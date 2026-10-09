from datetime import datetime, timezone
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import time
from typing import Literal
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from pymongo import MongoClient
from pymongo.errors import ConfigurationError, DuplicateKeyError, OperationFailure, ServerSelectionTimeoutError

load_dotenv()

app = FastAPI(title="Learning Gap Analyzer API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
_mongo_client = None


class ExpectedConcept(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    keywords: list[str] = Field(default_factory=list)


class AssessmentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(default="", max_length=500)
    subject: str = Field(default="Python Fundamentals", max_length=80)
    question: str = Field(min_length=10, max_length=2000)
    expected_concepts: list[ExpectedConcept] = Field(min_length=1, max_length=20)


class SubmissionCreate(BaseModel):
    answer: str = Field(min_length=3, max_length=10000)


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)
    role: Literal["student", "teacher"]


class LoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class AssignmentCreate(BaseModel):
    student_email: str = Field(min_length=5, max_length=254)
    subject: str = Field(min_length=2, max_length=80)


def get_database():
    global _mongo_client
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise HTTPException(status_code=503, detail="MONGODB_URI is missing. Add it to backend/.env and restart the API.")
    try:
        if _mongo_client is None:
            _mongo_client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        _mongo_client.admin.command("ping")
        return _mongo_client["learning_gap_analyzer"]
    except ConfigurationError:
        raise HTTPException(status_code=503, detail="MongoDB URI is invalid. Copy the Atlas connection string again and check the database name and URI format.")
    except OperationFailure as exc:
        if exc.code == 18 or "auth" in str(exc).lower():
            raise HTTPException(status_code=503, detail="MongoDB authentication failed. Check the Atlas database username and password; URL-encode special characters in the password.")
        raise HTTPException(status_code=503, detail="MongoDB rejected the request. Check that the Atlas database user has read/write access.")
    except ServerSelectionTimeoutError:
        raise HTTPException(status_code=503, detail="Cannot reach MongoDB Atlas. Check that the cluster is running and add your current IP address under Atlas Network Access.")
    except Exception:
        raise HTTPException(status_code=503, detail="MongoDB connection failed. Check the Atlas URI and Network Access settings.")


def normalize_phrase(text: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def analyze_concepts(answer: str, concepts: list[dict]) -> tuple[list[str], list[str], int]:
    normalized_answer = f" {normalize_phrase(answer)} "
    matched, gaps = [], []
    for concept in concepts:
        phrases = concept.get("keywords") or [concept["name"]]
        found = any(
            f" {normalize_phrase(phrase)} " in normalized_answer
            for phrase in phrases
            if normalize_phrase(phrase)
        )
        (matched if found else gaps).append(concept["name"])
    coverage = round(100 * len(matched) / len(concepts)) if concepts else 0
    return matched, gaps, coverage


bearer = HTTPBearer(auto_error=False)
PASSWORD_ITERATIONS = 310_000


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _unb64(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def _token_secret() -> bytes:
    secret = os.getenv("JWT_SECRET_KEY", "")
    if len(secret) < 32:
        raise HTTPException(status_code=503, detail="JWT_SECRET_KEY is missing or too short. Add a random secret of at least 32 characters to backend/.env and restart the API.")
    return secret.encode("utf-8")


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS)
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${_b64(salt)}${_b64(digest)}"


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, salt, expected = stored.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), _unb64(salt), int(iterations))
        return hmac.compare_digest(actual, _unb64(expected))
    except (ValueError, TypeError):
        return False


