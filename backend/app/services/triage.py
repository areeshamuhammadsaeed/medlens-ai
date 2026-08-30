"""
Unified triage layer. Both modules (X-ray, Report) funnel their raw output
through here so the frontend always renders one consistent result card,
regardless of input type.
"""
from app.models.schemas import TriageResult, UrgencyLevel


def triage_xray(prediction: dict) -> TriageResult:
    label = prediction["label"]
    confidence = prediction["confidence"]

    if label == "NORMAL":
        urgency = UrgencyLevel.MONITOR
        reason = "No abnormal patterns detected in the chest X-ray."
        summary = (
            f"The model did not detect signs of pneumonia in this X-ray "
            f"(confidence: {confidence:.0%})."
        )
    else:
        # Any positive finding defaults to at least "see a doctor soon";
        # high confidence pushes it to urgent.
        if confidence >= 0.85:
            urgency = UrgencyLevel.URGENT
            reason = f"High-confidence ({confidence:.0%}) detection of {label.lower()} pattern."
        else:
            urgency = UrgencyLevel.SEE_DOCTOR_SOON
            reason = f"Possible {label.lower()} pattern detected, moderate confidence ({confidence:.0%})."
        summary = (
            f"The model detected patterns consistent with {label.lower()} "
            f"(confidence: {confidence:.0%}). The highlighted (heatmap) regions show "
            f"where the model focused."
        )

    return TriageResult(
        source_type="xray",
        summary=summary,
        urgency=urgency,
        urgency_reason=reason,
        confidence=confidence,
        details=prediction,
    )


def triage_report(simplification: dict) -> TriageResult:
    red_flags = simplification.get("red_flags", [])
    n_flags = len(red_flags)

    if n_flags == 0:
        urgency = UrgencyLevel.MONITOR
        reason = "No values outside the normal range were identified."
    elif n_flags <= 2:
        urgency = UrgencyLevel.SEE_DOCTOR_SOON
        reason = f"{n_flags} value(s) outside normal range were identified."
    else:
        urgency = UrgencyLevel.URGENT
        reason = f"{n_flags} values outside normal range were identified — worth prompt review."

    return TriageResult(
        source_type="report",
        summary=simplification.get("plain_summary", ""),
        urgency=urgency,
        urgency_reason=reason,
        confidence=None,
        details=simplification,
    )
