import fitz
import json
import os

def extract(pdf_name, output_json):
    pdf_path = f'C:/Users/HP/Desktop/arachnie/Arachnie/backend/pdfs/{pdf_name}.pdf'
    if not os.path.exists(pdf_path):
        # Try alternate casing
        pdf_path = f'C:/Users/HP/Desktop/arachnie/Arachnie/backend/pdfs/{pdf_name.upper()}.pdf'
        if not os.path.exists(pdf_path):
            print(f"Skipping {pdf_name}: Not found at {pdf_path}")
            return
            
    doc = fitz.open(pdf_path)
    fields = []
    for page in doc:
        for widget in page.widgets():
            fields.append({
                'page': page.number + 1,
                'name': widget.field_name,
                'type': widget.field_type_string
            })
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(fields, f, indent=2)
    print(f"Extracted {len(fields)} fields for {pdf_name}")

if __name__ == "__main__":
    extract('I-129f', 'i129f_full_fields.json')
    extract('I-912', 'i912_full_fields.json')
    extract('I-864a', 'i864a_full_fields.json')
    extract('i-864ez', 'i864ez_full_fields.json')