def create_access_token(user: dict) -> str:
    header = _b64(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    payload = _b64(json.dumps({"sub": user["user_id"], "exp": int(time.time()) + 60 * 60 * 24 * 7}, separators=(",", ":")).encode())
    signing_input = f"{header}.{payload}"
    signature = _b64(hmac.new(_token_secret(), signing_input.encode(), hashlib.sha256).digest())
    return f"{signing_input}.{signature}"


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Sign in to continue.", headers={"WWW-Authenticate": "Bearer"})
    try:
        header, payload, signature = credentials.credentials.split(".", 2)
        if json.loads(_unb64(header)).get("alg") != "HS256":
            raise ValueError("Unsupported token algorithm")
        signing_input = f"{header}.{payload}"
        expected = hmac.new(_token_secret(), signing_input.encode(), hashlib.sha256).digest()
        if not hmac.compare_digest(expected, _unb64(signature)):
            raise ValueError("Invalid signature")
        claims = json.loads(_unb64(payload))
        if claims.get("exp", 0) < time.time():
            raise ValueError("Expired token")
        db = get_database()
        user = db.users.find_one({"user_id": claims.get("sub")}, {"_id": 0, "password_hash": 0})
        if not user:
            raise ValueError("Unknown user")
        return user
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Your session is invalid or expired. Please sign in again.", headers={"WWW-Authenticate": "Bearer"})


def require_role(user: dict, role: Literal["teacher", "student"]) -> dict:
    if user.get("role") != role:
        raise HTTPException(status_code=403, detail=f"This action requires a {role} account.")
    return user


def account_response(user: dict) -> dict:
    return {"user_id": user["user_id"], "name": user["name"], "email": user["email"], "role": user["role"]}


def auth_response(user: dict) -> dict:
    return {"access_token": create_access_token(user), "token_type": "bearer", "user": account_response(user)}


def public_assessment(doc: dict, include_question: bool = False) -> dict:
    result = {
        "assessment_id": doc["assessment_id"],
        "title": doc["title"],
        "description": doc.get("description", ""),
        "subject": doc.get("subject", "Python Fundamentals"),
        "question_count": 1,
        "created_at": doc["created_at"].isoformat(),
    }
    if include_question:
        result["question"] = doc["question"]
    return result


@app.get("/")
def home():
    return {"message": "Learning Gap Analyzer API is running", "docs": "/docs"}


@app.get("/db-status")
def database_status():
    db = get_database()
    return {"connected": True, "database": db.name}


@app.post("/auth/signup", status_code=201)
def signup(request: SignupRequest):
    email = request.email.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    db = get_database()
    try:
        db.users.create_index("email", unique=True)
        user = {
            "user_id": str(uuid4()),
            "name": request.name.strip(),
            "email": email,
            "password_hash": hash_password(request.password),
            "role": request.role,
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(user)
        if user["role"] == "student":
            db.assignments.update_many(
                {"student_email": email, "student_id": None},
                {"$set": {"student_id": user["user_id"], "student_name": user["name"], "status": "active"}},
            )
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="An account with this email already exists. Sign in instead.")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail="Could not create the account. Check the MongoDB connection.")
    return auth_response(user)


@app.post("/auth/login")
def login(request: LoginRequest):
    db = get_database()
    try:
        user = db.users.find_one({"email": request.email.strip().lower()})
    except Exception:
        raise HTTPException(status_code=503, detail="Could not access accounts in MongoDB.")
    if not user or not verify_password(request.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    return auth_response(user)


@app.get("/auth/me")
def current_account(user: dict = Depends(get_current_user)):
    return account_response(user)


@app.post("/teacher/assignments", status_code=201)
def assign_student(request: AssignmentCreate, current_user: dict = Depends(get_current_user)):
    require_role(current_user, "teacher")
    email = request.student_email.strip().lower()
    subject = request.subject.strip()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(status_code=422, detail="Enter a valid student email address.")
    db = get_database()
    try:
        student = db.users.find_one({"email": email}, {"_id": 0, "user_id": 1, "name": 1, "role": 1})
        if student and student.get("role") != "student":
            raise HTTPException(status_code=409, detail="That email belongs to a teacher account, not a student account.")
        db.assignments.create_index([("teacher_id", 1), ("student_email", 1), ("subject", 1)], unique=True)
        existing = db.assignments.find_one({"teacher_id": current_user["user_id"], "student_email": email, "subject": subject})
        if existing:
            raise HTTPException(status_code=409, detail="This student is already assigned to you for that subject.")
        assignment = {
            "assignment_id": str(uuid4()),
            "teacher_id": current_user["user_id"],
            "teacher_name": current_user["name"],
            "student_email": email,
            "student_id": student["user_id"] if student else None,
            "student_name": student["name"] if student else None,
            "subject": subject,
            "status": "active" if student else "pending",
            "created_at": datetime.now(timezone.utc),
        }
        db.assignments.insert_one(assignment)
        return {
            "assignment_id": assignment["assignment_id"],
            "student_email": email,
            "student_name": assignment["student_name"],
            "subject": subject,
            "status": assignment["status"],
        }
    except HTTPException:
        raise
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="This student is already assigned to you for that subject.")
    except Exception:
        raise HTTPException(status_code=503, detail="Could not save this student assignment to MongoDB.")


