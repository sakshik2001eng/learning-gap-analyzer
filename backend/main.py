from datetime import datetime, timezone
import os

from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

app = FastAPI(title="Learning Gap Analyzer API")


class AnswerRequest(BaseModel):
    question: str
    answer: str


@app.get("/")
def home():
    return {"message": "Learning Gap Analyzer API is running"}


@app.get("/db-status")
def database_status():
    """Check that this backend can reach the configured MongoDB deployment."""
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise HTTPException(
            status_code=503,
            detail="MONGODB_URI is missing. Add it to backend/.env and restart the API.",
        )

    try:
        with MongoClient(uri, serverSelectionTimeoutMS=5000) as client:
            client.admin.command("ping")
        return {"connected": True, "database": "learning_gap_analyzer"}
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="MongoDB connection failed. Check the Atlas URI and Network Access settings.",
        )


@app.post("/analyze")
def analyze_answer(request: AnswerRequest):
    # Answer analysis is still a placeholder; save the submission so the
    # assessment-to-database workflow is real and can be inspected in Atlas.
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise HTTPException(
            status_code=503,
            detail="MONGODB_URI is missing. Add it to backend/.env and restart the API.",
        )

    record = {
        "question": request.question,
        "answer": request.answer,
        "matched_concepts": [],
        "possible_gaps": [],
        "recommended_resources": [],
        "analysis_status": "not_implemented_yet",
        "created_at": datetime.now(timezone.utc),
    }

    try:
        with MongoClient(uri, serverSelectionTimeoutMS=5000) as client:
            result = client["learning_gap_analyzer"]["submissions"].insert_one(record)
            submission_id = str(result.inserted_id)
            record.pop("_id", None)
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Could not save the answer to MongoDB. Check the Atlas connection settings.",
        )

    return {
        "submission_id": submission_id,
        **record,
    }
