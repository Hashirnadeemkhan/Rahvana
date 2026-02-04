import { MasterProfile } from "@/types/profile";

/**
 * FIELD MAPPING REGISTRY
 * Central registry for common field name variations across different tools
 * Keys are the MasterProfile paths (dot notation), Values are arrays of possible form field names
 */
export const FIELD_MAPPINGS: Record<string, string[]> = {
  // --- Personal ---
  'name.first': ['first_name', 'given_name', 'applicant_first_name', 'sponsor_first_name', 'givenName', 'firstName'],
  'name.middle': ['middle_name', 'applicant_middle_name', 'sponsor_middle_name', 'middleName'],
  'name.last': ['last_name', 'family_name', 'surname', 'applicant_last_name', 'sponsor_last_name', 'lastName'],
  'dateOfBirth': ['dob', 'date_of_birth', 'birth_date', 'sponsor_dob', 'applicant_dob', 'dateOfBirth', 'beneficiary_dob'],
  'placeOfBirth.city': ['city_of_birth', 'birth_city'],
  'placeOfBirth.country': ['country_of_birth', 'birth_country'],
  'sex': ['sex', 'gender', 'applicant_sex', 'sponsor_sex'],
  'maritalStatus': ['marital_status', 'civil_status', 'current_marital_status'],

  // --- Contact ---
  'phone': ['phone_number', 'telephone', 'contact_number', 'daytime_phone', 'contactNumber', 'mobile'],
  'email': ['email_address', 'contact_email', 'email'],
  'currentAddress.street': ['street_address', 'address_line_1', 'current_street', 'mailing_street', 'address'],
  'currentAddress.city': ['city_name', 'current_city', 'mailing_city', 'city'],
  'currentAddress.state': ['state_province', 'current_state', 'mailing_state', 'state'],
  'currentAddress.zipCode': ['zip', 'postal_code', 'zip_code', 'current_zip', 'mailing_zip', 'zipCode'],
  'currentAddress.country': ['country_name', 'current_country', 'mailing_country', 'country_of_residence', 'beneficiary_country', 'destinationCountry', 'country'],
  'intendedUSState': ['intended_us_state_of_residence', 'intended_state', 'destination_state'],

  // --- Identifiers ---
  'passportNumber': ['passport_number', 'passportNumber', 'passport'],
  'passportExpiry': ['passport_expiry', 'passportExpiryDate', 'passport_expiration_date'],
  'ssn': ['ssn', 'social_security_number'],
  'alienNumber': ['a_number', 'alien_registration_number'],

  // --- Relationship ---
  'relationship.type': ['relationship_type', 'spousal_relationship_type', 'relationshipType'],
  'relationship.startDate': ['relationship_start_date', 'relationshipStartDate'],
  'relationship.marriageDate': ['marriage_date', 'date_of_marriage', 'wedding_date'],
  'relationship.howDidYouMeet': ['how_did_you_meet', 'meeting_story'],
  'relationship.numberOfInPersonVisits': ['number_of_in_person_visits', 'visit_count'],
  
  // Relationship Evidence
  'relationship.cohabitationProof': ['cohabitation_proof'],
  'relationship.sharedFinancialAccounts': ['shared_financial_accounts'],
  'relationship.weddingPhotos': ['wedding_photos_available'],
  'relationship.communicationLogs': ['communication_logs'],
  'relationship.moneyTransferReceipts': ['money_transfer_receipts_available'],
  'relationship.meetingProof': ['meeting_proof', 'driving_license_copy_available'], // mapped driving license to generic meeting proof

  // --- Employment ---
  'occupation': ['occupation', 'current_occupation_role', 'jobTitle', 'currentOccupation', 'profession'],
  'jobTitle': ['job_title', 'position'],
  'employer.name': ['employer', 'employer_name', 'employerName', 'company_name'],
  'industrySector': ['industry_sector', 'industry'],
  'employerType': ['employer_type'],
  'annualIncome': ['annual_income', 'annualIncome', 'sponsor_annual_income', 'income', 'yearly_income'],

  // --- Education ---
  'educationLevel': ['education_level', 'educationLevel', 'highest_education_level', 'highest_education'],
  'educationField': ['education_field', 'educationField', 'highest_education_field', 'field_of_study'],

  // --- Immigration History ---
  'immigrationHistory.previousVisaApplications': ['previous_visa_applications'],
  'immigrationHistory.previousVisaDenial': ['previous_visa_denial'],
  'immigrationHistory.overstayOrViolation': ['overstay_or_violation'],
  'immigrationHistory.criminalRecord': ['criminal_record'],
  'immigrationHistory.priorMilitaryService': ['prior_military_service'],
  'immigrationHistory.specializedWeaponsTraining': ['specialized_weapons_training'],
  'immigrationHistory.unofficialArmedGroups': ['unofficial_armed_groups'],

  // --- Financial Profile ---
  'householdSize': ['household_size', 'family_size'],
  'financialProfile.hasTaxReturns': ['has_tax_returns'],
  'financialProfile.hasEmploymentLetter': ['has_employment_letter'],
  'financialProfile.hasPaystubs': ['has_paystubs'],
  'financialProfile.jointSponsorAvailable': ['joint_sponsor_available'],
  'financialProfile.i864AffidavitSubmitted': ['i864_affidavit_submitted'],
  'financialProfile.i864SupportingDocs': ['i864_supporting_financial_documents'],

  // --- Documents ---
  'documents.hasPassport': ['passports_available', 'has_passport', 'passport_copy_available'],
  'documents.hasBirthCertificate': ['birth_certificates', 'has_birth_certificate'],
  'documents.hasPoliceCertificate': ['police_certificate_new', 'police_certificate_old', 'has_police_certificate'],
  'documents.ds260Confirmation': ['ds260_confirmation'],
  'documents.interviewLetter': ['interview_letter'],
  'documents.courierRegistration': ['courier_registration'],
  'documents.hasMedicalRecord': ['medical_report_available'],
  'documents.polioVaccination': ['polio_vaccination_certificate'],
  'documents.covidVaccination': ['covid_vaccination_certificate'],
  'documents.urduMarriageCertificate': ['urdu_marriage_certificate'],
  'documents.englishTranslationCertificate': ['english_translation_certificate'],
  'documents.unionCouncilCertificate': ['union_council_certificate'],
  'documents.familyRegistrationCertificate': ['family_registration_certificate'],
  'documents.hasPhotos': ['passport_photos_2x2'],
};

