"""
MedLens AI - Main FastAPI Application
Chest X-ray classification + report simplification + symptom checker,
unified under one triage layer.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import xray, report, symptom

load_dotenv()

app = FastAPI(
    title="MedLens AI",
    description="Chest X-ray classification, report simplification, and a symptom checker, unified under one triage layer.",
    version="0.2.0",
)

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(xray.router, prefix="/api/xray", tags=["Chest X-ray"])
app.include_router(report.router, prefix="/api/report", tags=["Report Simplifier"])
app.include_router(symptom.router, prefix="/api/symptom", tags=["Symptom Checker"])


@app.get("/")
def health_check():
    return {"status": "ok", "service": "MedLens AI backend"}
