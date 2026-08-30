# MedLens AI

A unified AI health companion built for the Softlexify National Hackathon 2026: chest
X-ray analysis, medical report simplification, and a symptom checker — funneled through
one consistent triage verdict (Monitor / See a doctor soon / Seek care promptly).

**Live demo:** _add your deployed URL here once live_
**Demo video:** _add link here_

---

## What it does

1. **Chest X-ray analysis** — a fine-tuned Vision Transformer (ViT-Base/16) classifies a
   chest X-ray and shows a Grad-CAM heatmap so you can see *what* the model focused on,
   not just its verdict. Includes a low-confidence safety check for images that don't
   look like a clear chest X-ray.
2. **Lab report simplifier** — OCR (Tesseract) + an LLM (via Groq's free API) turns a lab
   report or prescription into plain language, flags values outside the normal range,
   and supports **follow-up questions** grounded in that specific report.
3. **Symptom checker** — a conversational, explicitly non-diagnostic chat that suggests a
   general urgency level based on described symptoms.
4. **History** — a browser-local log (no backend database) of past analyses across all
   three modules.

Every result carries the same honest framing: AI-generated decision support, not a
medical diagnosis, with a clear recommendation to consult a healthcare professional.

## Current scope, honestly stated

- The X-ray model is currently trained as a **binary classifier (Normal / Pneumonia)**
  on the Kaggle Chest X-Ray Pneumonia dataset. A 4-class upgrade (adding COVID-19 and
  Lung Opacity via the COVID-19 Radiography Database) is scaffolded in
  `backend/notebooks/train_xray.ipynb` but requires retraining before use.
- History is stored only in the browser (`localStorage`) — there is no user database or
  authentication, by design, to keep the project's scope realistic for its timeline.
- The symptom checker and report chat are genuinely conversational (multi-turn), not
  single-shot forms.

## Tech stack

- **Backend:** FastAPI (Python), PyTorch + `timm` (ViT), `pytorch-grad-cam`, Tesseract
  OCR, Groq API (`openai/gpt-oss-20b`) for report simplification, report Q&A, and the
  symptom checker
- **Frontend:** React + Vite, custom CSS design system (navy/teal/indigo palette),
  responsive sidebar + mobile drawer navigation
- **Training:** Google Colab (free T4 GPU)

## Project structure

```
medlens-ai/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/{xray,report,symptom}.py
│   │   ├── services/{xray_model,ocr_service,groq_service,triage}.py
│   │   └── models/schemas.py
│   ├── notebooks/train_xray.ipynb
│   ├── weights/                # trained model goes here (not committed — see below)
│   └── requirements.txt
├── frontend/                   # React + Vite
│   └── src/{App.jsx, index.css, components/*}
└── docs/                       # demo video / slides for submission
```

## Setup — Backend

1. Install Tesseract (OCR engine):
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki (the code auto-detects the
     default install path)
   - Mac: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr poppler-utils`
2. ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
3. Free Groq API key: https://console.groq.com/keys
   ```bash
   cp .env.example .env   # paste your GROQ_API_KEY in
   ```
4. Train (or retrain) the X-ray model using `backend/notebooks/train_xray.ipynb` on
   Google Colab, then place the resulting `chest_xray_vit.pt` in `backend/weights/`.
   The API will still run without it, but predictions will be meaningless until a
   trained checkpoint is present.
5. ```bash
   uvicorn app.main:app --reload --port 8001
   ```
   Interactive docs at `http://localhost:8001/docs`.

## Setup — Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE to match your backend port
npm run dev
```
Visit `http://localhost:5173`.

## Deployment

- **Backend → Render**: root directory `backend`, build command
  `pip install -r requirements.txt`, start command
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `GROQ_API_KEY` as an
  environment variable. Since the trained model file is too large to commit to Git,
  it's fetched separately at build time — see deployment notes.
- **Frontend → Vercel**: root directory `frontend`, framework preset "Vite", set
  `VITE_API_BASE` to your deployed Render URL.

## Responsible-use note

This is a decision-support demo, not a diagnostic device. Every result carries an
explicit disclaimer, and urgency levels are framed around "when to see a doctor" rather
than a diagnosis — a deliberate safety and UX choice.