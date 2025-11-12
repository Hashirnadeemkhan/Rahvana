# backend/main.py

# 1. Zaroori Imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# settings ko sabse pehle import karein
from app.core.config import settings
import os 
import uvicorn
import sys

# =========================================================================
# 💡 FIX 1: REMBG Model Pre-loading (Model ko RAM mein pehle se load karein)
# =========================================================================
# Ye step zaroori hai bhale hi RAM zyada ho, taaki har request par model load na ho.
try:
    from rembg import new_session
    # REMBG_SESSION ko global scope mein define karein
    global REMBG_SESSION 
    print("Pre-loading REMBG model (u2net) at startup...")
    REMBG_SESSION = new_session('u2net') 
    print("✅ REMBG Model (u2net) loaded successfully.")
    
except Exception as e:
    print(f"⚠️ WARNING: Failed to pre-load REMBG model: {e}", file=sys.stderr)
    REMBG_SESSION = None # Agar fail ho toh None set kar dein

# =========================================================================
# 2. App Initialization
# =========================================================================
app = FastAPI(
    title=settings.PROJECT_NAME,
    # ... baki settings ...
)

# =========================================================================
# 3. CORS Middleware (Your existing code - yeh sahi lag raha hai)
# =========================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Note: Agar settings.CORS_ORIGINS mein 'https://www.rahvana.com' sahi se load ho raha hai,
# toh yeh kaam karna chahiye. Agar phir bhi masla ho, toh settings ko print karwa kar dekhen.

# Import routers (Model pre-loading ke baad hi routers import karein)
from app.api.v1.remove_bg import router as remove_bg_router
from app.api.v1.iv_schedule import router as iv_schedule_router
from app.api.v1.i130_routes import router as i130_router


# Root & Health endpoints (Keep your existing endpoints)
@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} running", "version": settings.VERSION}
# ... health endpoint ...

# Register routers
app.include_router(remove_bg_router, prefix="/api/v1", tags=["remove-bg"])
app.include_router(iv_schedule_router, prefix="/api/v1", tags=["iv-schedule"])
app.include_router(i130_router, prefix="/api/v1", tags=["i130"])

# ...