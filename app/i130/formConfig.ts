// app/i130/formConfig.ts

export type FieldType = "text" | "radio" | "checkbox" |"date";

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

  // ============================================
  // PAGE 3: SPOUSE & MARRIAGE DETAILS
  // ============================================
  {
    key: "spouse1_date_marriage",
    pdfKey: "Pt2Line18_DateOfMarriage",
    label: "18. Date of Current Marriage (mm/dd/yyyy)",
    type: "text",
    section: "Your Marital Information",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "spouse1_place_city",
    pdfKey: "Pt2Line19a_CityTown",
    label: "19.a. City/Town of Current Marriage",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse1_place_state",
    pdfKey: "Pt2Line19b_State",
    label: "19.b. State",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse1_place_province",
    pdfKey: "Pt2Line19c_Province",
    label: "19.c. Province",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse1_place_country",
    pdfKey: "Pt2Line19d_Country",
    label: "19.d. Country",
    type: "text",
    section: "Your Marital Information",
  },

  // Spouse 1 Full Name
  {
    key: "spouse1_family_name",
   pdfKey: "Pt2Line20a_FamilyName",
    label: "20.a. Family Name (Last Name) - Spouse 1",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse1_given_name",
 pdfKey: "Pt2Line20b_GivenName",
    label: "20.b. Given Name (First Name)",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse1_middle_name",
    pdfKey: "Pt2Line20c_MiddleName",
    label: "20.c. Middle Name",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse1_marriage_end_date",
    pdfKey: "Pt2Line21_DateMarriageEnded",
    label: "21. Date Marriage Ended (if applicable)",
    type: "text",
    section: "Your Marital Information",
    placeholder: "MM/DD/YYYY",
  },

  // Spouse 2 (Previous Spouse)
  {
    key: "spouse2_family_name",
    pdfKey: "Pt2Line22a_FamilyName",
    label: "22.a. Family Name (Last Name) - Spouse 2",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse2_given_name",
    pdfKey: "Pt2Line22b_GivenName",
    label: "22.b. Given Name (First Name)",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse2_middle_name",
    pdfKey: "Pt2Line22c_MiddleName",
    label: "22.c. Middle Name",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse2_marriage_end_date",
    pdfKey: "Pt2Line23_DateMarriageEnded",
    label: "23. Date Marriage Ended - Spouse 2",
    type: "text",
    section: "Your Marital Information",
    placeholder: "MM/DD/YYYY",
  },

  // Spouse 3
  {
    key: "spouse3_family_name",
    pdfKey: "Pt2Line24_FamilyName",
    label: "24. Family Name (Last Name) - Spouse 3",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse3_given_name",
    pdfKey: "Pt2Line24_GivenName",
    label: "24. Given Name (First Name)",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse3_middle_name",
    pdfKey: "Pt2Line24_MiddleName",
    label: "24. Middle Name",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse3_date_of_birth",
    pdfKey: "Pt2Line25_DateofBirth",
    label: "25. Date of Birth - Spouse 3",
    type: "text",
    section: "Your Marital Information",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "spouse3_sex",
    pdfKey: "Pt2Line26",
    label: "26. Sex - Spouse 3",
    type: "radio",
    section: "Your Marital Information",
    options: [
      { label: "Male", value: "Male", pdfKey: "Pt2Line26_Male" },
      { label: "Female", value: "Female", pdfKey: "Pt2Line26_Female" },
    ],
  },

  // Spouse 3 Residence
  {
    key: "spouse3_country_birth",
    pdfKey: "Pt2Line27_CountryofBirth",
    label: "27. Country of Birth - Spouse 3",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse3_city_residence",
    pdfKey: "Pt2Line28_CityTownOrVillageOfResidence",
    label: "28. City/Town/Village of Residence - Spouse 3",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "spouse3_country_residence",
    pdfKey: "Pt2Line29_CountryOfResidence",
    label: "29. Country of Residence - Spouse 3",
    type: "text",
    section: "Your Marital Information",
  },

  // Parent 1
  {
    key: "parent1_family_name",
    pdfKey: "Pt2Line30a_FamilyName",
    label: "30.a. Family Name (Last Name) - Parent 1",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "parent1_given_name",
    pdfKey: "Pt2Line30b_GivenName",
    label: "30.b. Given Name (First Name)",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "parent1_middle_name",
    pdfKey: "Pt2Line30c_MiddleName",
    label: "30.c. Middle Name",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "parent1_date_of_birth",
    pdfKey: "Pt2Line31_DateofBirth",
    label: "31. Date of Birth - Parent 1",
    type: "text",
    section: "Your Marital Information",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "parent1_sex",
    pdfKey: "Pt2Line32",
    label: "32. Sex - Parent 1",
    type: "radio",
    section: "Your Marital Information",
    options: [
      { label: "Male", value: "Male", pdfKey: "Pt2Line32_Male" },
      { label: "Female", value: "Female", pdfKey: "Pt2Line32_Female" },
    ],
  },

  // Parent 1 Residence
  {
    key: "parent1_country_birth",
    pdfKey: "Pt2Line33_CountryofBirth",
    label: "33. Country of Birth - Parent 1",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "parent1_city_residence",
    pdfKey: "Pt2Line34_CityTownOrVillageOfResidence",
    label: "34. City/Town/Village of Residence - Parent 1",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "parent1_country_residence",
    pdfKey: "Pt2Line35_CountryOfResidence",
    label: "35. Country of Residence - Parent 1",
    type: "text",
    section: "Your Marital Information",
  },

  // Citizenship Status
  {
    key: "citizenship_status",
    pdfKey: "Pt2Line36",
    label: "36. I am a (Select only one box):",
    type: "radio",
    section: "Your Marital Information",
    options: [
      { label: "U.S. Citizen", value: "USCitizen", pdfKey: "Pt2Line36_USCitizen" },
      { label: "Lawful Permanent Resident", value: "LPR", pdfKey: "Pt2Line36_LPR" },
    ],
  },
  {
    key: "naturalization_certificate",
    pdfKey: "Pt2Line36",
    label: "Have you obtained a Certificate of Naturalization or Certificate of Citizenship?",
    type: "radio",
    section: "Your Marital Information",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "Pt2Line36_Yes" },
      { label: "No", value: "No", pdfKey: "Pt2Line36_No" },
    ],
  },

  // Certificate Details
  {
    key: "certificate_number",
    pdfKey: "Pt2Line37a_CertificateNumber",
    label: "37.a. Certificate Number",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "certificate_place",
    pdfKey: "Pt2Line37b_PlaceOfIssuance",
    label: "37.b. Place of Issuance",
    type: "text",
    section: "Your Marital Information",
  },
  {
    key: "certificate_date",
    pdfKey: "Pt2Line37c_DateOfIssuance",
    label: "37.c. Date of Issuance (mm/dd/yyyy)",
    type: "text",
    section: "Your Marital Information",
    placeholder: "MM/DD/YYYY",
  },
  // ============================================
