# app/api/v1/i130_routes.py
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
import fitz
import io
import os
import logging
from typing import Dict
import pdf_config

# Configure logging
logger = logging.getLogger(__name__)

# Load field mapping
FIELD_MAPPING = pdf_config.FIELD_MAPPING

router = APIRouter()

class PDFFillerService:
    def __init__(self, field_mapping: Dict[str, str]):
        self.field_mapping = field_mapping

    def fill_pdf(self, pdf_path: str, form_data: Dict[str, str]) -> io.BytesIO:
        doc = fitz.open(pdf_path)
        filled_count = 0
        unfilled = []

        for frontend_key, value in form_data.items():
            pdf_field_name = self.field_mapping.get(frontend_key)
            if not pdf_field_name:
                unfilled.append(frontend_key)
                continue

            value = str(value).strip()
            if not value:
                continue

            is_filled = False
            for page in doc:
                for widget in page.widgets():
                    if widget.field_name == pdf_field_name:
                        try:
                            if widget.field_type in (fitz.PDF_WIDGET_TYPE_CHECKBOX, fitz.PDF_WIDGET_TYPE_RADIOBUTTON):
                                widget.field_value = "Yes" if value == "Yes" else "Off"
                            else:
                                widget.field_value = value
                            widget.update()
                            filled_count += 1
                            is_filled = True
                            break
                        except Exception as e:
                            logger.error(f"Error setting {pdf_field_name}: {e}")
                if is_filled:
                    break

            if not is_filled:
                unfilled.append(frontend_key)

        logger.info(f"Filled {filled_count} fields")
        if unfilled:
            logger.warning(f"Unfilled keys: {unfilled}")

        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True)
        doc.close()
        output.seek(0)
        return output

# Initialize service
pdf_service = PDFFillerService(FIELD_MAPPING)

def find_pdf_template() -> str:
    # Render-specific paths first
    possible_paths = [
        "/app/i130.pdf",  # Render container root
        "/app/i130_base.pdf",
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "i130.pdf"),  # Fallback for local
        os.path.join(os.path.dirname(__file__), "..", "..", "i130.pdf"),  # Another fallback
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            print(f"Found PDF: {path}")  # Debug log
            return path
            
    raise FileNotFoundError("PDF template not found. Ensure i130.pdf is in backend root.")

@router.post("/fill-pdf")
async def fill_pdf(request: Request):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    if not data:
        raise HTTPException(status_code=400, detail="No data")

    try:
        pdf_path = find_pdf_template()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))

    try:
        output = pdf_service.fill_pdf(pdf_path, data)
        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=i130-filled.pdf"},
        )
    except Exception as e:
        logger.error(f"PDF fill error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

@router.get("/debug-fields")
async def debug_fields():
    try:
        pdf_path = find_pdf_template()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))

    doc = fitz.open(pdf_path)
    fields = []
    for page_num, page in enumerate(doc):
        for widget in page.widgets():
            fields.append({
                "page": page_num + 1,
                "name": widget.field_name,
                "type": widget.field_type_string,
                "rect": list(widget.rect),
            })
    doc.close()

    return {
        "total_fields": len(fields),
        "fields": fields,
        "mapped_in_config": len(FIELD_MAPPING),
        "mapped_field_names": list(FIELD_MAPPING.values()),
    }

@router.get("/health")
async def health():
    return {
        "status": "OK",
        "message": "I-130 PDF Filler Running",
        "mapped_fields": len(FIELD_MAPPING),
    }

@router.get("/form-structure")
async def form_structure():
    return {
        "expected_keys": list(FIELD_MAPPING.keys()),
        "count": len(FIELD_MAPPING),
    }