import re
import os
import sys

def parse_ds260(input_file):
    print(f"Reading {input_file}...")
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

    print(f"File content length: {len(content)}")
    
    sections = content.split('---')
    questions = []
    
    id_pattern = re.compile(r'\*\*(S\d+-Q\d+)\*\*')
    original_pattern = re.compile(r'\*\*Original question:\*\*\s*(.*)')
    simplified_pattern = re.compile(r'\*\*Simplified wording:\*\*\s*(.*)')
    tips_pattern = re.compile(r'\*\*Tips to answer:\*\*\s*(.*?)(?=\*\*Resources:\*\*|\Z)', re.DOTALL)
    
    current_section = ""

    for i, section in enumerate(sections):
        section = section.strip()
        if not section:
            continue
            
        if section.startswith('## SECTION'):
            try:
                current_section = section.split('\n')[0].replace('## ', '').strip()
            except:
                pass
            
        id_match = id_pattern.search(section)
        if not id_match:
            continue
            
        q_id = id_match.group(1)
        
        orig_match = original_pattern.search(section)
        original = orig_match.group(1).strip() if orig_match else ""
        
        simp_match = simplified_pattern.search(section)
        simplified = simp_match.group(1).strip() if simp_match else ""
        
        tips_match = tips_pattern.search(section)
        tips = tips_match.group(1).strip() if tips_match else ""
        
        q_type = "text"
        options = []
        
        # Simple heuristic
        lower_tips = tips.lower()
        lower_orig = original.lower()
        if "date" in lower_orig or "when" in simplified.lower():
            q_type = "date"
        elif "yes" in lower_tips and "no" in lower_tips:
             q_type = "radio"
             options = [
                 {"label": "Yes", "value": "Yes", "pdfKey": f"{q_id}_Yes"},
                 {"label": "No", "value": "No", "pdfKey": f"{q_id}_No"}
             ]
        elif "male" in lower_tips and "female" in lower_tips:
             q_type = "radio"
             options = [
                 {"label": "Male", "value": "Male", "pdfKey": f"{q_id}_Male"},
                 {"label": "Female", "value": "Female", "pdfKey": f"{q_id}_Female"}
             ]
        
        field = {
            "key": q_id,
            "pdfKey": q_id,
            "label": simplified or original,
            "originalLabel": original,
            "type": q_type,
            "section": current_section,
            "tooltip": tips.replace('\n', ' ').replace('"', "'") 
        }
        
        if options:
            field["options"] = options
            
        questions.append(field)

    return questions

def generate_ts(questions, output_file):
    print(f"Generating TS file with {len(questions)} questions...")
    ts_content = """import type { Field } from "./types";

export const formId = "ds260";
export const formTitle = "Form DS-260";
export const formSubtitle = "Immigrant Visa Electronic Application";

export const formFields: Field[] = [
"""
    
    for q in questions:
        # Escape string values
        label = q["label"].replace('"', '\\"').replace('\n', ' ')
        orig_label = q["originalLabel"].replace('"', '\\"').replace('\n', ' ')
        section = q["section"].replace('"', '\\"').replace('\n', ' ')
        tooltip = q["tooltip"].replace('"', '\\"').replace('`', '\\`')
        
        ts_content += "  {\n"
        ts_content += f'    key: "{q["key"]}",\n'
        ts_content += f'    pdfKey: "{q["pdfKey"]}",\n'
        ts_content += f'    label: "{label}",\n'
        ts_content += f'    originalLabel: "{orig_label}",\n'
        ts_content += f'    type: "{q["type"]}",\n'
        ts_content += f'    section: "{section}",\n'
        if tooltip:
             ts_content += f'    tooltip: `{tooltip}`,\n'
        if q.get("options"):
            ts_content += "    options: [\n"
            for opt in q["options"]:
                ts_content += f'      {{ label: "{opt["label"]}", value: "{opt["value"]}", pdfKey: "{opt["pdfKey"]}" }},\n'
            ts_content += "    ],\n"
        ts_content += "  },\n"

    ts_content += "];\n"
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        print(f"Successfully wrote to {output_file}")
    except Exception as e:
        print(f"Error writing file: {e}")

if __name__ == "__main__":
    # Use absolute paths
    base_dir = r"d:\arachnie_work\updated_work"
    input_path = os.path.join(base_dir, "backend", "pdfs", "ds260_question_bank.txt")
    output_path = os.path.join(base_dir, "lib", "formConfig", "ds260.ts")
    
    if not os.path.exists(input_path):
        print(f"Input file not found at {input_path}")
    else:
        questions = parse_ds260(input_path)
        generate_ts(questions, output_path)