// PAGE 4: ADDITIONAL INFORMATION (Petitioner)
// ============================================

// ============================================
// ITEM 40: ADMISSION TO THE U.S.
// ============================================
{
  key: "class_of_admission",
  pdfKey: "Pt2Line40a_ClassOfAdmission",
  label: "40.a. Class of Admission",
  type: "text",
  section: "Your U.S. Entry Information",
  placeholder: "e.g. B2, F1, H1B",
},
{
  key: "date_of_admission",
  pdfKey: "Pt2Line40b_DateOfAdmission",
  label: "40.b. Date of Admission (mm/dd/yyyy)",
  type: "text",
  section: "Your U.S. Entry Information",
  placeholder: "MM/DD/YYYY",
},
{
  key: "city_of_admission",
  pdfKey: "Pt2Line40d_CityOrTown",
  label: "40.d. City or Town of Admission",
  type: "text",
  section: "Your U.S. Entry Information",
},
{
  key: "state_of_admission",
  pdfKey: "Pt2Line40e_State",
  label: "40.e. State of Admission",
  type: "text", // ComboBox in PDF → use text or dropdown
  section: "Your U.S. Entry Information",
},

// ============================================
// ITEM 41: CURRENT EMPLOYMENT ADDRESS (If different)
// ============================================
{
  key: "employment_different_address",
  pdfKey: "employment_different_address",
  label: "41. Is your current employment address different from your current physical address?",
  type: "radio",
  section: "Employment Information",
  options: [
    { label: "Yes", value: "Yes", pdfKey: "Pt2Line41_Yes" },
    { label: "No", value: "No", pdfKey: "Pt2Line41_No" },
  ],
},

// Employment Address (Conditional)
{
  key: "employment_street",
  pdfKey: "Pt2Line41_StreetNumberName",
  label: "41.a. Street Number and Name",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},
{
  key: "employment_unit_type",
  pdfKey: "employment_unit_type",
  label: "41.b. Unit",
  type: "radio",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
  options: [
    { label: "Apt.", value: "Apt", pdfKey: "Pt2Line41_Unit[0]" },
    { label: "Ste.", value: "Ste", pdfKey: "Pt2Line41_Unit[1]" },
    { label: "Flr.", value: "Flr", pdfKey: "Pt2Line41_Unit[2]" },
  ],
},
{
  key: "employment_unit_number",
  pdfKey: "Pt2Line41_AptSteFlrNumber",
  label: "41.c. Apt./Ste./Flr. Number",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},
{
  key: "employment_city",
  pdfKey: "Pt2Line41_CityOrTown",
  label: "41.d. City or Town",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},
{
  key: "employment_state",
  pdfKey: "Pt2Line41_State",
  label: "41.e. State",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},
{
  key: "employment_zip",
  pdfKey: "Pt2Line41_ZipCode",
  label: "41.f. ZIP Code",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
  maxLength: 5,
},
{
  key: "employment_province",
  pdfKey: "Pt2Line41_Province",
  label: "41.g. Province",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},
{
  key: "employment_postal_code",
  pdfKey: "Pt2Line41_PostalCode",
  label: "41.h. Postal Code",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},
{
  key: "employment_country",
  pdfKey: "Pt2Line41_Country",
  label: "41.i. Country",
  type: "text",
  section: "Employment Information",
  condition: (d) => d.employment_different_address === "Yes",
},

// ============================================
// ITEM 42-43: CURRENT EMPLOYMENT DETAILS
// ============================================
{
  key: "current_occupation",
  pdfKey: "Pt2Line42_Occupation",
  label: "42. Current Occupation",
  type: "text",
  section: "Employment Information",
},
{
  key: "employment_start_date",
  pdfKey: "Pt2Line43a_DateFrom",
  label: "43.a. Date Employment Began (mm/dd/yyyy)",
  type: "text",
  section: "Employment Information",
  placeholder: "MM/DD/YYYY",
},
{
  key: "employment_end_date",
  pdfKey: "Pt2Line43b_DateTo",
  label: "43.b. Date Employment Ended (mm/dd/yyyy)",
  type: "text",
  section: "Employment Information",
  placeholder: "MM/DD/YYYY or PRESENT",
},

