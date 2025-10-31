import cv2
import numpy as np
from PIL import Image
import io
from rembg import remove

async def process_passport_photo(file) -> bytes:
    input_image = await file.read()
    removed_bg = remove(input_image)
    img = Image.open(io.BytesIO(removed_bg)).convert("RGBA")
    
    white_bg = Image.new("RGB", img.size, (255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])
    img_cv = cv2.cvtColor(np.array(white_bg), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    
    # Face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, 1.1, 6)
    
    if len(faces) > 0:
        x, y, w, h = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
        cx, cy = x + w // 2, y + h // 2
        pad_w = int(w * 2.0)
        pad_h_top = int(h * 2.5)
        pad_h_bottom = int(h * 1.5)
        
        x1 = max(cx - pad_w // 2, 0)
        x2 = min(cx + pad_w // 2, img_cv.shape[1])
        y1 = max(cy - h // 2 - (pad_h_top - h // 2), 0)
        y2 = min(cy + h // 2 + pad_h_bottom, img_cv.shape[0])
        cropped = img_cv[y1:y2, x1:x2]
    else:
        cropped = img_cv
    
    # Aspect ratio + resize
    crop_h, crop_w = cropped.shape[:2]
    target_size = 600
    aspect = crop_w / crop_h
    if aspect > 1:
        new_w, new_h = target_size, int(target_size / aspect)
    else:
        new_h, new_w = target_size, int(target_size * aspect)
    
    resized = cv2.resize(cropped, (new_w, new_h), interpolation=cv2.INTER_AREA)
    final_img = np.ones((target_size, target_size, 3), dtype=np.uint8) * 255
    y_offset = (target_size - new_h) // 2
    x_offset = (target_size - new_w) // 2
    final_img[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
    
    # Natural touch-up
    lab = cv2.cvtColor(final_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.add(l, 8)
    l = np.clip(l, 0, 255).astype(np.uint8)
    lab = cv2.merge((l, a, b))
    final_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    final_img = cv2.bilateralFilter(final_img, d=7, sigmaColor=25, sigmaSpace=25)
    final_img = cv2.convertScaleAbs(final_img, alpha=1.03, beta=3)
    
    _, buffer = cv2.imencode(".jpg", final_img)
    return buffer.tobytes()