@app.get("/teacher/assignments")
def list_teacher_assignments(current_user: dict = Depends(get_current_user)):
    require_role(current_user, "teacher")
    db = get_database()
    try:
        assignments = list(db.assignments.find({"teacher_id": current_user["user_id"]}, {"_id": 0}).sort("created_at", -1))
        results = []
        for assignment in assignments:
            assessment_docs = list(db.assessments.find(
                {"created_by": current_user["user_id"], "subject": assignment["subject"]},
                {"_id": 0, "assessment_id": 1},
            ))
            assessment_ids = [item["assessment_id"] for item in assessment_docs]
            student_id = assignment.get("student_id")
            student = db.users.find_one({"user_id": student_id}, {"_id": 0, "name": 1}) if student_id else None
            submission_query = {
                "teacher_id": current_user["user_id"],
                "student_id": student_id,
                "assessment_id": {"$in": assessment_ids},
            }
            submissions = list(db.submissions.find(submission_query, {"_id": 0, "coverage_percent": 1, "created_at": 1, "assessment_id": 1})) if student_id and assessment_ids else []
            average = round(sum(item.get("coverage_percent", 0) for item in submissions) / len(submissions)) if submissions else 0
            results.append({
                "assignment_id": assignment["assignment_id"],
                "student_id": student_id,
                "student_name": (student or {}).get("name") or assignment.get("student_name"),
                "student_email": assignment["student_email"],
                "subject": assignment["subject"],
                "status": "active" if student_id else "pending",
                "assessment_count": len(assessment_ids),
                "submission_count": len(submissions),
                "progress_percent": average,
                "last_activity": max((item["created_at"].isoformat() for item in submissions if item.get("created_at")), default=None),
            })
        return {"assignments": results}
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve assigned students and progress from MongoDB.")


@app.get("/student/assignments")
def list_student_assignments(current_user: dict = Depends(get_current_user)):
    require_role(current_user, "student")
    db = get_database()
    try:
        assignments = list(db.assignments.find({
            "$or": [{"student_id": current_user["user_id"]}, {"student_email": current_user["email"]}]
        }, {"_id": 0}).sort("created_at", -1))
        results = []
        for assignment in assignments:
            assessments = list(db.assessments.find(
                {"created_by": assignment["teacher_id"], "subject": assignment["subject"]},
                {"_id": 0, "assessment_id": 1},
            ))
            ids = [item["assessment_id"] for item in assessments]
            submissions = list(db.submissions.find({
                "student_id": current_user["user_id"], "assessment_id": {"$in": ids}
            }, {"_id": 0, "coverage_percent": 1})) if ids else []
            results.append({
                "assignment_id": assignment["assignment_id"],
                "teacher_name": assignment.get("teacher_name", "Teacher"),
                "subject": assignment["subject"],
                "status": "active" if assignment.get("student_id") else "pending",
                "assessment_count": len(ids),
                "submission_count": len(submissions),
                "progress_percent": round(sum(item.get("coverage_percent", 0) for item in submissions) / len(submissions)) if submissions else 0,
            })
        return {"assignments": results}
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve your assigned subjects from MongoDB.")


@app.post("/assessments", status_code=201)
def create_assessment(request: AssessmentCreate, current_user: dict = Depends(get_current_user)):
    require_role(current_user, "teacher")
    db = get_database()
    doc = {
        "assessment_id": str(uuid4()),
        **{**request.model_dump(), "subject": request.subject.strip()},
        "expected_concepts": [item.model_dump() for item in request.expected_concepts],
        "created_by": current_user["user_id"],
        "created_at": datetime.now(timezone.utc),
    }
    try:
        db.assessments.insert_one(doc)
    except Exception:
        raise HTTPException(status_code=503, detail="Could not save the assessment to MongoDB.")
    return public_assessment(doc, include_question=True)


