# backend/app/api/v1/pdf_routes.py
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any

import fitz

from app.services.pdf_filler import PDFFillerService

router = APIRouter()

class FillRequest(BaseModel):
    formId: str
    data: Dict[str, Any]

@router.post("/fill-pdf")
async def fill_pdf(request: FillRequest):
    try:
        pdf_service = PDFFillerService(form_id=request.formId)
        output = pdf_service.fill_pdf(form_data=request.data)
        
        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={request.formId}_filled.pdf"}
        )
    except (ValueError, FileNotFoundError) as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}")

@router.get("/debug-pdf-fields/{form_id}")
async def debug_pdf_fields(form_id: str):
    try:
        pdf_service = PDFFillerService(form_id=form_id)
        doc = fitz.open(pdf_service.pdf_path)
        fields = [
            {
                "page": page_num + 1,
                "name": w.field_name,
                "type": w.field_type_string,
                "value": w.field_value,
                "rect": list(w.rect),
            }
            for page_num, page in enumerate(doc)
            for w in page.widgets()
        ]
        doc.close()

        return {
            "form_id": form_id,
            "pdf_path": pdf_service.pdf_path,
            "total_pdf_fields": len(fields),
            "mapped_in_config": len(pdf_service.field_mapping),
            "sample_fields": fields[:100],
        }
    except (ValueError, FileNotFoundError) as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
