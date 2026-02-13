import json
import re

# Based on actual I-912 form structure
FIELD_LABELS = {
    # Part 1: Basis for Request
    'pt1_l1_checkbox': 'I am receiving a means-tested benefit',
    'pt1_l2_checkbox': 'My household income is at or below 150% of Federal Poverty Guidelines',
    'pt1_l3_checkbox': 'I have a financial hardship',
    
    # Part 2: Information About You (Requestor)
    'pt2_l2_familyname': 'Family Name (Last Name)',
    'pt2_l2_givenname': 'Given Name (First Name)',
    'pt2_l2_middlename': 'Middle Name',
    'pt2_l3_familyname': 'Other Family Name',
    'pt2_l3_givenname': 'Other Given Name',
    'pt2_l3_middlename': 'Other Middle Name',
    'pt2_l3_aliennumber': 'A-Number (if any)',
    'pt2_l4_acctidentifier': 'USCIS Online Account Number (if any)',
    'pt2_l5_dateofbirth': 'Date of Birth',
    'pt2_l6_ssn': 'U.S. Social Security Number (if any)',
    'pt2_l7_maritalstatus': 'Marital Status',
    
    # Part 3: Applications/Petitions for Fee Waiver
    'pt3_l1_name': 'Full Name',
    'pt3_l1_aliennumber': 'A-Number',
    'pt3_l1_dateofbirth': 'Date of Birth',
    'pt3_l1_relationship': 'Relationship to You',
    'pt3_l1_formsfiled': 'Forms Being Filed',
    
    # Part 4: Means-Tested Benefits
    'pt4_l1_fullname': 'Full Name of Person Receiving Benefit',
    'pt4_l1_relationship': 'Relationship to You',
    'pt4_l1_typeofbene': 'Type of Benefit',
    'pt4_l1_agency': 'Name of Agency Awarding Benefit',
    'pt4_l1_dateaward': 'Date Benefit was Awarded',
    'pt4_l1_expdate': 'Date Benefit Expires (or must be renewed)',
    
    # Part 5: Income at or Below 150% of Federal Poverty Guidelines
    'pt5_l1_employmentstatus': 'Employment Status',
    'pt5_l2_unemploymentbenefits': 'Are you currently receiving unemployment benefits?',
    'pt5_l2a_dateofunemployment': 'Date you became unemployed',
    'pt5_l3_totalhousesize': 'What is your total household size?',
    'pt5_l4_totalhousehold': 'What is the total number of household members earning income including yourself?',
    'pt5_l5_namehousehold': 'Name of head of household (if not you)',
    'pt5_l6_annualadjustedgrossincome': 'Your Annual Adjusted Gross Income',
    'pt5_l7_annualadjustedgrossincome': 'Annual Adjusted Gross Income of All Family Members',
    'pt5_l8_totaladjustedhouseholdincome': 'Total Adjusted Household Income',
    'pt5_l9_haschanged': 'Has anything changed since the date you filed your Federal tax returns?',
    
    # Part 6: Financial Hardship
    'pt6_l1_situation': 'Describe your circumstances',
    'pt6_l2_typeofasset': 'Type of Asset',
    'pt6_l2_value': 'Value (U.S. Dollars)',
    'pt6_l3_checkbox': 'Monthly Expenses',
    'pt6_l3_total': 'Total Monthly Expenses and Liabilities',
    
    # Part 7: Requestor's Statement, Contact Information, Certification, and Signature
    'pt7_l1_statement': 'I can read and understand English',
    'pt7_l2_statement': 'The preparer named in Part 8',
    'pt7_l3_daytimetelephonenumber': 'Requestor\'s Daytime Telephone Number',
    'pt7_l4_mobiletelephonenumber': 'Requestor\'s Mobile Telephone Number',
    'pt7_l5_emailaddress': 'Requestor\'s Email Address',
    'pt7_l6_date': 'Date of Signature',
}

SKIP_PATTERNS = [
    'barcode', 'uscis', 'button', 'pagenumber', 'additionalinfo',
    'pdf417', 'area_'
]

def should_skip_field(name):
    name_lower = name.lower()
    return any(pattern in name_lower for pattern in SKIP_PATTERNS)

