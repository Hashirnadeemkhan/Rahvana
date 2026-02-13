# backend/app/services/pdf_filler.py
import re
import os
import io
import fitz
from typing import Dict
import logging

logger = logging.getLogger(__name__)
from app.core.form_configs import i130_config 
from app.core.form_configs import i864_config
from app.core.form_configs import i130a_config
from app.core.form_configs import i129f_config
from app.core.form_configs import i912_config
# from app.core.form_configs import ds260_config

# Master mapping: formId → FIELD_MAPPING
FORM_CONFIGS = {
    "i130": i130_config.FIELD_MAPPING,
    "i864": i864_config.FIELD_MAPPING,
    "i130a": i130a_config.FIELD_MAPPING,
    "i129f": i129f_config.FIELD_MAPPING,
    "i912": i912_config.FIELD_MAPPING,
    # "ds260": ds260_config.FIELD_MAPPING,
    # "i485": i485_config.FIELD_MAPPING,
    # "i765": i765_config.FIELD_MAPPING,
}

# Auto-find PDF templates
def find_pdf_template(form_id: str) -> str:
    # form_id is already normalized (e.g., 'i130a')
    # Try with hyphen if it looks like a USCIS form
    hyphenated = form_id
    if form_id.startswith('i') and len(form_id) > 1:
        hyphenated = f"i-{form_id[1:]}"
        
    candidates = [
        f"./pdfs/{form_id}.pdf",
        f"./pdfs/{hyphenated}.pdf",
        f"./pdfs/{form_id.upper()}.pdf",
        f"./pdfs/{hyphenated.upper()}.pdf",
        f"../pdfs/{form_id}.pdf",
        f"../pdfs/{hyphenated}.pdf",
        os.path.join(os.path.dirname(__file__), "..", "..", "pdfs", f"{form_id}.pdf"),
        os.path.join(os.path.dirname(__file__), "..", "..", "pdfs", f"{hyphenated}.pdf"),
        f"C:/Users/HP/Desktop/arachnie/Arachnie/backend/pdfs/{form_id}.pdf",
        f"C:/Users/HP/Desktop/arachnie/Arachnie/backend/pdfs/{hyphenated}.pdf",
    ]
    
    for path in candidates:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            logger.info(f"Found PDF: {abs_path}")
            return abs_path
    
    raise FileNotFoundError(f"PDF not found for form: {form_id}")

class PDFFillerService:
    def __init__(self, form_id: str):
        # Normalize form_id (match frontend logic)
        self.form_id = re.sub(r'[^a-z0-9]', '', form_id.lower())
        
        if self.form_id not in FORM_CONFIGS:
            raise ValueError(f"Form '{form_id}' (normalized: '{self.form_id}') not supported. Available: {list(FORM_CONFIGS.keys())}")
        
        self.field_mapping = FORM_CONFIGS[self.form_id]
        self.pdf_path = find_pdf_template(self.form_id)

    def fill_pdf(self, form_data: Dict[str, any]) -> io.BytesIO:
        doc = fitz.open(self.pdf_path)
        filled_count = 0
        unfilled = []

        for frontend_key, value in form_data.items():
            pdf_field_name = self.field_mapping.get(frontend_key)
            if not pdf_field_name:
                unfilled.append(frontend_key)
                continue

            str_value = str(value or "").strip()
            if not str_value:
                continue

            field_found = False
            for page in doc:
                for widget in page.widgets():
                    if widget.field_name == pdf_field_name or \
                       widget.field_name.split('.')[-1] == pdf_field_name.split('.')[-1]:
                        try:
                            if widget.field_type in (fitz.PDF_WIDGET_TYPE_CHECKBOX, fitz.PDF_WIDGET_TYPE_RADIOBUTTON):
                                is_checked = str(value).lower() in ["yes", "true", "1", "on"]
                                widget.field_value = "Yes" if is_checked else "Off"
                            else:
                                widget.field_value = str_value
                            widget.update()
                            filled_count += 1
                            field_found = True
                        except Exception as e:
                            logger.error(f"Error filling {pdf_field_name}: {e}")
            
            if not field_found:
                unfilled.append(frontend_key)

        logger.info(f"Filled {filled_count} fields for {self.form_id.upper()}")
        if unfilled:
            logger.warning(f"Unfilled keys: {unfilled[:20]}")

        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True, clean=True)
        doc.close()
        output.seek(0)
        return output