// ============================================
// ITEM 44-47: PREVIOUS EMPLOYMENT
// ============================================
{
  key: "previous_employer_name",
  pdfKey: "Pt2Line44_EmployerOrOrgName",
  label: "44. Name of Employer or Organization",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_employer_street",
  pdfKey: "Pt2Line45_StreetNumberName",
  label: "45.a. Street Number and Name",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_unit_type",
  pdfKey: "previous_unit_type",
  label: "45.b. Unit",
  type: "radio",
  section: "Previous Employment",
  options: [
    { label: "Apt.", value: "Apt", pdfKey: "Pt2Line45_Unit[0]" },
    { label: "Ste.", value: "Ste", pdfKey: "Pt2Line45_Unit[1]" },
    { label: "Flr.", value: "Flr", pdfKey: "Pt2Line45_Unit[2]" },
  ],
},
{
  key: "previous_unit_number",
  pdfKey: "Pt2Line45_AptSteFlrNumber",
  label: "45.c. Apt./Ste./Flr. Number",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_city",
  pdfKey: "Pt2Line45_CityOrTown",
  label: "45.d. City or Town",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_state",
  pdfKey: "Pt2Line45_State",
  label: "45.e. State",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_zip",
  pdfKey: "Pt2Line45_ZipCode",
  label: "45.f. ZIP Code",
  type: "text",
  section: "Previous Employment",
  maxLength: 5,
},
{
  key: "previous_province",
  pdfKey: "Pt2Line45_Province",
  label: "45.g. Province",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_postal_code",
  pdfKey: "Pt2Line45_PostalCode",
  label: "45.h. Postal Code",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_country",
  pdfKey: "Pt2Line45_Country",
  label: "45.i. Country",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_occupation",
  pdfKey: "Pt2Line46_Occupation",
  label: "46. Occupation",
  type: "text",
  section: "Previous Employment",
},
{
  key: "previous_employment_start",
  pdfKey: "Pt2Line47a_DateFrom",
  label: "47.a. Date From (mm/dd/yyyy)",
  type: "text",
  section: "Previous Employment",
  placeholder: "MM/DD/YYYY",
},
{
  key: "previous_employment_end",
  pdfKey: "Pt2Line47b_DateTo",
  label: "47.b. Date To (mm/dd/yyyy)",
  type: "text",
  section: "Previous Employment",
  placeholder: "MM/DD/YYYY",
},

// ============================================
// ITEM 48: ETHNICITY
// ============================================
{
  key: "ethnicity",
  pdfKey: "ethnicity",
  label: "48. Ethnicity (Select only one box)",
  type: "radio",
  section: "Physical Characteristics",
  options: [
    { label: "Hispanic or Latino", value: "hispanic", pdfKey: "Pt3Line1_Ethnicity[0]" },
    { label: "Not Hispanic or Latino", value: "not_hispanic", pdfKey: "Pt3Line1_Ethnicity[1]" },
  ],
},

// ============================================
// ITEM 49: RACE
// ============================================
{
  key: "race",
  pdfKey: "race",
  label: "49. Race (Select all that apply)",
  type: "checkbox",
  section: "Physical Characteristics",
  options: [
    { label: "White", value: "white", pdfKey: "Pt3Line2_Race_White" },
    { label: "Asian", value: "asian", pdfKey: "Pt3Line2_Race_Asian" },
    { label: "Black or African American", value: "black", pdfKey: "Pt3Line2_Race_Black" },
    { label: "American Indian or Alaska Native", value: "native", pdfKey: "Pt3Line2_Race_AmericanIndianAlaskaNative" },
    { label: "Native Hawaiian or Other Pacific Islander", value: "pacific", pdfKey: "Pt3Line2_Race_NativeHawaiianOtherPacificIslander" },
  ],
},

// ============================================
// ITEM 50: HEIGHT
// ============================================
{
  key: "height_feet",
  pdfKey: "Pt3Line3_HeightFeet",
  label: "50.a. Feet",
  type: "text",
  section: "Physical Characteristics",
  placeholder: "5",
  maxLength: 1,
},
{
  key: "height_inches",
  pdfKey: "Pt3Line3_HeightInches",
  label: "50.b. Inches",
  type: "text",
  section: "Physical Characteristics",
  placeholder: "10",
  maxLength: 2,
},

// ============================================
// ITEM 51: WEIGHT
// ============================================
{
  key: "weight_pounds",
  pdfKey: "weight_pounds",
  label: "51. Weight (in pounds)",
  type: "text",
  section: "Physical Characteristics",
  placeholder: "150",
  maxLength: 3,
  // Note: PDF splits into 3 fields — handle in backend
},

