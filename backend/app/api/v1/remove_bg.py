from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response
import cv2
import numpy as np
from PIL import Image
import io
from rembg import remove

router = APIRouter()

@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    # Read uploaded file
    input_image = await file.read()
    
    # Remove background using rembg
    removed_bg = remove(input_image)
    
    # Convert to RGBA and paste on white background
    img = Image.open(io.BytesIO(removed_bg)).convert("RGBA")
    white_bg = Image.new("RGB", img.size, (255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])
    
    # Convert to OpenCV format
    img_cv = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # Detect face
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)
    
    if len(faces) > 0:
        # Select largest face
        x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + w // 2, y + h // 2

        # Define square crop (2x2 ratio) around the face
        crop_size = int(max(w, h) * 2.0)

        # Move crop area slightly up (so face is a bit higher, like passport)
        y_shift = int(h * 0.3)
        y1 = max(cy - crop_size // 2 - y_shift, 0)
        y2 = min(y1 + crop_size, img_cv.shape[0])
        x1 = max(cx - crop_size // 2, 0)
        x2 = min(x1 + crop_size, img_cv.shape[1])

        cropped = img_cv[y1:y2, x1:x2]
    else:
        # Fallback: no face found, use original
        cropped = img_cv

    # Resize to standard passport size (600x600 = 2x2 inches at 300 DPI)
    final_img = cv2.resize(cropped, (600, 600), interpolation=cv2.INTER_AREA)

    # Enhance brightness and smoothness
    lab = cv2.cvtColor(final_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 8)
    l = np.clip(l, 0, 255).astype(np.uint8)
    lab = cv2.merge((l, a, b))
    final_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    final_img = cv2.bilateralFilter(final_img, d=7, sigmaColor=25, sigmaSpace=25)
    final_img = cv2.convertScaleAbs(final_img, alpha=1.03, beta=3)

    # Encode to JPEG
    _, buffer = cv2.imencode(".jpg", final_img)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")
