# AI-Powered Learning Gap Analyzer

40% implementation milestone: a Python Fundamentals application with a React student and teacher interface, FastAPI, and MongoDB. Users create accounts and sign in; teachers create written assessments with expected concepts; students submit answers; the API analyzes concept coverage and stores submissions.

## Project folders

- `backend/` — FastAPI endpoints and MongoDB data flow
- `frontend_claude/` — React/Vite interface connected to the API

## Run on Windows

Open two VS Code terminals from the project root.

### Terminal 1: API

```powershell
cd backend
..\.venv\Scripts\Activate.ps1
fastapi dev main.py
```

If the virtual environment is not created yet, run `py -m venv .venv` from the project root, activate it with `.venv\Scripts\Activate.ps1`, and install `backend\requirements.txt` using `python -m pip install -r backend\requirements.txt`.

Set `MONGODB_URI` and a random `JWT_SECRET_KEY` in `backend/.env` before starting the API. Keep this file private and never commit it. You can generate a secret in PowerShell with `py -c "import secrets; print(secrets.token_urlsafe(48))"`. Copy the result into `JWT_SECRET_KEY=`. The safe template is `backend/.env.example`.

### Terminal 2: web interface

```powershell
cd frontend_claude
npm install
npm run dev
```

Open the local Vite URL printed in the terminal (usually http://localhost:5173). Create a teacher account, open **My Students**, and assign the student's email to a subject. If the student has not signed up, the assignment remains pending until they create a student account using that email. Create an assessment for the same subject from **Assessments**. The student then signs in and sees that subject's assessments. The teacher can view answer coverage and submission counts on **My Students**, and read answers from the assessment page. Log out from the sidebar to return to the landing page. The app records the assignment; it does not send an email.

## Main API routes

- `GET /db-status` — check MongoDB connectivity
- `POST /auth/signup` and `POST /auth/login` — create an account or sign in
- `GET /auth/me` — retrieve the signed-in account
- `POST /teacher/assignments` and `GET /teacher/assignments` — assign a student email to a subject and review progress
- `GET /student/assignments` — retrieve subjects assigned to the signed-in student
- `POST /assessments` — create an assessment (teacher account)
- `GET /assessments` and `GET /assessments/{assessment_id}` — list assessments and read a question
- `POST /assessments/{assessment_id}/submissions` — submit an answer (student account)
- `GET /assessments/{assessment_id}/submissions` — creator-teacher view of saved answers and analysis
- `GET /submissions/{submission_id}` — retrieve one submission (creator-teacher account)

Swagger documentation is at http://127.0.0.1:8000/docs. The API uses seven-day signed bearer tokens and PBKDF2 password hashes. Registration is open and users choose student or teacher; there is no email verification or password-reset flow in this milestone.

## Current scope

Concept detection is a transparent keyword-matching baseline. The project does not yet include a trained NLP model, knowledge graph, email verification, password reset, or production-grade authentication. Existing dashboard charts remain illustrative demo data; account, assignment, assessment, and submission records use MongoDB.
