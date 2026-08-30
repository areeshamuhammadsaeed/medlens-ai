"""
OCR service: extracts raw text from an uploaded medical report (image or PDF).
Uses Tesseract, which is free and runs locally (no API needed).

Install system dependency: sudo apt-get install tesseract-ocr poppler-utils
"""
import io
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text(file_bytes: bytes, content_type: str) -> str:
    """
    Extracts text from an uploaded report. Handles both image formats and PDFs.
    """
    if content_type == "application/pdf":
        pages = convert_from_bytes(file_bytes)
        text_chunks = [pytesseract.image_to_string(page) for page in pages]
        return "\n".join(text_chunks)
    else:
        image = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(image)
