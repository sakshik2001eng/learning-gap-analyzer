# AI-Powered Learning Gap Analyzer

Final-year project prototype for identifying concepts in written answers and linking possible gaps to learning resources.

## Current first milestone

Run a small FastAPI backend locally. The first endpoint accepts an answer and returns a placeholder analysis. MongoDB and NLP will be connected in later steps.

## Project structure

- `backend/` — Python API and later NLP/database code
- `frontend/` — React application (to be created after the API starts)

## Run the backend on Windows

Open this folder in VS Code, open Terminal → New Terminal, then run:

```powershell
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
fastapi dev main.py
```

When the server is running, open http://127.0.0.1:8000/docs to view the API.

Do not commit database passwords or MongoDB connection strings to GitHub. We will store those in a local `.env` file later.
