# Arachnie API 

This is the backend server (built with FastAPI) that powers the entire immigration web app.

### What does it do?

#### 1. Creates Perfect Passport Photos Automatically  
- User uploads any selfie or photo  
- AI removes the background instantly  
- Detects the face and crops it exactly like a real passport photo  
- Resizes to official 2×2 inch size (600×600 pixels @ 300 DPI)  
- Slightly enhances brightness & smoothness  
- Returns a ready-to-print passport photo  

**Endpoint:** `POST /api/v1/remove-bg` (upload an image → get perfect passport photo back)

#### 2. Auto-Fills USCIS I-130 PDF Form  
- User fills the form on the website (name, address, DOB, etc.)  
- This server takes that data  
- Opens the official USCIS I-130 PDF template  
- Fills every field correctly behind the scenes  
- Returns a fully filled, ready-to-submit PDF  

**Endpoint:** `POST /api/v1/fill-pdf` (send form data → download filled I-130 PDF)

#### 3. Immigrant Visa (IV) Schedule Checker  
- Fetches latest visa bulletin data from official sources  
- Lets users search by city or visa category  
- Shows when their priority date becomes current  

**Endpoint:** `GET /api/v1/iv-schedule`

#### 4. Health & Debug Tools  
- `/health` → quick check if server is alive  
- `/debug-fields` → shows all fillable fields in the I-130 PDF (useful for developers)  
- `/form-structure` → shows exactly which form keys the frontend should send

### Tech Summary (for non-devs)
- Runs on Python + FastAPI (very fast & modern)  
- Can run locally or deployed on Render/Vercel/etc.  
- Automatically loads AI model for background removal (if available)  
- Works on both development and production

That’s it!  
Frontend talks to this backend → magic happens → users get perfect photos and filled forms without doing anything manually.
