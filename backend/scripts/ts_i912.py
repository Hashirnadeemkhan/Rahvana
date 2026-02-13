import json
import re

def get_section(page, name):
    part_match = re.search(r'P(\d+)_', name)
    if part_match:
        part = int(part_match.group(1))
        if part == 1: return "1. Basis for Request"
        if part == 2: return "2. Information About You"
        if part == 3: return "3. Household Size"
        if part == 4: return "4. Household Income"
        if part == 5: return "5. Income Details"
        if part == 6: return "6. Financial Hardship"
        if part >= 7: return "7. Signatures & Others"
    return f"Page {page}"

def clean_label(key):
    # pt1_l6a_familyname -> Item 6.a. Family Name
    match = re.search(r'pt\d+_l(\d+)(\w*)_(.*)', key)
    if match:
        line = match.group(1)
        sub = match.group(2)
        desc = match.group(3).replace('_', ' ').title()
        # Handle index
        desc = re.sub(r'\d+$', '', desc).strip()
        if sub: return f"Item {line}.{sub}. {desc}"
        return f"Item {line}. {desc}"
    return key.replace('_', ' ').title()

def clean_key(name):
    # Same cleaned key logic as python generator
    match = re.search(r'P(\d+)_Line(.*)', name)
    if match:
        part = match.group(1)
        line_desc = match.group(2)
        parts = line_desc.split('_')
        line = parts[0]
        desc = "_".join(parts[1:]).replace('[0]', '')
        idx_match = re.search(r'\[(\d+)\]', desc)
        if idx_match:
            idx = idx_match.group(1)
            desc = re.sub(r'\[\d+\]', '', desc)
            return f"pt{part}_l{line}_{desc.lower()}_{idx}"
        return f"pt{part}_l{line}_{desc.lower()}"
    
    # Fallback
    name = name.lower()
    if 'additionalinfo' in name or 'pagenumber' in name or 'barcode' in name:
        return None 
    
    clean = name.replace('form1[0].', '').replace('#subform[', 's_').replace('].', '_').replace('[0]', '').replace('[', '_').replace(']', '')
    return clean

def generate():
    try:
        with open('i912_full_fields.json', 'r') as f:
            fields = json.load(f)
        
        output_fields = []
        seen_keys = set()
        
        for f in fields:
            if 'BarCode' in f['name']: continue
            
            key = clean_key(f['name'])
            if not key or key in seen_keys: continue
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
        print("export const formId = 'i912';")
        print("export const formTitle = 'Form I-912';")
        print("export const formSubtitle = 'Request for Fee Waiver';\n")
        print("export const formFields: Field[] = [")
        
        current_section = None
        # Sort by page/section if needed, but they are broadly page ordered
        for f in output_fields:
            if f['section'] != current_section:
                current_section = f['section']
                print(f"  // === {current_section} ===")
            
            print(f"  {{ key: '{f['key']}', pdfKey: '{f['pdfKey']}', label: '{f['label']}', type: '{f['type']}', section: '{f['section']}' }},")
                
        print("];\n")
        print("export const getInitialFormData = () => {")
        print("  const data: Record<string, string> = {};")
        print("  formFields.forEach((f) => { if (f.key) data[f.key] = ''; });")
        print("  return data;")
        print("};\n")
        print("export const i912Config = { formId, formTitle, formSubtitle, formFields, getInitialFormData };")
        print("export default i912Config;")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate()
