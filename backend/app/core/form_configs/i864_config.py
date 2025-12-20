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
    # G-28 / Attorney Info
    # ============================================
    "g28_attached":                     "form1[0].#subform[0].G28-CheckBox1[0]",
    "attorney_bar_number":              "form1[0].#subform[0].AttorneyStateBarNumber[0]",
    "g28_uscis_account":                "form1[0].#subform[0].USCISOnlineAcctNumber[0]",
    "form_barcode":                     "form1[0].#pageSet[0].Page1[0].PDF417BarCode1[0]",


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

    # Family member 3 (Continued)
    "household_member3_dob":         "form1[0].#subform[3].P3_Line15_DateOfBirth[0]",
    "household_member3_alien_number": "form1[0].#subform[3].P2_Line5_AlienNumber[2]", # Named P2_Line5_AlienNumber[2] in JSON
    "household_member3_uscis_account": "form1[0].#subform[3].P3_Line17_AcctIdentifier[0]",

    # Family member 4
    "household_member4_family_name": "form1[0].#subform[3].P3_Line18a_FamilyName[0]",
    "household_member4_given_name":  "form1[0].#subform[3].P3_Line18b_GivenName[0]",
    "household_member4_middle_name": "form1[0].#subform[3].P3_Line18c_MiddleName[0]",
    "household_member4_relationship": "form1[0].#subform[3].P3_Line19_Relationship[0]",
    "household_member4_dob":         "form1[0].#subform[3].P3_Line20_DateOfBirth[0]",
    "household_member4_alien_number": "form1[0].#subform[3].P3_Line21_AlienNumber[0]",
    "household_member4_uscis_account": "form1[0].#subform[3].P3_Line22_AcctIdentifier[0]",


    # ============================================
    # PART 5 – Sponsor's Household Size (Page 5)
    # ============================================
    "hsize_total_immigrants":    "form1[0].#subform[4].P3_Line28_TotalNumberofImmigrants[0]",
    "hsize_yourself":           "form1[0].#subform[4].P5_Line2_Yourself[0]",
    "hsize_married":            "form1[0].#subform[4].P5_Line3_Married[0]",
    "hsize_dependent_children": "form1[0].#subform[4].P5_Line4_DependentChildren[0]",
    "hsize_other_dependents":   "form1[0].#subform[4].P5_Line5_OtherDependents[0]",
    "hsize_sponsors":           "form1[0].#subform[4].P5_Line6_Sponsors[0]",
    "hsize_same_residence":     "form1[0].#subform[4].P5_Line7_SameResidence[0]",
    "hsize_total":              "form1[0].#subform[4].Override[0]", # Total household size

    # ============================================
    # PART 6 – Sponsor's Employment and Income (Page 5-7)
    # ============================================
    "emp_employed_chk":         "form1[0].#subform[4].P6_Line1_Checkbox[0]",
    "emp_employer_name":        "form1[0].#subform[4].P6_Line1a_NameofEmployer[0]",
    "emp_employer_name_2":      "form1[0].#subform[4].P6_Line1a1_NameofEmployer[0]",
    "emp_employer_name_3":      "form1[0].#subform[4].P6_Line1a2_NameofEmployer[0]",
    
    "emp_self_employed_chk":    "form1[0].#subform[4].P6_Line4_Checkbox[0]",
    "emp_self_employed_as":     "form1[0].#subform[4].P6_Line4a_SelfEmployedAs[0]",
    
    "emp_retired_chk":          "form1[0].#subform[4].P6_Line5_Checkbox[0]",
    "emp_retired_date":         "form1[0].#subform[4].P6_Line5a_DateRetired[0]",
    
    "emp_unemployed_chk":       "form1[0].#subform[4].P6_Line6_Checkbox[0]",
    "emp_unemployed_date":      "form1[0].#subform[4].P6_Line6a_DateofUnemployment[0]",
    
    "emp_current_annual_income": "form1[0].#subform[4].P6_Line2_TotalIncome[0]",

    # Household Members Income (Page 6) - Optional repeated blocks
    "hh_income1_name":          "form1[0].#subform[5].P6_Line3_Name[0]",
    "hh_income1_relationship":  "form1[0].#subform[5].P6_Line4_Relationship[0]",
    "hh_income1_amount":        "form1[0].#subform[5].P6_Line5_CurrentIncome[0]",

    "hh_income2_name":          "form1[0].#subform[5].P6_Line6_Name[0]",
    "hh_income2_relationship":  "form1[0].#subform[5].P6_Line7_Relationship[0]",
    "hh_income2_amount":        "form1[0].#subform[5].P6_Line8_CurrentIncome[0]",

    "hh_income3_name":          "form1[0].#subform[5].P6_Line9_Name[0]",
    "hh_income3_relationship":  "form1[0].#subform[5].P6_Line10_Relationship[0]",
    "hh_income3_amount":        "form1[0].#subform[5].P6_Line11_CurrentIncome[0]",

    "hh_income4_name":          "form1[0].#subform[5].P6_Line12_Name[0]",
    "hh_income4_relationship":  "form1[0].#subform[5].P6_Line13_Relationship[0]",
    "hh_income4_amount":        "form1[0].#subform[5].P6_Line14_CurrentIncome[0]",

    "hh_total_household_income": "form1[0].#subform[5].P6_Line15_TotalHouseholdIncome[0]",
    
    "hh_people_listed": "form1[0].#subform[5].P6_Line16_CompletedForm[0]",
    "hh_intending_immigrant_check": "form1[0].#subform[5].P6_Line17_NotNeedComplete[0]",
    "hh_intending_immigrant_dependents": "form1[0].#subform[5].P6_Line17_Name[0]",
    
    "tax_filed_3years_chk_yes":     "form1[0].#subform[5].P6_Line18a_Checkbox[0]", # Logic might need 18a [0] and [1] ? Checked PDF keys.
    "tax_filed_3years_chk_no":     "form1[0].#subform[5].P6_Line18a_Checkbox[1]", # Logic might need 18a [0] and [1] ? Checked PDF keys.
    # Note: JSON shows [0] for "P6_Line18a_Checkbox" and also [1]. 
    # Usually "I have filed a Federal tax return for each of the three most recent tax years" is a single checkbox or Yes/No. 
    # In JSON step 20: [500, 607...] and [542, 607...]. Looks like Yes/No or Optional/Mandatory.
    # Assuming 'yes' triggers providing details.
    
    "tax_year_1":               "form1[0].#subform[6].P6_Line19a_TaxYear[0]",
    "tax_income_1":             "form1[0].#subform[6].P6_Line19a_TotalIncome[0]",
    
    "tax_year_2":               "form1[0].#subform[6].P6_Line19b_TaxYear[0]",
    "tax_income_2":             "form1[0].#subform[6].P6_Line19b_TotalIncome[0]",
    
    "tax_year_3":               "form1[0].#subform[6].P6_Line19c_TaxYear[0]",
    "tax_income_3":             "form1[0].#subform[6].P6_Line19c_TotalIncome[0]",
    
    "tax_not_required_chk":     "form1[0].#subform[6].P6_Line17_IWasNotReq[0]",

    # ============================================
    # PART 7 – Use of Assets (Page 7-8)
    # ============================================
    "asset_sponsor_balance":    "form1[0].#subform[6].P7_Line1_BalanceofAccounts[0]",
    "asset_sponsor_real_estate": "form1[0].#subform[6].P7_Line2_RealEstate[0]",
    "asset_sponsor_stocks":     "form1[0].#subform[6].P7_Line3_StocksBonds[0]",
    "asset_sponsor_total":      "form1[0].#subform[6].P7_Line4_Total[0]",
    
    "asset_hh_total":           "form1[0].#subform[6].P7_Line5_TotalAssetsHouseholdMembers[0]",
    
    # Assets for Principal Immigrant (Optional)
    "asset_pig_balance":        "form1[0].#subform[7].P7_Line6_BalanceofAccounts[0]",
    "asset_pig_real_estate":    "form1[0].#subform[7].P7_Line7_RealEstate[0]",
    "asset_pig_stocks":         "form1[0].#subform[7].P7_Line8_StocksBonds[0]",
    "asset_pig_total":          "form1[0].#subform[7].P7_Line9_Total[0]",
    
    "asset_total_value":        "form1[0].#subform[7].P7_Line10_TotalValueAssets[0]",

    # ============================================
    # PART 8 – Sponsor Contract & Contact (Page 10)
    # ============================================
    # "Can read english" check? JSON has P6_Line1_Checkbox[1] on Page 10.
    # Page 10 fields:
    # "form1[0].#subform[9].P6_Line1_Checkbox[1]" -> Looks like Language checkbox?
    # "form1[0].#subform[9].P6_Line1_Checkbox[2]" -> ?
    # "form1[0].#subform[9].P8_Line1b_language[0]" -> Language name if interpreter?
    
    "p8_can_read_english":      "form1[0].#subform[9].P6_Line1_Checkbox[1]", # Assuming this is the "I can read and understand English" check based on typical layout
    "p8_interpreter_chk":       "form1[0].#subform[9].P6_Line1_Checkbox[2]",
    "p8_language_used":         "form1[0].#subform[9].P8_Line1b_language[0]",
    
    "p8_preparer_chk":          "form1[0].#subform[9].P8_Line2_Checkbox[0]",
    "p8_preparer_name":         "form1[0].#subform[9].P8_Line2_Attorney[0]", # Labeled P8_Line2_Attorney but likely used for Preparer name in typical logic
    
    "p8_sponsor_phone":         "form1[0].#subform[9].P8_Line3_DaytimeTelephoneNumber[0]",
    "p8_sponsor_mobile":        "form1[0].#subform[9].P8_Line4_MobileTelephoneNumber[0]",
    "p8_sponsor_email":         "form1[0].#subform[9].P7Line7_EmailAddress[0]",
    "p8_sponsor_signature":     "form1[0].#subform[9].P8_Line9a_ApplicantSignature[0]",
    "p8_sponsor_sign_date":     "form1[0].#subform[9].P7Line9b_DateofSignature[0]",

    # ============================================
    # PART 9 – Interpreter (Page 11)
    # ============================================
    "p9_interp_family_name":    "form1[0].#subform[10].P9_Line1a_InterpretersFamilyName[0]",
    "p9_interp_given_name":     "form1[0].#subform[10].P9_Line1b_InterpretersGivenName[0]",
    "p9_interp_business":       "form1[0].#subform[10].P8Line2_InterpretersBusinessName[0]",
    "p9_interp_phone":          "form1[0].#subform[10].P9_Line4_InterpretersDaytimePhoneNumber[0]",
    # Note: JSON has phone[1] as well, maybe mobile?
    "p9_interp_email":          "form1[0].#subform[10].P9_Line5_InterpretersEmailAddress[0]",
    "p9_interp_language":       "form1[0].#subform[10].P9_Language[0]",
    "p9_interp_signature":      "form1[0].#subform[10].P9_Line6a_InterpretersSignature[0]",
    "p9_interp_sign_date":      "form1[0].#subform[10].P9_Line6b_DateofSignature[0]",

    # ============================================
    # PART 10 – Preparer (Page 11)
    # ============================================
    "p10_prep_family_name":     "form1[0].#subform[10].P10_Line1a_PreparersFamilyName[0]",
    "p10_prep_given_name":      "form1[0].#subform[10].P10_Line1b_PreparersGivenName[0]",
    "p10_prep_business":        "form1[0].#subform[10].P10_Line2_PreparersBusinessName[0]",
    "p10_prep_phone":           "form1[0].#subform[10].P10_Line4_PreparersDaytimePhoneNumber[0]",
    "p10_prep_fax":             "form1[0].#subform[10].P10_Line5_PreparersFaxNumber[0]",
    "p10_prep_email":           "form1[0].#subform[10].P10_Line6_PreparersEmailAddress[0]",
    "p10_prep_signature":       "form1[0].#subform[10].P10_Line8a_PreparersSignature[0]",
    "p10_prep_sign_date":       "form1[0].#subform[10].P10_Line8b_DateofSignature[0]",

    # ============================================
    # PART 11 – Additional Information (Page 12)
    # ============================================
    "p11_add_info_name_family": "form1[0].#subform[11].P4_Line1a_FamilyName[1]",
    "p11_add_info_name_given":  "form1[0].#subform[11].P4_Line1b_GivenName[1]",
    "p11_add_info_name_middle": "form1[0].#subform[11].P4_Line1c_MiddleName[1]",
    "p11_add_info_alien_number": "form1[0].#subform[11].Global_ANumber[0].P4_Line12_AlienNumber[1]",
    
    "p11_add_info_page1":       "form1[0].#subform[11].P11_Line3a_PageNumber[0]",
    "p11_add_info_part1":       "form1[0].#subform[11].P11_Line3b_PartNumber[0]",
    "p11_add_info_item1":       "form1[0].#subform[11].P11_Line3c_ItemNumber[0]",
    "p11_add_info_desc1":       "form1[0].#subform[11].P11_Line3d_AdditionalInfo[0]",
    
    "p11_add_info_page2":       "form1[0].#subform[11].P11_Line4a_PageNumber[0]",
    "p11_add_info_part2":       "form1[0].#subform[11].P11_Line4b_PartNumber[0]",
    "p11_add_info_item2":       "form1[0].#subform[11].P11_Line4c_ItemNumber[0]",
    "p11_add_info_desc2":       "form1[0].#subform[11].P11_Line4d_AdditionalInfo[0]",
    
    "p11_add_info_page3":       "form1[0].#subform[11].P11_Line5a_PageNumber[0]",
    "p11_add_info_part3":       "form1[0].#subform[11].P11_Line5b_PartNumber[0]",
    "p11_add_info_item3":       "form1[0].#subform[11].P11_Line5c_ItemNumber[0]",
    "p11_add_info_desc3":       "form1[0].#subform[11].P11_Line5d_AdditionalInfo[0]",
    
    "p11_add_info_page4":       "form1[0].#subform[11].P11_Line6a_PageNumber[0]",
    "p11_add_info_part4":       "form1[0].#subform[11].P11_Line6b_PartNumber[0]",
    "p11_add_info_item4":       "form1[0].#subform[11].P11_Line6c_ItemNumber[0]",
    "p11_add_info_desc4":       "form1[0].#subform[11].P11_Line6d_AdditionalInfo[0]",
}
