# backend/pdf_config.py

FIELD_MAPPING = {
    # ============================================
    # PART 1. RELATIONSHIP (Page 1)
    # ============================================
    
    # Q1: Relationship Type
    "relationship_Spouse": "form1[0].#subform[0].Pt1Line1_Spouse[0]", 
    "relationship_Parent": "form1[0].#subform[0].Pt1Line1_Parent[0]",   
    "relationship_BrotherSister": "form1[0].#subform[0].Pt1Line1_Siblings[0]",
    "relationship_Child": "form1[0].#subform[0].Pt1Line1_Child[0]",   

    # Q2: Relationship Detail (Conditional)
    "relationship_detail_ChildBornMarried": "form1[0].#subform[0].Pt1Line2_InWedlock[0]",
    "relationship_detail_Stepchild": "form1[0].#subform[0].Pt1Line2_Stepchild[0]",            
    "relationship_detail_ChildBornUnmarried": "form1[0].#subform[0].Pt1Line2_OutOfWedlock[0]",
    "relationship_detail_ChildAdopted": "form1[0].#subform[0].Pt1Line2_AdoptedChild[0]",

    # Q3: Sibling Adoption
    "sibling_adoption_Yes": "form1[0].#subform[0].Pt1Line3_Yes[0]",
    "sibling_adoption_No": "form1[0].#subform[0].Pt1Line3_No[0]",

    # Q4: Citizen Adoption
    "citizen_adoption_Yes": "form1[0].#subform[0].Pt1Line4_Yes[0]",
    "citizen_adoption_No": "form1[0].#subform[0].Pt1Line4_No[0]",
    
    # ============================================
    # PART 2. INFORMATION ABOUT YOU (Page 1 & 2)
    # ============================================
    
    # Registration Numbers
    "a_number": "form1[0].#subform[0].#area[4].Pt2Line1_AlienNumber[0]",          
    "uscis_account": "form1[0].#subform[0].#area[5].Pt2Line2_USCISOnlineActNumber[0]", 
    "ssn": "form1[0].#subform[0].Pt2Line11_SSN[0]",                               
    
    # Full Name (Current)
    "family_name": "form1[0].#subform[0].Pt2Line4a_FamilyName[0]",
    "given_name": "form1[0].#subform[0].Pt2Line4b_GivenName[0]",
    "middle_name": "form1[0].#subform[0].Pt2Line4c_MiddleName[0]",

    # Other Names Used (Item 5)
    "other_family_name": "form1[0].#subform[1].Pt2Line5a_FamilyName[0]",
    "other_given_name": "form1[0].#subform[1].Pt2Line5b_GivenName[0]",
    "other_middle_name": "form1[0].#subform[1].Pt2Line5c_MiddleName[0]",

    # Birth Information
    "city_of_birth": "form1[0].#subform[1].Pt2Line6_CityTownOfBirth[0]",
    "country_of_birth": "form1[0].#subform[1].Pt2Line7_CountryofBirth[0]",
    "date_of_birth": "form1[0].#subform[1].Pt2Line8_DateofBirth[0]", 

    # Sex (Q9)
    "sex_Male": "form1[0].#subform[1].Pt2Line9_Male[0]",
    "sex_Female": "form1[0].#subform[1].Pt2Line9_Female[0]",

    # ============================================
    # CURRENT PHYSICAL ADDRESS (Item 10)
    # ============================================
    "current_in_care_of": "form1[0].#subform[1].Pt2Line10_InCareofName[0]",
    "current_street": "form1[0].#subform[1].Pt2Line10_StreetNumberName[0]",
    
    # Unit Type for Current Address
    "current_unit_type_Apt": "form1[0].#subform[1].Pt2Line10_Unit[0]",
    "current_unit_type_Ste": "form1[0].#subform[1].Pt2Line10_Unit[1]",
    "current_unit_type_Flr": "form1[0].#subform[1].Pt2Line10_Unit[2]",
    
    "current_unit_number": "form1[0].#subform[1].Pt2Line10_AptSteFlrNumber[0]",
    "current_city": "form1[0].#subform[1].Pt2Line10_CityOrTown[0]",
    "current_state": "form1[0].#subform[1].Pt2Line10_State[0]",
    "current_zip": "form1[0].#subform[1].Pt2Line10_ZipCode[0]",
    "current_province": "form1[0].#subform[1].Pt2Line10_Province[0]",
    "current_postal_code": "form1[0].#subform[1].Pt2Line10_PostalCode[0]",
    "current_country": "form1[0].#subform[1].Pt2Line10_Country[0]",

    # ============================================
    # SAME MAILING ADDRESS (Item 11)
    # ============================================
    "same_mailing_address_Yes": "form1[0].#subform[1].Pt2Line11_Yes[0]",
    "same_mailing_address_No": "form1[0].#subform[1].Pt2Line11_No[0]",

    # ============================================
    # MAILING ADDRESS (Item 12) - If Different
    # ============================================
    "mailing_street": "form1[0].#subform[1].Pt2Line12_StreetNumberName[0]",
    
    # Unit Type for Mailing Address
    "mailing_unit_type_Apt": "form1[0].#subform[1].Pt2Line12_Unit[0]",
    "mailing_unit_type_Ste": "form1[0].#subform[1].Pt2Line12_Unit[1]",
    "mailing_unit_type_Flr": "form1[0].#subform[1].Pt2Line12_Unit[2]",
    
    "mailing_unit_number": "form1[0].#subform[1].Pt2Line12_AptSteFlrNumber[0]",
    "mailing_city": "form1[0].#subform[1].Pt2Line12_CityOrTown[0]",
    "mailing_state": "form1[0].#subform[1].Pt2Line12_State[0]",
    "mailing_zip": "form1[0].#subform[1].Pt2Line12_ZipCode[0]",
    "mailing_province": "form1[0].#subform[1].Pt2Line12_Province[0]",
    "mailing_postal_code": "form1[0].#subform[1].Pt2Line12_PostalCode[0]",
    "mailing_country": "form1[0].#subform[1].Pt2Line12_Country[0]",

    # ============================================
    # DATE RANGE AT CURRENT ADDRESS (Item 13)
    # ============================================
    "current_address_from": "form1[0].#subform[1].Pt2Line13a_DateFrom[0]",
    "current_address_to": "form1[0].#subform[1].Pt2Line13b_DateTo[0]",

    # ============================================
    # PREVIOUS PHYSICAL ADDRESS (Item 14)
    # ============================================
    "previous_street": "form1[0].#subform[1].Pt2Line14_StreetNumberName[0]",
    
    # Unit Type for Previous Address
    "previous_unit_type_Apt": "form1[0].#subform[1].Pt2Line14_Unit[0]",
    "previous_unit_type_Ste": "form1[0].#subform[1].Pt2Line14_Unit[1]",
    "previous_unit_type_Flr": "form1[0].#subform[1].Pt2Line14_Unit[2]",
    
    "previous_unit_number": "form1[0].#subform[1].Pt2Line14_AptSteFlrNumber[0]",
    "previous_city": "form1[0].#subform[1].Pt2Line14_CityOrTown[0]",
    "previous_state": "form1[0].#subform[1].Pt2Line14_State[0]",
    "previous_zip": "form1[0].#subform[1].Pt2Line14_ZipCode[0]",
    "previous_province": "form1[0].#subform[1].Pt2Line14_Province[0]",
    "previous_postal_code": "form1[0].#subform[1].Pt2Line14_PostalCode[0]",
    "previous_country": "form1[0].#subform[1].Pt2Line14_Country[0]",

    # ============================================
    # DATE RANGE AT PREVIOUS ADDRESS (Item 15)
    # ============================================
    "previous_address_from": "form1[0].#subform[1].Pt2Line15a_DateFrom[0]",
    "previous_address_to": "form1[0].#subform[1].Pt2Line15b_DateTo[0]",

    # ============================================
    # MARRIAGE INFORMATION (Items 16-17)
    # ============================================
    "number_of_marriages": "form1[0].#subform[1].Pt2Line16_NumberofMarriages[0]",
    
    # Current Marital Status (Q17)
    "marital_status_Single": "form1[0].#subform[1].Pt2Line17_Single[0]",
    "marital_status_Married": "form1[0].#subform[1].Pt2Line17_Married[0]",
    "marital_status_Divorced": "form1[0].#subform[1].Pt2Line17_Divorced[0]",
    "marital_status_Widowed": "form1[0].#subform[1].Pt2Line17_Widowed[0]",
    "marital_status_Separated": "form1[0].#subform[1].Pt2Line17_Separated[0]",
    "marital_status_Annulled": "form1[0].#subform[1].Pt2Line17_Annulled[0]",


    # Page 3 - Spouse
"Pt2Line20a_FamilyName": "form1[0].#subform[2].PtLine20a_FamilyName[0]",
"Pt2Line20b_GivenName": "form1[0].#subform[2].Pt2Line20b_GivenName[0]",
"Pt2Line20c_MiddleName": "form1[0].#subform[2].Pt2Line20c_MiddleName[0]",
"Pt2Line18_DateOfMarriage": "form1[0].#subform[2].Pt2Line18_DateOfMarriage[0]",

"Pt2Line19a_CityTown": "form1[0].#subform[2].Pt2Line19a_CityTown[0]",
"Pt2Line19b_State": "form1[0].#subform[2].Pt2Line19b_State[0]",
"Pt2Line19c_Province": "form1[0].#subform[2].Pt2Line19c_Province[0]",
"Pt2Line19d_Country": "form1[0].#subform[2].Pt2Line19d_Country[0]",
"Pt2Line21_DateMarriageEnded": "form1[0].#subform[2].Pt2Line21_DateMarriageEnded[0]",
"Pt2Line22a_FamilyName": "form1[0].#subform[2].Pt2Line22a_FamilyName[0]",
"Pt2Line22b_GivenName": "form1[0].#subform[2].Pt2Line22b_GivenName[0]",
"Pt2Line22c_MiddleName": "form1[0].#subform[2].Pt2Line22c_MiddleName[0]",
"Pt2Line23_DateMarriageEnded": "form1[0].#subform[2].Pt2Line23_DateMarriageEnded[0]",

"Pt2Line23a_checkbox": "form1[0].#subform[2].Pt2Line23a_checkbox[0]",
"Pt2Line23b_checkbox": "form1[0].#subform[2].Pt2Line23b_checkbox[0]",
"Pt2Line23c_checkbox": "form1[0].#subform[2].Pt2Line23c_checkbox[0]",
"Pt2Line23_DateMarriageEnded": "form1[0].#subform[2].Pt2Line23_DateMarriageEnded[0]",

# Child 1
"Pt2Line24_FamilyName": "form1[0].#subform[2].Pt2Line24_FamilyName[0]",
"Pt2Line24_GivenName": "form1[0].#subform[2].Pt2Line24_GivenName[0]",
"Pt2Line24_MiddleName": "form1[0].#subform[2].Pt2Line24_MiddleName[0]",
"Pt2Line25_DateofBirth": "form1[0].#subform[2].Pt2Line25_DateofBirth[0]",
"Pt2Line26_Male": "form1[0].#subform[2].Pt2Line26_Male[0]",
"Pt2Line26_Female": "form1[0].#subform[2].Pt2Line26_Female[0]",
"Pt2Line27_CountryofBirth": "form1[0].#subform[2].Pt2Line27_CountryofBirth[0]",
"Pt2Line28_CityTownOrVillageOfResidence": "form1[0].#subform[2].Pt2Line28_CityTownOrVillageOfResidence[0]",
"Pt2Line29_CountryOfResidence": "form1[0].#subform[2].Pt2Line29_CountryOfResidence[0]",

# Child 2
"Pt2Line30a_FamilyName": "form1[0].#subform[2].Pt2Line30a_FamilyName[0]",
"Pt2Line30b_GivenName": "form1[0].#subform[2].Pt2Line30b_GivenName[0]",
"Pt2Line30c_MiddleName": "form1[0].#subform[2].Pt2Line30c_MiddleName[0]",
"Pt2Line31_DateofBirth": "form1[0].#subform[2].Pt2Line31_DateofBirth[0]",
"Pt2Line32_Male": "form1[0].#subform[2].Pt2Line32_Male[0]",
"Pt2Line32_Female": "form1[0].#subform[2].Pt2Line32_Female[0]",
"Pt2Line33_CountryofBirth": "form1[0].#subform[2].Pt2Line33_CountryofBirth[0]",
"Pt2Line34_CityTownOrVillageOfResidence": "form1[0].#subform[2].Pt2Line34_CityTownOrVillageOfResidence[0]",
"Pt2Line35_CountryOfResidence": "form1[0].#subform[2].Pt2Line35_CountryOfResidence[0]",

# Immigration Status
"Pt2Line36_USCitizen": "form1[0].#subform[2].Pt2Line36_USCitizen[0]",
"Pt2Line36_LPR": "form1[0].#subform[2].Pt2Line36_LPR[0]",
"Pt2Line36_Yes": "form1[0].#subform[2].Pt2Line36_Yes[0]",
"Pt2Line36_No": "form1[0].#subform[2].Pt2Line36_No[0]",
"Pt2Line37a_CertificateNumber": "form1[0].#subform[2].Pt2Line37a_CertificateNumber[0]",
"Pt2Line37b_PlaceOfIssuance": "form1[0].#subform[2].Pt2Line37b_PlaceOfIssuance[0]",
"Pt2Line37c_DateOfIssuance": "form1[0].#subform[2].Pt2Line37c_DateOfIssuance[0]",
# ============================================
# PAGE 4 - ADDITIONAL INFO
# ============================================

# 40
"Pt2Line40a_ClassOfAdmission": "form1[0].#subform[3].Pt2Line40a_ClassOfAdmission[0]",
"Pt2Line40b_DateOfAdmission": "form1[0].#subform[3].Pt2Line40b_DateOfAdmission[0]",
"Pt2Line40d_CityOrTown": "form1[0].#subform[3].Pt2Line40d_CityOrTown[0]",
"Pt2Line40e_State": "form1[0].#subform[3].Pt2Line40e_State[0]",

# 41
"Pt2Line41_Yes": "form1[0].#subform[3].Pt2Line41_Yes[0]",
"Pt2Line41_No": "form1[0].#subform[3].Pt2Line41_No[0]",
"Pt2Line41_StreetNumberName": "form1[0].#subform[3].Pt2Line41_StreetNumberName[0]",
"Pt2Line41_Unit[0]": "form1[0].#subform[3].Pt2Line41_Unit[0]",
"Pt2Line41_Unit[1]": "form1[0].#subform[3].Pt2Line41_Unit[1]",
"Pt2Line41_Unit[2]": "form1[0].#subform[3].Pt2Line41_Unit[2]",
"Pt2Line41_AptSteFlrNumber": "form1[0].#subform[3].Pt2Line41_AptSteFlrNumber[0]",
"Pt2Line41_CityOrTown": "form1[0].#subform[3].Pt2Line41_CityOrTown[0]",
"Pt2Line41_State": "form1[0].#subform[3].Pt2Line41_State[0]",
"Pt2Line41_ZipCode": "form1[0].#subform[3].Pt2Line41_ZipCode[0]",
"Pt2Line41_Province": "form1[0].#subform[3].Pt2Line41_Province[0]",
"Pt2Line41_PostalCode": "form1[0].#subform[3].Pt2Line41_PostalCode[0]",
"Pt2Line41_Country": "form1[0].#subform[3].Pt2Line41_Country[0]",

# 42-47
"Pt2Line42_Occupation": "form1[0].#subform[3].Pt2Line42_Occupation[0]",
"Pt2Line43a_DateFrom": "form1[0].#subform[3].Pt2Line43a_DateFrom[0]",
"Pt2Line43b_DateTo": "form1[0].#subform[3].Pt2Line43b_DateTo[0]",
"Pt2Line44_EmployerOrOrgName": "form1[0].#subform[3].Pt2Line44_EmployerOrOrgName[0]",
"Pt2Line45_StreetNumberName": "form1[0].#subform[3].Pt2Line45_StreetNumberName[0]",
"Pt2Line45_Unit[0]": "form1[0].#subform[3].Pt2Line45_Unit[0]",
"Pt2Line45_Unit[1]": "form1[0].#subform[3].Pt2Line45_Unit[1]",
"Pt2Line45_Unit[2]": "form1[0].#subform[3].Pt2Line45_Unit[2]",
"Pt2Line45_AptSteFlrNumber": "form1[0].#subform[3].Pt2Line45_AptSteFlrNumber[0]",
"Pt2Line45_CityOrTown": "form1[0].#subform[3].Pt2Line45_CityOrTown[0]",
"Pt2Line45_State": "form1[0].#subform[3].Pt2Line45_State[0]",
"Pt2Line45_ZipCode": "form1[0].#subform[3].Pt2Line45_ZipCode[0]",
"Pt2Line45_Province": "form1[0].#subform[3].Pt2Line45_Province[0]",
"Pt2Line45_PostalCode": "form1[0].#subform[3].Pt2Line45_PostalCode[0]",
"Pt2Line45_Country": "form1[0].#subform[3].Pt2Line45_Country[0]",
"Pt2Line46_Occupation": "form1[0].#subform[3].Pt2Line46_Occupation[0]",
"Pt2Line47a_DateFrom": "form1[0].#subform[3].Pt2Line47a_DateFrom[0]",
"Pt2Line47b_DateTo": "form1[0].#subform[3].Pt2Line47b_DateTo[0]",

# 48-52
"Pt3Line1_Ethnicity[0]": "form1[0].#subform[3].Pt3Line1_Ethnicity[0]",
"Pt3Line1_Ethnicity[1]": "form1[0].#subform[3].Pt3Line1_Ethnicity[1]",
"Pt3Line2_Race_White": "form1[0].#subform[3].Pt3Line2_Race_White[0]",
"Pt3Line2_Race_Asian": "form1[0].#subform[3].Pt3Line2_Race_Asian[0]",
"Pt3Line2_Race_Black": "form1[0].#subform[3].Pt3Line2_Race_Black[0]",
"Pt3Line2_Race_AmericanIndianAlaskaNative": "form1[0].#subform[3].Pt3Line2_Race_AmericanIndianAlaskaNative[0]",
"Pt3Line2_Race_NativeHawaiianOtherPacificIslander": "form1[0].#subform[3].Pt3Line2_Race_NativeHawaiianOtherPacificIslander[0]",
"Pt3Line3_HeightFeet": "form1[0].#subform[3].Pt3Line3_HeightFeet[0]",
"Pt3Line3_HeightInches": "form1[0].#subform[3].Pt3Line3_HeightInches[0]",
"Pt3Line5_EyeColor[0]": "form1[0].#subform[3].Pt3Line5_EyeColor[0]",
"Pt3Line5_EyeColor[1]": "form1[0].#subform[3].Pt3Line5_EyeColor[1]",
"Pt3Line5_EyeColor[2]": "form1[0].#subform[3].Pt3Line5_EyeColor[2]",
"Pt3Line5_EyeColor[3]": "form1[0].#subform[3].Pt3Line5_EyeColor[3]",
"Pt3Line5_EyeColor[4]": "form1[0].#subform[3].Pt3Line5_EyeColor[4]",
"Pt3Line5_EyeColor[5]": "form1[0].#subform[3].Pt3Line5_EyeColor[5]",
"Pt3Line5_EyeColor[6]": "form1[0].#subform[3].Pt3Line5_EyeColor[6]",
"Pt3Line5_EyeColor[7]": "form1[0].#subform[3].Pt3Line5_EyeColor[7]",
"Pt3Line5_EyeColor[8]": "form1[0].#subform[3].Pt3Line5_EyeColor[8]",


# page 5 and page6
# ============================================
# PAGE 5 - PART 4 (Applicant Info)
# ============================================

"Pt4Line1_AlienNumber": "form1[0].#subform[4].#area[6].Pt4Line1_AlienNumber[0]",
"Pt4Line2_USCISOnlineActNumber": "form1[0].#subform[4].#area[7].Pt4Line2_USCISOnlineActNumber[0]",
"Pt4Line3_SSN": "form1[0].#subform[4].Pt4Line3_SSN[0]",
"Pt4Line4a_FamilyName": "form1[0].#subform[4].Pt4Line4a_FamilyName[0]",
"Pt4Line4b_GivenName": "form1[0].#subform[4].Pt4Line4b_GivenName[0]",
"Pt4Line4c_MiddleName": "form1[0].#subform[4].Pt4Line4c_MiddleName[0]",
"P4Line5a_FamilyName": "form1[0].#subform[4].P4Line5a_FamilyName[0]",
"Pt4Line5b_GivenName": "form1[0].#subform[4].Pt4Line5b_GivenName[0]",
"Pt4Line5c_MiddleName": "form1[0].#subform[4].Pt4Line5c_MiddleName[0]",
"Pt4Line7_CityTownOfBirth": "form1[0].#subform[4].Pt4Line7_CityTownOfBirth[0]",
"Pt4Line8_CountryOfBirth": "form1[0].#subform[4].Pt4Line8_CountryOfBirth[0]",
"Pt4Line9_DateOfBirth": "form1[0].#subform[4].Pt4Line9_DateOfBirth[0]",
"Pt4Line9_Male": "form1[0].#subform[4].Pt4Line9_Male[0]",
"Pt4Line9_Female": "form1[0].#subform[4].Pt4Line9_Female[0]",

# Hair Color (Pt3Line6) - Checkboxes
"Pt3Line6_HairColor_Black": "form1[0].#subform[4].Pt3Line6_HairColor[0]",
"Pt3Line6_HairColor_Blonde": "form1[0].#subform[4].Pt3Line6_HairColor[1]",
"Pt3Line6_HairColor_Brown": "form1[0].#subform[4].Pt3Line6_HairColor[2]",
"Pt3Line6_HairColor_Gray": "form1[0].#subform[4].Pt3Line6_HairColor[3]",
"Pt3Line6_HairColor_Red": "form1[0].#subform[4].Pt3Line6_HairColor[4]",
"Pt3Line6_HairColor_Sandy": "form1[0].#subform[4].Pt3Line6_HairColor[5]",
"Pt3Line6_HairColor_White": "form1[0].#subform[4].Pt3Line6_HairColor[6]",
"Pt3Line6_HairColor_Bald": "form1[0].#subform[4].Pt3Line6_HairColor[7]",
"Pt3Line6_HairColor_Unknown": "form1[0].#subform[4].Pt3Line6_HairColor[8]",

# Pt4Line10 - Ethnicity
"Pt4Line10_Yes": "form1[0].#subform[4].Pt4Line10_Yes[0]",
"Pt4Line10_No": "form1[0].#subform[4].Pt4Line10_No[0]",
"Pt4Line10_Unknown": "form1[0].#subform[4].Pt4Line10_Unknown[0]",

# Current Physical Address (Pt4Line11)
"Pt4Line11_StreetNumberName": "form1[0].#subform[4].Pt4Line11_StreetNumberName[0]",
"Pt4Line11_Unit_Ste": "form1[0].#subform[4].Pt4Line11_Unit[0]",
"Pt4Line11_Unit_Apt": "form1[0].#subform[4].Pt4Line11_Unit[1]",
"Pt4Line11_Unit_Flr": "form1[0].#subform[4].Pt4Line11_Unit[2]",
"Pt4Line11_AptSteFlrNumber": "form1[0].#subform[4].Pt4Line11_AptSteFlrNumber[0]",
"Pt4Line11_CityOrTown": "form1[0].#subform[4].Pt4Line11_CityOrTown[0]",
"Pt4Line11_State": "form1[0].#subform[4].Pt4Line11_State[0]",
"Pt4Line11_ZipCode": "form1[0].#subform[4].Pt4Line11_ZipCode[0]",
"Pt4Line11_Province": "form1[0].#subform[4].Pt4Line11_Province[0]",
"Pt4Line11_PostalCode": "form1[0].#subform[4].Pt4Line11_PostalCode[0]",
"Pt4Line11_Country": "form1[0].#subform[4].Pt4Line11_Country[0]",

# Mailing Address (Pt4Line12)
"Pt4Line12a_StreetNumberName": "form1[0].#subform[4].Pt4Line12a_StreetNumberName[0]",
"Pt4Line12b_Unit_Ste": "form1[0].#subform[4].Pt4Line12b_Unit[0]",
"Pt4Line12b_Unit_Apt": "form1[0].#subform[4].Pt4Line12b_Unit[1]",
"Pt4Line12b_Unit_Flr": "form1[0].#subform[4].Pt4Line12b_Unit[2]",
"Pt4Line12b_AptSteFlrNumber": "form1[0].#subform[4].Pt4Line12b_AptSteFlrNumber[0]",
"Pt4Line12c_CityOrTown": "form1[0].#subform[4].Pt4Line12c_CityOrTown[0]",
"Pt4Line12d_State": "form1[0].#subform[4].Pt4Line12d_State[0]",
"Pt4Line12e_ZipCode": "form1[0].#subform[4].Pt4Line12e_ZipCode[0]",

# Address in Care Of (Pt4Line13)
"Pt4Line13_StreetNumberName": "form1[0].#subform[4].Pt4Line13_StreetNumberName[0]",
"Pt4Line13_Unit_Ste": "form1[0].#subform[4].Pt4Line13_Unit[0]",
"Pt4Line13_Unit_Apt": "form1[0].#subform[4].Pt4Line13_Unit[1]",
"Pt4Line13_Unit_Flr": "form1[0].#subform[4].Pt4Line13_Unit[2]",
"Pt4Line13_AptSteFlrNumber": "form1[0].#subform[4].Pt4Line13_AptSteFlrNumber[0]",
"Pt4Line13_CityOrTown": "form1[0].#subform[4].Pt4Line13_CityOrTown[0]",
"Pt4Line13_Province": "form1[0].#subform[4].Pt4Line13_Province[0]",
"Pt4Line13_PostalCode": "form1[0].#subform[4].Pt4Line13_PostalCode[0]",
"Pt4Line13_Country": "form1[0].#subform[4].Pt4Line13_Country[0]",

# Daytime Phone
"Pt4Line14_DaytimePhoneNumber": "form1[0].#subform[4].Pt4Line14_DaytimePhoneNumber[0]",

# ============================================
# PAGE 6 - PART 4 (Continued)
# ============================================

# Mobile & Email
"Pt4Line15_MobilePhoneNumber": "form1[0].#subform[5].Pt4Line15_MobilePhoneNumber[0]",
"Pt4Line16_EmailAddress": "form1[0].#subform[5].Pt4Line16_EmailAddress[0]",

# Number of Marriages
"Pt4Line17_NumberofMarriages": "form1[0].#subform[5].Pt4Line17_NumberofMarriages[0]",

# Marital Status Checkboxes
"Pt4Line18_Married": "form1[0].#subform[5].Pt4Line18_MaritalStatus[0]",
"Pt4Line18_Divorced": "form1[0].#subform[5].Pt4Line18_MaritalStatus[1]",
"Pt4Line18_Widowed": "form1[0].#subform[5].Pt4Line18_MaritalStatus[2]",
"Pt4Line18_Single": "form1[0].#subform[5].Pt4Line18_MaritalStatus[3]",
"Pt4Line18_Annulled": "form1[0].#subform[5].Pt4Line18_MaritalStatus[4]",
"Pt4Line18_LegallySeparated": "form1[0].#subform[5].Pt4Line18_MaritalStatus[5]",

# Current Spouse Name
"Pt4Line18a_FamilyName": "form1[0].#subform[5].Pt4Line18a_FamilyName[0]",
"Pt4Line18b_GivenName": "form1[0].#subform[5].Pt4Line18b_GivenName[0]",
"Pt4Line18c_MiddleName": "form1[0].#subform[5].Pt4Line18c_MiddleName[0]",

# Date of Marriage
"Pt4Line19_DateOfMarriage": "form1[0].#subform[5].Pt4Line19_DateOfMarriage[0]",

# Place of Marriage
"Pt4Line20a_CityTown": "form1[0].#subform[5].Pt4Line20a_CityTown[0]",
"Pt4Line20b_State": "form1[0].#subform[5].Pt4Line20b_State[0]",
"Pt4Line20c_Province": "form1[0].#subform[5].Pt4Line20c_Province[0]",
"Pt4Line20d_Country": "form1[0].#subform[5].Pt4Line20d_Country[0]",

# Previous Spouse
"Pt4Line16a_FamilyName": "form1[0].#subform[5].Pt4Line16a_FamilyName[0]",
"Pt4Line16b_GivenName": "form1[0].#subform[5].Pt4Line16b_GivenName[0]",
"Pt4Line16c_MiddleName": "form1[0].#subform[5].Pt4Line16c_MiddleName[0]",
"Pt4Line17_DateMarriageEnded": "form1[0].#subform[5].Pt4Line17_DateMarriageEnded[0]",
"Pt4Line17_DateMarriageEnded_Extra": "form1[0].#subform[5].Pt4Line17_DateMarriageEnded[1]",

# Child 1
"Pt4Line30a_FamilyName": "form1[0].#subform[5].Pt4Line30a_FamilyName[0]",
"Pt4Line30b_GivenName": "form1[0].#subform[5].Pt4Line30b_GivenName[0]",
"Pt4Line30c_MiddleName": "form1[0].#subform[5].Pt4Line30c_MiddleName[0]",
"Pt4Line31_Relationship": "form1[0].#subform[5].Pt4Line31_Relationship[0]",
"Pt4Line32_DateOfBirth": "form1[0].#subform[5].Pt4Line32_DateOfBirth[0]",
"Pt4Line49_CountryOfBirth": "form1[0].#subform[5].Pt4Line49_CountryOfBirth[0]",

# Child 2
"Pt4Line34a_FamilyName": "form1[0].#subform[5].Pt4Line34a_FamilyName[0]",
"Pt4Line34b_GivenName": "form1[0].#subform[5].Pt4Line34b_GivenName[0]",
"Pt4Line34c_MiddleName": "form1[0].#subform[5].Pt4Line34c_MiddleName[0]",
"Pt4Line35_Relationship": "form1[0].#subform[5].Pt4Line35_Relationship[0]",
"Pt4Line36_DateOfBirth": "form1[0].#subform[5].Pt4Line36_DateOfBirth[0]",
"Pt4Line37_CountryOfBirth": "form1[0].#subform[5].Pt4Line37_CountryOfBirth[0]",

# Child 3
"Pt4Line38a_FamilyName": "form1[0].#subform[5].Pt4Line38a_FamilyName[0]",
"Pt4Line38b_GivenName": "form1[0].#subform[5].Pt4Line38b_GivenName[0]",
"Pt4Line38c_MiddleName": "form1[0].#subform[5].Pt4Line38c_MiddleName[0]",
"Pt4Line39_Relationship": "form1[0].#subform[5].Pt4Line39_Relationship[0]",
"Pt4Line40_DateOfBirth": "form1[0].#subform[5].Pt4Line40_DateOfBirth[0]",
"Pt4Line41_CountryOfBirth": "form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]",

# Barcode (PDF417)
"PDF417BarCode1": "form1[0].#pageSet[0].Page1[5].PDF417BarCode1[0]",


# page 7
}