/**
 * Access a nested property safely using dot notation string
 * e.g. getNestedProperty(profile, 'name.first')
 */
function getNestedProperty(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (isObject(current)) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Set a nested property safely using dot notation string
 * Creates intermediate objects if they don't exist
 */
function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object';
}

function setNestedProperty(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
}

/**
 * UNIVERSAL AUTO-FILL FUNCTION
 * Maps profile data to ANY form structure using the registry.
 *
 * @param profile - The user's master profile
 * @param formStructure - The target form's initial state (keys determine what we look for)
 * @returns Updated form data with autofilled values
 */
export const autoFillForm = (
  profile: MasterProfile | Partial<MasterProfile>,
  formStructure: Record<string, unknown>
): Record<string, unknown> => {
  const updatedForm = { ...formStructure } as Record<string, unknown>;

  // 1. Iterate through each field in the target form
  for (const formFieldKey of Object.keys(updatedForm)) {
    // Skip if field already has a user-entered value (optional optimization, remove if we want to overwrite)
    if (updatedForm[formFieldKey] !== undefined && updatedForm[formFieldKey] !== "" && updatedForm[formFieldKey] !== null) {
      continue;
    }

    // 2. Find matching Profile Path from Registry
    let foundValue: unknown = undefined;

    for (const [profilePath, variations] of Object.entries(FIELD_MAPPINGS)) {
      if (variations.includes(formFieldKey)) {
        // Found a match! Get value from profile
        foundValue = getNestedProperty(profile as Record<string, unknown>, profilePath);

        // Special Handling for Income (strip non-numeric if target likely expects number or clean string)
        if (profilePath === 'annualIncome' && foundValue) {
           const clean = String(foundValue).replace(/[^0-9.]/g, "");
           foundValue = (typeof updatedForm[formFieldKey] === 'number') ? Number(clean) : clean;
        }

        break; // Stop checking other map entries
      }
    }

    // 3. If found, apply to form
    if (foundValue !== undefined && foundValue !== null) {
      updatedForm[formFieldKey] = foundValue;
    }
  }

  return updatedForm;
};