// ============================================
// ITEM 52: EYE COLOR
// ============================================
{
  key: "eye_color",
  pdfKey: "eye_color",
  label: "52. Eye Color (Select only one box)",
  type: "radio",
  section: "Physical Characteristics",
  options: [
    { label: "Black", value: "black", pdfKey: "Pt3Line5_EyeColor[0]" },
    { label: "Blue", value: "blue", pdfKey: "Pt3Line5_EyeColor[1]" },
    { label: "Brown", value: "brown", pdfKey: "Pt3Line5_EyeColor[2]" },
    { label: "Gray", value: "gray", pdfKey: "Pt3Line5_EyeColor[3]" },
    { label: "Green", value: "green", pdfKey: "Pt3Line5_EyeColor[4]" },
    { label: "Hazel", value: "hazel", pdfKey: "Pt3Line5_EyeColor[5]" },
    { label: "Maroon", value: "maroon", pdfKey: "Pt3Line5_EyeColor[6]" },
    { label: "Pink", value: "pink", pdfKey: "Pt3Line5_EyeColor[7]" },
    { label: "Unknown/Other", value: "other", pdfKey: "Pt3Line5_EyeColor[8]" },
  ],
},

 // ============================================
  // PAGE 4: ADDITIONAL INFORMATION
  // ============================================
  {
    key: "Pt2Line40a_ClassOfAdmission",
    label: "40.a. Class of Admission",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line40a_ClassOfAdmission",
    placeholder: "e.g., B-2, F-1, etc.",
  },
  {
    key: "Pt2Line40b_DateOfAdmission",
    label: "40.b. Date of Admission (mm/dd/yyyy)",
    section: "Immigration & Employment Information",
    type: "date",
    pdfKey: "Pt2Line40b_DateOfAdmission",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "Pt2Line40d_CityOrTown",
    label: "40.d. Place of Admission - City or Town",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line40d_CityOrTown",
    placeholder: "City or Town",
  },
  {
    key: "Pt2Line40e_State",
    label: "40.e. State",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line40e_State",
    placeholder: "State",
    maxLength: 2,
  },
  {
    key: "Pt2Line41_LPR",
    label: "41. Did you gain lawful permanent resident status through marriage to a U.S. citizen or lawful permanent resident?",
    section: "Immigration & Employment Information",
    type: "radio",
    pdfKey: "Pt2Line41",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "Pt2Line41_Yes" },
      { label: "No", value: "No", pdfKey: "Pt2Line41_No" },
    ],
  },
  {
    key: "Pt2Line42_Occupation",
    label: "42. Your Current Occupation (Employer 1)",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line42_Occupation",
    placeholder: "Your occupation",
  },
  {
    key: "Pt2Line43a_DateFrom",
    label: "43.a. Date From (mm/dd/yyyy)",
    section: "Immigration & Employment Information",
    type: "date",
    pdfKey: "Pt2Line43a_DateFrom",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "Pt2Line43b_DateTo",
    label: "43.b. Date To (mm/dd/yyyy)",
    section: "Immigration & Employment Information",
    type: "date",
    pdfKey: "Pt2Line43b_DateTo",
    placeholder: "MM/DD/YYYY or PRESENT",
  },
  {
    key: "Pt2Line44_EmployerOrOrgName",
    label: "44. Name of Employer/Company (Employer 1)",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line44_EmployerOrOrgName",
    placeholder: "Company name",
  },
  {
    key: "Pt2Line45_StreetNumberName",
    label: "45. Employer Address - Street Number and Name",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line45_StreetNumberName",
    placeholder: "Street address",
  },
  {
    key: "Pt2Line45_CityOrTown",
    label: "City or Town",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line45_CityOrTown",
    placeholder: "City",
  },
  {
    key: "Pt2Line45_State",
    label: "State",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line45_State",
    placeholder: "State",
    maxLength: 2,
  },
  {
    key: "Pt2Line45_ZipCode",
    label: "ZIP Code",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line45_ZipCode",
    placeholder: "ZIP",
    maxLength: 10,
  },
  {
    key: "Pt2Line45_Country",
    label: "Country",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line45_Country",
    placeholder: "Country",
  },
  {
    key: "Pt2Line46_Occupation",
    label: "46. Your Occupation (Employer 2)",
    section: "Immigration & Employment Information",
    type: "text",
    pdfKey: "Pt2Line46_Occupation",
    placeholder: "Your occupation",
  },
  {
    key: "Pt2Line47a_DateFrom",
    label: "47.a. Date From (mm/dd/yyyy)",
    section: "Immigration & Employment Information",
    type: "date",
    pdfKey: "Pt2Line47a_DateFrom",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "Pt2Line47b_DateTo",
    label: "47.b. Date To (mm/dd/yyyy)",
    section: "Immigration & Employment Information",
    type: "date",
    pdfKey: "Pt2Line47b_DateTo",
    placeholder: "MM/DD/YYYY or PRESENT",
  },

  // ============================================
  // PART 3: BIOGRAPHIC INFORMATION
  // ============================================
  {
    key: "Pt3Line1_Ethnicity",
    label: "1. Ethnicity",
    section: "Biographic Information",
    type: "radio",
    pdfKey: "Pt3Line1_Ethnicity",
    options: [
      { label: "Hispanic or Latino", value: "Hispanic", pdfKey: "Pt3Line1_Ethnicity[0]" },
      { label: "Not Hispanic or Latino", value: "NotHispanic", pdfKey: "Pt3Line1_Ethnicity[1]" },
    ],
  },
  {
    key: "Pt3Line2_Race_White",
    label: "2. Race - White",
    section: "Biographic Information",
    type: "checkbox",
    pdfKey: "Pt3Line2_Race_White",
  },
  {
    key: "Pt3Line2_Race_Asian",
    label: "Asian",
    section: "Biographic Information",
    type: "checkbox",
    pdfKey: "Pt3Line2_Race_Asian",
  },
  {
    key: "Pt3Line2_Race_Black",
    label: "Black or African American",
    section: "Biographic Information",
    type: "checkbox",
    pdfKey: "Pt3Line2_Race_Black",
  },
  {
    key: "Pt3Line2_Race_AmericanIndianAlaskaNative",
    label: "American Indian or Alaska Native",
    section: "Biographic Information",
    type: "checkbox",
    pdfKey: "Pt3Line2_Race_AmericanIndianAlaskaNative",
  },
  {
    key: "Pt3Line2_Race_NativeHawaiianOtherPacificIslander",
    label: "Native Hawaiian or Other Pacific Islander",
    section: "Biographic Information",
    type: "checkbox",
    pdfKey: "Pt3Line2_Race_NativeHawaiianOtherPacificIslander",
  },
  {
    key: "Pt3Line3_HeightFeet",
    label: "3. Height - Feet",
    section: "Biographic Information",
    type: "text",
    pdfKey: "Pt3Line3_HeightFeet",
    placeholder: "Feet",
    maxLength: 1,
  },
  {
    key: "Pt3Line3_HeightInches",
    label: "Inches",
    section: "Biographic Information",
    type: "text",
    pdfKey: "Pt3Line3_HeightInches",
    placeholder: "Inches",
    maxLength: 2,
  },
  {
    key: "Pt3Line5_EyeColor",
    label: "5. Eye Color",
    section: "Biographic Information",
    type: "radio",
    pdfKey: "Pt3Line5_EyeColor",
    options: [
      { label: "Black", value: "Black", pdfKey: "Pt3Line5_EyeColor[0]" },
      { label: "Blue", value: "Blue", pdfKey: "Pt3Line5_EyeColor[1]" },
      { label: "Brown", value: "Brown", pdfKey: "Pt3Line5_EyeColor[2]" },
      { label: "Gray", value: "Gray", pdfKey: "Pt3Line5_EyeColor[3]" },
      { label: "Green", value: "Green", pdfKey: "Pt3Line5_EyeColor[4]" },
      { label: "Hazel", value: "Hazel", pdfKey: "Pt3Line5_EyeColor[5]" },
      { label: "Maroon", value: "Maroon", pdfKey: "Pt3Line5_EyeColor[6]" },
      { label: "Pink", value: "Pink", pdfKey: "Pt3Line5_EyeColor[7]" },
      { label: "Unknown/Other", value: "Unknown", pdfKey: "Pt3Line5_EyeColor[8]" },
    ],
  },
  // =============================================
  // PAGE 5 - PART 3: Biographic Information
  // =============================================
  {
    key: "hairColor",
    label: "Hair Color",
    type: "radio",
    section: "Part 3. Biographic Information",
    pdfKey: "hairColor",
    options: [
      { label: "Black", value: "black", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[0]" },
      { label: "Brown", value: "brown", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[1]" },
      { label: "Blonde", value: "blonde", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[2]" },
      { label: "Gray", value: "gray", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[3]" },
      { label: "White", value: "white", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[4]" },
      { label: "Red", value: "red", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[5]" },
      { label: "Sandy", value: "sandy", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[6]" },
      { label: "Bald", value: "bald", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[7]" },
      { label: "Unknown", value: "unknown", pdfKey: "form1[0].#subform[4].Pt3Line6_HairColor[8]" },
    ],
  },

  // =============================================
  // PAGE 5 - PART 4: Information About Beneficiary
  // =============================================
  {
    key: "alienNumber",
    label: "1. Alien Registration Number (A-Number) (if any)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].#area[6].Pt4Line1_AlienNumber[0]",
    placeholder: "A-XXXXXXXXX",
    maxLength: 12,
  },
  {
    key: "uscisOnlineNumber",
    label: "2. USCIS Online Account Number (if any)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].#area[7].Pt4Line2_USCISOnlineActNumber[0]",
    placeholder: "USCIS Account Number",
    maxLength: 20,
  },
  {
    key: "ssn",
    label: "3. U.S. Social Security Number (if any)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line3_SSN[0]",
    placeholder: "XXX-XX-XXXX",
    maxLength: 11,
  },

  // Full Name
  {
    key: "familyName",
    label: "4.a. Family Name (Last Name)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line4a_FamilyName[0]",
    placeholder: "Last Name",
  },
  {
    key: "givenName",
    label: "4.b. Given Name (First Name)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line4b_GivenName[0]",
    placeholder: "First Name",
  },
  {
    key: "middleName",
    label: "4.c. Middle Name",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line4c_MiddleName[0]",
    placeholder: "Middle Name (if applicable)",
  },

  // Other Names Used
  {
    key: "otherFamilyName",
    label: "5.a. Other Family Name Used (if any)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].P4Line5a_FamilyName[0]",
    placeholder: "Other Last Name",
  },
  {
    key: "otherGivenName",
    label: "5.b. Other Given Name Used (if any)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line5b_GivenName[0]",
    placeholder: "Other First Name",
  },
  {
    key: "otherMiddleName",
    label: "5.c. Other Middle Name Used (if any)",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line5c_MiddleName[0]",
    placeholder: "Other Middle Name",
  },

  // Birth Information
  {
    key: "cityOfBirth",
    label: "7. City/Town/Village of Birth",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line7_CityTownOfBirth[0]",
    placeholder: "City of Birth",
  },
  {
    key: "countryOfBirth",
    label: "8. Country of Birth",
    type: "text",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line8_CountryOfBirth[0]",
    placeholder: "Country of Birth",
  },
  {
    key: "dateOfBirth",
    label: "9. Date of Birth (mm/dd/yyyy)",
    type: "date",
    section: "Part 4. Information About Your Relative",
    pdfKey: "form1[0].#subform[4].Pt4Line9_DateOfBirth[0]",
    placeholder: "MM/DD/YYYY",
  },

  // Gender
  {
    key: "gender",
    label: "Gender",
    type: "radio",
    section: "Part 4. Information About Your Relative",
    pdfKey: "gender",
    options: [
      { label: "Male", value: "male", pdfKey: "form1[0].#subform[4].Pt4Line9_Male[0]" },
      { label: "Female", value: "female", pdfKey: "form1[0].#subform[4].Pt4Line9_Female[0]" },
    ],
  },

  // Has this person ever been in the U.S.?
  {
    key: "everInUS",
    label: "10. Has this person ever been in the United States?",
    type: "radio",
    section: "Part 4. Information About Your Relative",
    pdfKey: "everInUS",
    options: [
      { label: "Yes", value: "yes", pdfKey: "form1[0].#subform[4].Pt4Line10_Yes[0]" },
      { label: "No", value: "no", pdfKey: "form1[0].#subform[4].Pt4Line10_No[0]" },
      { label: "Unknown", value: "unknown", pdfKey: "form1[0].#subform[4].Pt4Line10_Unknown[0]" },
    ],
  },

  // Current Physical Address
  {
    key: "currentStreet",
    label: "11. Current Physical Address - Street Number and Name",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_StreetNumberName[0]",
    placeholder: "Street Address",
  },
  {
    key: "currentUnitType",
    label: "Unit Type",
    type: "radio",
    section: "Part 4. Current Physical Address",
    pdfKey: "currentUnitType",
    options: [
      { label: "Apt.", value: "apt", pdfKey: "form1[0].#subform[4].Pt4Line11_Unit[0]" },
      { label: "Ste.", value: "ste", pdfKey: "form1[0].#subform[4].Pt4Line11_Unit[1]" },
      { label: "Flr.", value: "flr", pdfKey: "form1[0].#subform[4].Pt4Line11_Unit[2]" },
    ],
  },
  {
    key: "currentAptNumber",
    label: "Apt/Ste/Flr Number",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_AptSteFlrNumber[0]",
    placeholder: "Number",
  },
  {
    key: "currentCity",
    label: "City or Town",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_CityOrTown[0]",
    placeholder: "City",
  },
  {
    key: "currentState",
    label: "State (if in U.S.)",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_State[0]",
    placeholder: "State",
  },
  {
    key: "currentZipCode",
    label: "ZIP Code",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_ZipCode[0]",
    placeholder: "ZIP Code",
    maxLength: 10,
  },
  {
    key: "currentProvince",
    label: "Province (if outside U.S.)",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_Province[0]",
    placeholder: "Province",
  },
  {
    key: "currentPostalCode",
    label: "Postal Code (if outside U.S.)",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_PostalCode[0]",
    placeholder: "Postal Code",
  },
  {
    key: "currentCountry",
    label: "Country",
    type: "text",
    section: "Part 4. Current Physical Address",
    pdfKey: "form1[0].#subform[4].Pt4Line11_Country[0]",
    placeholder: "Country",
  },

  // Address Where Your Relative Intends to Live (in U.S.)
  {
    key: "futureStreet",
    label: "12.a. Street Number and Name",
    type: "text",
    section: "Part 4. Address Where Your Relative Intends to Live",
    pdfKey: "form1[0].#subform[4].Pt4Line12a_StreetNumberName[0]",
    placeholder: "Future Street Address",
  },
  {
    key: "futureUnitType",
    label: "12.b. Unit Type",
    type: "radio",
    section: "Part 4. Address Where Your Relative Intends to Live",
    pdfKey: "futureUnitType",
    options: [
      { label: "Apt.", value: "apt", pdfKey: "form1[0].#subform[4].Pt4Line12b_Unit[0]" },
      { label: "Ste.", value: "ste", pdfKey: "form1[0].#subform[4].Pt4Line12b_Unit[1]" },
      { label: "Flr.", value: "flr", pdfKey: "form1[0].#subform[4].Pt4Line12b_Unit[2]" },
    ],
  },
  {
    key: "futureAptNumber",
    label: "Apt/Ste/Flr Number",
    type: "text",
    section: "Part 4. Address Where Your Relative Intends to Live",
    pdfKey: "form1[0].#subform[4].Pt4Line12b_AptSteFlrNumber[0]",
    placeholder: "Number",
  },
  {
    key: "futureCity",
    label: "12.c. City or Town",
    type: "text",
    section: "Part 4. Address Where Your Relative Intends to Live",
    pdfKey: "form1[0].#subform[4].Pt4Line12c_CityOrTown[0]",
    placeholder: "City",
  },
  {
    key: "futureState",
    label: "12.d. State",
    type: "text",
    section: "Part 4. Address Where Your Relative Intends to Live",
    pdfKey: "form1[0].#subform[4].Pt4Line12d_State[0]",
    placeholder: "State",
  },
  {
    key: "futureZipCode",
    label: "12.e. ZIP Code",
    type: "text",
    section: "Part 4. Address Where Your Relative Intends to Live",
    pdfKey: "form1[0].#subform[4].Pt4Line12e_ZipCode[0]",
    placeholder: "ZIP Code",
    maxLength: 10,
  },

  // Foreign Address (if not intending to live in U.S.)
  {
    key: "foreignStreet",
    label: "13. Street Number and Name",
    type: "text",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "form1[0].#subform[4].Pt4Line13_StreetNumberName[0]",
    placeholder: "Street Address",
  },
  {
    key: "foreignUnitType",
    label: "Unit Type",
    type: "radio",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "foreignUnitType",
    options: [
      { label: "Apt.", value: "apt", pdfKey: "form1[0].#subform[4].Pt4Line13_Unit[0]" },
      { label: "Ste.", value: "ste", pdfKey: "form1[0].#subform[4].Pt4Line13_Unit[1]" },
      { label: "Flr.", value: "flr", pdfKey: "form1[0].#subform[4].Pt4Line13_Unit[2]" },
    ],
  },
  {
    key: "foreignAptNumber",
    label: "Apt/Ste/Flr Number",
    type: "text",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "form1[0].#subform[4].Pt4Line13_AptSteFlrNumber[0]",
    placeholder: "Number",
  },
  {
    key: "foreignCity",
    label: "City or Town",
    type: "text",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "form1[0].#subform[4].Pt4Line13_CityOrTown[0]",
    placeholder: "City",
  },
  {
    key: "foreignProvince",
    label: "Province",
    type: "text",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "form1[0].#subform[4].Pt4Line13_Province[0]",
    placeholder: "Province",
  },
  {
    key: "foreignPostalCode",
    label: "Postal Code",
    type: "text",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "form1[0].#subform[4].Pt4Line13_PostalCode[0]",
    placeholder: "Postal Code",
  },
  {
    key: "foreignCountry",
    label: "Country",
    type: "text",
    section: "Part 4. Address Abroad (if not immigrating to U.S.)",
    pdfKey: "form1[0].#subform[4].Pt4Line13_Country[0]",
    placeholder: "Country",
  },

  // Contact Information
  {
    key: "daytimePhone",
    label: "14. Daytime Telephone Number",
    type: "text",
    section: "Part 4. Contact Information",
    pdfKey: "form1[0].#subform[4].Pt4Line14_DaytimePhoneNumber[0]",
    placeholder: "+1 (XXX) XXX-XXXX",
  },

  // =============================================
  // PAGE 6 - Continuation of Part 4
  // =============================================
  {
    key: "mobilePhone",
    label: "15. Mobile Telephone Number (if any)",
    type: "text",
    section: "Part 4. Contact Information",
    pdfKey: "form1[0].#subform[5].Pt4Line15_MobilePhoneNumber[0]",
    placeholder: "+1 (XXX) XXX-XXXX",
  },
  {
    key: "email",
    label: "16. Email Address (if any)",
    type: "text",
    section: "Part 4. Contact Information",
    pdfKey: "form1[0].#subform[5].Pt4Line16_EmailAddress[0]",
    placeholder: "email@example.com",
  },

  // Marital Information
  {
    key: "numberOfMarriages",
    label: "17. How many times has your relative been married?",
    type: "text",
    section: "Part 4. Marital Information",
    pdfKey: "form1[0].#subform[5].Pt4Line17_NumberofMarriages[0]",
    placeholder: "Number",
    maxLength: 2,
  },
  {
    key: "maritalStatus",
    label: "18. Current Marital Status",
    type: "radio",
    section: "Part 4. Marital Information",
    pdfKey: "maritalStatus",
    options: [
      { label: "Single, Never Married", value: "single", pdfKey: "form1[0].#subform[5].Pt4Line18_MaritalStatus[3]" },
      { label: "Married", value: "married", pdfKey: "form1[0].#subform[5].Pt4Line18_MaritalStatus[0]" },
      { label: "Divorced", value: "divorced", pdfKey: "form1[0].#subform[5].Pt4Line18_MaritalStatus[2]" },
      { label: "Widowed", value: "widowed", pdfKey: "form1[0].#subform[5].Pt4Line18_MaritalStatus[1]" },
      { label: "Separated", value: "separated", pdfKey: "form1[0].#subform[5].Pt4Line18_MaritalStatus[4]" },
      { label: "Marriage Annulled", value: "annulled", pdfKey: "form1[0].#subform[5].Pt4Line18_MaritalStatus[5]" },
    ],
  },

  // Current Marriage Information
  {
    key: "dateOfMarriage",
    label: "19. Date of Current Marriage (mm/dd/yyyy)",
    type: "date",
    section: "Part 4. Current Marriage Information",
    pdfKey: "form1[0].#subform[5].Pt4Line19_DateOfMarriage[0]",
    placeholder: "MM/DD/YYYY",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "marriageCity",
    label: "20.a. Place of Current Marriage - City or Town",
    type: "text",
    section: "Part 4. Current Marriage Information",
    pdfKey: "form1[0].#subform[5].Pt4Line20a_CityTown[0]",
    placeholder: "City/Town",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "marriageState",
    label: "20.b. State (if in U.S.)",
    type: "text",
    section: "Part 4. Current Marriage Information",
    pdfKey: "form1[0].#subform[5].Pt4Line20b_State[0]",
    placeholder: "State",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "marriageProvince",
    label: "20.c. Province (if outside U.S.)",
    type: "text",
    section: "Part 4. Current Marriage Information",
    pdfKey: "form1[0].#subform[5].Pt4Line20c_Province[0]",
    placeholder: "Province",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "marriageCountry",
    label: "20.d. Country",
    type: "text",
    section: "Part 4. Current Marriage Information",
    pdfKey: "form1[0].#subform[5].Pt4Line20d_Country[0]",
    placeholder: "Country",
    condition: (data) => data.maritalStatus === "married",
  },

  // Names of Prior Spouses
  {
    key: "priorSpouseFamilyName",
    label: "16.a. Prior Spouse's Family Name (Last Name)",
    type: "text",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line16a_FamilyName[0]",
    placeholder: "Last Name",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 1,
  },
  {
    key: "priorSpouseGivenName",
    label: "16.b. Prior Spouse's Given Name (First Name)",
    type: "text",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line16b_GivenName[0]",
    placeholder: "First Name",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 1,
  },
  {
    key: "priorSpouseMiddleName",
    label: "16.c. Prior Spouse's Middle Name",
    type: "text",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line16c_MiddleName[0]",
    placeholder: "Middle Name",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 1,
  },
  {
    key: "priorMarriageEndDate",
    label: "17. Date Marriage Ended (mm/dd/yyyy)",
    type: "date",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line17_DateMarriageEnded[0]",
    placeholder: "MM/DD/YYYY",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 1,
  },

  // Additional Prior Spouse
  {
    key: "priorSpouse2FamilyName",
    label: "18.a. Additional Prior Spouse's Family Name",
    type: "text",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line18a_FamilyName[0]",
    placeholder: "Last Name",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 2,
  },
  {
    key: "priorSpouse2GivenName",
    label: "18.b. Additional Prior Spouse's Given Name",
    type: "text",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line18b_GivenName[0]",
    placeholder: "First Name",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 2,
  },
  {
    key: "priorSpouse2MiddleName",
    label: "18.c. Additional Prior Spouse's Middle Name",
    type: "text",
    section: "Part 4. Names of Prior Spouses",
    pdfKey: "form1[0].#subform[5].Pt4Line18c_MiddleName[0]",
    placeholder: "Middle Name",
    condition: (data) => parseInt(data.numberOfMarriages || "0") > 2,
  },

  // Information About Your Relative's Parents - Parent 1
  {
    key: "parent1FamilyName",
    label: "30.a. Parent 1's Family Name (Last Name)",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line30a_FamilyName[0]",
    placeholder: "Last Name",
  },
  {
    key: "parent1GivenName",
    label: "30.b. Parent 1's Given Name (First Name)",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line30b_GivenName[0]",
    placeholder: "First Name",
  },
  {
    key: "parent1MiddleName",
    label: "30.c. Parent 1's Middle Name",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line30c_MiddleName[0]",
    placeholder: "Middle Name",
  },
  {
    key: "parent1Relationship",
    label: "31. Parent 1's Relationship",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line31_Relationship[0]",
    placeholder: "e.g., Mother, Father",
  },
  {
    key: "parent1DateOfBirth",
    label: "32. Parent 1's Date of Birth (mm/dd/yyyy)",
    type: "date",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line32_DateOfBirth[0]",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "parent1CountryOfBirth",
    label: "49. Parent 1's Country of Birth",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line49_CountryOfBirth[0]",
    placeholder: "Country",
  },

  // Parent 2
  {
    key: "parent2FamilyName",
    label: "34.a. Parent 2's Family Name (Last Name)",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line34a_FamilyName[0]",
    placeholder: "Last Name",
  },
  {
    key: "parent2GivenName",
    label: "34.b. Parent 2's Given Name (First Name)",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line34b_GivenName[0]",
    placeholder: "First Name",
  },
  {
    key: "parent2MiddleName",
    label: "34.c. Parent 2's Middle Name",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line34c_MiddleName[0]",
    placeholder: "Middle Name",
  },
  {
    key: "parent2Relationship",
    label: "35. Parent 2's Relationship",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line35_Relationship[0]",
    placeholder: "e.g., Mother, Father",
  },
  {
    key: "parent2DateOfBirth",
    label: "36. Parent 2's Date of Birth (mm/dd/yyyy)",
    type: "date",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line36_DateOfBirth[0]",
    placeholder: "MM/DD/YYYY",
  },
  {
    key: "parent2CountryOfBirth",
    label: "37. Parent 2's Country of Birth",
    type: "text",
    section: "Part 4. Information About Your Relative's Parents",
    pdfKey: "form1[0].#subform[5].Pt4Line37_CountryOfBirth[0]",
    placeholder: "Country",
  },

  // Current Spouse Information
  {
    key: "spouseFamilyName",
    label: "38.a. Current Spouse's Family Name (Last Name)",
    type: "text",
    section: "Part 4. Information About Your Relative's Current Spouse",
    pdfKey: "form1[0].#subform[5].Pt4Line38a_FamilyName[0]",
    placeholder: "Last Name",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "spouseGivenName",
    label: "38.b. Current Spouse's Given Name (First Name)",
    type: "text",
    section: "Part 4. Information About Your Relative's Current Spouse",
    pdfKey: "form1[0].#subform[5].Pt4Line38b_GivenName[0]",
    placeholder: "First Name",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "spouseMiddleName",
    label: "38.c. Current Spouse's Middle Name",
    type: "text",
    section: "Part 4. Information About Your Relative's Current Spouse",
    pdfKey: "form1[0].#subform[5].Pt4Line38c_MiddleName[0]",
    placeholder: "Middle Name",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "spouseRelationship",
    label: "39. Relationship",
    type: "text",
    section: "Part 4. Information About Your Relative's Current Spouse",
    pdfKey: "form1[0].#subform[5].Pt4Line39_Relationship[0]",
    placeholder: "Spouse",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "spouseDateOfBirth",
    label: "40. Current Spouse's Date of Birth (mm/dd/yyyy)",
    type: "date",
    section: "Part 4. Information About Your Relative's Current Spouse",
    pdfKey: "form1[0].#subform[5].Pt4Line40_DateOfBirth[0]",
    placeholder: "MM/DD/YYYY",
    condition: (data) => data.maritalStatus === "married",
  },
  {
    key: "spouseCountryOfBirth",
    label: "41. Current Spouse's Country of Birth",
    type: "text",
    section: "Part 4. Information About Your Relative's Current Spouse",
    pdfKey: "form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]",
    placeholder: "Country",
    condition: (data) => data.maritalStatus === "married",
  },
];

export const getInitialFormData = () => {
  const data: Record<string, string> = {};
  formFields.forEach((f) => (data[f.key] = ""));
  return data;
};