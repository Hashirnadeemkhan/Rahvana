import json
import re
import os

def clean_key(name):
    # Remove prefix
    clean_name = name.replace('form1[0].', '')
    
    # regex for "PartX_LineY_Description[Z]"
    match = re.search(r'(?:Part|Pt|P)(\d+)[_\s](?:Line)?([0-9a-z]+)?_(.*)', clean_name, re.I)
    if match:
        part = match.group(1)
        line = match.group(2) or "0"
        desc = match.group(3)
        idx_match = re.search(r'\[(\d+)\]', desc)
        suffix = ""
        if idx_match:
            idx = idx_match.group(1)
            suffix = f"_{idx}" if idx != "0" else ""
            desc = re.sub(r'\[\d+\]', '', desc)
        return f"pt{part}_l{line}_{desc.lower().strip('_')}{suffix}"
    
    # regex for "Line3a_PageNumber[0]" (Additional Information fields)
    match = re.search(r'Line(\d+)([a-z])?_(.*)', clean_name, re.I)
    if match:
        line_num = match.group(1)
        sub = match.group(2) or ""
        desc = match.group(3)
        idx_match = re.search(r'\[(\d+)\]', desc)
        suffix = ""
        if idx_match:
            idx = idx_match.group(1)
            suffix = f"_{idx}" if idx != "0" else ""
            desc = re.sub(r'\[\d+\]', '', desc)
        return f"pt8_l{line_num}{sub}_{desc.lower().strip('_')}{suffix}"

    # Generic fallback
    clean = clean_name.lower()
    if 'barcode' in clean or 'pdf417' in clean: return None
    clean = re.sub(r'\[\d+\]', '', clean)
    clean = clean.replace('#subform', 's').replace('#pageset', 'ps').replace('[', '_').replace(']', '').replace('.', '_').replace('#', '')
    return clean.strip('_').replace('__', '_')

# High-quality predefined labels
LABELS_I129F = {
    'pt1_l6a_familyname': 'Your Family Name (Last Name)',
    'pt1_l6b_givenname': 'Your Given Name (First Name)',
    'pt1_l6c_middlename': 'Your Middle Name',
    'pt1_l4a_checkboxes': 'U.S. Citizen',
    'pt1_l4a_checkboxes_1': 'Lawful Permanent Resident',
    'pt1_l5_checkboxes': 'Male',
    'pt1_l5_checkboxes_1': 'Female',
    'pt1_l1_aliennumber': 'A-Number (if any)',
    'pt1_l2_acctidentifier': 'USCIS Online Account Number (if any)',
    'pt1_l3_ssn': 'Social Security Number (if any)',
    'pt1_l8_streetnumbername': 'Mailing Address - Street Number and Name',
    'pt1_l8_cityortown': 'Mailing Address - City or Town',
    'pt1_l8_zipcode': 'Mailing Address - ZIP Code',
    'pt1_l22_dateofbirth': 'Your Date of Birth (mm/dd/yyyy)',
    'pt2_l1a_familyname': 'Beneficiary\'s Family Name (Last Name)',
    'pt2_l1b_givenname': 'Beneficiary\'s Given Name (First Name)',
    'pt2_l4_dateofbirth': 'Beneficiary\'s Date of Birth (mm/dd/yyyy)',
    'pt2_l37_checkboxes': 'Has the beneficiary ever been in the U.S.?',
    'pt3_l1_checkboxes': 'Have you ever filed for this beneficiary before?',
}

LABELS_I864A = {
    'pt1_l1a_familyname': 'Household Member\'s Family Name (Last Name)',
    'pt1_l1b_givenname': 'Household Member\'s Given Name (First Name)',
    'pt1_l5_dateofbirth': 'Household Member\'s Date of Birth (mm/dd/yyyy)',
    'pt1_l10_ssn': 'Household Member\'s Social Security Number',
    'pt1_l11_aliennumber': 'Household Member\'s A-Number',
    'pt2_l1_relationship': 'Relationship to Sponsor',
    'pt3_l1_employmentstatus': 'Employment Status',
    'pt3_l2_income': 'Current Individual Annual Income',
}

def get_label(key, form_id):
    # Check specific override
    if form_id == 'i129f' and key in LABELS_I129F: return LABELS_I129F[key]
    if form_id == 'i864a' and key in LABELS_I864A: return LABELS_I864A[key]
    
    parts = key.split('_')
    
    def clean_name(n):
        n = n.title()
        n = n.replace('Checkboxes', '').replace('Checkbox', '').replace('Chbx', '')
        n = n.replace('Familyname', 'Family Name').replace('Givenname', 'Given Name').replace('Middlename', 'Middle Name')
        n = n.replace('Streetnumbername', 'Street Number and Name').replace('Aliennumber', 'A-Number').replace('Ssn', 'Social Security Number')
        n = n.replace('Zipcode', 'ZIP Code').replace('Cityortown', 'City or Town').replace('Aptsteflrnumber', 'Apt./Ste./Flr. Number')
        n = n.replace('Countryofcitzornationality', 'Country of Citizenship or Nationality')
        n = n.replace('Citytownofbirth', 'City/Town of Birth').replace('Countryofbirth', 'Country of Birth')
        return n.strip()

    if 'pt' in parts[0] and 'l' in parts[1]:
        part = parts[0][2:]
        line = parts[1][1:]
        desc = "_".join(parts[2:])
        suffix = ""
        if desc and desc[-1].isdigit() and (len(desc) == 1 or desc[-2] == '_'):
            suffix = f" ({desc.split('_')[-1]})"
            desc = "_".join(desc.split('_')[:-1])
        
        main_label = clean_name(desc)
        if not main_label: return f"Part {part}, Item {line}"
        return f"{main_label}{suffix}"
    
    return clean_name("_".join(parts))

