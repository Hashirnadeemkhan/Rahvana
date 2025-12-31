import re
import os
import sys

def parse_ds260_config(input_file):
    print(f"Reading {input_file}...")
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

    sections = content.split('---')
    questions = []
    
    id_pattern = re.compile(r'\*\*(S\d+-Q\d+)\*\*')
    original_pattern = re.compile(r'\*\*Original question:\*\*\s*(.*)')
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
            
        id_match = id_pattern.search(section)
        if not id_match:
            continue
            
        q_id = id_match.group(1)
        
        orig_match = original_pattern.search(section)
        original = orig_match.group(1).strip() if orig_match else ""
        
        if original:
             questions.append((q_id, original))

    return questions

def generate_python_config(questions, output_file):
    print(f"Generating Python config with {len(questions)} mappings...")
    
    content = """# backend/app/core/form_configs/ds260_config.py

# Mapping of Form Field Keys to Original Question Text
# Generated automatically

FIELD_MAPPING = {
"""
    
    for key, label in questions:
        # Escape quotes
        label = label.replace('"', '\\"').replace('\n', ' ')
        content += f'    "{key}": "{label}",\n'
        
    content += "}\n"
    
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully wrote to {output_file}")
    except Exception as e:
        print(f"Error writing file: {e}")

if __name__ == "__main__":
    base_dir = r"d:\arachnie_work\updated_work"
    input_path = os.path.join(base_dir, "backend", "pdfs", "ds260_question_bank.txt")
    output_path = os.path.join(base_dir, "backend", "app", "core", "form_configs", "ds260_config.py")
    
    if not os.path.exists(input_path):
        print(f"Input file not found at {input_path}")
    else:
        questions = parse_ds260_config(input_path)
        generate_python_config(questions, output_path)
