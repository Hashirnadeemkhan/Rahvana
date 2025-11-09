// app/i130/formConfig.ts

export type FieldType = "text" | "radio";

export type Field = {
  key: string;
  pdfKey: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxLength?: number;
  options?: { label: string; value: string; pdfKey: string }[];
  condition?: (data: Record<string, string>) => boolean;
  section?: string;
};

export const formFields: Field[] = [
  // ============================================
  // PART 1. RELATIONSHIP
  // ============================================
  {
    key: "relationship",
    pdfKey: "relationship",
    label: "1. I am filing this petition for my (Select only one box):",
    type: "radio",
    section: "Part 1. Relationship",
    options: [
      { label: "Spouse", value: "Spouse", pdfKey: "relationship_Spouse" },
      { label: "Parent", value: "Parent", pdfKey: "relationship_Parent" },
      { label: "Brother/Sister", value: "BrotherSister", pdfKey: "relationship_BrotherSister" },
      { label: "Child", value: "Child", pdfKey: "relationship_Child" },
    ],
  },
  {
    key: "relationship_detail",
    pdfKey: "relationship_detail",
    label: "2. If you are filing this petition for your child or parent, select the box that describes your relationship (Select only one box):",
    type: "radio",
    section: "Part 1. Relationship",
    condition: (d) => ["Parent", "Child"].includes(d.relationship),
    options: [
      { label: "Child was born to parents who were married to each other at the time of the child's birth", value: "ChildBornMarried", pdfKey: "relationship_detail_ChildBornMarried" },
      { label: "Stepchild/Stepparent", value: "Stepchild", pdfKey: "relationship_detail_Stepchild" },
      { label: "Child was born to parents who were not married to each other at the time of the child's birth", value: "ChildBornUnmarried", pdfKey: "relationship_detail_ChildBornUnmarried" },
      { label: "Child was adopted (not an Orphan or Hague Convention adoptee)", value: "ChildAdopted", pdfKey: "relationship_detail_ChildAdopted" },
    ],
  },
  {
    key: "sibling_adoption",
    pdfKey: "sibling_adoption",
    label: "3. If the beneficiary is your brother/sister, are you related by adoption?",
    type: "radio",
    section: "Part 1. Relationship",
    condition: (d) => d.relationship === "BrotherSister",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "sibling_adoption_Yes" },
      { label: "No", value: "No", pdfKey: "sibling_adoption_No" },
    ],
  },
  {
    key: "citizen_adoption",
    pdfKey: "citizen_adoption",
    label: "4. Did you gain lawful permanent resident status or citizenship through adoption?",
    type: "radio",
    section: "Part 1. Relationship",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "citizen_adoption_Yes" },
      { label: "No", value: "No", pdfKey: "citizen_adoption_No" },
    ],
  },

  // ============================================
  // PART 2. INFORMATION ABOUT YOU (PETITIONER)
  // ============================================
  {
    key: "a_number",
    pdfKey: "a_number",
    label: "1. Alien Registration Number (A-Number) (if any)",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "A-Number",
    maxLength: 9,
  },
  {
    key: "uscis_account",
    pdfKey: "uscis_account",
    label: "2. USCIS Online Account Number (if any)",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "USCIS Account",
    maxLength: 12,
  },
  {
    key: "ssn",
    pdfKey: "ssn",
    label: "3. U.S. Social Security Number (if any)",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "SSN",
    maxLength: 9,
  },

  // Full Name
  {
    key: "family_name",
    pdfKey: "family_name",
    label: "4.a. Family Name (Last Name)",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "Last Name",
    maxLength: 35,
  },
  {
    key: "given_name",
    pdfKey: "given_name",
    label: "4.b. Given Name (First Name)",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "First Name",
    maxLength: 35,
  },
  {
    key: "middle_name",
    pdfKey: "middle_name",
    label: "4.c. Middle Name",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "Middle Name",
    maxLength: 35,
  },

  // Other Names Used
  {
    key: "other_family_name",
    pdfKey: "other_family_name",
    label: "5.a. Family Name (Last Name) - Other Names Used",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
  },
  {
    key: "other_given_name",
    pdfKey: "other_given_name",
    label: "5.b. Given Name (First Name) - Other Names Used",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
  },
  {
    key: "other_middle_name",
    pdfKey: "other_middle_name",
    label: "5.c. Middle Name - Other Names Used",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
  },

  // Birth Info
  {
    key: "city_of_birth",
    pdfKey: "city_of_birth",
    label: "6. City/Town/Village of Birth",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
  },
  {
    key: "country_of_birth",
    pdfKey: "country_of_birth",
    label: "7. Country of Birth",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
  },
  {
    key: "date_of_birth",
    pdfKey: "date_of_birth",
    label: "8. Date of Birth (mm/dd/yyyy)",
    type: "text",
    section: "Part 2. Information About You (Petitioner)",
    placeholder: "MM/DD/YYYY",
    maxLength: 10,
  },

  // Sex
  {
    key: "sex",
    pdfKey: "sex",
    label: "9. Sex",
    type: "radio",
    section: "Part 2. Information About You (Petitioner)",
    options: [
      { label: "Male", value: "Male", pdfKey: "sex_Male" },
      { label: "Female", value: "Female", pdfKey: "sex_Female" },
    ],
  },

  // ============================================
  // CURRENT PHYSICAL ADDRESS (Item 10)
  // ============================================
  {
    key: "current_in_care_of",
    pdfKey: "current_in_care_of",
    label: "10. In Care of Name",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_street",
    pdfKey: "current_street",
    label: "10.a. Street Number and Name",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_unit_type",
    pdfKey: "current_unit_type",
    label: "10.b. Unit",
    type: "radio",
    section: "Address History",
    options: [
      { label: "Apt.", value: "Apt", pdfKey: "current_unit_type_Apt" },
      { label: "Ste.", value: "Ste", pdfKey: "current_unit_type_Ste" },
      { label: "Flr.", value: "Flr", pdfKey: "current_unit_type_Flr" },
    ],
  },
  {
    key: "current_unit_number",
    pdfKey: "current_unit_number",
    label: "10.c. Apt./Ste./Flr. Number",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_city",
    pdfKey: "current_city",
    label: "10.d. City or Town",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_state",
    pdfKey: "current_state",
    label: "10.e. State",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_zip",
    pdfKey: "current_zip",
    label: "10.f. ZIP Code",
    type: "text",
    section: "Address History",
    maxLength: 5,
  },
  {
    key: "current_province",
    pdfKey: "current_province",
    label: "10.g. Province",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_postal_code",
    pdfKey: "current_postal_code",
    label: "10.h. Postal Code",
    type: "text",
    section: "Address History",
  },
  {
    key: "current_country",
    pdfKey: "current_country",
    label: "10.i. Country",
    type: "text",
    section: "Address History",
  },

  // ============================================
  // MAILING ADDRESS SAME? (Item 11)
  // ============================================
  {
    key: "same_mailing_address",
    pdfKey: "same_mailing_address",
    label: "11. Is your current mailing address the same as your physical address?",
    type: "radio",
    section: "Address History",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "same_mailing_address_Yes" },
      { label: "No", value: "No", pdfKey: "same_mailing_address_No" },
    ],
  },

  // ============================================
  // MAILING ADDRESS (Item 12) - If Different
  // ============================================
  {
    key: "mailing_street",
    pdfKey: "mailing_street",
    label: "12.a. Street Number and Name",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_unit_type",
    pdfKey: "mailing_unit_type",
    label: "12.b. Unit",
    type: "radio",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
    options: [
      { label: "Apt.", value: "Apt", pdfKey: "mailing_unit_type_Apt" },
      { label: "Ste.", value: "Ste", pdfKey: "mailing_unit_type_Ste" },
      { label: "Flr.", value: "Flr", pdfKey: "mailing_unit_type_Flr" },
    ],
  },
  {
    key: "mailing_unit_number",
    pdfKey: "mailing_unit_number",
    label: "12.c. Apt./Ste./Flr. Number",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_city",
    pdfKey: "mailing_city",
    label: "12.d. City or Town",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_state",
    pdfKey: "mailing_state",
    label: "12.e. State",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_zip",
    pdfKey: "mailing_zip",
    label: "12.f. ZIP Code",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_province",
    pdfKey: "mailing_province",
    label: "12.g. Province",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_postal_code",
    pdfKey: "mailing_postal_code",
    label: "12.h. Postal Code",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },
  {
    key: "mailing_country",
    pdfKey: "mailing_country",
    label: "12.i. Country",
    type: "text",
    section: "Address History",
    condition: (d) => d.same_mailing_address === "No",
  },

  // ============================================
  // CURRENT ADDRESS DATES (Item 13)
  // ============================================
  {
    key: "current_address_from",
    pdfKey: "current_address_from",
    label: "13.a. Date From (mm/dd/yyyy)",
    type: "text",
    section: "Address History",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "current_address_to",
    pdfKey: "current_address_to",
    label: "13.b. Date To (mm/dd/yyyy)",
    type: "text",
    section: "Address History",
    placeholder: "PRESENT",
  },

  // ============================================
  // PREVIOUS PHYSICAL ADDRESS (Item 14)
  // ============================================
  {
    key: "previous_street",
    pdfKey: "previous_street",
    label: "14.a. Street Number and Name",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_unit_type",
    pdfKey: "previous_unit_type",
    label: "14.b. Unit",
    type: "radio",
    section: "Address History",
    options: [
      { label: "Apt.", value: "Apt", pdfKey: "previous_unit_type_Apt" },
      { label: "Ste.", value: "Ste", pdfKey: "previous_unit_type_Ste" },
      { label: "Flr.", value: "Flr", pdfKey: "previous_unit_type_Flr" },
    ],
  },
  {
    key: "previous_unit_number",
    pdfKey: "previous_unit_number",
    label: "14.c. Apt./Ste./Flr. Number",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_city",
    pdfKey: "previous_city",
    label: "14.d. City or Town",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_state",
    pdfKey: "previous_state",
    label: "14.e. State",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_zip",
    pdfKey: "previous_zip",
    label: "14.f. ZIP Code",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_province",
    pdfKey: "previous_province",
    label: "14.g. Province",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_postal_code",
    pdfKey: "previous_postal_code",
    label: "14.h. Postal Code",
    type: "text",
    section: "Address History",
  },
  {
    key: "previous_country",
    pdfKey: "previous_country",
    label: "14.i. Country",
    type: "text",
    section: "Address History",
  },

  // ============================================
  // PREVIOUS ADDRESS DATES (Item 15)
  // ============================================
  {
    key: "previous_address_from",
    pdfKey: "previous_address_from",
    label: "15.a. Date From (mm/dd/yyyy)",
    type: "text",
    section: "Address History",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "previous_address_to",
    pdfKey: "previous_address_to",
    label: "15.b. Date To (mm/dd/yyyy)",
    type: "text",
    section: "Address History",
    placeholder: "MM/DD/YYYY",
  },

  // ============================================
  // MARRIAGE INFORMATION
  // ============================================
  {
    key: "number_of_marriages",
    pdfKey: "number_of_marriages",
    label: "16. How many times have you been married?",
    type: "text",
    section: "Your Marital Information",
    maxLength: 2,
  },
  {
    key: "marital_status",
    pdfKey: "marital_status",
    label: "17. Current Marital Status",
    type: "radio",
    section: "Your Marital Information",
    options: [
      { label: "Single, Never Married", value: "Single", pdfKey: "marital_status_Single" },
      { label: "Married", value: "Married", pdfKey: "marital_status_Married" },
      { label: "Divorced", value: "Divorced", pdfKey: "marital_status_Divorced" },
      { label: "Widowed", value: "Widowed", pdfKey: "marital_status_Widowed" },
      { label: "Separated", value: "Separated", pdfKey: "marital_status_Separated" },
      { label: "Annulled", value: "Annulled", pdfKey: "marital_status_Annulled" },
    ],
  },
];

export const getInitialFormData = () => {
  const data: Record<string, string> = {};
  formFields.forEach((f) => (data[f.key] = ""));
  return data;
};