# C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\api\v1\remove_bg.py
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

# Check if API key is available
if REMOVE_BG_API_KEY:
    print(f"[REMOVE.BG] API key loaded successfully")
else:
    print("[REMOVE.BG] No API key found, will use local rembg fallback")

# ------------------------------
# LOAD REMBG MODEL ON STARTUP (fallback)
# ------------------------------
os.environ["U2NET_HOME"] = "/opt/render/.u2net"
REMBG_SESSION = new_session("u2netp")   # smallest + fastest model

# Try to load MODNet matting service for passport photos
MATTING_SERVICE = None
try:
    from app.services.matting_service import MattingService
    MATTING_SERVICE = MattingService()
    print("[PASSPORT] MODNet matting service loaded successfully")
except Exception as e:
    print(f"[PASSPORT] MODNet not available, using rembg fallback: {e}")


async def remove_bg_with_api(image_bytes: bytes) -> bytes:
    """
    Remove background using remove.bg API.
    Returns PNG image with transparent background.
    """
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
            error_msg = response.text
            print(f"[REMOVE.BG] API Error: {response.status_code} - {error_msg}")
            raise Exception(f"Remove.bg API error: {response.status_code}")


@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    input_image = await file.read()

    removed = remove(input_image, session=REMBG_SESSION)

    # Convert to RGBA
    img = Image.open(io.BytesIO(removed)).convert("RGBA")
    white_bg = Image.new("RGB", img.size, (255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])

    # Convert to cv2
    img_cv = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # Face detection
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)

    if len(faces) > 0:
        x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + w // 2, y + h // 2
        crop_size = int(max(w, h) * 2.0)
        y_shift = int(h * 0.3)

        y1 = max(cy - crop_size // 2 - y_shift, 0)
        y2 = min(y1 + crop_size, img_cv.shape[0])
        x1 = max(cx - crop_size // 2, 0)
        x2 = min(x1 + crop_size, img_cv.shape[1])

        cropped = img_cv[y1:y2, x1:x2]
    else:
        cropped = img_cv

    # Resize
    final_img = cv2.resize(cropped, (600, 600), interpolation=cv2.INTER_AREA)

    # Enhancement
    lab = cv2.cvtColor(final_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 8)
    lab = cv2.merge((l, a, b))
    final_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    final_img = cv2.bilateralFilter(final_img, d=7, sigmaColor=25, sigmaSpace=25)
    final_img = cv2.convertScaleAbs(final_img, alpha=1.03, beta=3)

    _, buffer = cv2.imencode(".jpg", final_img)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")


@router.post("/passport-photo")
async def create_passport_photo(
    file: UploadFile = File(...),
    width: int = Query(default=600, ge=100, le=2000),
    height: int = Query(default=600, ge=100, le=2000),
    quality: int = Query(default=95, ge=50, le=100)
):
    """
    Create a professional passport photo with:
    - AI-powered background removal (remove.bg API -> MODNet -> rembg fallback)
    - Clean white background for passport compliance
    - Face detection and centering
    - Customizable size (default 2x2 inch at 300dpi)

    Priority order:
    1. remove.bg API (best quality, if API key available)
    2. MODNet (local AI model, if loaded)
    3. rembg (lightweight fallback)

    Args:
        file: Input image file
        width: Output width in pixels (default 600)
        height: Output height in pixels (default 600)
        quality: JPEG quality (default 95)

    Returns:
        JPEG image with white background
    """
    input_bytes = await file.read()
    result_bgr = None

    # Priority 1: Try remove.bg API if API key is available
    if REMOVE_BG_API_KEY:
        try:
            print("[PASSPORT] Trying remove.bg API...")
            result_bgr = await _process_passport_with_removebg(input_bytes, width, height)
            print("[PASSPORT] remove.bg API success!")
        except Exception as e:
            print(f"[PASSPORT] remove.bg API failed: {e}")
            traceback.print_exc()

    # Priority 2: Try MODNet if available and remove.bg failed
    if result_bgr is None and MATTING_SERVICE is not None:
        try:
            print("[PASSPORT] Trying MODNet pipeline...")
            result_rgb = MATTING_SERVICE.process_passport_photo(
                input_bytes,
                output_size=(width, height)
            )
            result_bgr = cv2.cvtColor(result_rgb, cv2.COLOR_RGB2BGR)
            print("[PASSPORT] MODNet success!")
        except Exception as e:
            print(f"[PASSPORT] MODNet failed: {e}")
            traceback.print_exc()

    # Priority 3: Fallback to rembg
    if result_bgr is None:
        try:
            print("[PASSPORT] Falling back to local rembg...")
            result_bgr = _process_passport_fallback(input_bytes, width, height)
            print("[PASSPORT] rembg fallback success!")
        except Exception as e:
            print(f"[PASSPORT] rembg fallback failed: {e}")
            traceback.print_exc()
            return Response(
                content=f"Error processing image: {str(e)}",
                status_code=500,
                media_type="text/plain"
            )

    # Encode as JPEG
    encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    _, buffer = cv2.imencode(".jpg", result_bgr, encode_params)

    return Response(
        content=buffer.tobytes(),
        media_type="image/jpeg",
        headers={
            "Content-Disposition": f"attachment; filename=passport_photo_{width}x{height}.jpg"
        }
    )


async def _process_passport_with_removebg(input_bytes: bytes, width: int, height: int) -> np.ndarray:
    """
    Process passport photo using remove.bg API and add white background.
    """
    # Step 1: Remove background using remove.bg API
    transparent_png = await remove_bg_with_api(input_bytes)

    # Step 2: Open the transparent PNG
    img_rgba = Image.open(io.BytesIO(transparent_png)).convert("RGBA")

    # Step 3: Create white background and composite
    white_bg = Image.new("RGB", img_rgba.size, (255, 255, 255))
    white_bg.paste(img_rgba, mask=img_rgba.split()[3])  # Use alpha channel as mask

    # Step 4: Convert to cv2 (BGR)
    img_cv = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)

    # Step 5: Face detection and centering
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)

    h, w_img = img_cv.shape[:2]

    if len(faces) > 0:
        # Get largest face
        x, y, fw, fh = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + fw // 2, y + fh // 2
        crop_size = int(max(fw, fh) * 2.2)
        y_shift = int(fh * 0.25)

        y1 = max(cy - crop_size // 2 - y_shift, 0)
        y2 = min(y1 + crop_size, h)
        x1 = max(cx - crop_size // 2, 0)
        x2 = min(x1 + crop_size, w_img)

        cropped = img_cv[y1:y2, x1:x2]
    else:
        # No face detected, center crop
        min_dim = min(h, w_img)
        y1 = (h - min_dim) // 2
        x1 = (w_img - min_dim) // 2
        cropped = img_cv[y1:y1+min_dim, x1:x1+min_dim]

    # Step 6: Resize to target dimensions
    final_img = cv2.resize(cropped, (width, height), interpolation=cv2.INTER_LANCZOS4)

    # Step 7: Light enhancement for passport photo quality
    lab = cv2.cvtColor(final_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 5)
    lab = cv2.merge((l, a, b))
    final_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    final_img = cv2.bilateralFilter(final_img, d=5, sigmaColor=15, sigmaSpace=15)

    return final_img


def _process_passport_fallback(input_bytes: bytes, width: int, height: int) -> np.ndarray:
    """
    Fallback passport photo processing using rembg.
    """
    # Remove background with rembg
    removed = remove(input_bytes, session=REMBG_SESSION)

    # Convert to RGBA
    img = Image.open(io.BytesIO(removed)).convert("RGBA")

    # Create white background
    white_bg = Image.new("RGB", img.size, (255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])

    # Convert to cv2 (BGR)
    img_cv = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)

    # Face detection and centering
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)

    h, w_img = img_cv.shape[:2]

    if len(faces) > 0:
        x, y, fw, fh = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + fw // 2, y + fh // 2
        crop_size = int(max(fw, fh) * 2.2)
        y_shift = int(fh * 0.25)

        y1 = max(cy - crop_size // 2 - y_shift, 0)
        y2 = min(y1 + crop_size, h)
        x1 = max(cx - crop_size // 2, 0)
        x2 = min(x1 + crop_size, w_img)

        cropped = img_cv[y1:y2, x1:x2]
    else:
        min_dim = min(h, w_img)
        y1 = (h - min_dim) // 2
        x1 = (w_img - min_dim) // 2
        cropped = img_cv[y1:y1+min_dim, x1:x1+min_dim]

    # Resize
    final_img = cv2.resize(cropped, (width, height), interpolation=cv2.INTER_LANCZOS4)

    # Enhancement
    lab = cv2.cvtColor(final_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 5)
    lab = cv2.merge((l, a, b))
    final_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    final_img = cv2.bilateralFilter(final_img, d=5, sigmaColor=15, sigmaSpace=15)

    return final_img