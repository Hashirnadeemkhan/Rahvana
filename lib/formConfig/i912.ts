import type { Field } from './types';

export const formId = 'i912';
export const formTitle = 'Form I-912';
export const formSubtitle = 'Request for Fee Waiver';

export const formFields: Field[] = [
  // === Part 1: Basis for Your Request ===
  { key: 'pt1_l1_checkbox', pdfKey: 'pt1_l1_checkbox', label: 'I am receiving a means-tested benefit (such as SNAP, Medicaid, SSI, TANF, or other state/local benefits)', type: 'checkbox', section: 'Part 1: Basis for Your Request' },
  { key: 'pt1_l2_checkbox', pdfKey: 'pt1_l2_checkbox', label: 'My household income is at or below 150% of the Federal Poverty Guidelines', type: 'checkbox', section: 'Part 1: Basis for Your Request' },
  { key: 'pt1_l3_checkbox', pdfKey: 'pt1_l3_checkbox', label: 'I am experiencing a financial hardship that prevents me from paying the filing fee', type: 'checkbox', section: 'Part 1: Basis for Your Request' },
  
  // === Part 2: Information About You (Requestor) ===
  { key: 's_0_p2_l2_familyname', pdfKey: 's_0_p2_l2_familyname', label: 'Your Family Name (Last Name)', type: 'text', section: 'Part 2: Information About You' },
  { key: 's_0_p2_l2_givenname', pdfKey: 's_0_p2_l2_givenname', label: 'Your Given Name (First Name)', type: 'text', section: 'Part 2: Information About You' },
  { key: 's_0_p2_l2_middlename', pdfKey: 's_0_p2_l2_middlename', label: 'Your Middle Name', type: 'text', section: 'Part 2: Information About You' },
  
  { key: 's_0_p2_l3_familyname', pdfKey: 's_0_p2_l3_familyname', label: 'Other Family Names You Have Used (if any)', type: 'text', section: 'Part 2: Information About You' },
  { key: 's_0_p2_l3_givenname', pdfKey: 's_0_p2_l3_givenname', label: 'Other Given Names You Have Used (if any)', type: 'text', section: 'Part 2: Information About You' },
  { key: 's_0_p2_l3_middlename', pdfKey: 's_0_p2_l3_middlename', label: 'Other Middle Names You Have Used (if any)', type: 'text', section: 'Part 2: Information About You' },
  
  { key: 'pt2_l3_aliennumber', pdfKey: 'pt2_l3_aliennumber', label: 'Alien Registration Number (A-Number), if any', type: 'text', section: 'Part 2: Information About You' },
  { key: 'pt2_l4_acctidentifier', pdfKey: 'pt2_l4_acctidentifier', label: 'USCIS Online Account Number (if any)', type: 'text', section: 'Part 2: Information About You' },
  { key: 's_1_p2_5_dateofbirth', pdfKey: 's_1_p2_5_dateofbirth', label: 'Your Date of Birth (mm/dd/yyyy)', type: 'date', section: 'Part 2: Information About You' },
  { key: 'pt2_l6_ssn', pdfKey: 'pt2_l6_ssn', label: 'U.S. Social Security Number (if any)', type: 'text', section: 'Part 2: Information About You' },
  
  { key: 's_1_p2_7_maritalstatus', pdfKey: 's_1_p2_7_maritalstatus', label: 'Single, Never Married', type: 'checkbox', section: 'Part 2: Information About You' },
  { key: 's_1_p2_7_maritalstatus_1', pdfKey: 's_1_p2_7_maritalstatus_1', label: 'Married', type: 'checkbox', section: 'Part 2: Information About You' },
  { key: 's_1_p2_7_maritalstatus_2', pdfKey: 's_1_p2_7_maritalstatus_2', label: 'Divorced', type: 'checkbox', section: 'Part 2: Information About You' },
  { key: 's_1_p2_7_maritalstatus_3', pdfKey: 's_1_p2_7_maritalstatus_3', label: 'Widowed', type: 'checkbox', section: 'Part 2: Information About You' },
  { key: 's_1_p2_7_maritalstatus_4', pdfKey: 's_1_p2_7_maritalstatus_4', label: 'Marriage Annulled', type: 'checkbox', section: 'Part 2: Information About You' },
  { key: 's_1_p2_7_maritalstatus_5', pdfKey: 's_1_p2_7_maritalstatus_5', label: 'Separated', type: 'checkbox', section: 'Part 2: Information About You' },
  
  // === Part 3: Applications and Petitions for Which You Are Requesting a Fee Waiver ===
  { key: 's_1_part3_line1_name1', pdfKey: 's_1_part3_line1_name1', label: 'Full Name of Person #1', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 'pt3_l1_aliennumber', pdfKey: 'pt3_l1_aliennumber', label: 'A-Number of Person #1', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_dateofbirth1', pdfKey: 's_1_part3_line1_dateofbirth1', label: 'Date of Birth of Person #1', type: 'date', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part4_line2a_relationshiptoyou1', pdfKey: 's_1_part4_line2a_relationshiptoyou1', label: 'Relationship to You (Person #1)', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_formsfiled1', pdfKey: 's_1_part3_line1_formsfiled1', label: 'Forms Being Filed for Person #1', type: 'text', section: 'Part 3: Applications and Petitions' },
  
  { key: 's_1_part3_line1_name2', pdfKey: 's_1_part3_line1_name2', label: 'Full Name of Person #2', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 'pt3_l1_aliennumber2', pdfKey: 'pt3_l1_aliennumber2', label: 'A-Number of Person #2', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_dateofbirth2', pdfKey: 's_1_part3_line1_dateofbirth2', label: 'Date of Birth of Person #2', type: 'date', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_formsfiled2', pdfKey: 's_1_part3_line1_formsfiled2', label: 'Forms Being Filed for Person #2', type: 'text', section: 'Part 3: Applications and Petitions' },
  
  { key: 's_1_part3_line1_name3', pdfKey: 's_1_part3_line1_name3', label: 'Full Name of Person #3', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 'pt3_l1_aliennumber3', pdfKey: 'pt3_l1_aliennumber3', label: 'A-Number of Person #3', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_dateofbirth3', pdfKey: 's_1_part3_line1_dateofbirth3', label: 'Date of Birth of Person #3', type: 'date', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_formsfiled3', pdfKey: 's_1_part3_line1_formsfiled3', label: 'Forms Being Filed for Person #3', type: 'text', section: 'Part 3: Applications and Petitions' },
  
  { key: 's_1_part3_line1_name4', pdfKey: 's_1_part3_line1_name4', label: 'Full Name of Person #4', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 'pt3_l1_aliennumber4', pdfKey: 'pt3_l1_aliennumber4', label: 'A-Number of Person #4', type: 'text', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_dateofbirth4', pdfKey: 's_1_part3_line1_dateofbirth4', label: 'Date of Birth of Person #4', type: 'date', section: 'Part 3: Applications and Petitions' },
  { key: 's_1_part3_line1_formsfiled4', pdfKey: 's_1_part3_line1_formsfiled4', label: 'Forms Being Filed for Person #4', type: 'text', section: 'Part 3: Applications and Petitions' },
  
  { key: 's_1_part3_line1_totalforms', pdfKey: 's_1_part3_line1_totalforms', label: 'Total Number of Forms (including yourself)', type: 'text', section: 'Part 3: Applications and Petitions' },
  
  // === Part 4: Means-Tested Benefits ===
  { key: 's_1_part4_line1_fullname1', pdfKey: 's_1_part4_line1_fullname1', label: 'Full Name of Person Receiving Benefit #1', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_relationship1', pdfKey: 's_1_part4_line1_relationship1', label: 'Relationship to You #1', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_typeofbene1', pdfKey: 's_1_part4_line1_typeofbene1', label: 'Type of Benefit #1', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_agency1', pdfKey: 's_1_part4_line1_agency1', label: 'Name of Agency Awarding Benefit #1', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_dateaward1', pdfKey: 's_1_part4_line1_dateaward1', label: 'Date Benefit #1 was Awarded', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_expdate1', pdfKey: 's_1_part4_line1_expdate1', label: 'Date Benefit #1 Expires (or must be renewed)', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  
  { key: 's_1_part4_line1_fullname2', pdfKey: 's_1_part4_line1_fullname2', label: 'Full Name of Person Receiving Benefit #2', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_relationship2', pdfKey: 's_1_part4_line1_relationship2', label: 'Relationship to You #2', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_typeofbene2', pdfKey: 's_1_part4_line1_typeofbene2', label: 'Type of Benefit #2', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_agency2', pdfKey: 's_1_part4_line1_agency2', label: 'Name of Agency Awarding Benefit #2', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_dateaward2', pdfKey: 's_1_part4_line1_dateaward2', label: 'Date Benefit #2 was Awarded', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_expdate2', pdfKey: 's_1_part4_line1_expdate2', label: 'Date Benefit #2 Expires (or must be renewed)', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  
  { key: 's_1_part4_line1_fullname3', pdfKey: 's_1_part4_line1_fullname3', label: 'Full Name of Person Receiving Benefit #3', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_relationship3', pdfKey: 's_1_part4_line1_relationship3', label: 'Relationship to You #3', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_typeofbene3', pdfKey: 's_1_part4_line1_typeofbene3', label: 'Type of Benefit #3', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_agency3', pdfKey: 's_1_part4_line1_agency3', label: 'Name of Agency Awarding Benefit #3', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_dateaward3', pdfKey: 's_1_part4_line1_dateaward3', label: 'Date Benefit #3 was Awarded', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_expdate3', pdfKey: 's_1_part4_line1_expdate3', label: 'Date Benefit #3 Expires (or must be renewed)', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  
  { key: 's_1_part4_line1_fullname4', pdfKey: 's_1_part4_line1_fullname4', label: 'Full Name of Person Receiving Benefit #4', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_relationship4', pdfKey: 's_1_part4_line1_relationship4', label: 'Relationship to You #4', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_typeofbene4', pdfKey: 's_1_part4_line1_typeofbene4', label: 'Type of Benefit #4', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_agency4', pdfKey: 's_1_part4_line1_agency4', label: 'Name of Agency Awarding Benefit #4', type: 'text', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_dateaward4', pdfKey: 's_1_part4_line1_dateaward4', label: 'Date Benefit #4 was Awarded', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  { key: 's_1_part4_line1_expdate4', pdfKey: 's_1_part4_line1_expdate4', label: 'Date Benefit #4 Expires (or must be renewed)', type: 'date', section: 'Part 4: Means-Tested Benefits' },
  
  // === Part 5: Income at or Below 150% of Federal Poverty Guidelines ===
  { key: 's_2_p5_1_employmentstatus', pdfKey: 's_2_p5_1_employmentstatus', label: 'Employed (full-time, part-time, seasonal, self-employed)', type: 'checkbox', section: 'Part 5: Income Information' },
  { key: 's_2_p5_1_employmentstatus_1', pdfKey: 's_2_p5_1_employmentstatus_1', label: 'Unemployed or Not Employed', type: 'checkbox', section: 'Part 5: Income Information' },
  { key: 's_2_p5_1_employmentstatus_2', pdfKey: 's_2_p5_1_employmentstatus_2', label: 'Retired', type: 'checkbox', section: 'Part 5: Income Information' },
  
  { key: 's_2_#area_0_part5_line2_chbxyesno', pdfKey: 's_2_#area_0_part5_line2_chbxyesno', label: 'Are you currently receiving unemployment benefits? - Yes', type: 'checkbox', section: 'Part 5: Income Information' },
  { key: 's_2_#area_0_part5_line2_chbxyesno_1', pdfKey: 's_2_#area_0_part5_line2_chbxyesno_1', label: 'Are you currently receiving unemployment benefits? - No', type: 'checkbox', section: 'Part 5: Income Information' },
  { key: 's_2_p5_2a_dateofunemployment', pdfKey: 's_2_p5_2a_dateofunemployment', label: 'Date you became unemployed (mm/dd/yyyy)', type: 'date', section: 'Part 5: Income Information' },
  
  { key: 's_2_part5_line3_totalhousesize', pdfKey: 's_2_part5_line3_totalhousesize', label: 'What is your total household size?', type: 'text', section: 'Part 5: Income Information' },
  { key: 's_2_part5_line4_totalhousehold', pdfKey: 's_2_part5_line4_totalhousehold', label: 'What is the total number of household members earning income (including yourself)?', type: 'text', section: 'Part 5: Income Information' },
  { key: 's_2_part5_line5_namehousehold', pdfKey: 's_2_part5_line5_namehousehold', label: 'Name of head of household (if not you)', type: 'text', section: 'Part 5: Income Information' },
  
  { key: 's_2_monthlyincome', pdfKey: 's_2_monthlyincome', label: 'Your Annual Adjusted Gross Income', type: 'text', section: 'Part 5: Income Information' },
  { key: 's_2_avghousehold', pdfKey: 's_2_avghousehold', label: 'Annual Adjusted Gross Income of All Family Members', type: 'text', section: 'Part 5: Income Information' },
  { key: 's_2_total', pdfKey: 's_2_total', label: 'Total Adjusted Household Income', type: 'text', section: 'Part 5: Income Information' },
  
  { key: 's_2_#area_1_part5_line9_checkbox', pdfKey: 's_2_#area_1_part5_line9_checkbox', label: 'Has anything changed since you filed your Federal tax returns? - Yes', type: 'checkbox', section: 'Part 5: Income Information' },
  { key: 's_2_#area_1_part5_line9_checkbox_1', pdfKey: 's_2_#area_1_part5_line9_checkbox_1', label: 'Has anything changed since you filed your Federal tax returns? - No', type: 'checkbox', section: 'Part 5: Income Information' },
  { key: 's_2_part5_line9_explanation', pdfKey: 's_2_part5_line9_explanation', label: 'If Yes, provide an explanation', type: 'text', section: 'Part 5: Income Information' },
  
  // === Part 6: Financial Hardship ===
  { key: 's_3_part6_line1_situation', pdfKey: 's_3_part6_line1_situation', label: 'Describe your circumstances that you would like USCIS to consider (homelessness, major medical debt, natural disasters, etc.)', type: 'text', section: 'Part 6: Financial Hardship' },
  
  { key: 's_3_part7_line2a_typeofasset', pdfKey: 's_3_part7_line2a_typeofasset', label: 'Type of Asset #1', type: 'text', section: 'Part 6: Financial Hardship' },
  { key: 's_3_assets1', pdfKey: 's_3_assets1', label: 'Value of Asset #1 (U.S. Dollars)', type: 'text', section: 'Part 6: Financial Hardship' },
  { key: 's_3_part7_line2b_typeofasset', pdfKey: 's_3_part7_line2b_typeofasset', label: 'Type of Asset #2', type: 'text', section: 'Part 6: Financial Hardship' },
  { key: 's_3_assets2', pdfKey: 's_3_assets2', label: 'Value of Asset #2 (U.S. Dollars)', type: 'text', section: 'Part 6: Financial Hardship' },
  { key: 's_3_part7_line2c_typeofasset', pdfKey: 's_3_part7_line2c_typeofasset', label: 'Type of Asset #3', type: 'text', section: 'Part 6: Financial Hardship' },
  { key: 's_3_assets3', pdfKey: 's_3_assets3', label: 'Value of Asset #3 (U.S. Dollars)', type: 'text', section: 'Part 6: Financial Hardship' },
  { key: 's_3_totalassets', pdfKey: 's_3_totalassets', label: 'Total Value of Assets', type: 'text', section: 'Part 6: Financial Hardship' },
  
  { key: 'pt6_l3_checkbox', pdfKey: 'pt6_l3_checkbox', label: 'Rent and/or Mortgage', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_1', pdfKey: 'pt6_l3_checkbox_1', label: 'Food', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_2', pdfKey: 'pt6_l3_checkbox_2', label: 'Utilities', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_3', pdfKey: 'pt6_l3_checkbox_3', label: 'Child and/or Elder Care', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_4', pdfKey: 'pt6_l3_checkbox_4', label: 'Insurance', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_5', pdfKey: 'pt6_l3_checkbox_5', label: 'Loans and/or Credit Cards', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_6', pdfKey: 'pt6_l3_checkbox_6', label: 'Car Payment', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_7', pdfKey: 'pt6_l3_checkbox_7', label: 'Commuting Costs', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_8', pdfKey: 'pt6_l3_checkbox_8', label: 'Medical Expenses', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_9', pdfKey: 'pt6_l3_checkbox_9', label: 'School Expenses', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_checkbox_10', pdfKey: 'pt6_l3_checkbox_10', label: 'Other (Explain)', type: 'checkbox', section: 'Part 6: Financial Hardship' },
  { key: 'pt6_l3_other', pdfKey: 'pt6_l3_other', label: 'Other Expense Description', type: 'text', section: 'Part 6: Financial Hardship' },
  
  { key: 's_3_part6_line3_total', pdfKey: 's_3_part6_line3_total', label: 'Total Monthly Expenses and Liabilities', type: 'text', section: 'Part 6: Financial Hardship' },
  
  // === Part 7: Requestor's Statement, Contact Information, Certification, and Signature ===
  { key: 's_4_p7_l1_chbx', pdfKey: 's_4_p7_l1_chbx', label: 'I can read and understand English, and I have read and understand every question and instruction on this request', type: 'checkbox', section: 'Part 7: Signature and Contact' },
  { key: 's_4_p7_l1_chbx_1', pdfKey: 's_4_p7_l1_chbx_1', label: 'The interpreter named in Part 8 read to me every question and instruction on this request', type: 'checkbox', section: 'Part 7: Signature and Contact' },
  { key: 's_4_p7_l2_chbx', pdfKey: 's_4_p7_l2_chbx', label: 'At my request, the preparer named in Part 9 prepared this request for me', type: 'checkbox', section: 'Part 7: Signature and Contact' },
  
  { key: 's_4_p7_l3_daytimetelephonenumber1', pdfKey: 's_4_p7_l3_daytimetelephonenumber1', label: 'Your Daytime Telephone Number', type: 'text', section: 'Part 7: Signature and Contact' },
  { key: 's_4_p7_l4_mobiletelephonenumber1', pdfKey: 's_4_p7_l4_mobiletelephonenumber1', label: 'Your Mobile Telephone Number (if any)', type: 'text', section: 'Part 7: Signature and Contact' },
  { key: 's_4_p7_l5_emailaddress', pdfKey: 's_4_p7_l5_emailaddress', label: 'Your Email Address (if any)', type: 'text', section: 'Part 7: Signature and Contact' },
  { key: 's_4_p7_l6_date', pdfKey: 's_4_p7_l6_date', label: 'Date of Signature (mm/dd/yyyy)', type: 'date', section: 'Part 7: Signature and Contact' },
  
  // === Part 8: Interpreter's Contact Information ===
  { key: 's_5_p9_l1a_familyname', pdfKey: 's_5_p9_l1a_familyname', label: 'Interpreter\'s Family Name (Last Name)', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l1b_givenname', pdfKey: 's_5_p9_l1b_givenname', label: 'Interpreter\'s Given Name (First Name)', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l2_busorgname', pdfKey: 's_5_p9_l2_busorgname', label: 'Interpreter\'s Business or Organization Name (if any)', type: 'text', section: 'Part 8: Interpreter Information' },
  
  { key: 's_5_p9_l3a_streetnumbername', pdfKey: 's_5_p9_l3a_streetnumbername', label: 'Interpreter\'s Street Number and Name', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_lb_unit', pdfKey: 's_5_p9_lb_unit', label: 'Apt.', type: 'checkbox', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_lb_unit_1', pdfKey: 's_5_p9_lb_unit_1', label: 'Ste.', type: 'checkbox', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_lb_unit_2', pdfKey: 's_5_p9_lb_unit_2', label: 'Flr.', type: 'checkbox', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3b_aptsteflrnumber', pdfKey: 's_5_p9_l3b_aptsteflrnumber', label: 'Interpreter\'s Apt./Ste./Flr. Number', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3c_city', pdfKey: 's_5_p9_l3c_city', label: 'Interpreter\'s City or Town', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3d_state', pdfKey: 's_5_p9_l3d_state', label: 'Interpreter\'s State', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3e_zipcode', pdfKey: 's_5_p9_l3e_zipcode', label: 'Interpreter\'s ZIP Code', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3f_postalcode', pdfKey: 's_5_p9_l3f_postalcode', label: 'Interpreter\'s Postal Code', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3g_province', pdfKey: 's_5_p9_l3g_province', label: 'Interpreter\'s Province', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l3h_country', pdfKey: 's_5_p9_l3h_country', label: 'Interpreter\'s Country', type: 'text', section: 'Part 8: Interpreter Information' },
  
  { key: 's_5_p9_l4_daytimetelephonenumber1', pdfKey: 's_5_p9_l4_daytimetelephonenumber1', label: 'Interpreter\'s Daytime Telephone Number', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l5_emailaddress', pdfKey: 's_5_p9_l5_emailaddress', label: 'Interpreter\'s Email Address (if any)', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_language', pdfKey: 's_5_p9_language', label: 'Language in which you are fluent', type: 'text', section: 'Part 8: Interpreter Information' },
  { key: 's_5_p9_l6b_date', pdfKey: 's_5_p9_l6b_date', label: 'Interpreter\'s Date of Signature (mm/dd/yyyy)', type: 'date', section: 'Part 8: Interpreter Information' },
  
  // === Part 9: Contact Information, Declaration, and Signature of the Person Preparing this Request ===
  { key: 's_6_p10_l1a_familyname', pdfKey: 's_6_p10_l1a_familyname', label: 'Preparer\'s Family Name (Last Name)', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l1b_givenname', pdfKey: 's_6_p10_l1b_givenname', label: 'Preparer\'s Given Name (First Name)', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l2_busorgname', pdfKey: 's_6_p10_l2_busorgname', label: 'Preparer\'s Business or Organization Name (if any)', type: 'text', section: 'Part 9: Preparer Information' },
  
  { key: 's_6_p10_l3a_streetnumbername', pdfKey: 's_6_p10_l3a_streetnumbername', label: 'Preparer\'s Street Number and Name', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3b_unit', pdfKey: 's_6_p10_l3b_unit', label: 'Apt.', type: 'checkbox', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3b_unit_1', pdfKey: 's_6_p10_l3b_unit_1', label: 'Ste.', type: 'checkbox', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3b_unit_2', pdfKey: 's_6_p10_l3b_unit_2', label: 'Flr.', type: 'checkbox', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3b_aptsteflrnumber', pdfKey: 's_6_p10_l3b_aptsteflrnumber', label: 'Preparer\'s Apt./Ste./Flr. Number', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3c_city', pdfKey: 's_6_p10_l3c_city', label: 'Preparer\'s City or Town', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3d_state', pdfKey: 's_6_p10_l3d_state', label: 'Preparer\'s State', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3e_zipcode', pdfKey: 's_6_p10_l3e_zipcode', label: 'Preparer\'s ZIP Code', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3f_postalcode', pdfKey: 's_6_p10_l3f_postalcode', label: 'Preparer\'s Postal Code', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3g_province', pdfKey: 's_6_p10_l3g_province', label: 'Preparer\'s Province', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l3h_country', pdfKey: 's_6_p10_l3h_country', label: 'Preparer\'s Country', type: 'text', section: 'Part 9: Preparer Information' },
  
  { key: 's_6_p10_l4_daytimetelephonenumber1', pdfKey: 's_6_p10_l4_daytimetelephonenumber1', label: 'Preparer\'s Daytime Telephone Number', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l5_faxnumber1', pdfKey: 's_6_p10_l5_faxnumber1', label: 'Preparer\'s Fax Number (if any)', type: 'text', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l6_emailaddress', pdfKey: 's_6_p10_l6_emailaddress', label: 'Preparer\'s Email Address (if any)', type: 'text', section: 'Part 9: Preparer Information' },
  
  { key: 's_6_p10_l7_chbx', pdfKey: 's_6_p10_l7_chbx', label: 'I am not an attorney or accredited representative', type: 'checkbox', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l7_chbx_1', pdfKey: 's_6_p10_l7_chbx_1', label: 'I am an attorney or accredited representative', type: 'checkbox', section: 'Part 9: Preparer Information' },
  { key: 's_6_p10_l8b_date', pdfKey: 's_6_p10_l8b_date', label: 'Preparer\'s Date of Signature (mm/dd/yyyy)', type: 'date', section: 'Part 9: Preparer Information' },
];

export const getInitialFormData = () => {
  const data: Record<string, string> = {};
  formFields.forEach((f) => { if (f.key) data[f.key] = ''; });
  return data;
};

export const i912Config = { formId, formTitle, formSubtitle, formFields, getInitialFormData };
export default i912Config;
