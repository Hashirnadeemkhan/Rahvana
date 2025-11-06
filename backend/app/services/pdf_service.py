import io
from typing import Dict, Any, Optional, Tuple, List
from pdfrw import PdfReader, PdfWriter, PdfDict, PdfName, PdfString, PdfObject
from app.core.config import settings
import json
from pathlib import Path

class PDFService:
    """Service for filling PDF forms"""
    
    def __init__(self):
        self.field_mapping_cache = {}
    
    def get_pdf_fields(self, form_name: str) -> Dict[str, Dict[str, Any]]:
        """Extract all available fields from PDF"""
        if form_name in self.field_mapping_cache:
            return self.field_mapping_cache[form_name]
        
        # Find PDF file
        if form_name == "i130":
            possible_paths = [
                settings.DATA_DIR / "i130.pdf",
                settings.FORMS_DIR / "i130.pdf",
            ]
        else:
            possible_paths = [
                settings.DATA_DIR / f"{form_name}.pdf",
                settings.FORMS_DIR / f"{form_name}.pdf",
            ]
        
        pdf_path = None
        for path in possible_paths:
            if path.exists():
                pdf_path = path
                break
        
        if not pdf_path:
            print(f"⚠️  PDF not found. Checked:")
            for path in possible_paths:
                print(f"   - {path}")
            return {}
        
        try:
            print(f"📖 Reading PDF fields from: {pdf_path}")
            template = PdfReader(str(pdf_path))
            fields = {}
            
            for page_idx, page in enumerate(template.pages, 1):
                annots = page.get("/Annots")
                if annots is None:
                    continue
                
                for annot in annots:
                    if annot.get("/Subtype") != PdfName.Widget:
                        continue
                    
                    key_obj = annot.get("/T")
                    if not key_obj:
                        continue
                    
                    key = key_obj.to_unicode().strip()
                    field_type = annot.get("/FT")
                    
                    fields[key] = {
                        "type": str(field_type) if field_type else "text",
                        "page": page_idx,
                        "field_ref": annot
                    }
            
            self.field_mapping_cache[form_name] = fields
            print(f"✅ Found {len(fields)} PDF fields in {form_name}")
            return fields
        
        except Exception as e:
            print(f"❌ Error reading PDF fields: {e}")
            return {}
    
    def validate_data_for_pdf(self, form_name: str, data: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Validate data can be written to PDF"""
        errors = []
        pdf_fields = self.get_pdf_fields(form_name)
        
        if not pdf_fields:
            print("⚠️  No PDF fields found, skipping field validation")
            return True, []
        
        for key, value in data.items():
            if value is None or value == "":
                continue
            
            # Check if PDF field exists
            if key not in pdf_fields:
                print(f"⚠️  PDF field not found: {key}")
            
            # Check value length
            if isinstance(value, str) and len(value) > 255:
                errors.append(f"Field '{key}' too long (max 255 chars)")
            
            # Check for invalid characters
            if isinstance(value, str) and '\x00' in value:
                errors.append(f"Field '{key}' contains invalid characters")
        
        return len(errors) == 0, errors
    
    def fill_pdf(self, form_name: str, data: Dict[str, Any]) -> Optional[io.BytesIO]:
        """Fill PDF with provided data"""
        # Find PDF file
        if form_name == "i130":
            possible_paths = [
                settings.DATA_DIR / "i130.pdf",
                settings.FORMS_DIR / "i130.pdf",
            ]
        else:
            possible_paths = [
                settings.DATA_DIR / f"{form_name}.pdf",
                settings.FORMS_DIR / f"{form_name}.pdf",
            ]
        
        pdf_path = None
        for path in possible_paths:
            if path.exists():
                pdf_path = path
                break
        
        if not pdf_path:
            raise FileNotFoundError(f"PDF not found for {form_name}")
        
        try:
            print(f"\n{'='*60}")
            print(f"📋 Filling PDF: {form_name}")
            print(f"📂 From: {pdf_path}")
            print(f"{'='*60}")
            
            # Validate data
            is_valid, errors = self.validate_data_for_pdf(form_name, data)
            if not is_valid:
                print(f"⚠️  Validation warnings: {errors}")
            
            # Read template
            template = PdfReader(str(pdf_path))
            filled_count = 0
            skipped_count = 0
            
            for page_number, page in enumerate(template.pages, start=1):
                annots = page.get("/Annots")
                if annots is None:
                    continue
                
                for annot in annots:
                    if annot.get("/Subtype") != PdfName.Widget:
                        continue
                    
                    key_obj = annot.get("/T")
                    if not key_obj:
                        continue
                    
                    key = key_obj.to_unicode().strip()
                    
                    # Check if we have data for this field
                    if key not in data:
                        skipped_count += 1
                        continue
                    
                    value = data[key]
                    if value is None or value == "":
                        skipped_count += 1
                        continue
                    
                    value_str = str(value)
                    
                    try:
                        # Handle different field types
                        field_type = annot.get("/FT")
                        
                        if field_type == PdfName.Btn:  # Checkbox/Button
                            annot.update(PdfDict(AS=PdfName(value_str)))
                        else:  # Text field
                            annot.update(
                                PdfDict(
                                    V=PdfString.encode(value_str),
                                    AS=PdfName(value_str[:32] if len(value_str) > 32 else value_str)
                                )
                            )
                        
                        print(f"✅ Page {page_number}: {key} = {value_str[:50]}")
                        filled_count += 1
                    
                    except Exception as e:
                        print(f"⚠️  Error filling {key}: {e}")
                        skipped_count += 1
            
            # Enable appearance streams
            if template.Root and template.Root.get("/AcroForm"):
                template.Root.AcroForm.update(
                    PdfDict(NeedAppearances=PdfName.true)
                )
            
            # Write output
            output = io.BytesIO()
            PdfWriter().write(output, template)
            output.seek(0)
            
            print(f"\n✅ PDF filled successfully!")
            print(f"   Filled: {filled_count}, Skipped: {skipped_count}")
            print(f"{'='*60}\n")
            
            return output
        
        except Exception as e:
            print(f"❌ Error filling PDF: {e}")
            import traceback
            traceback.print_exc()
            return None