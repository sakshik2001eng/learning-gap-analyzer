from datetime import datetime, timezone
import os
import re

from fastapi import FastAPI
from fastapi import HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

app = FastAPI(title="Learning Gap Analyzer API")


class ExpectedConcept(BaseModel):
    name: str
    keywords: list[str] = Field(default_factory=list)


class AnswerRequest(BaseModel):
    question: str
    answer: str
    expected_concepts: list[ExpectedConcept] = Field(default_factory=list)


def normalize_phrase(text: str) -> str:
    """Lowercase text and remove punctuation for simple phrase matching."""
    return " ".join(re.findall(r"[a-z0-9]+", text.casefold()))


def analyze_concepts(
    answer: str, expected_concepts: list[ExpectedConcept]
) -> tuple[list[str], list[str], int]:
    """Match teacher-provided evidence phrases against a student answer."""
    normalized_answer = f" {normalize_phrase(answer)} "
    matched = []
    gaps = []

    for concept in expected_concepts:
        evidence_phrases = concept.keywords or [concept.name]
        has_evidence = any(
            f" {normalize_phrase(phrase)} " in normalized_answer
            for phrase in evidence_phrases
            if normalize_phrase(phrase)
        )
        (matched if has_evidence else gaps).append(concept.name)

    coverage = round(100 * len(matched) / len(expected_concepts)) if expected_concepts else 0
    return matched, gaps, coverage


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
    matched_concepts, possible_gaps, coverage = analyze_concepts(
        request.answer, request.expected_concepts
    )
    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise HTTPException(
            status_code=503,
            detail="MONGODB_URI is missing. Add it to backend/.env and restart the API.",
        )

    record = {
        "question": request.question,
        "answer": request.answer,
        "expected_concepts": [concept.model_dump() for concept in request.expected_concepts],
        "matched_concepts": matched_concepts,
        "possible_gaps": possible_gaps,
        "recommended_resources": [],
        "coverage_percent": coverage,
        "analysis_status": (
            "keyword_match_v1"
            if request.expected_concepts
            else "awaiting_expected_concepts"
        ),
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