def get_clean_label(key, field_name):
    # Check if we have a predefined label
    for pattern, label in FIELD_LABELS.items():
        if pattern in key:
            return label
    
    # Generate from key
    parts = key.split('_')
    
    # Handle Part X Line Y pattern
    if 'pt' in parts[0] and 'l' in parts[1]:
        part_num = parts[0].replace('pt', '')
        line_num = parts[1].replace('l', '')
        desc = ' '.join(parts[2:]).title()
        
        # Clean up common patterns
        desc = desc.replace('Checkbox', '').replace('Chbx', '')
        desc = desc.replace('Familyname', 'Family Name')
        desc = desc.replace('Givenname', 'Given Name')
        desc = desc.replace('Middlename', 'Middle Name')
        desc = desc.replace('Dateofbirth', 'Date of Birth')
        desc = desc.replace('Aliennumber', 'A-Number')
        desc = desc.replace('Ssn', 'Social Security Number')
        
        if desc.strip():
            return f"{desc.strip()}"
        return f"Part {part_num}, Item {line_num}"
    
    # Fallback
    return ' '.join(parts).title().replace('_', ' ')

def get_section(key, page):
    if 'pt1' in key:
        return 'Part 1: Basis for Request'
    elif 'pt2' in key:
        return 'Part 2: Information About You'
    elif 'pt3' in key:
        return 'Part 3: Applications and Petitions'
    elif 'pt4' in key:
        return 'Part 4: Means-Tested Benefits'
    elif 'pt5' in key:
        return 'Part 5: Income Information'
    elif 'pt6' in key:
        return 'Part 6: Financial Hardship'
    elif 'pt7' in key or 'pt8' in key or 'pt9' in key or 'pt10' in key:
        return 'Part 7: Signature and Contact Information'
    else:
        return f'Additional Information'

def generate():
    with open('i912_full_fields.json', 'r') as f:
        fields = json.load(f)
    
    with open('i912_config_generated.py', 'r') as f:
        content = f.read()
        # Extract mapping
        mapping = {}
        for line in content.split('\n'):
            if '": "' in line:
                parts = line.strip().split('": "')
                if len(parts) == 2:
                    key = parts[0].strip('"').strip()
                    value = parts[1].strip('",').strip()
                    mapping[key] = value
    
    output_fields = []
    seen_keys = set()
    
    for key, pdf_name in mapping.items():
        if should_skip_field(pdf_name) or should_skip_field(key):
            continue
        
        if key in seen_keys:
            continue
        seen_keys.add(key)
        
        # Find field info
        field_info = next((f for f in fields if f['name'] == pdf_name), None)
        if not field_info:
            continue
        
        label = get_clean_label(key, pdf_name)
        ftype = "text"
        
        if field_info['type'] == "CheckBox":
            ftype = "checkbox"
        elif any(x in key.lower() for x in ['date', 'dob']):
            ftype = "date"
        
        section = get_section(key, field_info['page'])
        
        output_fields.append({
            "key": key,
            "pdfKey": key,
            "label": label,
            "type": ftype,
            "section": section,
            "page": field_info['page']
        })
    
    # Sort by page then section
    output_fields.sort(key=lambda x: (x['page'], x['section']))
    
    # Generate TypeScript
    print("import type { Field } from './types';")
    print()
    print("export const formId = 'i912';")
    print("export const formTitle = 'Form I-912';")
    print("export const formSubtitle = 'Request for Fee Waiver';")
    print()
    print("export const formFields: Field[] = [")
    
    current_section = None
    for f in output_fields:
        if f['section'] != current_section:
            current_section = f['section']
            print(f"  // === {current_section} ===")
        
        # Escape single quotes in label
        label = f['label'].replace("'", "\\'")
        print(f"  {{ key: '{f['key']}', pdfKey: '{f['pdfKey']}', label: '{label}', type: '{f['type']}', section: '{f['section']}' }},")
    
    print("];")
    print()
    print("export const getInitialFormData = () => {")
    print("  const data: Record<string, string> = {};")
    print("  formFields.forEach((f) => { if (f.key) data[f.key] = ''; });")
    print("  return data;")
    print("};")
    print()
    print("export const i912Config = { formId, formTitle, formSubtitle, formFields, getInitialFormData };")
    print("export default i912Config;")

if __name__ == "__main__":
    generate()
