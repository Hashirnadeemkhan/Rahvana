import json
import re

def get_section(page, name):
    if page == 1: return "Part 1. Petitioner (Basics)"
    if page == 2: return "Part 1. Petitioner (Address & Employment)"
    if page == 3: return "Part 1. Petitioner (Bio & Parents)"
    if page == 4: return "Part 1. Petitioner (Citizenship & History)"
    if page == 5: return "Part 2. Beneficiary (Basics)"
    if page == 6: return "Part 2. Beneficiary (Address History)"
    if page == 7: return "Part 2. Beneficiary (Employment History)"
    if page == 8: return "Part 3. Other Info / Part 2 cont."
    if page == 9: return "Part 4. Biographic Information"
    if page == 10: return "Part 5. Criminal History"
    if page == 11: return "Part 6. Petitioner Statement & Contact"
    if page == 12: return "Part 8. Additional Information"
    return f"Page {page}"

def clean_label(key):
    # pt1_l6a_familyname -> 6.a. Family Name
    match = re.search(r'pt\d+_l(\d+)(\w*)_(.*)', key)
    if match:
        line = match.group(1)
        sub = match.group(2)
        desc = match.group(3).replace('_', ' ').title()
        if sub: return f"Item {line}.{sub}. {desc}"
        return f"Item {line}. {desc}"
    return key.replace('_', ' ').title()

def generate():
    with open('i129f_full_fields.json', 'r') as f:
        pdf_fields = json.load(f)
    
    # We need the key logic to match i129f_config.py
    def clean_key(name):
        match = re.search(r'Pt(\d+)(Line|Item)?(\d+\w*)_(.*)', name)
        if match:
            part = match.group(1); line = match.group(3); 
            desc = match.group(4).replace('[0]', '')
            idx_match = re.search(r'\[(\d+)\]', desc)
            if idx_match:
                idx = idx_match.group(1); desc = re.sub(r'\[\d+\]', '', desc)
                return f"pt{part}_l{line}_{desc.lower()}_{idx}"
            return f"pt{part}_l{line}_{desc.lower()}"
        if 'AdditionalInfo' in name or 'PageNumber' in name:
            res = name.lower().replace('form1[0].', '').replace('#subform[', 's').replace('].', '_').replace('[0]', '')
            return res
        return name.lower().replace('form1[0].', '').replace('#', '').replace('[0]', '').replace('].', '_').replace('[', '_').replace(']', '')

    output_fields = []
    seen_keys = set()
    
    for f in pdf_fields:
        if 'BarCode' in f['name'] or 'PDF417' in f['name']: continue
        
        key = clean_key(f['name'])
        if key in seen_keys: continue
        seen_keys.add(key)
        
        label = clean_label(key)
        ftype = "text"
        lkey = key.lower()
        if f['type'] == "CheckBox": 
            ftype = "checkbox"
        elif any(x in lkey for x in ['date', 'dob']):
            ftype = "date"
        
        output_fields.append({
            "key": key,
            "pdfKey": key,
            "label": label,
            "type": ftype,
            "section": get_section(f['page'], f['name'])
        })

    print("import type { Field } from './types';\n")
    print("export const formId = 'i129f';")
    print("export const formTitle = 'Form I-129F';")
    print("export const formSubtitle = 'Petition for Alien Fiancé(e)';\n")
    print("export const formFields: Field[] = [")
    
    current_section = None
    for f in output_fields:
        if f['section'] != current_section:
            current_section = f['section']
            print(f"  // === {current_section} ===")
        
        extra = ""
        if f['type'] == "checkbox":
            # For checkboxes, try to give a better label if it's a 'Checkbox 1' type
            pass
        
        # Add a placeholder for radio buttons - if label ends in 'Checkboxes' it's likely part of a group
        print(f"  {{ key: '{f['key']}', pdfKey: '{f['pdfKey']}', label: '{f['label']}', type: '{f['type']}', section: '{f['section']}' }},")
            
    print("];\n")
    print("export const getInitialFormData = () => {")
    print("  const data: Record<string, string> = {};")
    print("  formFields.forEach((f) => { if (f.key) data[f.key] = ''; });")
    print("  return data;")
    print("};\n")
    print("export const i129fConfig = { formId, formTitle, formSubtitle, formFields, getInitialFormData };")
    print("export default i129fConfig;")

if __name__ == "__main__":
    generate()
