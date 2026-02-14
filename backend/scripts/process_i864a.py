import json
import re

def clean_key(name):
    match = re.search(r'(?:P|Part)(\d+)[_\s](?:Line)?(.*)', name)
    if match:
        part = match.group(1)
        rest = match.group(2)
        parts = rest.strip('_').split('_')
        line = "0"
        desc = "unknown"
        if parts[0].isdigit():
            line = parts[0]
            desc = "_".join(parts[1:])
        elif 'Line' in parts[0]:
             m_line = re.search(r'Line(\d+)', parts[0])
             if m_line:
                 line = m_line.group(1)
                 desc = "_".join(parts[1:])
             else:
                 desc = "_".join(parts)
        else:
             desc = "_".join(parts)
        desc = desc.replace('[0]', '')
        idx_match = re.search(r'\[(\d+)\]', desc)
        if idx_match:
            idx = idx_match.group(1)
            desc = re.sub(r'\[\d+\]', '', desc)
            return f"pt{part}_l{line}_{desc.lower()}_{idx}"
        return f"pt{part}_l{line}_{desc.lower()}"
    clean_name = name.lower()
    if 'additionalinfo' in clean_name or 'pagenumber' in clean_name or 'barcode' in clean_name:
        return None
    clean = clean_name.replace('form1[0].', '').replace('#subform[', 's_').replace('].', '_').replace('[0]', '').replace('[', '_').replace(']', '')
    return clean

FIELD_LABELS = {
    'pt1_l1a_familyname': 'Family Name (Last Name)',
    'pt1_l1b_givenname': 'Given Name (First Name)',
    'pt1_l1c_middlename': 'Middle Name',
    'pt1_l2_streetnumbername': 'Street Number and Name',
    'pt1_l2_aptsteflrnumber': 'Apt./Ste./Flr. Number',
    'pt1_l2_cityortown': 'City or Town',
    'pt1_l2_state': 'State',
    'pt1_l2_zipcode': 'ZIP Code',
    'pt1_l5_dateofbirth': 'Date of Birth',
    'pt1_l10_ssn': 'Social Security Number',
    'pt1_l11_aliennumber': 'A-Number',
}

SKIP_PATTERNS = ['barcode', 'uscis', 'button', 'pagenumber', 'additionalinfo', 'pdf417', 'area_']

def should_skip_field(name):
    name_lower = name.lower()
    return any(pattern in name_lower for pattern in SKIP_PATTERNS)

def get_clean_label(key, field_name):
    for pattern, label in FIELD_LABELS.items():
        if pattern in key: return label
    parts = key.split('_')
    if len(parts) >= 3 and 'pt' in parts[0] and 'l' in parts[1]:
        part_num = parts[0].replace('pt', '')
        line_num = parts[1].replace('l', '')
        desc = ' '.join(parts[2:]).title()
        desc = desc.replace('Checkbox', '').replace('Chbx', '').replace('Familyname', 'Family Name').replace('Givenname', 'Given Name').replace('Middlename', 'Middle Name').replace('Dateofbirth', 'Date of Birth').replace('Aliennumber', 'A-Number').replace('Ssn', 'Social Security Number').replace('Streetnumbername', 'Street Number and Name').replace('Aptsteflrnumber', 'Apt./Ste./Flr. Number').replace('Cityortown', 'City or Town').strip()
        if desc: return desc
        return f"Part {part_num}, Item {line_num}"
    return ' '.join(parts).title().replace('_', ' ')

def get_section(key, page):
    if 'pt1' in key: return 'Part 1: Information About Household Member'
    if 'pt2' in key: return 'Part 2: Relationship to Sponsor'
    if 'pt3' in key: return 'Part 3: Employment and Income'
    if 'pt4' in key: return 'Part 4: Assets'
    if 'pt5' in key: return "Part 5: Sponsor's Promise, Statement, and Signature"
    if 'pt6' in key: return "Part 6: Household Member's Promise, Statement, and Signature"
    if 'pt7' in key: return 'Part 7: Interpreter Information'
    if 'pt8' in key: return 'Part 8: Preparer Information'
    return 'Additional Information'

def generate():
    with open('i864a_full_fields.json', 'r') as f:
        fields = json.load(f)
    
    mapping = {}
    output_fields = []
    seen_keys = set()
    
    for f in fields:
        if 'BarCode' in f['name']: continue
        key = clean_key(f['name'])
        if not key or should_skip_field(key) or should_skip_field(f['name']): continue
        
        mapping[key] = f['name']
        if key in seen_keys: continue
        seen_keys.add(key)
        
        label = get_clean_label(key, f['name'])
        ftype = "checkbox" if f['type'] == "CheckBox" else "text"
        if any(x in key.lower() for x in ['date', 'dob']): ftype = "date"
        
        output_fields.append({
            "key": key, "pdfKey": key, "label": label, "type": ftype,
            "section": get_section(key, f['page']), "page": f['page']
        })
    
    # Save mapping to Python config
    with open('i864a_config_generated.py', 'w') as f:
        f.write("FIELD_MAPPING = {\n")
        for k in sorted(mapping.keys()):
            f.write(f'    "{k}": "{mapping[k]}",\n')
        f.write("}\n")
    
    # Generate TypeScript
    output_fields.sort(key=lambda x: (x['page'], x['section']))
    ts_output = [
        "import type { Field } from './types';", "",
        "export const formId = 'i864a';",
        "export const formTitle = 'Form I-864A';",
        "export const formSubtitle = 'Contract Between Sponsor and Household Member';", "",
        "export const formFields: Field[] = ["
    ]
    current_section = None
    for f in output_fields:
        if f['section'] != current_section:
            current_section = f['section']
            ts_output.append(f"  // === {current_section} ===")
        
        # Externalize escaping for f-string compatibility
        safe_label = f['label'].replace("'", "\\'")
        ts_output.append(f"  {{ key: '{f['key']}', pdfKey: '{f['pdfKey']}', label: '{safe_label}', type: '{f['type']}', section: '{f['section']}' }},")
    ts_output.extend([
        "];", "",
        "export const getInitialFormData = () => {",
        "  const data: Record<string, string> = {};",
        "  formFields.forEach((f) => { if (f.key) data[f.key] = ''; });",
        "  return data;",
        "};", "",
        "export const i864aConfig = { formId, formTitle, formSubtitle, formFields, getInitialFormData };",
        "export default i864aConfig;"
    ])
    with open('i864a.ts', 'w') as f:
        f.write("\n".join(ts_output))
    print(f"Generated {len(mapping)} mappings and i864a.ts")

if __name__ == "__main__":
    generate()
