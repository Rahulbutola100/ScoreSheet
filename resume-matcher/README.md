# ScoreSheet — AI Resume & Job Description Matcher

Upload a resume, paste a job description, and get:
- An honest 0–100 match score with a verdict (Poor → Excellent)
- Matched vs. missing keywords
- Specific suggestions on where/how to add missing keywords (with example bullet points)
- Section-by-section feedback (skills, experience, ATS formatting)
- Top 3 actionable improvements

Built with React (Vite) on the frontend and Node/Express + **Groq (free, OpenAI-compatible API)**
on the backend, running Meta's Llama 3.3 70B model. Resume parsing supports PDF, DOCX, and TXT.

> Note: the "scan job portals like LinkedIn/Naukri" idea from the original brief
> was deliberately left out — those sites block scraping and it violates their
> terms of service. This focuses on the core, demo-able value: the matching engine.

## Project structure

```
resume-matcher/
├── server/        # Express API (resume parsing + Groq matching)
└── client/        # React (Vite) frontend
```

## 1. Get a free Groq API key

1. Go to https://console.groq.com
2. Sign up (free, no credit card required)
3. Go to "API Keys" → create a new key
4. Copy it — you'll paste it into `.env` below

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your Groq API key into GROQ_API_KEY
npm run dev
```

Server runs on `http://localhost:5000`.

## 3. Frontend setup

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` calls to the backend.

Open `http://localhost:5173` in your browser.

## How it works

1. The backend extracts plain text from your uploaded resume (`pdf-parse` for PDFs,
   `mammoth` for DOCX).
2. That text plus the job description are sent to Groq's `llama-3.3-70b-versatile`
   model via the OpenAI-compatible SDK, with a strict system prompt asking for a
   structured JSON analysis — match score, matched/missing keywords, where to add
   them, and section feedback.
3. The frontend renders that JSON as a scorecard-style report.

## Why Groq instead of OpenAI

Groq's API is **free** (generous free tier, no credit card needed) and is
OpenAI-compatible — meaning the same `openai` npm SDK works, you just point it
at Groq's base URL and use a Groq model name. This makes the project free to
run and demo, while keeping the code nearly identical to an OpenAI-based setup
(useful if an interviewer asks "could you swap this back to OpenAI?" — yes,
in about 3 lines).

## Talking points for your interview

- **Real problem, real users**: solves the "why am I not getting interview calls"
  problem almost every job seeker has right now.
- **Full stack**: file upload + parsing, prompt engineering for structured JSON
  output, REST API, React state management, responsive UI.
- **Production-minded touches**: file type/size validation, error handling on
  both client and server, no data persistence (privacy-friendly), clear empty/error
  states.
- **Cost-conscious decision**: chose Groq's free tier over a paid API for a
  student/demo project — shows judgment about tradeoffs, not just "got it working."
- **Extensible**: you can add auth + a history of past scans, support multiple
  resume versions, or swap the matching engine for a local embedding-based
  scorer (no API key needed at all) — good answers if an interviewer asks
  "what would you add next?"

## Possible extensions

- Save scan history per user (needs auth + a database)
- Let users edit their resume inline and re-score instantly
- Local/offline matching mode using embeddings (no API key required)
- Export the report as a PDF
- Swap back to OpenAI's GPT-4o-mini for production (3-line change, see `server/utils/matchEngine.js`)
