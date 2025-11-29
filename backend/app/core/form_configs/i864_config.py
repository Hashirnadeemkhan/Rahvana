# C:\Users\HP\Desktop\arachnie\Arachnie\backend\app\core\form_configs\i864_config.py

FIELD_MAPPING = {
 
    # ============================================
    # PART 1 – Basis for Filing (Page 1)
    # ============================================
    "p1_relationship_petition":          "form1[0].#subform[0].P1_Line1a-f_CB[0]",   # I am the petitioner
    "p1_relationship_joint_5percent":   "form1[0].#subform[0].P1_Line1a-f_CB[1]",   # 5% owner (joint sponsor)
    "p1_relationship_joint_entity":     "form1[0].#subform[0].P1_Line1a-f_CB[2]",   # Entity owns 5%+
    "p1_relationship_substitute":       "form1[0].#subform[0].P1_Line1a-f_CB[3]",   # Substitute sponsor
    "p1_relationship_household_member": "form1[0].#subform[0].P1_Line1a-f_CB[4]",   # Household member
    "p1_relationship_relative":         "form1[0].#subform[0].P1_Line1a-f_CB[5]",   # Relative (other)

    "p1_relationship_detail_entity":    "form1[0].#subform[0].P1_Line1c_InterestIn[0]",
    "p1_relationship_detail_relative":  "form1[0].#subform[0].P1_Line1c_Relationship[0]",
    "p1_relationship_detail_other":     "form1[0].#subform[0].P1_Line1f_Relationship[0]",
    "p1_relationship_detail_petition_b": "form1[0].#subform[0].P1_Line1b_Relationship[0]",

    "p1_legal_guardian_yes": "form1[0].#subform[0].P1_Line1e1_Checkbox[0]",
    "p1_legal_guardian_no":  "form1[0].#subform[0].P1_Line1e1_Checkbox[1]",

    # ============================================
    # PART 4 – Sponsor's Personal Information (Page 1–2)
    # ============================================
    "sponsor_family_name":  "form1[0].#subform[0].P4_Line1a_FamilyName[0]",
    "sponsor_given_name":   "form1[0].#subform[0].P4_Line1b_GivenName[0]",
    "sponsor_middle_name":  "form1[0].#subform[0].P4_Line1c_MiddleName[0]",

    "sponsor_in_care_of":   "form1[0].#subform[1].P4_Line2a_InCareOf[0]",
    "sponsor_street":       "form1[0].#subform[1].P4_Line2b_StreetNumberName[0]",
    "sponsor_unit_apt":     "form1[0].#subform[1].P4_Line2c_Unit[0]",
    "sponsor_unit_ste":     "form1[0].#subform[1].P4_Line2c_Unit[1]",
    "sponsor_unit_flr":     "form1[0].#subform[1].P4_Line2c_Unit[2]",
    "sponsor_unit_number":  "form1[0].#subform[1].P4_Line2d_AptSteFlrNumber[0]",
    "sponsor_city":         "form1[0].#subform[1].P4_Line2e_CityOrTown[0]",
    "sponsor_state":        "form1[0].#subform[1].P4_Line2f_State[0]",
    "sponsor_zip":          "form1[0].#subform[1].P4_Line2g_ZipCode[0]",
    "sponsor_province":     "form1[0].#subform[1].P4_Line2h_Province[0]",
    "sponsor_postal_code":  "form1[0].#subform[1].P4_Line2i_PostalCode[0]",
    "sponsor_country":      "form1[0].#subform[1].P4_Line2j_Country[0]",

    "sponsor_is_us_citizen_yes": "form1[0].#subform[1].P1_Line3_Checkbox[0]",
    "sponsor_is_us_citizen_no":  "form1[0].#subform[1].P1_Line3_Checkbox[1]",

    "sponsor_mailing_street":       "form1[0].#subform[1].P4_Line4a_StreetNumberName[0]",
    "sponsor_mailing_unit_apt":     "form1[0].#subform[1].P4_Line4b_Unit[0]",
    "sponsor_mailing_unit_ste":     "form1[0].#subform[1].P4_Line4b_Unit[1]",
    "sponsor_mailing_unit_flr":     "form1[0].#subform[1].P4_Line4b_Unit[2]",
    "sponsor_mailing_unit_number":  "form1[0].#subform[1].P4_Line4c_AptSteFlrNumber[0]",
    "sponsor_mailing_city":         "form1[0].#subform[1].P4_Line4d_CityOrTown[0]",
    "sponsor_mailing_state":        "form1[0].#subform[1].P4_Line4e_State[0]",
    "sponsor_mailing_zip":          "form1[0].#subform[1].P4_Line4f_ZipCode[0]",
    "sponsor_mailing_province":     "form1[0].#subform[1].P4_Line4g_Province[0]",
    "sponsor_mailing_postal_code":  "form1[0].#subform[1].P4_Line4h_PostalCode[0]",
    "sponsor_mailing_country":      "form1[0].#subform[1].P4_Line4i_Country[0]",

    "sponsor_domicile_country": "form1[0].#subform[1].P4_Line5_CountryOfDomicile[0]",
    "sponsor_dob":              "form1[0].#subform[1].P4_Line6_DateOfBirth[0]",
    "sponsor_city_of_birth":    "form1[0].#subform[1].P4_Line7_CityofBirth[0]",
    "sponsor_ssn":              "form1[0].#subform[1].P4_Line10_SocialSecurityNumber[0]",

    "sponsor_citizenship_us":      "form1[0].#subform[1].P4_Line11a_Checkbox[0]",
    "sponsor_citizenship_national": "form1[0].#subform[1].P4_Line11b_Checkbox[0]",
    "sponsor_citizenship_lpr":     "form1[0].#subform[1].P4_Line11c_Checkbox[0]",

    "sponsor_alien_number":     "form1[0].#subform[1].#area[1].P4_Line12_AlienNumber[0]",
    "sponsor_uscis_account":    "form1[0].#subform[1].P4_Line13_AcctIdentifier[0]",

    "sponsor_military_active_yes": "form1[0].#subform[1].P4_Line14_Checkboxes[0]",
    "sponsor_military_active_no":  "form1[0].#subform[1].P4_Line14_Checkboxes[1]",

    # ============================================
    # PART 2 – Information About the Principal Immigrant (Page 3)
    # ============================================
    "immigrant_family_name":  "form1[0].#subform[2].P2_Line1a_FamilyName[0]",
    "immigrant_given_name":   "form1[0].#subform[2].P2_Line1b_GivenName[0]",
    "immigrant_middle_name":  "form1[0].#subform[2].P2_Line1c_MiddleName[0]",

    "immigrant_in_care_of":   "form1[0].#subform[2].P2_Line2_InCareOf[0]",
    "immigrant_street":       "form1[0].#subform[2].P2_Line2_StreetNumberName[0]",
    "immigrant_unit_apt":     "form1[0].#subform[2].P2_Line2_Unit[0]",
    "immigrant_unit_ste":     "form1[0].#subform[2].P2_Line2_Unit[1]",
    "immigrant_unit_flr":     "form1[0].#subform[2].P2_Line2_Unit[2]",
    "immigrant_unit_number":  "form1[0].#subform[2].P2_Line2_AptSteFlrNumber[0]",
    "immigrant_city":         "form1[0].#subform[2].P2_Line2_CityOrTown[0]",
    "immigrant_state":        "form1[0].#subform[2].P2_Line2_State[0]",
    "immigrant_zip":          "form1[0].#subform[2].P2_Line2_ZipCode[0]",
    "immigrant_province":     "form1[0].#subform[2].P2_Line2_Province[0]",
    "immigrant_postal_code":  "form1[0].#subform[2].P2_Line2_PostalCode[0]",
    "immigrant_country":      "form1[0].#subform[2].P2_Line2_Country[0]",

    "immigrant_country_citizenship": "form1[0].#subform[2].P2_Line3_CountryCitizenship[0]",
    "immigrant_dob":                 "form1[0].#subform[2].P2_Line4_DateOfBirth[0]",
    "immigrant_alien_number":        "form1[0].#subform[2].#area[2].P2_Line5_AlienNumber[0]",
    "immigrant_uscis_account":       "form1[0].#subform[2].Pt2_Line6_USCISOnlineAcctNumber[0]",
    "immigrant_daytime_phone":       "form1[0].#subform[2].P2_Line7_DaytimePhoneNumber[0]",

    # ============================================
    # PART 3 – Household Size (Page 3–4)
    # ============================================
    "household_sponsoring_self_yes":     "form1[0].#subform[2].P3_Line1_Checkbox[0]",
    "household_sponsoring_self_no":      "form1[0].#subform[2].P3_Line1_Checkbox[1]",

    "household_sponsoring_family_yes":   "form1[0].#subform[2].P3_Line2_SponsoringFamily[0]",
    "household_sponsoring_family_no":    "form1[0].#subform[2].P3_Line2_SponsoringFamily[1]",

    # Family member 1
    "household_member1_family_name": "form1[0].#subform[2].P3_Line3a_FamilyName[0]",
    "household_member1_given_name":  "form1[0].#subform[2].P3_Line3b_GivenName[0]",
    "household_member1_middle_name": "form1[0].#subform[2].P3_Line3c_MiddleName[0]",
    "household_member1_relationship": "form1[0].#subform[2].P3_Line4_Relationship[0]",
    "household_member1_dob":         "form1[0].#subform[2].P3_Line_DateOfBirth[0]",
    "household_member1_alien_number": "form1[0].#subform[2].P2_Line5_AlienNumber[1]",
    "household_member1_uscis_account": "form1[0].#subform[2].P3_Line7_AcctIdentifier[0]",

    # Family member 2
    "household_member2_family_name": "form1[0].#subform[3].P3_Line8a_FamilyName[0]",
    "household_member2_given_name":  "form1[0].#subform[3].P3_Line8b_GivenName[0]",
    "household_member2_middle_name": "form1[0].#subform[3].P3_Line8c_MiddleName[0]",
    "household_member2_relationship": "form1[0].#subform[3].P3_Line9_Relationship[0]",
    "household_member2_dob":         "form1[0].#subform[3].P3_Line10_DateOfBirth[0]",
    "household_member2_alien_number": "form1[0].#subform[3].P3_Line11_AlienNumber[0]",
    "household_member2_uscis_account": "form1[0].#subform[3].P3_Line12_AcctIdentifier[0]",

    # Family member 3
    "household_member3_family_name": "form1[0].#subform[3].P3_Line13a_FamilyName[0]",
    "household_member3_given_name":  "form1[0].#subform[3].P3_Line13b_GivenName[0]",
    "household_member3_middle_name": "form1[0].#subform[3].P3_Line13c_MiddleName[0]",
    "household_member3_relationship": "form1[0].#subform[3].P3_Line14_Relationship[0]",

    # ============================================
    # G-28 Attorney Info (Page 1)
    # ============================================
    "g28_attorney_checkbox":       "form1[0].#subform[0].G28-CheckBox1[0]",
    "g28_bar_number":              "form1[0].#subform[0].AttorneyStateBarNumber[0]",
    "g28_uscis_account":           "form1[0].#subform[0].USCISOnlineAcctNumber[0]",

    # ============================================
    # Additional Notes
    # ============================================
    # Add more fields from later pages (Part 5, 6, 7, etc.) as you extract them.
    # This mapping covers all fields present in your current JSON sample.
}