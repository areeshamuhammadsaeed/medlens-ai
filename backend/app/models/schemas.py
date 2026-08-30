"""
Shared Pydantic schemas. All three modules (X-ray, Report, Symptom Checker)
funnel their output through TriageResult where relevant, so the frontend
renders consistent UI regardless of which module produced it.
"""
from typing import Optional, List
from pydantic import BaseModel
from enum import Enum


class UrgencyLevel(str, Enum):
    MONITOR = "monitor"
    SEE_DOCTOR_SOON = "see_doctor_soon"
    URGENT = "urgent"


class TriageResult(BaseModel):
    source_type: str  # "xray" | "report"
    summary: str
    urgency: UrgencyLevel
    urgency_reason: str
    confidence: Optional[float] = None
    details: dict
    disclaimer: str = (
        "This is an AI-generated decision-support output, not a medical diagnosis. "
        "Always consult a licensed healthcare professional."
    )


class XrayPrediction(BaseModel):
    label: str
    confidence: float
    heatmap_base64: str
    all_class_probs: dict


class RedFlag(BaseModel):
    term: str
    value: str
    normal_range: Optional[str] = None
    explanation: str


class ReportSimplification(BaseModel):
    plain_summary: str
    red_flags: List[RedFlag]
    original_text_excerpt: str


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ReportChatRequest(BaseModel):
    report_text: str
    history: List[ChatMessage] = []
    question: str


class ReportChatResponse(BaseModel):
    answer: str


class SymptomChatRequest(BaseModel):
    history: List[ChatMessage] = []
    message: str


class SymptomChatResponse(BaseModel):
    answer: str
    urgency_hint: Optional[str] = None  # "monitor" | "see_doctor_soon" | "urgent" | null
