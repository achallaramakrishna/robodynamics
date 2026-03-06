# RoboDynamics AI Tutor (Next.js + FastAPI)

This folder contains the starter implementation for Vedic Math AI Tutor:

- `web/` -> Next.js (App Router) UI + BFF routes
- `tutor-api/` -> FastAPI rule-based tutor backend
- `docker-compose.yml` -> local dev bootstrap

## Architecture

1. Java app (`robodynamics`) issues launch token at `/api/ai-tutor/session/init`
2. User launches `/ai-tutor/launch?module=VEDIC_MATH`
3. Next.js reads token and calls FastAPI `/ai-tutor-api/vedic/start`
4. FastAPI serves lesson + questions, evaluates answers, answers doubts
5. FastAPI forwards event telemetry to Java `/api/ai-tutor/session/event`
6. Java exposes summary at `/api/ai-tutor/session/summary`

## Local Run

### Option A: docker-compose

```bash
cd ai-tutor
docker compose up --build
```

### Option B: manual

Terminal 1:
```bash
cd ai-tutor/tutor-api
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8091
```

Terminal 2:
```bash
cd ai-tutor/web
npm install
npm run dev
```

## Required Environment

### Java app (`src/main/resources/app-config.properties` uses env fallbacks)

- `RD_AI_TUTOR_WEB_BASE_URL` (example: `https://robodynamics.in`)
- `RD_AI_TUTOR_JWT_SECRET`
- `RD_AI_TUTOR_INTERNAL_API_KEY`

### FastAPI (`ai-tutor/tutor-api/.env.example`)

- `AI_TUTOR_JWT_SECRET` (must match Java)
- `AI_TUTOR_JWT_ISSUER`
- `AI_TUTOR_JWT_AUDIENCE`
- `TUTOR_INTERNAL_KEY` (must match Java internal API key)
- `ROBODYNAMICS_EVENT_URL`
- `ROBODYNAMICS_EVENT_API_KEY`
- `AI_TUTOR_CONTENT_ROOT` (chapter screenplay folder root, default `/opt/robodynamics`)
- `OPENAI_API_KEY` (for PDF -> screenplay generation tool)
- `OPENAI_MODEL` (default `gpt-4.1-mini`)

### Next.js (`ai-tutor/web/.env.example`)

- `TUTOR_API_BASE_URL` (usually `http://localhost:8091`)
- `TUTOR_INTERNAL_KEY` (must match FastAPI `TUTOR_INTERNAL_KEY`)
- `SARVAM_API_KEY` (server-side TTS key)
- `SARVAM_TTS_URL`, `SARVAM_TTS_MODEL`, `SARVAM_DEFAULT_LANGUAGE_CODE`
- `SARVAM_DEFAULT_SPEAKER`, `SARVAM_SPEAKER_ARYA`, `SARVAM_SPEAKER_VED`, `SARVAM_SPEAKER_TARA`, `SARVAM_SPEAKER_NIVA`

## Screenplay Generation (OpenAI + PDF)

Generate chapter scene scripts from chapter PDFs and store them as:
`/opt/robodynamics/{courseId}/chapter_scripts.json`

```bash
cd ai-tutor/tutor-api
python3 scripts/generate_screenplay_openai.py \
  --course-id vedic_math \
  --source-dir /opt/robodynamics/vedic_math \
  --output /opt/robodynamics/vedic_math/chapter_scripts.json
```

The tutor API will load this file automatically and use it for whiteboard scene-by-scene teaching.

## Notes

- Current starter uses in-memory session/event store in Java and FastAPI.
- SQL schema for persistent analytics is available at `docs/ai_tutor_schema.sql`.
- Nginx routing template is available at `docs/ai_tutor_integration_nginx.conf`.