/**
 * REVERSE MAPPER: Maps form data BACK to MasterProfile structure
 * Allows saving data from any tool back to the central profile.
 */
export const mapFormToProfile = (
  formData: Record<string, unknown>,
  existingProfile: Partial<MasterProfile> = {}
): Partial<MasterProfile> => {
  const newProfile = { ...existingProfile } as Record<string, unknown>; // Shallow copy base

  for (const [formKey, formValue] of Object.entries(formData)) {
    if (formValue === undefined || formValue === "" || formValue === null) continue;

    // Find which profile path this form key belongs to
    for (const [profilePath, variations] of Object.entries(FIELD_MAPPINGS)) {
      if (variations.includes(formKey)) {
        // Special constraint: Don't overwrite complex objects with simple strings if not intended
        // But our paths are leaf nodes mainly, so safeMap is okay.

        // Map value based on expected type (basic inference)
        setNestedProperty(newProfile, profilePath, formValue);
        break;
      }
    }
  }

  return newProfile as Partial<MasterProfile>;
};

/**
 * Legacy wrapper for backward compatibility with existing code
 */
export const mapProfileToGenericForm = autoFillForm;

/**
 * Specialized wrapper for Visa Checker to maintain strict typing if needed
 */
export const mapProfileToVisaChecker = (profile: MasterProfile | Partial<MasterProfile>): Record<string, unknown> => {
  // Just use the generic auto-filler against a mapped structure logic
  // Since the visa checker expects a specific return type, we can infer it or just return Record<string, any>
  // The original function did specific logic, but our generic one covers 90%
  // We will re-implement the specific logic using the new system for safety

  const dummyFormStruct: Record<string, unknown> = {
     sponsor_dob: "",
     country_of_residence: "",
     intended_us_state_of_residence: "",
     relationship_start_date: "",
     marriage_date: "",
     spousal_relationship_type: "",
     how_did_you_meet: "",
     number_of_in_person_visits: 0,
     highest_education_level: "",
     highest_education_field: "",
     current_occupation_role: "",
     industry_sector: "",
     employer_type: "",
     sponsor_annual_income: 0,
     previous_visa_applications: false,
     previous_visa_denial: false,
     overstay_or_violation: false,
     criminal_record: false,
     household_size: 0,
     has_tax_returns: false,
     has_employment_letter: false,
     has_paystubs: false,
     passports_available: false,
     birth_certificates: false,
     police_certificate_new: false,
     prior_military_service: false,
     specialized_weapons_training: false,
     unofficial_armed_groups: false,
     cohabitation_proof: false,
     shared_financial_accounts: false,
     wedding_photos_available: false,
     communication_logs: false,
     money_transfer_receipts_available: false,
     driving_license_copy_available: false, // meeting proof

     // Docs
     urdu_marriage_certificate: false,
     english_translation_certificate: false,
     union_council_certificate: false,
     family_registration_certificate: false,
     ds260_confirmation: false,
     interview_letter: false,
     courier_registration: false,
     medical_report_available: false,
     polio_vaccination_certificate: false,
     covid_vaccination_certificate: false,
     passport_photos_2x2: false,
  };

  return autoFillForm(profile, dummyFormStruct);
};


