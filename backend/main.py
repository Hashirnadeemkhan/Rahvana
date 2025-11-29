# C:\Users\HP\Desktop\arachnie\Arachnie\backend\main.py
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
from app.api.v1.visa_checker import router as visa_checker_router
from app.api.v1.pdf_routes import router as pdf_router
from app.api.v1.whatsapp import router as whatsapp_router

# App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Immigration Assistant with Visa Bulletin Checker",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# FIXED CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        # Add your production URL when deployed
        settings.API_BASE_URL if 'render.com' in settings.API_BASE_URL else "",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # Important for file downloads
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
app.include_router(pdf_router, prefix="/api/v1", tags=["pdf-forms"])
app.include_router(visa_checker_router, prefix="/api/v1/visa-checker", tags=["visa-checker"])
app.include_router(whatsapp_router, prefix="/api/v1", tags=["whatsapp-ai"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)