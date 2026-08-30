from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.ocr_service import extract_text
from app.services.groq_service import simplify_report, answer_report_question
from app.services.triage import triage_report
from app.models.schemas import TriageResult, ReportChatRequest, ReportChatResponse

router = APIRouter()

ALLOWED_TYPES = {"application/pdf", "image/jpeg", "image/png", "image/jpg"}


@router.post("/analyze", response_model=TriageResult)
async def analyze_report(file: UploadFile = File(...)):
    """
    Upload a medical report (PDF or photo). Returns a plain-language summary,
    flagged abnormal values, and a unified triage verdict.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Please upload a PDF, JPG, or PNG file.")

    file_bytes = await file.read()

    try:
        raw_text = extract_text(file_bytes, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="No text could be extracted. Try a clearer image or a text-based PDF.",
        )

    try:
        simplification = simplify_report(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simplification failed: {str(e)}")

    simplification["original_text_excerpt"] = raw_text[:300]
    # Kept for follow-up Q&A — the frontend sends this back on each chat message
    # so the assistant stays grounded in this specific report.
    simplification["full_text"] = raw_text[:4000]

    return triage_report(simplification)


@router.post("/chat", response_model=ReportChatResponse)
async def chat_about_report(payload: ReportChatRequest):
    """
    Answers a follow-up question about a previously analyzed report. Stateless —
    the frontend resends the report's full text and conversation history each time.
    """
    try:
        answer = answer_report_question(payload.report_text, payload.history, payload.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

    return ReportChatResponse(answer=answer)
