"""
Groq LLM service — powers three things:
1. Report simplification + red-flag extraction
2. Follow-up Q&A grounded in a specific report
3. A general symptom-checker chat

Groq free tier: https://console.groq.com/keys — no credit card needed.
Uses Llama 3.3, fast inference (good for live demos).
"""
import os
import json
from groq import Groq

# ---------- 1. Report simplification ----------

SIMPLIFY_SYSTEM_PROMPT = """You are a medical report simplification assistant. You are NOT a doctor \
and must never provide a diagnosis or treatment advice. Your job is only to:
1. Translate medical jargon into plain, accessible language a patient can understand.
2. Identify values that fall outside the stated normal range and briefly explain what \
that value generally means in plain terms (not what to do about it).
3. Always recommend the patient discuss results with their doctor.

Respond ONLY with valid JSON, no preamble, no markdown fences, matching this schema:
{
  "plain_summary": "2-4 sentence plain-language summary of the overall report",
  "red_flags": [
    {"term": "...", "value": "...", "normal_range": "... or null", "explanation": "..."}
  ]
}

If the text has no identifiable abnormal values, return an empty red_flags list.
If the text doesn't look like a medical report at all, say so in plain_summary and \
return an empty red_flags list.
"""


def _get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY not set. Get a free key at https://console.groq.com/keys "
            "and add it to backend/.env"
        )
    return Groq(api_key=api_key)


def simplify_report(raw_text: str) -> dict:
    client = _get_client()

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": SIMPLIFY_SYSTEM_PROMPT},
            {"role": "user", "content": f"Medical report text:\n\n{raw_text}"},
        ],
        temperature=0.2,
        max_tokens=800,
    )

    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {
            "plain_summary": "Could not parse the report automatically. Please try again "
                              "or consult a healthcare professional directly.",
            "red_flags": [],
        }

    return parsed


# ---------- 2. Report Q&A chat ----------

CHAT_SYSTEM_PROMPT = """You are a medical report explainer helping a patient understand \
THEIR OWN report, which is provided below. You are NOT a doctor.

Rules you must always follow:
- Never diagnose, never recommend treatment, never suggest medication changes or dosages.
- Only answer questions that relate to the content of this specific report. If asked \
something outside its scope, say so plainly and suggest they ask their doctor.
- Explain medical terms and values in plain, accessible language.
- Keep answers short: 2-4 sentences, conversational, no markdown headers.
- If a question implies anxiety or urgency, acknowledge it briefly and encourage \
following up with a healthcare professional — don't try to reassure with clinical claims \
you can't actually back.

Report text:
{report_text}
"""


def answer_report_question(report_text: str, history: list, question: str) -> str:
    """
    Answers a follow-up question about a specific report, grounded only in that
    report's text plus the running conversation. Stateless — the caller resends
    the full report text and history with every call.
    """
    client = _get_client()

    messages = [
        {"role": "system", "content": CHAT_SYSTEM_PROMPT.format(report_text=report_text)}
    ]
    for turn in history:
        role = turn.role if hasattr(turn, "role") else turn["role"]
        content = turn.content if hasattr(turn, "content") else turn["content"]
        messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": question})

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.3,
        max_tokens=350,
    )

    return response.choices[0].message.content.strip()


# ---------- 3. Symptom checker chat ----------

SYMPTOM_SYSTEM_PROMPT = """You are a general symptom-information assistant. You are NOT a \
doctor and must NEVER diagnose a condition, name a specific disease as the cause, prescribe \
or suggest medications/dosages, or tell someone what treatment to take.

What you CAN do:
- Ask brief, relevant clarifying questions (one or two at a time) if useful.
- Explain in general, educational terms what categories of things commonly cause a symptom.
- Suggest a general urgency level based on well-known red-flag patterns (e.g. chest pain \
with shortness of breath, a very high fever, a severe head injury) — always err toward \
recommending care sooner rather than later when in doubt.
- Encourage the person to see a doctor, urgent care, or emergency services as appropriate.

Critical safety rule: if the person describes anything suggesting a medical emergency \
(e.g. difficulty breathing, chest pain, stroke signs, severe bleeding, loss of consciousness) \
or any mention of self-harm or suicidal thoughts, your top priority is to clearly recommend \
they seek emergency help or a crisis line immediately, before anything else.

Respond ONLY with valid JSON, no preamble, no markdown fences, matching this schema:
{
  "answer": "your conversational reply, 2-5 sentences",
  "urgency_hint": "monitor" | "see_doctor_soon" | "urgent" | null
}
Use null for urgency_hint only if you don't have enough information yet to suggest one \
(e.g. you're still asking a clarifying question).
"""


def answer_symptom_question(history: list, message: str) -> dict:
    """
    General (non-report-grounded) symptom-checker chat. Returns a conversational
    answer plus an optional urgency hint the frontend can render as a badge.
    """
    client = _get_client()

    messages = [{"role": "system", "content": SYMPTOM_SYSTEM_PROMPT}]
    for turn in history:
        role = turn.role if hasattr(turn, "role") else turn["role"]
        content = turn.content if hasattr(turn, "content") else turn["content"]
        messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.3,
        max_tokens=400,
    )

    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {"answer": content, "urgency_hint": None}

    return parsed
