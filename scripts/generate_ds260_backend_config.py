"""
Script to generate backend/app/core/form_configs/ds260_config.py from lib/formConfig/ds260.ts
This ensures backend PDF generation uses the exact same section headers as the frontend.
"""

import re
import os

# Paths
INPUT_FILE = r"d:\arachnie_work\updated_work\lib\formConfig\ds260.ts"
OUTPUT_FILE = r"d:\arachnie_work\updated_work\backend\app\core\form_configs\ds260_config.py"

def generate_config():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to extract key, originalLabel, and section
    # key: "S01-Q001",
    # originalLabel: "Name Provided (Surnames, Given Names)",
    # section: "SECTION 1.1: Personal Information - Name and Identity",
    
    # We'll use a simple state machine or regex to capture blocks
    # But regex might be easier if we capture group by group
    
    mapping = {}
    sections = {}
    
    # Split by object definitions to handle fields better
    # or just regex find iter
    
    # Pattern to find key, originalLabel, section
    # Note: they might be in any order, but usually key is first.
    # We will search for key, then look ahead for originalLabel and section
    
    # Parse pdfSectionTitles mapping
    pdf_section_titles = {}
    # Simpler regex - ignoring type annotation details
    pdf_section_block_match = re.search(r'export\s+const\s+pdfSectionTitles\s*:.*?=\s*{(.*?)};', content, re.DOTALL)
    
    if pdf_section_block_match:
        section_block = pdf_section_block_match.group(1)
        # simplistic parsing of "key": "value",
        # We need to handle potential newlines and spaces around keys/values
        section_matches = re.finditer(r'"([^"]+)"\s*:\s*"([^"]+)"', section_block)
        for sm in section_matches:
            pdf_section_titles[sm.group(1)] = sm.group(2)
        print(f"Found match for pdfSectionTitles. Parsed {len(pdf_section_titles)} entries.")
    else:
        print("WARNING: Could not find pdfSectionTitles variable in input file.")
        # Debug: print snippet where it might be
        snippet = re.search(r'pdfSectionTitles', content)
        if snippet:
            print(f"Found 'pdfSectionTitles' at index {snippet.start()}. Context: {content[snippet.start():snippet.start()+100]}")
        else:
            print("String 'pdfSectionTitles' not found in file content.")

    # Find all field blocks
    field_pattern = r'{\s+key:\s+"([^"]+)",(.*?)}'
    matches = re.finditer(field_pattern, content, re.DOTALL)
    
    for match in matches:
        key = match.group(1)
        block = match.group(2)
        
        # Extract originalLabel
        label_match = re.search(r'originalLabel:\s+"([^"]+)"', block)
        if label_match:
            original_label = label_match.group(1)
            mapping[key] = original_label
            
        # Extract section
        section_match = re.search(r'section:\s+"([^"]+)"', block)
        if section_match:
            section = section_match.group(1)
            # Map section name if mapping exists
            final_section = pdf_section_titles.get(section, section)
            sections[key] = final_section
            
    # Write output
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("# backend/app/core/form_configs/ds260_config.py\n\n")
        f.write("# Mapping of Form Field Keys to Original Question Text\n")
        f.write("# Generated automatically from ds260.ts\n\n")
        
        f.write("FIELD_MAPPING = {\n")
        for key, label in mapping.items():
            f.write(f'    "{key}": "{label}",\n')
        f.write("}\n\n")
        
        f.write("# Mapping of Form Field Keys to Section Names\n")
        f.write("SECTION_MAPPING = {\n")
        for key, section in sections.items():
            f.write(f'    "{key}": "{section}",\n')
        f.write("}\n")
        
    print(f"Generated {len(mapping)} field mappings and {len(sections)} section mappings.")

if __name__ == "__main__":
    generate_config()
