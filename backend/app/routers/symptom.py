from fastapi import APIRouter, HTTPException

from app.services.groq_service import answer_symptom_question
from app.models.schemas import SymptomChatRequest, SymptomChatResponse

router = APIRouter()


@router.post("/chat", response_model=SymptomChatResponse)
async def chat_symptom_checker(payload: SymptomChatRequest):
    """
    General (non-report-grounded) symptom-checker chat. Stateless — the frontend
    resends the running conversation history with each message.
    """
    try:
        result = answer_symptom_question(payload.history, payload.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Symptom checker failed: {str(e)}")

    return SymptomChatResponse(
        answer=result.get("answer", ""),
        urgency_hint=result.get("urgency_hint"),
    )
