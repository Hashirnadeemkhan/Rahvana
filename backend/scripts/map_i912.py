import json
import re

def clean_key(name):
    # Try P1_Line1... or Part4_Line1...
    match = re.search(r'(?:P|Part)(\d+)[_\s](?:Line)?(.*)', name)
    if match:
        part = match.group(1)
        rest = match.group(2)
        
        # Clean rest: remove leading underscores, etc.
        # Example rest: "1_Checkbox[0]", "7_MaritalStatus[6]"
        
        # If rest starts with digit, treat as Line
        # 1_Checkbox -> Line 1, desc Checkbox
        
        # Split by underscore
        parts = rest.strip('_').split('_')
        
        line = "0"
        desc = "unknown"
        
        if parts[0].isdigit():
            line = parts[0]
            desc = "_".join(parts[1:])
        elif 'Line' in parts[0]: 
             # e.g. Line6_SSN -> parts=["Line6", "SSN"]
             m_line = re.search(r'Line(\d+)', parts[0])
             if m_line:
                 line = m_line.group(1)
                 desc = "_".join(parts[1:])
             else:
                 desc = "_".join(parts)
        else:
             desc = "_".join(parts)
        
        # Final cleanup on desc
        desc = desc.replace('[0]', '')
        idx_match = re.search(r'\[(\d+)\]', desc)
        if idx_match:
            idx = idx_match.group(1)
            desc = re.sub(r'\[\d+\]', '', desc)
            return f"pt{part}_l{line}_{desc.lower()}_{idx}"
        
        # Final cleanup on desc
        desc = desc.replace('[0]', '')
        idx_match = re.search(r'\[(\d+)\]', desc)
        if idx_match:
            idx = idx_match.group(1)
            desc = re.sub(r'\[\d+\]', '', desc)
            return f"pt{part}_l{line}_{desc.lower()}_{idx}"
        
        return f"pt{part}_l{line}_{desc.lower()}"
    
    # Fallback
    clean_name = name.lower()
    if 'additionalinfo' in clean_name or 'pagenumber' in clean_name or 'barcode' in clean_name:
        return None 
    
    clean = clean_name.replace('form1[0].', '').replace('#subform[', 's_').replace('].', '_').replace('[0]', '').replace('[', '_').replace(']', '')
    return clean

def generate():
    try:
        with open('i912_full_fields.json', 'r') as f:
            fields = json.load(f)
        
        mapping = {}
        for f in fields:
            if 'BarCode' in f['name']: continue
            key = clean_key(f['name'])
            if not key: continue
            mapping[key] = f['name']
        
        sorted_mapping = dict(sorted(mapping.items()))
        
        output = "FIELD_MAPPING = {\n"
        for k, v in sorted_mapping.items():
            output += f'    "{k}": "{v}",\n'
        output += "}\n"
        
        with open('i912_config_generated.py', 'w') as f:
            f.write(output)
        print(f"Generated {len(mapping)} mappings")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate()
