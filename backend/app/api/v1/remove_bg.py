from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response
import cv2
import numpy as np
from PIL import Image
import io
# *CRITICAL CHANGE:* Import the session creator
from rembg.session_factory import new_session 
from rembg import remove

router = APIRouter()

# --- 1. Define the low-memory model ---
REMBG_MODEL = 'u2netp' 

# --- 2. GLOBAL CHANGE: Pre-load the smaller model session on startup ---
# This executes ONCE when the app starts, forcing the small model (u2netp) 
# to be loaded, thereby avoiding the OOM error caused by the large default model.
REMBG_SESSION = new_session(REMBG_MODEL)

@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    # Read uploaded file
    input_image = await file.read()
    
    # 3. Use the pre-loaded global session object
    removed_bg = remove(input_image, session=REMBG_SESSION)
    
    # 4. Convert to RGBA and paste on white background
    img = Image.open(io.BytesIO(removed_bg)).convert("RGBA")
    white_bg = Image.new("RGB", img.size, (255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])
    
    # 5. Convert to OpenCV format for face detection and processing
    img_cv = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # 6. Detect face
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)
    
    if len(faces) > 0:
        # Select largest face
        x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + w // 2, y + h // 2

        # Define square crop (2x2 ratio) around the face
        crop_size = int(max(w, h) * 2.0)

        # Move crop area slightly up (for passport style)
        y_shift = int(h * 0.3)
        y1 = max(cy - crop_size // 2 - y_shift, 0)
        y2 = min(y1 + crop_size, img_cv.shape[0])
        x1 = max(cx - crop_size // 2, 0)
        x2 = min(x1 + crop_size, img_cv.shape[1])

        cropped = img_cv[y1:y2, x1:x2]
    else:
        # Fallback: no face found, use original image with white background
        cropped = img_cv

    # 7. Resize to standard passport size (600x600)
    final_img = cv2.resize(cropped, (600, 600), interpolation=cv2.INTER_AREA)

    # 8. Enhance brightness and smoothness
    lab = cv2.cvtColor(final_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 8)
    l = np.clip(l, 0, 255).astype(np.uint8)
    lab = cv2.merge((l, a, b))
    final_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    final_img = cv2.bilateralFilter(final_img, d=7, sigmaColor=25, sigmaSpace=25)
    final_img = cv2.convertScaleAbs(final_img, alpha=1.03, beta=3)

    # 9. Encode and return
    _, buffer = cv2.imencode(".jpg", final_img)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")