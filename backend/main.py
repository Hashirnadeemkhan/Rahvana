# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import os
import uvicorn

# Import routers
from app.api.v1.remove_bg import router as remove_bg_router
from app.api.v1.iv_schedule import router as iv_schedule_router
from app.api.v1.i130_routes import router as i130_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Immigration form filler with PDF support",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Ensure your frontend URLs are here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root & Health endpoints
@app.get("/")
def root():
    return {"message": f"{settings.PROJECT_NAME} running", "version": settings.VERSION}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Register routers
app.include_router(remove_bg_router, prefix="/api/v1", tags=["remove-bg"])
app.include_router(iv_schedule_router, prefix="/api/v1", tags=["iv-schedule"])
app.include_router(i130_router, prefix="/api/v1", tags=["i130"])

# # --- Uvicorn start for local & Render ---
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 8000))  # Render sets PORT automatically
#     uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
