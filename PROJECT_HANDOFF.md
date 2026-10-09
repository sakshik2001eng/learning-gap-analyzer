# Project Handoff: Learning Gap Analyzer

This document is for the next teammate taking over the project. It describes the implementation in the current GitHub feature branch, how to run it, how the account/assignment/assessment data flows, and what still needs attention.

## Project goal and current milestone

The project is a Python Fundamentals learning-gap analyzer. A teacher creates a written-answer assessment and defines expected concepts. The assigned student submits an answer. FastAPI compares the answer with the expected keywords, saves the analysis in MongoDB, and shows the student feedback and the teacher progress.

The current scope is a demonstrable partial implementation. The analysis is a keyword-matching baseline. It is not a trained NLP system, automatic quiz generator, or knowledge graph yet.

## Current GitHub state

- Repository: [sakshik2001eng/learning-gap-analyzer](https://github.com/sakshik2001eng/learning-gap-analyzer)
- Active branch: `feature/keep-claude-frontend`
- Latest pushed implementation commit: `02a0290` — `Add accounts and teacher student assignments`
- The changes are on the feature branch; they have not been merged into `main`.
- Local working tree also has two unrelated items that were intentionally not included in the commit: a modified `frontend_claude/package-lock.json` and an accidental nested `learning-gap-analyzer/` clone. Check `git status` before staging anything; avoid `git add .` until those items are understood.
- `backend/.env` is ignored by Git and must remain private. It contains the local MongoDB URI and a locally generated `JWT_SECRET_KEY`; never copy those values into this document, chat, or GitHub.

## Technology and layout

- Frontend: React 18, React Router, Vite, Tailwind CSS, Recharts, Lucide icons.
- Backend: Python, FastAPI, Pydantic, PyMongo, python-dotenv.
- Database: MongoDB Atlas, database `learning_gap_analyzer`.
- Authentication uses Python standard-library PBKDF2-HMAC-SHA256 password hashing and HMAC-SHA256 signed bearer tokens. No extra auth package is required.
- Main folders: `backend/` and `frontend_claude/`. The Claude frontend is the active UI; the Devin frontend was removed earlier.

## What is implemented

### Accounts and access

- Sign-up collects name, email, password, and role (`student` or `teacher`). Emails are normalized to lowercase and duplicate emails are rejected.
- Passwords are stored as salted PBKDF2-HMAC-SHA256 hashes (310,000 iterations), never as plain text.
- Sign-in returns a signed bearer token that expires after seven days. The browser stores the token and account summary in local storage and checks the session on page load.
- Student and teacher routes are protected in the React app. The backend also checks the bearer token and role for protected API operations.
- Logout clears the browser's local session and returns to the landing page. It does not revoke a copied token on the server; that token remains valid until expiry.
- Registration is open: the person signing up chooses their role. Email verification, password reset, account recovery, and teacher approval/invitation codes are not implemented.

### Teacher-to-student subject assignments

- The teacher opens **My Students**, enters a student email, and selects a subject.
- If that email already belongs to a student account, the assignment becomes active immediately.
- If the student has not signed up, the app saves a pending assignment. When that person signs up as a student using the same email, the backend links the pending assignment to the new account.
- An assignment belongs to a specific teacher, student email/account, and subject. A teacher can assign multiple students and subjects; one student can have assignments from multiple teachers.
- The assignment is recorded in the app; it does not send an email.
- The current UI subject choices are Python Fundamentals, Python Variables and Types, Python Conditions and Loops, Python Functions, and Python Lists and Dictionaries.

### Assessments, answers, and progress

- Teachers create written-answer assessments under **Assessments**. Each assessment has a subject, title, description, question, and expected concepts/keywords.
- Students can list and open only assessments whose teacher and subject match their assignment.
- Students submit a free-text answer. The backend uses the student's signed-in account as the submitter; the browser cannot choose another student ID.
- For each expected concept, the backend checks whether one of its teacher-provided keywords appears in the answer after lowercasing and removing punctuation. It returns matched concepts, possible gaps, and percentage coverage.
- The teacher's **My Students** page shows each assigned email and subject, pending/active status, assessment count, submission count, average keyword coverage, and latest activity.
- Teacher submission views show the answer and its matched/missing concepts for their own assessments.
- Quiz questions are teacher-authored. They are **not** generated automatically from notes or materials.
- Other dashboard charts, learning-gap cards, recommendations, reports, and some student details remain illustrative/static demo data. The connected student subject/progress view and teacher assignment/progress view are the data-driven parts of those dashboards.

## MongoDB collections

The application creates or uses these collections in `learning_gap_analyzer`:

- `users`: `user_id`, `name`, normalized `email`, `password_hash`, `role`, and `created_at`. A unique email index is created during sign-up.
- `assignments`: `assignment_id`, `teacher_id`, `teacher_name`, `student_email`, nullable `student_id`/`student_name`, `subject`, status, and `created_at`. A unique compound index prevents the same teacher assigning the same email to the same subject twice.
- `assessments`: `assessment_id`, title, description, subject, question, teacher-owned `expected_concepts`, `created_by`, and `created_at`.
- `submissions`: `submission_id`, assessment/teacher/student IDs, student name, question and answer, matched concepts, possible gaps, coverage percent, analysis status, and timestamp.

The expected-concept rubric is deliberately omitted from student-facing assessment responses. The saved submission contains its analysis result, not a need for the student to supply the rubric.

## API routes

Open Swagger at `http://127.0.0.1:8000/docs` when the backend is running.

- `GET /` — API availability message.
- `GET /db-status` — MongoDB connectivity check.
- `POST /auth/signup` — create account and return bearer token.
- `POST /auth/login` — verify email/password and return bearer token.
- `GET /auth/me` — return the account for the bearer token.
- `POST /teacher/assignments` — teacher assigns an email to a subject.
- `GET /teacher/assignments` — teacher's roster and progress summary.
- `GET /student/assignments` — current student's assigned subjects and progress summary.
- `POST /assessments` — teacher creates an assessment.
- `GET /assessments` — return assessments accessible to the signed-in account.
- `GET /assessments/{assessment_id}` — read an authorized assessment question, without its expected-concept rubric.
- `POST /assessments/{assessment_id}/submissions` — student submits an answer for concept matching and storage.
- `GET /assessments/{assessment_id}/submissions` — assessment creator retrieves saved student answers and analysis.
- `GET /submissions/{submission_id}` — assessment teacher retrieves one saved submission.

Except for account creation, sign-in, the home route, and database status, APIs require an `Authorization: Bearer <token>` header. The frontend adds the token automatically.

## Run locally on Windows

Use two VS Code terminals. The root `.venv` and `backend/.env` already exist in the current checkout; a new teammate must create their own environment and private `.env`.

### 1. Configure MongoDB

Create `backend/.env` with:

```text
MONGODB_URI=<your Atlas driver connection string>
JWT_SECRET_KEY=<a random secret of at least 32 characters>
```

Generate a suitable JWT secret in PowerShell with:

```powershell
py -c "import secrets; print(secrets.token_urlsafe(48))"
```

Get the URI from Atlas **Connect → Drivers**. The local `.env` is ignored by Git. Do not commit it, post it, or share database credentials in chat. The template is `backend/.env.example`.

### 2. Start FastAPI

From the project root:

```powershell
cd backend
..\.venv\Scripts\Activate.ps1
fastapi dev main.py
```

If creating a fresh venv, run these first from the project root:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

Then start FastAPI from `backend/` as above. To check MongoDB, open `/db-status` or Swagger.

### 3. Start the React app

In a second terminal from the project root:

```powershell
cd frontend_claude
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

### 4. Demonstrate the full flow

1. Create a **teacher** account.
2. Open **My Students** and assign a student email to a subject.
3. Open **Assessments** and create an assessment using that exact subject.
4. Sign out. Create or sign in to a **student** account using the assigned email.
5. Open the student dashboard or **Quizzes**, open the matching assessment, and submit an answer.
6. Sign back in as the teacher. **My Students** shows progress; the assessment card shows the submitted answer and analysis.

## Current MongoDB connection issue

The sign-up request fails before account creation if the backend cannot ping Atlas. The local configuration was checked without printing credentials: `MONGODB_URI` is present and uses a MongoDB URI scheme. A read-only Atlas ping from the current environment returned `ServerSelectionTimeoutError`. That means the client timed out reaching the cluster; it does not by itself prove whether the Atlas IP list, cluster status, DNS, firewall, or local network is responsible.

Troubleshooting order:

1. In Atlas, verify the cluster is running.
2. Under **Network Access → IP Access List**, add the current public IP of the machine running FastAPI. If each teammate runs the backend locally, each machine needs network access. Atlas requires Project Owner permission to change the project IP access list. See [MongoDB Atlas IP access list instructions](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).
3. Restart FastAPI after any local `.env` change and retry `GET /db-status`.
4. If the error becomes an authentication error, check the Atlas **Database Access** username/password and percent-encode special characters in the URI password. Do not share the URI when asking for help.
5. If IP access and cluster status are correct but it still times out, check VPN, firewall, DNS, or the network hosting the backend.

The backend now distinguishes a server-selection timeout from malformed URI and MongoDB authentication errors. Restart it to load the latest message.

## Verification performed

- `python -m py_compile main.py` completed successfully.
- Vite production build completed successfully. It reports a non-blocking warning that the main JavaScript bundle is over 500 kB.
- `git diff --check` passed.
- End-to-end signup, assignment, and assessment flow was not verified against Atlas because the connection timed out.

## Suggested next work

1. Restore Atlas network connectivity, then exercise account creation, login, pending assignment claim, subject filtering, submission save, and teacher progress from the UI.
2. Add frontend/backend automated tests for role access, duplicate emails/assignments, and assignment ownership.
3. Add controlled teacher provisioning (currently anyone can choose the teacher role during registration), plus password reset and email verification if required.
4. Decide how teachers will create quizzes from learning material; that automatic generation does not exist yet.
5. Replace static demo charts and gap cards with MongoDB-backed student/class analytics.
6. Add a pull request from `feature/keep-claude-frontend` into `main` when the team is ready to review and merge.
