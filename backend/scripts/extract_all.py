import fitz
import json
import os

def extract(pdf_name, output_json):
    pdf_path = os.path.join(r'C:\Users\HP\Desktop\arachnie\Arachnie\backend\pdfs', pdf_name)
    if not os.path.exists(pdf_path):
        print(f"Skipping {pdf_name}: Not found")
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
    with open(output_json, 'w') as f:
        json.dump(fields, f, indent=2)
    print(f"Extracted {len(fields)} fields from {pdf_name} to {output_json}")

if __name__ == "__main__":
    extract('i-129f.pdf', 'i129f_full_fields.json')
    extract('i-912.pdf', 'i912_full_fields.json')
    extract('I-864a.pdf', 'i864a_full_fields.json')