@app.get("/assessments")
def list_assessments(current_user: dict = Depends(get_current_user)):
    db = get_database()
    try:
        if current_user["role"] == "teacher":
            query = {"created_by": current_user["user_id"]}
        else:
            assignments = list(db.assignments.find({
                "$or": [{"student_id": current_user["user_id"]}, {"student_email": current_user["email"]}]
            }, {"_id": 0, "teacher_id": 1, "subject": 1}))
            access = list({(item["teacher_id"], item["subject"]) for item in assignments})
            if not access:
                return {"assessments": []}
            query = {"$or": [{"created_by": teacher_id, "subject": subject} for teacher_id, subject in access]}
        items = db.assessments.find(query, {"_id": 0}).sort("created_at", -1)
        return {"assessments": [public_assessment(item) for item in items]}
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve assessments from MongoDB.")


@app.get("/assessments/{assessment_id}")
def get_assessment(assessment_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    try:
        doc = db.assessments.find_one({"assessment_id": assessment_id}, {"_id": 0})
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve the assessment from MongoDB.")
    if not doc:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    if current_user["role"] == "teacher":
        if doc.get("created_by") != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="You can only view your own assessments.")
    else:
        assignment = db.assignments.find_one({
            "teacher_id": doc.get("created_by"),
            "subject": doc.get("subject"),
            "$or": [{"student_id": current_user["user_id"]}, {"student_email": current_user["email"]}],
        })
        if not assignment:
            raise HTTPException(status_code=403, detail="You are not assigned to this subject by its teacher.")
    return public_assessment(doc, include_question=True)


@app.post("/assessments/{assessment_id}/submissions", status_code=201)
def submit_answer(assessment_id: str, request: SubmissionCreate, current_user: dict = Depends(get_current_user)):
    require_role(current_user, "student")
    db = get_database()
    try:
        assessment = db.assessments.find_one({"assessment_id": assessment_id}, {"_id": 0})
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve the assessment from MongoDB.")
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    assignment = db.assignments.find_one({
        "teacher_id": assessment.get("created_by"),
        "subject": assessment.get("subject"),
        "$or": [{"student_id": current_user["user_id"]}, {"student_email": current_user["email"]}],
    })
    if not assignment:
        raise HTTPException(status_code=403, detail="You are not assigned to this subject by its teacher.")

    matched, gaps, coverage = analyze_concepts(request.answer, assessment["expected_concepts"])
    record = {
        "submission_id": str(uuid4()),
        "assessment_id": assessment_id,
        "assessment_title": assessment["title"],
        "student_id": current_user["user_id"],
        "student_name": current_user["name"],
        "teacher_id": assessment.get("created_by"),
        "question": assessment["question"],
        "answer": request.answer,
        "matched_concepts": matched,
        "possible_gaps": gaps,
        "coverage_percent": coverage,
        "analysis_status": "keyword_match_v1",
        "created_at": datetime.now(timezone.utc),
    }
    try:
        db.submissions.insert_one(record.copy())
    except Exception:
        raise HTTPException(status_code=503, detail="Could not save the answer to MongoDB.")
    record["created_at"] = record["created_at"].isoformat()
    return record


@app.get("/assessments/{assessment_id}/submissions")
def list_submissions(assessment_id: str, current_user: dict = Depends(get_current_user)):
    require_role(current_user, "teacher")
    db = get_database()
    try:
        assessment = db.assessments.find_one({"assessment_id": assessment_id, "created_by": current_user["user_id"]})
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found for this teacher account.")
        rows = db.submissions.find({"assessment_id": assessment_id}, {"_id": 0}).sort("created_at", -1)
        return {"submissions": [{**row, "created_at": row["created_at"].isoformat()} for row in rows]}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve submissions from MongoDB.")


@app.get("/submissions/{submission_id}")
def get_submission(submission_id: str, current_user: dict = Depends(get_current_user)):
    require_role(current_user, "teacher")
    db = get_database()
    try:
        row = db.submissions.find_one({"submission_id": submission_id, "teacher_id": current_user["user_id"]}, {"_id": 0})
    except Exception:
        raise HTTPException(status_code=503, detail="Could not retrieve the submission from MongoDB.")
    if not row:
        raise HTTPException(status_code=404, detail="Submission not found.")
    row["created_at"] = row["created_at"].isoformat()
    return row
