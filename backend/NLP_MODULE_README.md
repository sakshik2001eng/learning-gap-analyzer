# Semantic analyzer

The main FastAPI application imports `analyze_semantic` from `nlp_engine.py` and runs it whenever a student submits an assessment answer. The expected concepts and keywords come from the teacher-authored assessment rubric; students never submit or see that rubric.

## How matching works

1. `all-MiniLM-L6-v2` encodes each answer sentence and each concept name/keyword.
2. Cosine similarity supplies an estimated mastery score for each concept. An exact keyword hit receives a strong score as a transparent safeguard.
3. A concept at or above the configured threshold is marked `known`; a lower score is marked `gap`. The best matching answer sentence and whether the match was semantic or a keyword hit are included as evidence.
4. The API stores the feedback in the submission document: `concept_scores`, `concept_graph`, `matched_concepts`, `possible_gaps`, `coverage_percent`, and `analysis_status`.

These scores are an early learning-feedback estimate, not a calibrated grade. Teachers should review the answer itself.

## Install and run

From the project root, activate the project's virtual environment and install backend dependencies:

```powershell
python -m pip install -r backend\requirements.txt
cd backend
fastapi dev main.py
```

`sentence-transformers` also installs PyTorch and supporting libraries, so setup can take a while and use substantial disk space. On the first assessment submission, the model is downloaded and cached. That first request requires internet access; later requests reuse the cache. If installation or model loading fails, the main API logs the failure and uses `keyword_fallback_v1` so students can still submit.

## Optional isolated sandbox

For development experiments only, run the analyzer without the accounts and MongoDB application:

```powershell
cd backend
fastapi dev nlp_app.py --port 8001
```

Open `http://127.0.0.1:8001/docs` and try `POST /analyze-semantic`. The integrated application remains on port `8000`; the student UI uses the integrated endpoint.
