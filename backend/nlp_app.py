"""Optional local-only API for trying the semantic NLP module in isolation."""

from fastapi import FastAPI
from pydantic import BaseModel, Field

from nlp_engine import analyze_semantic

app = FastAPI(title="Learning Gap Analyzer NLP Sandbox")


class Concept(BaseModel):
    name: str
    keywords: list[str] = Field(default_factory=list)


class SemanticRequest(BaseModel):
    answer: str
    expected_concepts: list[Concept]


@app.get("/")
def home():
    return {"message": "Semantic NLP sandbox is running", "note": "The main application uses port 8000."}


@app.post("/analyze-semantic")
def analyze(request: SemanticRequest):
    return analyze_semantic(request.answer, request.expected_concepts)
