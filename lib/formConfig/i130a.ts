import type { Field } from "./types";

export const formId = "i130a";
export const formTitle = "Form I-130A";
export const formSubtitle = "Supplemental Information for Spouse Beneficiary";

export const formFields: Field[] = [
  // ========================
  // G-28 & Attorney
  // ========================
  {
    key: "g28_attached",
    pdfKey: "g28_attached",
    label: "Form G-28 is attached",
    type: "checkbox",
    section: "Attorney or Accredited Representative",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "g28_attached" },
    ],
  },
  {
    key: "g28_uscis_account",
    pdfKey: "attorney_uscis_acct",
    label: "USCIS Online Account Number (Attorney) (if any)",
    type: "text",
    section: "Attorney or Accredited Representative",
    // condition: (d) => !!d.g28_attached,
  },
  {
    key: "attorney_bar_number",
    pdfKey: "attorney_bar_number",
    label: "Attorney State Bar Number (if any)",
    type: "text",
    section: "Attorney or Accredited Representative",
    // condition: (d) => !!d.g28_attached,
  },
  {
    key: "p1_volag_number",
    pdfKey: "p1_volag_number",
    label: "Volag Number (if any)",
    type: "text",
    section: "Attorney or Accredited Representative",
    // condition: (d) => !!d.g28_attached,
  },

  // ========================
  // Part 1. Information About You (Spouse Beneficiary)
  // ========================
  {
    key: "p1_alien_number",
    pdfKey: "p1_alien_number",
    label: "Alien Registration Number (A-Number) (if any)",
    type: "text",
    section: "Part 1. Information About You (Spouse Beneficiary)",
    maxLength: 9,
  },
  {
    key: "p1_uscis_account",
    pdfKey: "p1_uscis_account",
    label: "USCIS Online Account Number (if any)",
    type: "text",
    section: "Part 1. Information About You (Spouse Beneficiary)",
    maxLength: 12,
  },
  {
    key: "p1_family_name",
    pdfKey: "p1_family_name",
    label: "Family Name (Last Name)",
    type: "text",
    section: "Part 1. Information About You (Spouse Beneficiary)",
  },
  {
    key: "p1_given_name",
    pdfKey: "p1_given_name",
    label: "Given Name (First Name)",
    type: "text",
    section: "Part 1. Information About You (Spouse Beneficiary)",
  },
  {
    key: "p1_middle_name",
    pdfKey: "p1_middle_name",
    label: "Middle Name",
    type: "text",
    section: "Part 1. Information About You (Spouse Beneficiary)",
  },

  // Address History 1 (Current)
  {
    key: "p1_addr1_street",
    pdfKey: "p1_addr1_street",
    label: "Street Number and Name (Current Address)",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_unit_type",
    pdfKey: "p1_addr1_unit_apt", // Logic will need to handle multiple checkboxes based on value? 
    // For simplicity in text config, we map to one, or use a dropdown. 
    // Mapping "pdfKey" here is for display. The actual filler handles mapping logic if complex.
    // But here we are 1:1. 
    // We will just expose the value fields.
    label: "Unit Type (Apt/Ste/Flr)",
    type: "radio",
    options: [
      { label: "Apt", value: "apt", pdfKey: "p1_addr1_unit_apt" },
      { label: "Ste", value: "ste", pdfKey: "p1_addr1_unit_ste" },
      { label: "Flr", value: "flr", pdfKey: "p1_addr1_unit_flr" }
    ],
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_unit_val",
    pdfKey: "p1_addr1_unit_val",
    label: "Unit Number",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_city",
    pdfKey: "p1_addr1_city",
    label: "City or Town",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_state",
    pdfKey: "p1_addr1_state",
    label: "State",
    type: "text", // Or select list of states
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_zip",
    pdfKey: "p1_addr1_zip",
    label: "Zip Code",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_province",
    pdfKey: "p1_addr1_province",
    label: "Province",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_postal",
    pdfKey: "p1_addr1_postal",
    label: "Postal Code",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_country",
    pdfKey: "p1_addr1_country",
    label: "Country",
    type: "text",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_date_from",
    pdfKey: "p1_addr1_date_from",
    label: "Date From (mm/dd/yyyy)",
    type: "date",
    section: "Address History 1 (Current)",
  },
  {
    key: "p1_addr1_date_to",
    pdfKey: "p1_addr1_date_to",
    label: "Date To (mm/dd/yyyy)",
    type: "date",
    section: "Address History 1 (Current)",
  },

  // Parents Information
  // {
  //   key: "p1_parents_header",
  //   label: "Parent 1 Information",
  //   type: "header",
  //   section: "Information About Your Parents",
  // },
  {
    key: "p1_parent1_family_name",
    pdfKey: "p1_parent1_family_name",
    label: "Parent 1 Family Name",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_given_name",
    pdfKey: "p1_parent1_given_name",
    label: "Parent 1 Given Name",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_middle_name",
    pdfKey: "p1_parent1_middle_name",
    label: "Parent 1 Middle Name",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_dob",
    pdfKey: "p1_parent1_dob",
    label: "Parent 1 Date of Birth",
    type: "date",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_sex",
    pdfKey: "p1_parent1_sex", // Placeholder for logic
    label: "Parent 1 Sex",
    type: "radio",
    options: [
      { label: "Male", value: "Male", pdfKey: "p1_parent1_sex_male" },
      { label: "Female", value: "Female", pdfKey: "p1_parent1_sex_female" }
    ],
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_city_birth",
    pdfKey: "p1_parent1_city_birth",
    label: "Parent 1 City/Town of Birth",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_country_birth",
    pdfKey: "p1_parent1_country_birth",
    label: "Parent 1 Country of Birth",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent1_country_res",
    pdfKey: "p1_parent1_country_res",
    label: "Parent 1 Country of Residence",
    type: "text",
    section: "Information About Your Parents",
  },

  // {
  //   key: "p1_parents2_header",
  //   label: "Parent 2 Information",
  //   type: "header",
  //   section: "Information About Your Parents",
  // },
  {
    key: "p1_parent2_family_name",
    pdfKey: "p1_parent2_family_name",
    label: "Parent 2 Family Name",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_given_name",
    pdfKey: "p1_parent2_given_name",
    label: "Parent 2 Given Name",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_middle_name",
    pdfKey: "p1_parent2_middle_name",
    label: "Parent 2 Middle Name",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_dob",
    pdfKey: "p1_parent2_dob",
    label: "Parent 2 Date of Birth",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_sex",
    pdfKey: "p1_parent2_sex",
    label: "Parent 2 Sex",
    type: "radio",
    options: [
      { label: "Male", value: "Male", pdfKey: "p1_parent2_sex_male" },
      { label: "Female", value: "Female", pdfKey: "p1_parent2_sex_female" }
    ],
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_city_birth",
    pdfKey: "p1_parent2_city_birth",
    label: "Parent 2 City/Town of Birth",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_country_birth",
    pdfKey: "p1_parent2_country_birth",
    label: "Parent 2 Country of Birth",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_city_res",
    pdfKey: "p1_parent2_city_res",
    label: "Parent 2 City/Town of Residence",
    type: "text",
    section: "Information About Your Parents",
  },
  {
    key: "p1_parent2_country_res",
    pdfKey: "p1_parent2_country_res",
    label: "Parent 2 Country of Residence",
    type: "text",
    section: "Information About Your Parents",
  },

  // Employment
  // {
  //   key: "p2_emp_header",
  //   label: "Employment History (Last 5 Years)",
  //   type: "header",
  //   section: "Part 2. Information About Your Employment",
  // },
  {
    key: "p2_emp1_name",
    pdfKey: "p2_emp1_name",
    label: "Employer 1 Name",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_street",
    pdfKey: "p2_emp1_street",
    label: "Employer 1 Street Number and Name",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_unit_type",
    pdfKey: "p2_emp1_unit_apt",
    label: "Employer 1 Unit Type (Apt/Ste/Flr)",
    type: "radio",
    options: [
      { label: "Apt", value: "apt", pdfKey: "p2_emp1_unit_apt" },
      { label: "Ste", value: "ste", pdfKey: "p2_emp1_unit_ste" },
      { label: "Flr", value: "flr", pdfKey: "p2_emp1_unit_flr" }
    ],
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_unit_val",
    pdfKey: "p2_emp1_unit_val",
    label: "Employer 1 Unit Number",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_city",
    pdfKey: "p2_emp1_city",
    label: "Employer 1 City or Town",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_state",
    pdfKey: "p2_emp1_state",
    label: "Employer 1 State",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_zip",
    pdfKey: "p2_emp1_zip",
    label: "Employer 1 Zip Code",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_province",
    pdfKey: "p2_emp1_province",
    label: "Employer 1 Province",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_postal",
    pdfKey: "p2_emp1_postal",
    label: "Employer 1 Postal Code",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_country",
    pdfKey: "p2_emp1_country",
    label: "Employer 1 Country",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_occupation",
    pdfKey: "p2_emp1_occupation",
    label: "Employer 1 Occupation",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_date_from",
    pdfKey: "p2_emp1_date_from",
    label: "Employer 1 Date From",
    type: "date",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp1_date_to",
    pdfKey: "p2_emp1_date_to",
    label: "Employer 1 Date To",
    type: "date",
    section: "Part 2. Information About Your Employment",
  },
  // Employment 2
  {
    key: "p2_emp2_name",
    pdfKey: "p2_emp2_name",
    label: "Employer 2 Name",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_street",
    pdfKey: "p2_emp2_street",
    label: "Employer 2 Street Address",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_unit_type",
    pdfKey: "p2_emp2_unit_apt",
    label: "Employer 2 Unit Type (Apt/Ste/Flr)",
    type: "radio",
    options: [
      { label: "Apt", value: "apt", pdfKey: "p2_emp2_unit_apt" },
      { label: "Ste", value: "ste", pdfKey: "p2_emp2_unit_ste" },
      { label: "Flr", value: "flr", pdfKey: "p2_emp2_unit_flr" }
    ],
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_unit_val",
    pdfKey: "p2_emp2_unit_val",
    label: "Employer 2 Unit Number",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_city",
    pdfKey: "p2_emp2_city",
    label: "Employer 2 City",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_state",
    pdfKey: "p2_emp2_state",
    label: "Employer 2 State",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_zip",
    pdfKey: "p2_emp2_zip",
    label: "Employer 2 Zip Code",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_province",
    pdfKey: "p2_emp2_province",
    label: "Employer 2 Province",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_postal",
    pdfKey: "p2_emp2_postal",
    label: "Employer 2 Postal Code",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_country",
    pdfKey: "p2_emp2_country",
    label: "Employer 2 Country",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_occupation",
    pdfKey: "p2_emp2_occupation",
    label: "Employer 2 Occupation",
    type: "text",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_date_from",
    pdfKey: "p2_emp2_date_from",
    label: "Employer 2 Date From",
    type: "date",
    section: "Part 2. Information About Your Employment",
  },
  {
    key: "p2_emp2_date_to",
    pdfKey: "p2_emp2_date_to",
    label: "Employer 2 Date To",
    type: "date",
    section: "Part 2. Information About Your Employment",
  },

  // Employment 3 (Part 3)
  {
    key: "",
    pdfKey: "",
    label: "Provide your last occupation outside the United States if not shown above.  If you never worked outside the United States, provide this information in the space provided in Part 7. ",
    type: "hidden",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_name",
    pdfKey: "p3_emp3_name",
    label: "Name",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_street",
    pdfKey: "p3_emp3_street",
    label: "Street Address",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p2_emp1_unit_type",
    pdfKey: "p2_emp1_unit_apt",
    label: "Unit Type (Apt/Ste/Flr)",
    type: "radio",
    options: [
      { label: "Apt", value: "apt", pdfKey: "p3_emp3_unit_apt" },
      { label: "Ste", value: "ste", pdfKey: "p3_emp3_unit_ste" },
      { label: "Flr", value: "flr", pdfKey: "p3_emp3_unit_flr" }
    ],
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_unit_val",
    pdfKey: "p3_emp3_unit_val",
    label: "Unit Number",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_city",
    pdfKey: "p3_emp3_city",
    label: "City",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_state",
    pdfKey: "p3_emp3_state",
    label: "State",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_zip",
    pdfKey: "p3_emp3_zip",
    label: "Zip Code",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_country",
    pdfKey: "p3_emp3_country",
    label: "Country",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_occupation",
    pdfKey: "p3_emp3_occupation",
    label: "Occupation",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_date_from",
    pdfKey: "p3_emp3_date_from",
    label: "Date From",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },
  {
    key: "p3_emp3_date_to",
    pdfKey: "p3_emp3_date_to",
    label: "Date To",
    type: "text",
    section: "Part 3. Employment Outside the United States",
  },

  // Part 4
  {
    key: "p4_language_english_chk",
    pdfKey: "p4_language_english_chk",
    label: "I can read and understand English",
    type: "checkbox",
    section: "Part 4.  Spouse Information",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "p4_language_english_chk" },
    ]
  },

  {
    key: "p4_language_interp_lang",
    pdfKey: "p4_language_interp_lang",
    label: "Answers Language",
    type: "text",
    section: "Part 4.  Spouse Information",
  },
  {
    key: "p4_interpreter_chk",
    pdfKey: "p4_interpreter_chk",
    label: "The interpreter named in Part 5. read to me every question and instruction on this form",
    type: "checkbox",
    section: "Part 4.  Spouse Information",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "p4_interpreter_chk" },
    ]
  },
  {
    key: "p4_interpreter_name",
    pdfKey: "p4_interpreter_name",
    label: "Interpreter Name",
    type: "text",
    section: "Part 4.  Spouse Information",
  },
  {
    key: "p4_phone",
    pdfKey: "p4_phone",
    label: "Daytime Telephone Number",
    type: "text",
    section: "Part 4.  Spouse Information",
  },
  {
    key: "p4_mobile",
    pdfKey: "p4_mobile",
    label: "Mobile Telephone Number",
    type: "text",
    section: "Part 4.  Spouse Information",
  },
  {
    key: "p4_email",
    pdfKey: "p4_email",
    label: "Email Address",
    type: "text",
    section: "Part 4.  Spouse Information",
  },
  {
    key: "p4_signature",
    pdfKey: "p4_signature",
    label: "Signature",
    type: "text",
    section: "Part 4.  Spouse Information",
  },
  {
    key: "p4_date_signed",
    pdfKey: "p4_date_signed",
    label: "Date of Signature (mm/dd/yyyy)",
    type: "date",
    section: "Part 4.  Spouse Information",
  },

  // Part 5 - Interpreter
  {
    key: "p5_interp_family_name",
    pdfKey: "p5_interp_family_name",
    label: "Interpreter Family Name (Last Name)",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_given_name",
    pdfKey: "p5_interp_given_name",
    label: "Interpreter Given Name (First Name)",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_business",
    pdfKey: "p5_interp_business",
    label: "Interpreter Business Name (if any)",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_street",
    pdfKey: "p5_interp_street",
    label: "Street Number and Name",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_unit_type",
    pdfKey: "p5_interp_unit_apt",
    label: "Unit Type (Apt/Ste/Flr)",
    type: "radio",
    options: [
      { label: "Apt", value: "apt", pdfKey: "p5_interp_unit_apt" },
      { label: "Ste", value: "ste", pdfKey: "p5_interp_unit_ste" },
      { label: "Flr", value: "flr", pdfKey: "p5_interp_unit_flr" }
    ],
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_unit_val",
    pdfKey: "p5_interp_unit_val",
    label: "Unit Number",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_city",
    pdfKey: "p5_interp_city",
    label: "City or Town",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_state",
    pdfKey: "p5_interp_state",
    label: "State",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_zip",
    pdfKey: "p5_interp_zip",
    label: "Zip Code",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_province",
    pdfKey: "p5_interp_province",
    label: "Province",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_postal",
    pdfKey: "p5_interp_postal",
    label: "Postal Code",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_country",
    pdfKey: "p5_interp_country",
    label: "Country",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_phone",
    pdfKey: "p5_interp_phone",
    label: "Daytime Telephone Number",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_email",
    pdfKey: "p5_interp_email",
    label: "Email Address",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_language",
    pdfKey: "p5_interp_language",
    label: "Language Fluency",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_signature",
    pdfKey: "p5_interp_signature",
    label: "Signature",
    type: "text",
    section: "Part 5. Interpreter Information",
  },
  {
    key: "p5_interp_date_signed",
    pdfKey: "p5_interp_date_signed",
    label: "Date of Signature (mm/dd/yyyy)",
    type: "date",
    section: "Part 5. Interpreter Information",
  },
  // Part 6 - Preparer
  {
    key: "p6_prep_given_name",
    pdfKey: "p6_prep_given_name",
    label: "Preparer Given Name (First Name)",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_family_name",
    pdfKey: "p6_prep_family_name",
    label: "Preparer Family Name (Last Name)",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_business",
    pdfKey: "p6_prep_business",
    label: "Preparer Business Name (if any)",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_street",
    pdfKey: "p6_prep_street",
    label: "Street Number and Name",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_unit_type",
    pdfKey: "p6_prep_unit_apt",
    label: "Unit Type (Apt/Ste/Flr)",
    type: "radio",
    options: [
      { label: "Apt", value: "apt", pdfKey: "p6_prep_unit_apt" },
      { label: "Ste", value: "ste", pdfKey: "p6_prep_unit_ste" },
      { label: "Flr", value: "flr", pdfKey: "p6_prep_unit_flr" }
    ],
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_unit_val",
    pdfKey: "p6_prep_unit_val",
    label: "Unit Number",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_city",
    pdfKey: "p6_prep_city",
    label: "City or Town",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_state",
    pdfKey: "p6_prep_state",
    label: "State",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_zip",
    pdfKey: "p6_prep_zip",
    label: "Zip Code",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_province",
    pdfKey: "p6_prep_province",
    label: "Province",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_postal",
    pdfKey: "p6_prep_postal",
    label: "Postal Code",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_country",
    pdfKey: "p6_prep_country",
    label: "Country",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_phone",
    pdfKey: "p6_prep_phone",
    label: "Daytime Telephone Number",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_fax",
    pdfKey: "p6_prep_fax",
    label: "Fax Number",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_email",
    pdfKey: "p6_prep_email",
    label: "Email Address",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_statement_chk",
    pdfKey: "p6_prep_statement_chk1",
    label: "Preparer Statement",
    type: "radio",
    options: [
      { label: "I am not an attorney or accredited representative.", value: "not_attorney", pdfKey: "p6_prep_statement_chk1" },
      { label: "I am an attorney or accredited representative.", value: "attorney", pdfKey: "p6_prep_statement_chk2" }
    ],
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_attorney_chk",
    pdfKey: "p6_prep_attorney_chk1",
    label: "Attorney Representation",
    type: "radio",
    options: [
      { label: "My representation extends to this form.", value: "extends", pdfKey: "p6_prep_attorney_chk1" },
      { label: "My representation does not extend to this form.", value: "does_not_extend", pdfKey: "p6_prep_attorney_chk2" }
    ],
    section: "Part 6. Preparer Information",
    // condition: (d) => d.p6_prep_statement_chk === 'attorney'
  },
  {
    key: "p6_prep_signature",
    pdfKey: "p6_prep_signature",
    label: "Signature",
    type: "text",
    section: "Part 6. Preparer Information",
  },
  {
    key: "p6_prep_date_signed",
    pdfKey: "p6_prep_date_signed",
    label: "Date of Signature (mm/dd/yyyy)",
    type: "date",
    section: "Part 6. Preparer Information",
  },

  // Part 7 - Additional Information
  {
    key: "p7_add_info_page1",
    pdfKey: "p7_add_info_page1",
    label: "Page Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_part1",
    pdfKey: "p7_add_info_part1",
    label: "Part Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_item1",
    pdfKey: "p7_add_info_item1",
    label: "Item Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_desc1",
    pdfKey: "p7_add_info_desc1",
    label: "Additional Information",
    type: "textarea",
    section: "Part 7. Additional Information",
  },

  {
    key: "p7_add_info_page2",
    pdfKey: "p7_add_info_page2",
    label: "Page Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_part2",
    pdfKey: "p7_add_info_part2",
    label: "Part Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_item2",
    pdfKey: "p7_add_info_item2",
    label: "Item Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_desc2",
    pdfKey: "p7_add_info_desc2",
    label: "Additional Information",
    type: "textarea",
    section: "Part 7. Additional Information",
  },

  {
    key: "p7_add_info_page3",
    pdfKey: "p7_add_info_page3",
    label: "Page Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_part3",
    pdfKey: "p7_add_info_part3",
    label: "Part Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_item3",
    pdfKey: "p7_add_info_item3",
    label: "Item Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_desc3",
    pdfKey: "p7_add_info_desc3",
    label: "Additional Information",
    type: "textarea",
    section: "Part 7. Additional Information",
  },

  {
    key: "p7_add_info_page4",
    pdfKey: "p7_add_info_page4",
    label: "Page Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_part4",
    pdfKey: "p7_add_info_part4",
    label: "Part Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_item4",
    pdfKey: "p7_add_info_item4",
    label: "Item Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_desc4",
    pdfKey: "p7_add_info_desc4",
    label: "Additional Information",
    type: "textarea",
    section: "Part 7. Additional Information",
  },

  {
    key: "p7_add_info_page5",
    pdfKey: "p7_add_info_page5",
    label: "Page Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_part5",
    pdfKey: "p7_add_info_part5",
    label: "Part Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_item5",
    pdfKey: "p7_add_info_item5",
    label: "Item Number",
    type: "text",
    section: "Part 7. Additional Information",
  },
  {
    key: "p7_add_info_desc5",
    pdfKey: "p7_add_info_desc5",
    label: "Additional Information",
    type: "textarea",
    section: "Part 7. Additional Information",
  },
]

export const getInitialFormData = () => {
  const data: Record<string, string> = {};
  formFields.forEach((f) => (data[f.key] = ""));
  return data;
};

export const i130aConfig = {
  formId,
  formTitle,
  formSubtitle,
  formFields,
  getInitialFormData,
};

export default i130aConfig;