// C:\Users\HP\Desktop\arachnie\Arachnie\lib\formConfig\i864.ts

import type { Field } from "./types";

export const formId = "i864";
export const formTitle = "Form I-864";
export const formSubtitle = "Affidavit of Support Under Section 213A of the INA";

export const formFields: Field[] = [
 
{
  key: "g28_uscis_account",
  pdfKey: "g28_uscis_account",
  label: "USCIS Online Account Number (Attorney)",
  type: "text",
  section: "Attorney or Accredited Representative",
  condition: (d) => !!d.g28_attached,  // Same logic – works everywhere
},

  // ============================================
  // PART 1. Basis for Filing Affidavit of Support
  // ============================================
  {
    key: "p1_relationship",
    pdfKey: "p1_relationship",
    label: "1. I am filing this affidavit of support as:",
    type: "radio",
    section: "Part 1. Basis for Filing Affidavit of Support",
    options: [
      { label: "The petitioner", value: "petition", pdfKey: "p1_relationship_petition" },
      { label: "A joint sponsor", value: "joint_5percent", pdfKey: "p1_relationship_joint_5percent" },
      { label: "A 5% owner of the entity", value: "joint_entity", pdfKey: "p1_relationship_joint_entity" },
      { label: "Substitute sponsor", value: "substitute", pdfKey: "p1_relationship_substitute" },
      { label: "Household member", value: "household_member", pdfKey: "p1_relationship_household_member" },
      { label: "Relative (other)", value: "relative", pdfKey: "p1_relationship_relative" },
    ],
  },
  {
    key: "p1_entity_name",
    pdfKey: "p1_relationship_detail_entity",
    label: "Name of the entity (if 5% owner)",
    type: "text",
    section: "Part 1. Basis for Filing Affidavit of Support",
    condition: (d) => d.p1_relationship === "joint_entity",
  },
  {
    key: "p1_relative_relationship",
    pdfKey: "p1_relationship_detail_relative",
    label: "Relationship to the intending immigrant (if relative)",
    type: "text",
    section: "Part 1. Basis for Filing Affidavit of Support",
    condition: (d) => d.p1_relationship === "relative",
  },
  {
    key: "p1_other_relationship",
    pdfKey: "p1_relationship_detail_other",
    label: "Other relationship (specify)",
    type: "text",
    section: "Part 1. Basis for Filing Affidavit of Support",
    condition: (d) => ["household_member", "relative"].includes(d.p1_relationship),
  },
  {
    key: "p1_legal_guardian",
    pdfKey: "p1_legal_guardian",
    label: "I am the legal guardian of the intending immigrant",
    type: "radio",
    section: "Part 1. Basis for Filing Affidavit of Support",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "p1_legal_guardian_yes" },
      { label: "No", value: "No", pdfKey: "p1_legal_guardian_no" },
    ],
  },

  // ============================================
  // PART 4. Sponsor's Information
  // ============================================
  {
    key: "sponsor_family_name",
    pdfKey: "sponsor_family_name",
    label: "1.a. Family Name (Last Name)",
    type: "text",
    section: "Part 4. Sponsor Information",
    required: true,
  },
  {
    key: "sponsor_given_name",
    pdfKey: "sponsor_given_name",
    label: "1.b. Given Name (First Name)",
    type: "text",
    section: "Part 4. Sponsor Information",
    required: true,
  },
  {
    key: "sponsor_middle_name",
    pdfKey: "sponsor_middle_name",
    label: "1.c. Middle Name",
    type: "text",
    section: "Part 4. Sponsor Information",
  },

  // Mailing Address
  {
    key: "sponsor_in_care_of",
    pdfKey: "sponsor_in_care_of",
    label: "2.a. In Care Of Name",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_street",
    pdfKey: "sponsor_street",
    label: "2.b. Street Number and Name",
    type: "text",
    section: "Part 4. Sponsor Information",
    required: true,
  },
  {
    key: "sponsor_unit_type",
    pdfKey: "sponsor_unit_type",
    label: "2.c. Unit",
    type: "radio",
    section: "Part 4. Sponsor Information",
    options: [
      { label: "Apt.", value: "Apt", pdfKey: "sponsor_unit_apt" },
      { label: "Ste.", value: "Ste", pdfKey: "sponsor_unit_ste" },
      { label: "Flr.", value: "Flr", pdfKey: "sponsor_unit_flr" },
    ],
  },
  {
    key: "sponsor_unit_number",
    pdfKey: "sponsor_unit_number",
    label: "2.d. Apt./Ste./Flr. Number",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_city",
    pdfKey: "sponsor_city",
    label: "2.e. City or Town",
    type: "text",
    section: "Part 4. Sponsor Information",
    required: true,
  },
  {
    key: "sponsor_state",
    pdfKey: "sponsor_state",
    label: "2.f. State",
    type: "combo",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_zip",
    pdfKey: "sponsor_zip",
    label: "2.g. ZIP Code",
    type: "text",
    section: "Part 4. Sponsor Information",
    maxLength: 5,
  },
  {
    key: "sponsor_province",
    pdfKey: "sponsor_province",
    label: "2.h. Province",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_postal_code",
    pdfKey: "sponsor_postal_code",
    label: "2.i. Postal Code",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_country",
    pdfKey: "sponsor_country",
    label: "2.j. Country",
    type: "text",
    section: "Part 4. Sponsor Information",
    required: true,
  },

  // Is U.S. Citizen?
  {
    key: "sponsor_is_us_citizen",
    pdfKey: "sponsor_is_us_citizen",
    label: "3. Are you a U.S. citizen?",
    type: "radio",
    section: "Part 4. Sponsor Information",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "sponsor_is_us_citizen_yes" },
      { label: "No", value: "No", pdfKey: "sponsor_is_us_citizen_no" },
    ],
  },

  // Mailing Address (if different)
  {
    key: "sponsor_mailing_street",
    pdfKey: "sponsor_mailing_street",
    label: "4.a. Street Number and Name (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_mailing_unit_type",
    pdfKey: "sponsor_mailing_unit_type",
    label: "4.b. Unit (Mailing)",
    type: "radio",
    section: "Part 4. Sponsor Information",
    options: [
      { label: "Apt.", value: "Apt", pdfKey: "sponsor_mailing_unit_apt" },
      { label: "Ste.", value: "Ste", pdfKey: "sponsor_mailing_unit_ste" },
      { label: "Flr.", value: "Flr", pdfKey: "sponsor_mailing_unit_flr" },
    ],
  },
  {
    key: "sponsor_mailing_unit_number",
    pdfKey: "sponsor_mailing_unit_number",
    label: "4.c. Apt./Ste./Flr. Number (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_mailing_city",
    pdfKey: "sponsor_mailing_city",
    label: "4.d. City or Town (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_mailing_state",
    pdfKey: "sponsor_mailing_state",
    label: "4.e. State (Mailing)",
    type: "combo",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_mailing_zip",
    pdfKey: "sponsor_mailing_zip",
    label: "4.f. ZIP Code (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
    maxLength: 5,
  },
  {
    key: "sponsor_mailing_province",
    pdfKey: "sponsor_mailing_province",
    label: "4.g. Province (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_mailing_postal_code",
    pdfKey: "sponsor_mailing_postal_code",
    label: "4.h. Postal Code (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_mailing_country",
    pdfKey: "sponsor_mailing_country",
    label: "4.i. Country (Mailing)",
    type: "text",
    section: "Part 4. Sponsor Information",
  },

  // Other Info
  {
    key: "sponsor_domicile_country",
    pdfKey: "sponsor_domicile_country",
    label: "5. Country of Domicile",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_dob",
    pdfKey: "sponsor_dob",
    label: "6. Date of Birth (mm/dd/yyyy)",
    type: "text",
    section: "Part 4. Sponsor Information",
    placeholder: "MM/DD/YYYY",
    maxLength: 10,
  },
  {
    key: "sponsor_city_of_birth",
    pdfKey: "sponsor_city_of_birth",
    label: "7. City/Town/Village of Birth",
    type: "text",
    section: "Part 4. Sponsor Information",
  },
  {
    key: "sponsor_ssn",
    pdfKey: "sponsor_ssn",
    label: "10. U.S. Social Security Number",
    type: "text",
    section: "Part 4. Sponsor Information",
    maxLength: 9,
  },

  // Citizenship Status
  {
    key: "sponsor_citizenship",
    pdfKey: "sponsor_citizenship",
    label: "11. My citizenship status is:",
    type: "radio",
    section: "Part 4. Sponsor Information",
    options: [
      { label: "U.S. Citizen", value: "us_citizen", pdfKey: "sponsor_citizenship_us" },
      { label: "U.S. National", value: "us_national", pdfKey: "sponsor_citizenship_national" },
      { label: "Lawful Permanent Resident", value: "lpr", pdfKey: "sponsor_citizenship_lpr" },
    ],
  },

  {
    key: "sponsor_alien_number",
    pdfKey: "sponsor_alien_number",
    label: "12. Alien Registration Number (A-Number)",
    type: "text",
    section: "Part 4. Sponsor Information",
    maxLength: 9,
  },
  {
    key: "sponsor_uscis_account",
    pdfKey: "sponsor_uscis_account",
    label: "13. USCIS Online Account Number",
    type: "text",
    section: "Part 4. Sponsor Information",
    maxLength: 12,
  },

  {
    key: "sponsor_military_active",
    pdfKey: "sponsor_military_active",
    label: "14. I am currently on active duty in the U.S. Armed Forces",
    type: "radio",
    section: "Part 4. Sponsor Information",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "sponsor_military_active_yes" },
      { label: "No", value: "No", pdfKey: "sponsor_military_active_no" },
    ],
  },

  // ============================================
  // PART 2. Information About the Principal Immigrant
  // ============================================
  {
    key: "immigrant_family_name",
    pdfKey: "immigrant_family_name",
    label: "1.a. Family Name (Last Name)",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
    required: true,
  },
  {
    key: "immigrant_given_name",
    pdfKey: "immigrant_given_name",
    label: "1.b. Given Name (First Name)",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
    required: true,
  },
  {
    key: "immigrant_middle_name",
    pdfKey: "immigrant_middle_name",
    label: "1.c. Middle Name",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },

  // Immigrant Address
  {
    key: "immigrant_in_care_of",
    pdfKey: "immigrant_in_care_of",
    label: "2. In Care Of Name",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_street",
    pdfKey: "immigrant_street",
    label: "Street Number and Name",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_unit_type",
    pdfKey: "immigrant_unit_type",
    label: "Unit",
    type: "radio",
    section: "Part 2. Information About the Principal Immigrant",
    options: [
      { label: "Apt.", value: "Apt", pdfKey: "immigrant_unit_apt" },
      { label: "Ste.", value: "Ste", pdfKey: "immigrant_unit_ste" },
      { label: "Flr.", value: "Flr", pdfKey: "immigrant_unit_flr" },
    ],
  },
  {
    key: "immigrant_unit_number",
    pdfKey: "immigrant_unit_number",
    label: "Apt./Ste./Flr. Number",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_city",
    pdfKey: "immigrant_city",
    label: "City or Town",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_state",
    pdfKey: "immigrant_state",
    label: "State",
    type: "combo",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_zip",
    pdfKey: "immigrant_zip",
    label: "ZIP Code",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
    maxLength: 5,
  },
  {
    key: "immigrant_province",
    pdfKey: "immigrant_province",
    label: "Province",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_postal_code",
    pdfKey: "immigrant_postal_code",
    label: "Postal Code",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_country",
    pdfKey: "immigrant_country",
    label: "Country",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },

  {
    key: "immigrant_country_citizenship",
    pdfKey: "immigrant_country_citizenship",
    label: "3. Country of Citizenship",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },
  {
    key: "immigrant_dob",
    pdfKey: "immigrant_dob",
    label: "4. Date of Birth",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
    placeholder: "MM/DD/YYYY",
    maxLength: 10,
  },
  {
    key: "immigrant_alien_number",
    pdfKey: "immigrant_alien_number",
    label: "5. Alien Registration Number (A-Number)",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
    maxLength: 9,
  },
  {
    key: "immigrant_uscis_account",
    pdfKey: "immigrant_uscis_account",
    label: "6. USCIS Online Account Number",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
    maxLength: 12,
  },
  {
    key: "immigrant_daytime_phone",
    pdfKey: "immigrant_daytime_phone",
    label: "7. Daytime Telephone Number",
    type: "text",
    section: "Part 2. Information About the Principal Immigrant",
  },

  // ============================================
  // PART 3. Household Size
  // ============================================
  {
    key: "household_sponsoring_self",
    pdfKey: "household_sponsoring_self",
    label: "1. Are you sponsoring yourself?",
    type: "radio",
    section: "Part 3. Household Size",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "household_sponsoring_self_yes" },
      { label: "No", value: "No", pdfKey: "household_sponsoring_self_no" },
    ],
  },
  {
    key: "household_sponsoring_family",
    pdfKey: "household_sponsoring_family",
    label: "2. Are you including any family members in your household?",
    type: "radio",
    section: "Part 3. Household Size",
    options: [
      { label: "Yes", value: "Yes", pdfKey: "household_sponsoring_family_yes" },
      { label: "No", value: "No", pdfKey: "household_sponsoring_family_no" },
    ],
  },

  // Repeatable Household Members (You can handle dynamically in UI)
  // For now, static first 3 as per PDF
];

export const getInitialFormData = () => {
  const data: Record<string, string> = {};
  formFields.forEach((f) => (data[f.key] = ""));
  return data;
};

export const i864Config = {
  formId,
  formTitle,
  formSubtitle,
  formFields,
  getInitialFormData,
};

export default i864Config;