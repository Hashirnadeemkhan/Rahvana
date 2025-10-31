from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import remove_bg_router, iv_schedule_router

import numpy as np
from PIL import Image
import io


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is working"}

app.include_router(remove_bg_router, prefix="/api/v1")
app.include_router(iv_schedule_router, prefix="/api/v1")