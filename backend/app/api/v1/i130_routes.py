# app/api/v1/i130_routes.py
import os
import io
import logging
from typing import Dict
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
import fitz  # PyMuPDF

# Import your field mapping
import pdf_config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Load field mapping from pdf_config.py
FIELD_MAPPING: Dict[str, str] = pdf_config.FIELD_MAPPING


class PDFFillerService:
    def __init__(self, field_mapping: Dict[str, str]):
        self.field_mapping = field_mapping

    def fill_pdf(self, pdf_path: str, form_data: Dict[str, str]) -> io.BytesIO:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF template not found at {pdf_path}")

        doc = fitz.open(pdf_path)
        filled_count = 0
        unfilled = []

        for frontend_key, value in form_data.items():
            pdf_field_name = self.field_mapping.get(frontend_key)
            if not pdf_field_name:
                unfilled.append(frontend_key)
                continue

            str_value = str(value or "").strip()
            if not str_value:
                continue  # Skip empty values

            found = False
            for page in doc:
                if found:
                    break
                for widget in page.widgets():
                    if widget.field_name != pdf_field_name:
                        continue

                    try:
                        widget_type = widget.field_type

                        # Handle Checkboxes & Radio buttons properly
                        if widget_type in (fitz.PDF_WIDGET_TYPE_CHECKBOX, fitz.PDF_WIDGET_TYPE_RADIOBUTTON):
                            # Most USCIS PDFs use "Yes" and "Off", some use export value "1"
                            on_values = ["Yes", "1", "On"]
                            off_values = ["Off", "0", "No"]

                            desired = "Yes" if str_value in ["Yes", "yes", "true", "True", "1", True] else "Off"
                            widget.field_value = desired
                        else:
                            # Text fields, combo boxes, etc.
                            widget.field_value = str_value

                        widget.update()
                        filled_count += 1
                        found = True
                        break

                    except Exception as e:
                        logger.error(f"Error filling field {pdf_field_name}: {e}")

            if not found:
                unfilled.append(frontend_key)

        logger.info(f"Filled {filled_count} fields successfully.")
        if unfilled:
            logger.warning(f"Unfilled frontend keys: {unfilled}")

        # Save to BytesIO
        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True, clean=True)
        doc.close()
        output.seek(0)
        return output


# Initialize service
pdf_service = PDFFillerService(FIELD_MAPPING)


def find_pdf_template() -> str:
    """
    Smart detection of i130.pdf
    Works on Windows (your PC), Linux, Docker, Render.com
    """
    candidates = [
        # Your exact path (highest priority)
        r"C:\Users\HP\Desktop\arachnie\Arachnie\backend\pdfs\i130.pdf",

        # Standard project paths
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "pdfs", "i130.pdf"),
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "i130.pdf"),
        "/app/pdfs/i130.pdf",                    # Render/Docker
        "/app/i130.pdf",
        "./pdfs/i130.pdf",
        "./i130.pdf",
    ]

    for path in candidates:
        absolute = os.path.abspath(path)
        if os.path.exists(absolute):
            logger.info(f"PDF template found: {absolute}")
            return absolute

    raise FileNotFoundError(
        "i130.pdf not found!\n"
        "Make sure the file exists at one of these locations:\n" +
        "\n".join(candidates)
    )


@router.post("/fill-pdf")
async def fill_pdf(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="JSON body must be an object")

    pdf_path = find_pdf_template()

    try:
        output_buffer = pdf_service.fill_pdf(pdf_path, data)
        return StreamingResponse(
            output_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=I-130_Filled.pdf"}
        )
    except Exception as e:
        logger.exception("Failed to fill PDF")
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@router.get("/debug-fields")
async def debug_fields():
    pdf_path = find_pdf_template()
    doc = fitz.open(pdf_path)
    fields = []

    for page_num, page in enumerate(doc, start=1):
        for widget in page.widgets():
            fields.append({
                "page": page_num,
                "name": widget.field_name,
                "type": widget.field_type_string,
                "value": widget.field_value,
                "export_value": getattr(widget, "field_value", None),  # for checkboxes
                "rect": list(widget.rect),
            })
    doc.close()

    return {
        "pdf_path": pdf_path,
        "total_fields_in_pdf": len(fields),
        "mapped_in_config": len(FIELD_MAPPING),
        "fields": fields[:100],  # limit output size
    }


@router.get("/health")
async def health():
    try:
        find_pdf_template()
        pdf_ok = True
    except:
        pdf_ok = False

    return {
        "status": "OK" if pdf_ok else "ERROR",
        "message": "I-130 PDF Filler Service",
        "pdf_found": pdf_ok,
        "mapped_fields": len(FIELD_MAPPING),
    }


@router.get("/form-structure")
async def form_structure():
    return {
        "expected_frontend_keys": list(FIELD_MAPPING.keys()),
        "total_expected": len(FIELD_MAPPING),
        "tip": "Send these exact keys in JSON body to /fill-pdf"
    }