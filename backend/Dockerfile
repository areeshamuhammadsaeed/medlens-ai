FROM python:3.10-slim

# System dependencies:
# - tesseract-ocr: the actual OCR engine (pytesseract is just a Python wrapper around it)
# - poppler-utils: needed to convert PDF pages to images before OCR
# - curl: used below to fetch the trained model weights
# - libgl1 / libglib2.0-0: required by opencv at import time, otherwise it crashes
#   with "libGL.so.1: cannot open shared object file" on minimal Linux images
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    poppler-utils \
    curl \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# The trained model weights are too large to commit to git, so they're hosted as a
# GitHub Release asset and downloaded here at build time instead.
RUN mkdir -p weights && \
    curl -L -o weights/chest_xray_vit.pt \
    https://github.com/areeshamuhammadsaeed/medlens-ai/releases/download/v1.0-weights/chest_xray_vit.pt

EXPOSE 8080

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
