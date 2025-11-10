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
}