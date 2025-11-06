# scripts/extract_i130_fields.py
from PyPDF2 import PdfReader
import json, os, re
from collections import defaultdict

base_dir = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(base_dir, "../data/i130.pdf")
json_path = os.path.join(base_dir, "../generated/i130_fields_structured.json")

reader = PdfReader(pdf_path)
fields = reader.get_fields()

# Clean label function
def clean_label(raw):
    if not raw:
        return ""
    # Remove junk
    label = re.sub(r"[_►▶●■]+", " ", raw)
    label = re.sub(r"\[.*?\]", "", label)  # Remove [2], [X]
    label = re.sub(r"\s{2,}", " ", label).strip()
    # Capitalize properly
    return " ".join(word.capitalize() for word in label.split())

# Auto-detect sections using PDF field names
SECTION_PATTERNS = {
    "Part 1": ["relationship", "spouse", "parent", "brother", "sister", "child", "adoption"],
    "Part 2": ["petitioner", "family name", "given name", "middle name", "a-number", "ssn"],
    "Part 3": ["beneficiary", "alien registration", "birth", "gender", "marital"],
    "Part 4": ["address", "street", "apt", "city", "state", "zip", "province", "postal"],
    "Part 5": ["entry", "passport", "i-94", "arrival"],
    "Part 6": ["employment", "occupation", "employer"],
    "Part 7": ["children", "sons", "daughters"],
    "Part 8": ["parents", "mother", "father"],
    "Part 9": ["additional", "explanation"],
}

# Reverse map: keyword → section title
keyword_to_section = {}
for section, keywords in SECTION_PATTERNS.items():
    for kw in keywords:
        keyword_to_section[kw.lower()] = section

# Output structure
structured = {"sections": []}
section_map = {}

# Process each field
for name, field in fields.items():
    raw_label = field.get("/TU") or field.get("/T") or name
    label = clean_label(raw_label)
    if not label:
        label = clean_label(name)

    field_type = "checkbox" if field.get("/FT") == "/Btn" else "text"

    # Detect section
    section_title = "Other Information"
    name_lower = name.lower()
    label_lower = label.lower()
    for kw, sec in keyword_to_section.items():
        if kw in name_lower or kw in label_lower:
            section_title = sec
            break

    # Radio group detection (e.g., Yes/No)
    group = None
    if field_type == "checkbox" and ("yes" in label_lower or "no" in label_lower):
        base = re.sub(r"\s*\[.*\]|yes|no", "", label_lower, flags=re.I).strip()
        group = f"radio_{base}"

    field_obj = {
        "name": name,
        "label": label,
        "type": field_type,
        "group": group,
        "placeholder": "mm/dd/yyyy" if "date" in label_lower else ""
    }

    if section_title not in section_map:
        section_map[section_title] = []
        structured["sections"].append({
            "title": section_title,
            "fields": section_map[section_title]
        })

    section_map[section_title].append(field_obj)

# Sort sections logically
section_order = ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7", "Part 8", "Part 9", "Other Information"]
structured["sections"] = sorted(
    structured["sections"],
    key=lambda x: section_order.index(x["title"]) if x["title"] in section_order else 999
)

# Save
os.makedirs(os.path.dirname(json_path), exist_ok=True)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(structured, f, indent=2, ensure_ascii=False)

print(f"Auto-structured {len(fields)} fields into {len(structured['sections'])} sections → {json_path}")