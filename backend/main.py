# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import uvicorn
import sys

# REMBG (optional)
REMBG_SESSION = None
try:
    from rembg import new_session
    print("Loading REMBG model...")
    REMBG_SESSION = new_session("u2net")
    print("REMBG ready")
except Exception as e:
    print(f"REMBG not loaded: {e}", file=sys.stderr)

# Routers
from app.api.v1.remove_bg import router as remove_bg_router
from app.api.v1.iv_schedule import router as iv_schedule_router
from app.api.v1.i130_routes import router as i130_router
from app.api.v1.visa_checker import router as visa_checker_router

# App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Immigration Assistant with Visa Bulletin Checker",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — Auto detect dev/production from .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Arachnie API Live",
        "docs": f"{settings.API_BASE_URL}/docs" if 'render.com' in settings.API_BASE_URL else "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

# Mount Routers
app.include_router(remove_bg_router, prefix="/api/v1", tags=["remove-bg"])
app.include_router(iv_schedule_router, prefix="/api/v1", tags=["iv-schedule"])
app.include_router(i130_router, prefix="/api/v1", tags=["i130"])
app.include_router(visa_checker_router, prefix="/api/v1/visa-checker", tags=["visa-checker"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)