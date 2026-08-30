"""
Chest X-ray classifier: loads a fine-tuned ViT/ResNet model and runs inference.

Training happens separately in Colab/Kaggle (see backend/notebooks/train_xray.ipynb).
This module just loads the exported weights and serves predictions.
"""
import os
import io
import base64
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import timm
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image



def reshape_transform(tensor, height=14, width=14):
    """
    ViT represents images as a sequence of patch tokens, not a 2D grid.
    Grad-CAM needs a 2D spatial layout, so this reshapes the sequence
    (dropping the [CLS] token) back into a height x width grid.
    """
    result = tensor[:, 1:, :].reshape(tensor.size(0), height, width, tensor.size(2))
    result = result.transpose(2, 3).transpose(1, 2)
    return result

# Update these once you've trained and know your final class set.
# Common setup for the Kaggle "Chest X-Ray Images (Pneumonia)" dataset:
CLASS_NAMES = ["NORMAL", "PNEUMONIA"]
# If you add TB data later, expand to: ["NORMAL", "PNEUMONIA", "TUBERCULOSIS"]

IMAGE_SIZE = 224

_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.Grayscale(num_output_channels=3),  # X-rays are grayscale; model expects 3ch
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

_model = None
_cam = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_model():
    """Loads the model once and caches it. Call at app startup or lazily on first request."""
    global _model, _cam
    if _model is not None:
        return _model

    model_name = os.getenv("IMAGE_MODEL_NAME", "vit_base_patch16_224")
    weights_path = os.getenv("IMAGE_MODEL_PATH", "weights/chest_xray_vit.pt")

    model = timm.create_model(model_name, pretrained=False, num_classes=len(CLASS_NAMES))

    if os.path.exists(weights_path):
        state_dict = torch.load(weights_path, map_location=_device)
        model.load_state_dict(state_dict)
    else:
        # Fallback so the API doesn't crash before you've trained a model yet.
        # Replace weights/chest_xray_vit.pt with your trained checkpoint.
        print(f"[WARNING] No weights found at {weights_path}. Using untrained model — "
              f"predictions will be meaningless until you train and export weights.")

    model.eval()
    model.to(_device)
    _model = model

    # Grad-CAM target layer differs by architecture; for ViT, use the last block's norm layer.
    if "vit" in model_name:
        target_layers = [model.blocks[-1].norm1]
        _cam = GradCAM(model=model, target_layers=target_layers, reshape_transform=reshape_transform)
    else:
        target_layers = [model.layer4[-1]]
        _cam = GradCAM(model=model, target_layers=target_layers)
    return _model


def predict(image_bytes: bytes) -> dict:
    """
    Runs classification + Grad-CAM on an uploaded X-ray image.
    Returns label, confidence, per-class probabilities, and a base64 heatmap overlay.
    """
    load_model()  # no-op if already loaded

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = _transform(image).unsqueeze(0).to(_device)

    with torch.no_grad():
        logits = _model(input_tensor)
        probs = F.softmax(logits, dim=1)[0].cpu().numpy()

    pred_idx = int(np.argmax(probs))
    label = CLASS_NAMES[pred_idx]
    confidence = float(probs[pred_idx])
    all_class_probs = {CLASS_NAMES[i]: float(probs[i]) for i in range(len(CLASS_NAMES))}

    # Grad-CAM heatmap
    grayscale_cam = _cam(input_tensor=input_tensor, targets=None)[0]
    rgb_img = np.array(image.resize((IMAGE_SIZE, IMAGE_SIZE))).astype(np.float32) / 255.0
    cam_overlay = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    _, buffer = cv2.imencode(".png", cv2.cvtColor(cam_overlay, cv2.COLOR_RGB2BGR))
    heatmap_base64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "label": label,
        "confidence": confidence,
        "all_class_probs": all_class_probs,
        "heatmap_base64": heatmap_base64,
    }
