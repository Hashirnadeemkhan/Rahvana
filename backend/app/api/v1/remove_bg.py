# Background Removal API - remove.bg + rembg fallback
from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import Response

from rembg import remove
from rembg.session_factory import new_session
import cv2
import numpy as np
from PIL import Image
import io
import os
import traceback
import httpx

router = APIRouter()

# ------------------------------
# REMOVE.BG API CONFIGURATION (from .env)
# ------------------------------
REMOVE_BG_API_KEY = os.getenv("REMOVE_BG_API_KEY", "")
REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg"

if REMOVE_BG_API_KEY:
    print(f"[REMOVE.BG] API key loaded successfully")
else:
    print("[REMOVE.BG] No API key found, will use local rembg fallback")

# ------------------------------
# LOAD REMBG MODEL ON STARTUP
# ------------------------------
os.environ["U2NET_HOME"] = "/opt/render/.u2net"
REMBG_SESSION = new_session("u2netp")


async def remove_bg_with_api(image_bytes: bytes) -> bytes:
    """Remove background using remove.bg API."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            REMOVE_BG_API_URL,
            files={"image_file": ("image.png", image_bytes, "image/png")},
            data={"size": "auto"},
            headers={"X-Api-Key": REMOVE_BG_API_KEY}
        )
        if response.status_code == 200:
            return response.content
        else:
            raise Exception(f"Remove.bg API error: {response.status_code}")


def _face_center_crop(img_bgr: np.ndarray, width: int, height: int) -> np.ndarray:
    """Detect face and center crop the image."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)

    h, w = img_bgr.shape[:2]

    if len(faces) > 0:
        x, y, fw, fh = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + fw // 2, y + fh // 2
        crop_size = int(max(fw, fh) * 2.2)
        y_shift = int(fh * 0.25)

        y1 = max(cy - crop_size // 2 - y_shift, 0)
        y2 = min(y1 + crop_size, h)
        x1 = max(cx - crop_size // 2, 0)
        x2 = min(x1 + crop_size, w)

        cropped = img_bgr[y1:y2, x1:x2]
    else:
        min_dim = min(h, w)
        y1 = (h - min_dim) // 2
        x1 = (w - min_dim) // 2
        cropped = img_bgr[y1:y1+min_dim, x1:x1+min_dim]

    return cv2.resize(cropped, (width, height), interpolation=cv2.INTER_LANCZOS4)


def _enhance_image(img_bgr: np.ndarray) -> np.ndarray:
    """Apply light enhancement for passport photo quality."""
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 5)
    lab = cv2.merge((l, a, b))
    img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    return cv2.bilateralFilter(img, d=5, sigmaColor=15, sigmaSpace=15)


def _remove_bg_to_white_bg(input_bytes: bytes) -> np.ndarray:
    """Remove background and composite on white using rembg."""
    removed = remove(input_bytes, session=REMBG_SESSION)
    img_rgba = Image.open(io.BytesIO(removed)).convert("RGBA")
    white_bg = Image.new("RGB", img_rgba.size, (255, 255, 255))
    white_bg.paste(img_rgba, mask=img_rgba.split()[3])
    return cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)


@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    """Simple background removal - returns cropped and enhanced image."""
    input_image = await file.read()

    if REMOVE_BG_API_KEY:
        try:
            transparent_png = await remove_bg_with_api(input_image)
            img_rgba = Image.open(io.BytesIO(transparent_png)).convert("RGBA")
            white_bg = Image.new("RGB", img_rgba.size, (255, 255, 255))
            white_bg.paste(img_rgba, mask=img_rgba.split()[3])
            img_bgr = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)
        except Exception as e:
            print(f"[REMOVE.BG] API failed, using fallback: {e}")
            img_bgr = _remove_bg_to_white_bg(input_image)
    else:
        img_bgr = _remove_bg_to_white_bg(input_image)

    # Face detection and crop
    result = _face_center_crop(img_bgr, 600, 600)
    result = _enhance_image(result)

    _, buffer = cv2.imencode(".jpg", result)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")


@router.post("/passport-photo")
async def create_passport_photo(
    file: UploadFile = File(...),
    width: int = Query(default=600, ge=100, le=2000),
    height: int = Query(default=600, ge=100, le=2000),
    quality: int = Query(default=95, ge=50, le=100)
):
    """
    Create passport photo with:
    - remove.bg API (if key available) or rembg fallback
    - White background
    - Face detection and centering
    - Customizable size
    """
    input_bytes = await file.read()
    result_bgr = None

    # Try remove.bg API first
    if REMOVE_BG_API_KEY:
        try:
            print("[PASSPORT] Using remove.bg API...")
            transparent_png = await remove_bg_with_api(input_bytes)
            img_rgba = Image.open(io.BytesIO(transparent_png)).convert("RGBA")
            white_bg = Image.new("RGB", img_rgba.size, (255, 255, 255))
            white_bg.paste(img_rgba, mask=img_rgba.split()[3])
            result_bgr = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)
            print("[PASSPORT] remove.bg API success!")
        except Exception as e:
            print(f"[PASSPORT] remove.bg API failed: {e}")

    # Fallback to rembg
    if result_bgr is None:
        print("[PASSPORT] Using rembg fallback...")
        result_bgr = _remove_bg_to_white_bg(input_bytes)

    # Face detection and centering
    result_bgr = _face_center_crop(result_bgr, width, height)

    # Enhancement
    result_bgr = _enhance_image(result_bgr)

    # JPEG encode
    _, buffer = cv2.imencode(".jpg", result_bgr, [cv2.IMWRITE_JPEG_QUALITY, quality])

    return Response(
        content=buffer.tobytes(),
        media_type="image/jpeg",
        headers={"Content-Disposition": f"attachment; filename=passport_photo_{width}x{height}.jpg"}
    )
