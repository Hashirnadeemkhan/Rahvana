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

router = APIRouter()

# ------------------------------
# LOAD REMBG MODEL ON STARTUP
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
    - AI-powered background removal (MODNet)
    - Clean hair edge handling (no blue/green spill)
    - White background
    - Face centering
    - 2x2 inch standard size (600x600 at 300dpi)

    Args:
        file: Input image file
        width: Output width in pixels (default 600)
        height: Output height in pixels (default 600)
        quality: JPEG quality (default 95)

    Returns:
        JPEG image with white background
    """
    input_bytes = await file.read()

    try:
        if MATTING_SERVICE is not None:
            # Use professional MODNet pipeline
            print("[PASSPORT] Using MODNet pipeline...")
            result_rgb = MATTING_SERVICE.process_passport_photo(
                input_bytes,
                output_size=(width, height)
            )
            # Convert RGB to BGR for cv2
            result_bgr = cv2.cvtColor(result_rgb, cv2.COLOR_RGB2BGR)
        else:
            # Fallback to rembg
            print("[PASSPORT] Using rembg fallback...")
            result_bgr = _process_passport_fallback(input_bytes, width, height)

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

    except Exception as e:
        print(f"[PASSPORT] Error: {e}")
        traceback.print_exc()
        # Try fallback
        try:
            result_bgr = _process_passport_fallback(input_bytes, width, height)
            encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
            _, buffer = cv2.imencode(".jpg", result_bgr, encode_params)
            return Response(content=buffer.tobytes(), media_type="image/jpeg")
        except Exception as e2:
            return Response(
                content=f"Error processing image: {str(e2)}",
                status_code=500,
                media_type="text/plain"
            )


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