
FIELD_MAPPING = {
    # ============================================
    # PART 1 – Information About You (Spouse Beneficiary)
    # ============================================
    "p1_alien_number":          "form1[0].#subform[0].Pt1Line1_AlienNumber[0]",
    "p1_uscis_account":         "form1[0].#subform[0].#area[0].USCISOnlineAcctNumber[0]",
    "p1_family_name":           "form1[0].#subform[0].Pt1Line3a_FamilyName[0]",
    "p1_given_name":            "form1[0].#subform[0].Pt1Line3b_GivenName[0]",
    "p1_middle_name":           "form1[0].#subform[0].Pt1Line3c_MiddleName[0]",

    # Address History 1 (Current)
    "p1_addr1_street":          "form1[0].#subform[0].Pt1Line4a_StreetNumberName[0]",
    "p1_addr1_unit_apt":        "form1[0].#subform[0].Pt1Line4b_Unit[0]",
    "p1_addr1_unit_ste":        "form1[0].#subform[0].Pt1Line4b_Unit[1]",
    "p1_addr1_unit_flr":        "form1[0].#subform[0].Pt1Line4b_Unit[2]",
    "p1_addr1_unit_val":        "form1[0].#subform[0].Pt1Line4b_AptSteFlrNumber[0]",
    "p1_addr1_city":            "form1[0].#subform[0].Pt1Line4c_CityOrTown[0]",
    "p1_addr1_state":           "form1[0].#subform[0].Pt1Line4d_State[0]",
    "p1_addr1_zip":             "form1[0].#subform[0].Pt1Line4e_ZipCode[0]",
    "p1_addr1_province":        "form1[0].#subform[0].Pt1Line4f_Province[0]",
    "p1_addr1_postal":          "form1[0].#subform[0].Pt1Line4g_PostalCode[0]",
    "p1_addr1_country":         "form1[0].#subform[0].Pt1Line4h_Country[0]",
    "p1_addr1_date_from":       "form1[0].#subform[0].Pt1Line5a_DateFrom[0]",
    "p1_addr1_date_to":         "form1[0].#subform[0].Pt1Line5b_DateTo[0]",

    # Address History 2
    "p1_addr2_street":          "form1[0].#subform[0].Pt1Line6a_StreetNumberName[0]",
    "p1_addr2_unit_apt":        "form1[0].#subform[0].Pt1Line6b_Unit[0]",
    "p1_addr2_unit_ste":        "form1[0].#subform[0].Pt1Line6b_Unit[1]",
    "p1_addr2_unit_flr":        "form1[0].#subform[0].Pt1Line6b_Unit[2]",
    "p1_addr2_unit_val":        "form1[0].#subform[0].Pt1Line6b_AptSteFlrNumber[0]",
    "p1_addr2_city":            "form1[0].#subform[0].Pt1Line6c_CityOrTown[0]",
    "p1_addr2_state":           "form1[0].#subform[0].Pt1Line6d_State[0]",
    "p1_addr2_zip":             "form1[0].#subform[0].Pt1Line6e_ZipCode[0]",
    "p1_addr2_province":        "form1[0].#subform[0].Pt1Line6f_Province[0]",
    "p1_addr2_postal":          "form1[0].#subform[0].Pt1Line6g_PostalCode[0]",
    "p1_addr2_country":         "form1[0].#subform[0].Pt1Line6h_Country[0]",
    "p1_addr2_date_from":       "form1[0].#subform[0].Pt1Line7a_DateFrom[0]",
    "p1_addr2_date_to":         "form1[0].#subform[0].Pt1Line7b_DateTo[0]",

    # Address History 3
    "p1_addr3_street":          "form1[0].#subform[0].Pt1Line8a_StreetNumberName[0]",
    "p1_addr3_unit_apt":        "form1[0].#subform[0].Pt1Line8b_Unit[0]",
    "p1_addr3_unit_ste":        "form1[0].#subform[0].Pt1Line8b_Unit[1]",
    "p1_addr3_unit_flr":        "form1[0].#subform[0].Pt1Line8b_Unit[2]",
    "p1_addr3_unit_val":        "form1[0].#subform[0].Pt1Line8b_AptSteFlrNumber[0]",
    "p1_addr3_city":            "form1[0].#subform[0].Pt1Line8c_CityOrTown[0]",
    "p1_addr3_province":        "form1[0].#subform[0].Pt1Line8d_Province[0]",
    "p1_addr3_postal":          "form1[0].#subform[0].Pt1Line8e_PostalCode[0]",
    "p1_addr3_country":         "form1[0].#subform[0].Pt1Line8f_Country[0]",
    "p1_addr3_date_from":       "form1[0].#subform[1].Pt1Line9a_DateFrom[0]",
    "p1_addr3_date_to":         "form1[0].#subform[1].Pt1Line9b_DateTo[0]",

    # Parent 1 Information
    "p1_parent1_family_name":   "form1[0].#subform[1].Pt1Line10_FamilyName[0]",
    "p1_parent1_given_name":    "form1[0].#subform[1].Pt1Line10_GivenName[0]",
    "p1_parent1_middle_name":   "form1[0].#subform[1].Pt1Line10_MiddleName[0]",
    "p1_parent1_dob":           "form1[0].#subform[1].Pt1Line11_DateofBirth[0]",
    "p1_parent1_sex_male":      "form1[0].#subform[1].Pt1Line12_Male[0]",
    "p1_parent1_sex_female":    "form1[0].#subform[1].Pt1Line12_Female[0]",
    "p1_parent1_city_birth":    "form1[0].#subform[1].Pt1Line12CityTownOfBirth[0]",
    "p1_parent1_country_birth": "form1[0].#subform[1].Pt1Line13_CountryofBirth[0]", # Note: JSON has Pt1Line13 and Pt1Line14 labeled CountryofBirth. Assuming 13 is correct based on order.
    "p1_parent1_country_res":   "form1[0].#subform[1].Pt1Line15_CountryofResidence[0]",

    # Parent 2 Information
    "p1_parent2_family_name":   "form1[0].#subform[1].Pt1Line16_FamilyName[0]",
    "p1_parent2_given_name":    "form1[0].#subform[1].Pt1Line16_GivenName[0]",
    "p1_parent2_middle_name":   "form1[0].#subform[1].Pt1Line16_MiddleName[0]",
    "p1_parent2_dob":           "form1[0].#subform[1].Pt1Line17_DateofBirth[0]",
    "p1_parent2_sex_male":      "form1[0].#subform[1].Pt1Line19_Male[0]",
    "p1_parent2_sex_female":    "form1[0].#subform[1].Pt1Line19_Female[0]",
    "p1_parent2_city_birth":    "form1[0].#subform[1].Pt1Line18_CityTownOfBirth[0]",
    "p1_parent2_country_birth": "form1[0].#subform[1].Pt1Line19_CountryofBirth[0]", 
    "p1_parent2_city_res":      "form1[0].#subform[1].Pt1Line20_CityTownVillageofRes[0]",
    "p1_parent2_country_res":   "form1[0].#subform[1].Pt1Line21_CountryofResidence[0]",

    # ============================================
    # PART 2 – Information About Your Employment
    # ============================================
    # Employment 1 (Current)
    "p2_emp1_name":             "form1[0].#subform[1].Pt2Line1_EmployerOrCompName[0]",
    "p2_emp1_street":           "form1[0].#subform[1].Pt2Line2a_StreetNumberName[0]",
    "p2_emp1_unit_apt":         "form1[0].#subform[1].Pt2Line2b_Unit[0]",
    "p2_emp1_unit_ste":         "form1[0].#subform[1].Pt2Line2b_Unit[1]",
    "p2_emp1_unit_flr":         "form1[0].#subform[1].Pt2Line2b_Unit[2]",
    "p2_emp1_unit_val":         "form1[0].#subform[1].Pt2Line2b_AptSteFlrNumber[0]",
    "p2_emp1_city":             "form1[0].#subform[1].Pt2Line2c_CityOrTown[0]",
    "p2_emp1_state":            "form1[0].#subform[1].Pt2Line2d_State[0]",
    "p2_emp1_zip":              "form1[0].#subform[1].Pt2Line2e_ZipCode[0]",
    "p2_emp1_province":         "form1[0].#subform[1].Pt2Line2f_Province[0]",
    "p2_emp1_postal":           "form1[0].#subform[1].Pt2Line2g_PostalCode[0]",
    "p2_emp1_country":          "form1[0].#subform[1].Pt2Line2h_Country[0]",
    "p2_emp1_occupation":       "form1[0].#subform[1].Pt2Line3_Occupation[0]",
    "p2_emp1_date_from":        "form1[0].#subform[1].Pt2Line4a_DateFrom[0]",
    "p2_emp1_date_to":          "form1[0].#subform[1].Pt2Line4b_DateTo[0]",

    # Employment 2
    "p2_emp2_name":             "form1[0].#subform[1].Pt2Line5_EmployerOrCompName[0]",
    "p2_emp2_street":           "form1[0].#subform[1].Pt2Line6_StreetNumberName[0]",
    "p2_emp2_unit_apt":         "form1[0].#subform[1].Pt2Line6_Unit[0]",
    "p2_emp2_unit_ste":         "form1[0].#subform[1].Pt2Line6_Unit[1]",
    "p2_emp2_unit_flr":         "form1[0].#subform[1].Pt2Line6_Unit[2]",
    "p2_emp2_unit_val":         "form1[0].#subform[1].Pt2Line6_AptSteFlrNumber[0]",
    "p2_emp2_city":             "form1[0].#subform[1].Pt2Line6_CityOrTown[0]",
    "p2_emp2_state":            "form1[0].#subform[1].Pt2Line6_State[0]",
    "p2_emp2_zip":              "form1[0].#subform[1].Pt2Line6_ZipCode[0]",
    "p2_emp2_province":         "form1[0].#subform[1].Pt2Line6_Province[0]",
    "p2_emp2_postal":           "form1[0].#subform[1].Pt2Line6_PostalCode[0]",
    "p2_emp2_country":          "form1[0].#subform[1].Pt2Line6_Country[0]",
    "p2_emp2_occupation":       "form1[0].#subform[2].Pt2Line7_Occupation[0]", # Logic jump to Part 3 page but still labeled Pt2Line7 in XML maybe?
    "p2_emp2_date_from":        "form1[0].#subform[2].Pt2Line8a_DateFrom[0]",
    
    # Employment 3 (Part 3)
    "p3_emp3_name":             "form1[0].#subform[2].Pt3Line1_EmployerOrCompName[0]",
    "p3_emp3_occupation":       "form1[0].#subform[2].Pt3Line3_Occupation[0]",
    
    # Preparer / Interpreter / Attorney
    "g28_attached":             "form1[0].#subform[0].CheckBox1[0]",
    "attorney_bar_number":      "form1[0].#subform[0].AttorneyStateBarNumber[0]",
    "attorney_uscis_acct":      "form1[0].#subform[0].USCISOnlineAcctNumber[0]", # Note: Duplicate field name in JSON list to p1_uscis_account?
                                # Looking at JSON:
                                # "form1[0].#subform[0].#area[0].USCISOnlineAcctNumber[0]" -> p1
                                # "form1[0].#subform[0].AttorneyStateBarNumber[0]"
                                # Wait, "form1[0].#subform[0].USCISOnlineAcctNumber[0]" -> This one usually for Attorney block which is near bar number.
                                # The "area[0]" one is likely the applicant one.
    
    # ============================================
    # PART 1 (Additional)
    # ============================================
    "p1_volag_number":          "form1[0].#subform[0].VolagNumber[0]",
    "p1_elis_account":          "form1[0].#subform[0].#area[1].Pt2Line3_USCISELISActNumber[0]",

    # ============================================
    # PART 2 (Additional)
    # ============================================
    "p2_emp2_date_to":          "form1[0].#subform[2].Pt2Line8b_DateTo[0]",

    # ============================================
    # PART 3 – Employment History 3
    # ============================================
    "p3_emp3_street":           "form1[0].#subform[2].Pt3Line2a_StreetNumberName[0]",
    "p3_emp3_unit_apt":         "form1[0].#subform[2].Pt3Line2b_Unit[0]",
    "p3_emp3_unit_ste":         "form1[0].#subform[2].Pt3Line2b_Unit[1]",
    "p3_emp3_unit_flr":         "form1[0].#subform[2].Pt3Line2b_Unit[2]",
    "p3_emp3_unit_val":         "form1[0].#subform[2].Pt3Line2b_AptSteFlrNumber[0]",
    "p3_emp3_city":             "form1[0].#subform[2].Pt3Line2c_CityOrTown[0]",
    "p3_emp3_state":            "form1[0].#subform[2].Pt3Line2d_State[0]",
    "p3_emp3_zip":              "form1[0].#subform[2].Pt3Line2e_ZipCode[0]",
    "p3_emp3_province":         "form1[0].#subform[2].Pt3Line2f_Province[0]",
    "p3_emp3_postal":           "form1[0].#subform[2].Pt3Line2g_PostalCode[0]",
    "p3_emp3_country":          "form1[0].#subform[2].Pt3Line2h_Country[0]",
    "p3_emp3_date_from":        "form1[0].#subform[2].Pt3Line4a_DateFrom[0]",
    "p3_emp3_date_to":          "form1[0].#subform[2].Pt3Line4b_DateTo[0]",

    # ============================================
    # PART 4 – Beneficiary Contact & Certification
    # ============================================
    "p4_language_english_chk":  "form1[0].#subform[2].Pt4Line1Checkbox[0]",
    "p4_language_interp_lang":   "form1[0].#subform[2].Pt4Line1b_Language[0]",
    "p4_interpreter_chk":       "form1[0].#subform[2].Pt4_Checkbox[0]",
    "p4_interpreter_name":      "form1[0].#subform[2].Pt4Line2_RepresentativeName[0]",
    
    "p4_phone":                 "form1[0].#subform[2].Pt4Line3_DaytimePhoneNumber1[0]",
    "p4_mobile":                "form1[0].#subform[2].Pt4Line4_MobileNumber1[0]",
    "p4_email":                 "form1[0].#subform[2].Pt4Line5_Email[0]",
    "p4_preparer_chk":          "form1[0].#subform[2].Pt4Line1Checkbox[1]",
    
    "p4_signature":             "form1[0].#subform[2].Pt4Line6a_Signature[0]",
    "p4_date_signed":           "form1[0].#subform[2].Pt4Line6b_DateofSignature[0]",

    # ============================================
    # PART 5 – Interpreter
    # ============================================
    "p5_interp_family_name":    "form1[0].#subform[3].Pt5Line1a_InterpreterFamilyName[0]",
    "p5_interp_given_name":     "form1[0].#subform[3].Pt5Line1b_InterpreterGivenName[0]",
    "p5_interp_business":       "form1[0].#subform[3].Pt5Line2_InterpreterBusinessorOrg[0]",
    "p5_interp_street":         "form1[0].#subform[3].Pt5Line3a_StreetNumberName[0]",
    "p5_interp_unit_apt":       "form1[0].#subform[3].Pt5Line3b_Unit[0]",
    "p5_interp_unit_ste":       "form1[0].#subform[3].Pt5Line3b_Unit[1]",
    "p5_interp_unit_flr":       "form1[0].#subform[3].Pt5Line3b_Unit[2]",
    "p5_interp_unit_val":       "form1[0].#subform[3].Pt5Line3b_AptSteFlrNumber[0]",
    "p5_interp_city":           "form1[0].#subform[3].Pt5Line3c_CityOrTown[0]",
    "p5_interp_state":          "form1[0].#subform[3].Pt5Line3d_State[0]",
    "p5_interp_zip":            "form1[0].#subform[3].Pt5Line3e_ZipCode[0]",
    "p5_interp_province":       "form1[0].#subform[3].Pt5Line3f_Province[0]",
    "p5_interp_postal":         "form1[0].#subform[3].Pt5Line3g_PostalCode[0]",
    "p5_interp_country":        "form1[0].#subform[3].Pt5Line3h_Country[0]",
    "p5_interp_phone":          "form1[0].#subform[3].Pt5Line4_InterpreterDaytimeTelephone[0]",
    "p5_interp_email":          "form1[0].#subform[3].Pt5Line5_Email[0]",
    "p5_interp_language":       "form1[0].#subform[3].Pt5_NameofLanguage[0]",
    "p5_interp_signature":      "form1[0].#subform[3].Pt5Line6a_Signature[0]",
    "p5_interp_date_signed":    "form1[0].#subform[3].Pt5Line6b_DateofSignature[0]",

    # ============================================
    # PART 6 – Preparer
    # ============================================
    "p6_prep_family_name":      "form1[0].#subform[3].Pt6Line1a_PreparerFamilyName[0]",
    "p6_prep_given_name":       "form1[0].#subform[3].Pt6Line1b_PreparerGivenName[0]",
    "p6_prep_business":         "form1[0].#subform[3].Pt6Line2_BusinessName[0]",
    "p6_prep_street":           "form1[0].#subform[3].Pt6Line3a_StreetNumberName[0]",
    "p6_prep_unit_apt":         "form1[0].#subform[3].Pt6Line3b_Unit[0]",
    "p6_prep_unit_ste":         "form1[0].#subform[3].Pt6Line3b_Unit[1]",
    "p6_prep_unit_flr":         "form1[0].#subform[3].Pt6Line3b_Unit[2]",
    "p6_prep_unit_val":         "form1[0].#subform[3].Pt6Line3b_AptSteFlrNumber[0]",
    "p6_prep_city":             "form1[0].#subform[3].Pt6Line3c_CityOrTown[0]",
    "p6_prep_state":            "form1[0].#subform[3].Pt6Line3d_State[0]",
    "p6_prep_zip":              "form1[0].#subform[3].Pt6Line3e_ZipCode[0]",
    "p6_prep_province":         "form1[0].#subform[3].Pt6Line3f_Province[0]",
    "p6_prep_postal":           "form1[0].#subform[3].Pt6Line3g_PostalCode[0]",
    "p6_prep_country":          "form1[0].#subform[3].Pt6Line3h_Country[0]",
    "p6_prep_phone":            "form1[0].#subform[4].Pt6Line4_DaytimePhoneNumber[0]",
    "p6_prep_fax":              "form1[0].#subform[4].Pt6Line5_PreparerFaxNumber[0]",
    "p6_prep_email":            "form1[0].#subform[4].Pt6Line6_Email[0]",
    "p6_prep_statement_chk1":   "form1[0].#subform[4].Pt6Line7_Checkbox[0]",
    "p6_prep_statement_chk2":   "form1[0].#subform[4].Pt6Line7_Checkbox[1]",
    "p6_prep_attorney_chk1":    "form1[0].#subform[4].Pt6Line7b_Checkbox[0]",
    "p6_prep_attorney_chk2":    "form1[0].#subform[4].Pt6Line7b_Checkbox[1]",
    "p6_prep_signature":        "form1[0].#subform[4].Pt6Line8a_Signature[0]",
    "p6_prep_date_signed":      "form1[0].#subform[4].Pt6Line8b_DateofSignature[0]",

    # ============================================
    # PART 7 – Additional Information
    # ============================================
    "p7_add_info_page1":        "form1[0].#subform[5].Pt7Line3a_PageNumber[0]",
    "p7_add_info_part1":        "form1[0].#subform[5].Pt7Line3b_PartNumber[0]",
    "p7_add_info_item1":        "form1[0].#subform[5].Pt7Line3c_ItemNumber[0]",
    "p7_add_info_desc1":        "form1[0].#subform[5].Pt7Line3d_AdditionalInfo[0]",
    
    "p7_add_info_page2":        "form1[0].#subform[5].Pt7Line4a_PageNumber[0]",
    "p7_add_info_part2":        "form1[0].#subform[5].Pt7Line4b_PartNumber[0]",
    "p7_add_info_item2":        "form1[0].#subform[5].Pt7Line4c_ItemNumber[0]",
    "p7_add_info_desc2":        "form1[0].#subform[5].Pt7Line4d_AdditionalInfo[0]",

    "p7_add_info_page3":        "form1[0].#subform[5].Pt7Line5a_PageNumber[0]",
    "p7_add_info_part3":        "form1[0].#subform[5].Pt7Line5b_PartNumber[0]",
    "p7_add_info_item3":        "form1[0].#subform[5].Pt7Line5c_ItemNumber[0]",
    "p7_add_info_desc3":        "form1[0].#subform[5].Pt7Line5d_AdditionalInfo[0]",

    "p7_add_info_page4":        "form1[0].#subform[5].Pt7Line6a_PageNumber[0]",
    "p7_add_info_part4":        "form1[0].#subform[5].Pt7Line6b_PartNumber[0]",
    "p7_add_info_item4":        "form1[0].#subform[5].Pt7Line6c_ItemNumber[0]",
    "p7_add_info_desc4":        "form1[0].#subform[5].Pt7Line6d_AdditionalInfo[0]",

    "p7_add_info_page5":        "form1[0].#subform[5].Pt7Line7a_PageNumber[0]",
    "p7_add_info_part5":        "form1[0].#subform[5].Pt7Line7b_PartNumber[0]",
    "p7_add_info_item5":        "form1[0].#subform[5].Pt7Line7c_ItemNumber[0]",
    "p7_add_info_desc5":        "form1[0].#subform[5].Pt7Line7d_AdditionalInfo[0]",

    # Header Repeat Fields (Page 6)
    "p7_header_family_name":    "form1[0].#subform[5].Pt1Line3a_FamilyName[1]",
    "p7_header_given_name":     "form1[0].#subform[5].Pt1Line3b_GivenName[1]",
    "p7_header_middle_name":    "form1[0].#subform[5].Pt1Line3c_MiddleName[1]",
    "p7_header_alien_number":   "form1[0].#subform[5].Pt1Line1_AlienNumber[1]",
}
