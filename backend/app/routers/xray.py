from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.xray_model import predict
from app.services.triage import triage_xray
from app.models.schemas import TriageResult

router = APIRouter()


@router.post("/analyze", response_model=TriageResult)
async def analyze_xray(file: UploadFile = File(...)):
    """
    Upload a chest X-ray image. Returns classification (Normal/Pneumonia),
    confidence, a Grad-CAM heatmap, and a unified triage verdict.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file (jpg/png).")

    image_bytes = await file.read()

    try:
        prediction = predict(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    return triage_xray(prediction)
