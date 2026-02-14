import fitz
import json

def list_fields():
    pdf_path = r'C:\Users\HP\Desktop\arachnie\Arachnie\backend\pdfs\I-864a.pdf'
    doc = fitz.open(pdf_path)
    fields = []
    for page in doc:
        for widget in page.widgets():
            fields.append({
                'page': page.number + 1,
                'name': widget.field_name,
                'type': widget.field_type_string
            })
    with open('i864a_full_fields.json', 'w') as f:
        json.dump(fields, f, indent=2)
    print(f"Extracted {len(fields)} fields for I-864A")

if __name__ == "__main__":
    list_fields()
