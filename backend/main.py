from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Learning Gap Analyzer API")


class AnswerRequest(BaseModel):
    question: str
    answer: str


@app.get("/")
def home():
    return {"message": "Learning Gap Analyzer API is running"}


@app.post("/analyze")
def analyze_answer(request: AnswerRequest):
    # Placeholder response; concept matching and MongoDB come in later steps.
    return {
        "question": request.question,
        "answer": request.answer,
        "matched_concepts": [],
        "possible_gaps": [],
        "recommended_resources": [],
        "status": "analysis_not_implemented_yet",
    }
