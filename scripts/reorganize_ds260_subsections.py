# """
# Script to reorganize DS-260 form sections into smaller subsections (5-6 questions each)
# """

# import re

# # Read the current ds260.ts file
# input_file = r"d:\arachnie_work\updated_work\lib\formConfig\ds260.ts"
# output_file = r"d:\arachnie_work\updated_work\lib\formConfig\ds260.ts"

# with open(input_file, 'r', encoding='utf-8') as f:
#     content = f.read()

# # Define subsection mappings (question range -> new section name)
# subsections = {
#     # Section 1: 31 questions -> 6 subsections
#     ("S01-Q001", "S01-Q006"): "SECTION 1.1: Personal Information - Name and Identity",
#     ("S01-Q007", "S01-Q010"): "SECTION 1.2: Birth Information",
#     ("S01-Q011", "S01-Q016"): "SECTION 1.3: Passport and Citizenship",
#     ("S01-Q017", "S01-Q022"): "SECTION 1.4: Address and Phone Information",
#     ("S01-Q023", "S01-Q027"): "SECTION 1.5: Email and Social Media",
#     ("S01-Q028", "S01-Q031"): "SECTION 1.6: U.S. Address Information",
    
#     # Section 2: 33 questions -> 6 subsections
#     ("S02-Q001", "S02-Q007"): "SECTION 2.1: Father's Information",
#     ("S02-Q008", "S02-Q014"): "SECTION 2.2: Mother's Information",
#     ("S02-Q015", "S02-Q022"): "SECTION 2.3: Previous Marriages",
#     ("S02-Q023", "S02-Q027"): "SECTION 2.4: Children - Basic Information",
#     ("S02-Q028", "S02-Q030"): "SECTION 2.5: Children - Location",
#     ("S02-Q031", "S02-Q033"): "SECTION 2.6: Children - Immigration Plans",
    
#     # Section 3: 10 questions -> 2 subsections
#     ("S03-Q001", "S03-Q003"): "SECTION 3.1: Previous U.S. Travel",
#     ("S03-Q004", "S03-Q010"): "SECTION 3.2: U.S. Visa History",
    
#     # Section 4: 14 questions -> 3 subsections
#     ("S04-Q001", "S04-Q005"): "SECTION 4.1: Employment Information",
#     ("S04-Q006", "S04-Q009"): "SECTION 4.2: Education and Travel",
#     ("S04-Q010", "S04-Q014"): "SECTION 4.3: Military, Organizations, and Skills",
    
#     # Section 5: 6 questions -> 1 subsection
#     ("S05-Q001", "S05-Q006"): "SECTION 5.1: Petitioner Information",
    
#     # Section 6: 54 questions -> 10 subsections
#     ("S06-Q001", "S06-Q004"): "SECTION 6.1: Health and Medical",
#     ("S06-Q005", "S06-Q007"): "SECTION 6.2: Criminal History and Drug Violations",
#     ("S06-Q008", "S06-Q012"): "SECTION 6.3: Human Trafficking",
#     ("S06-Q013", "S06-Q017"): "SECTION 6.4: Terrorism and Security",
#     ("S06-Q018", "S06-Q022"): "SECTION 6.5: Genocide, Torture, and Violence",
#     ("S06-Q023", "S06-Q027"): "SECTION 6.6: Political Affiliations and Property",
#     ("S06-Q028", "S06-Q031"): "SECTION 6.7: Fraud and Deportation",
#     ("S06-Q041", "S06-Q045"): "SECTION 6.8: Custody and Voting Violations",
#     ("S06-Q046", "S06-Q050"): "SECTION 6.9: Professional and Military Requirements",
#     ("S06-Q051", "S06-Q054"): "SECTION 6.10: Other Inadmissibility Grounds",
    
#     # Section 7: 3 questions -> 1 subsection
#     ("S07-Q001", "S07-Q003"): "SECTION 7.1: Social Security Number",
    
#     # Section 8: 5 questions -> 1 subsection
#     ("S08-Q001", "S08-Q005"): "SECTION 8.1: Preparer Information",
# }

# def get_subsection_for_question(question_id):
#     """Find the appropriate subsection for a given question ID"""
#     for (start_q, end_q), subsection_name in subsections.items():
#         # Extract section and question numbers
#         start_section, start_num = start_q.split("-Q")
#         end_section, end_num = end_q.split("-Q")
#         curr_section, curr_num = question_id.split("-Q")
        
#         if curr_section == start_section:
#             if int(start_num) <= int(curr_num) <= int(end_num):
#                 return subsection_name
    
#     return None

# # Pattern to match section lines
# section_pattern = r'(    section: "SECTION \d+: [^"]+",)'

# def replace_section(match):
#     """Replace section with appropriate subsection"""
#     # Find the question ID from context (look backwards in content)
#     pos = match.start()
#     # Search backwards for the key field
#     key_search = content.rfind('key: "', max(0, pos - 500), pos)
#     if key_search != -1:
#         key_end = content.find('"', key_search + 6)
#         question_id = content[key_search + 6:key_end]
        
#         new_section = get_subsection_for_question(question_id)
#         if new_section:
#             return f'    section: "{new_section}",'
    
#     return match.group(0)

# # Replace all sections
# new_content = re.sub(section_pattern, replace_section, content)

# # Write the updated content
# with open(output_file, 'w', encoding='utf-8') as f:
#     f.write(new_content)

# print("[SUCCESS] Successfully reorganized DS-260 form into subsections")
# print(f"[SUCCESS] Updated file: {output_file}")
# print("\nSubsection breakdown:")
# print("- Section 1: 6 subsections (Personal, Birth, Passport, Address, Email, U.S. Address)")
# print("- Section 2: 6 subsections (Father, Mother, Previous Marriages, Children x3)")
# print("- Section 3: 2 subsections (Travel, Visa History)")
# print("- Section 4: 3 subsections (Employment, Education, Military)")
# print("- Section 5: 1 subsection (Petitioner)")
# print("- Section 6: 10 subsections (Health, Criminal, Trafficking, Terrorism, etc.)")
# print("- Section 7: 1 subsection (SSN)")
# print("- Section 8: 1 subsection (Preparer)")
# print("\nTotal: 30 subsections instead of 8 sections")
