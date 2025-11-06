# backend/app/api/v1/i130_routes.py
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import json
from scripts.fill_i130_pdf import fill_pdf

router = APIRouter(prefix="/i130", tags=["I-130 Form"])

# DEBUG: Print exact path
current_file = os.path.abspath(__file__)
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))
JSON_PATH = os.path.join(base_dir, "generated", "i130_fields_structured.json")

print(f"\nJSON PATH: {JSON_PATH}")
print(f"File exists: {os.path.exists(JSON_PATH)}\n")

@router.get("/fields-structured")
async def get_structured_fields():
    if not os.path.exists(JSON_PATH):
        raise HTTPException(status_code=404, detail=f"File not found: {JSON_PATH}")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.post("/fill")
async def fill_form(form_data: dict):
    filled_path = fill_pdf(form_data)
    return FileResponse(filled_path, filename="I-130_Filled.pdf", media_type="application/pdf")