def get_section_name(key, page, form_id):
    match = re.search(r'pt(\d+)', key)
    p = match.group(1) if match else "0"
    
    mapping = {
        'i129f': {
            '1': 'Part 1: Petitioner Information',
            '2': 'Part 2: Beneficiary Information',
            '3': 'Part 3: Other Information',
            '4': 'Part 4: Relationship Information',
            '5': 'Part 5: Petitioner Statement',
            '6': 'Part 6: Interpreter Information',
            '7': 'Part 7: Preparer Information',
            '8': 'Part 8: Additional Information',
        },
        'i864a': {
            '1': 'Part 1: Household Member Info',
            '2': 'Part 2: Relationship to Sponsor',
            '3': 'Part 3: Employment and Income',
            '4': 'Part 4: Assets',
            '5': 'Part 5: Sponsor Statement',
            '6': 'Part 6: Household Member Statement',
            '7': 'Part 7: Interpreter Info',
            '8': 'Part 8: Preparer Info',
            '9': 'Part 9: Additional Information',
        }
    }
    res = mapping.get(form_id, {}).get(p)
    if res: return res
    if key.startswith('l'): return "Part 8: Additional Information"
    return f"Part {p}"

def generate_form(config):
    form_id = config['id']
    with open(config['input'], 'r') as f: fields = json.load(f)
    
    mapping = {}
    output_fields = []
    seen_keys = set()
    
    for f in fields:
        key = clean_key(f['name'])
        if not key: continue
        
        # Filter duplicates: keep the one on the earliest page
        if key in seen_keys: continue
        seen_keys.add(key)
        mapping[key] = f['name']
        
        label = get_label(key, form_id)
        ftype = "checkbox" if f['type'] == "CheckBox" else "text"
        if any(x in key.lower() for x in ['date', 'dob']): ftype = "date"
        
        output_fields.append({
            "key": key, "pdfKey": key, "label": label, "type": ftype,
            "section": get_section_name(key, f['page'], form_id), "page": f['page']
        })
    
    # Save Backend
    with open(f"C:/Users/HP/Desktop/arachnie/Arachnie/backend/app/core/form_configs/{form_id}_config.py", 'w') as f:
        f.write("FIELD_MAPPING = {\n")
        for k in sorted(mapping.keys()): f.write(f'    "{k}": "{mapping[k]}",\n')
        f.write("}\n")
    
    # Sort: Section order, then Page, then Key
    def sort_key(x):
        # Professional section ordering
        s = x['section']
        order = 99
        if 'Part 1' in s: order = 1
        elif 'Part 2' in s: order = 2
        elif 'Part 3' in s: order = 3
        elif 'Part 4' in s: order = 4
        elif 'Part 5' in s: order = 5
        elif 'Part 6' in s: order = 6
        elif 'Part 7' in s: order = 7
        elif 'Part 8' in s: order = 8
        elif 'Part 9' in s: order = 9
        elif 'Additional' in s: order = 50
        return (order, x['page'], x['key'])

    output_fields.sort(key=sort_key)
    
    # Save TS
    ts_path = f"C:/Users/HP/Desktop/arachnie/Arachnie/lib/formConfig/{form_id}.ts"
    lines = [
        f"// Generated {len(output_fields)} fields for {config['title']}",
        "import type { Field } from './types';", "",
        f"export const formId = '{form_id}';",
        f"export const formTitle = '{config['title']}';",
        f"export const formSubtitle = '{config['subtitle']}';", "",
        "export const formFields: Field[] = ["
    ]
    current_section = None
    for f in output_fields:
        if f['section'] != current_section:
            current_section = f['section']
            lines.append(f"  // === {current_section} ===")
        safe_label = f['label'].replace("'", "\\'")
        lines.append(f"  {{ key: '{f['key']}', pdfKey: '{f['pdfKey']}', label: '{safe_label}', type: '{f['type']}', section: '{f['section']}' }},")
    
    lines.extend([
        "];", "",
        "export const getInitialFormData = () => {",
        "  const data: Record<string, string> = {};",
        "  formFields.forEach((f) => { if (f.key != null) data[f.key] = ''; });",
        "  return data;",
        "};", "",
        f"export const {form_id}Config = {{ formId, formTitle, formSubtitle, formFields, getInitialFormData }};",
        "export default i129fConfig;" if form_id == "i129f" else f"export default {form_id}Config;"
    ])
    with open(ts_path, 'w') as f: f.write("\n".join(lines))
    print(f"Generated {form_id}")

if __name__ == "__main__":
    configs = [
        {'id': 'i129f', 'input': 'i129f_full_fields.json', 'title': 'Form I-129F', 'subtitle': 'Petition for Alien Fiance(e)'},
        {'id': 'i912', 'input': 'i912_full_fields.json', 'title': 'Form I-912', 'subtitle': 'Request for Fee Waiver'},
        {'id': 'i864a', 'input': 'i864a_full_fields.json', 'title': 'Form I-864A', 'subtitle': 'Contract Between Sponsor and Household Member'}
    ]
    for c in configs: generate_form(c)
