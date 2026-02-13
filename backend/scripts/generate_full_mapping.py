import json
import re

def clean_key(name):
    # form1[0].#subform[0].Pt1Line6a_FamilyName[0]
    
    # Extract Part and Line
    match = re.search(r'Pt(\d+)(Line|Item)?(\d+\w*)_(.*)', name)
    if match:
        part = match.group(1)
        line = match.group(3)
        desc = match.group(4).replace('[0]', '')
        
        # Handle index in desc like _Checkboxes[1]
        idx_match = re.search(r'\[(\d+)\]', desc)
        if idx_match:
            idx = idx_match.group(1)
            desc = re.sub(r'\[\d+\]', '', desc)
            return f"pt{part}_l{line}_{desc.lower()}_{idx}"
        
        return f"pt{part}_l{line}_{desc.lower()}"

    # Fallback for page 11 (Additional Information)
    if 'AdditionalInfo' in name or 'PageNumber' in name:
        name = name.replace('form1[0].', '').replace('#subform[', 's').replace('].', '_').replace('[0]', '')
        return name.lower()

    return name.lower().replace('form1[0].', '').replace('#', '').replace('[0]', '').replace('].', '_').replace('[', '_').replace(']', '')

def generate():
    with open('i129f_full_fields.json', 'r') as f:
        fields = json.load(f)
    
    mapping = {}
    for f in fields:
        if 'BarCode' in f['name']: continue
        
        key = clean_key(f['name'])
        mapping[key] = f['name']
    
    sorted_mapping = dict(sorted(mapping.items(), key=lambda item: item[1]))
    
    output = "FIELD_MAPPING = {\n"
    for k, v in sorted_mapping.items():
        output += f'    "{k}": "{v}",\n'
    output += "}\n"
    
    with open('full_mapping_i129f.py', 'w') as f:
        f.write(output)
    print(f"Generated {len(mapping)} mappings")

if __name__ == "__main__":
    generate()
