export interface Address {
  street: string;
  unit?: string;
  unitType?: "Apt" | "Ste" | "Flr";
  city: string;
  state: string;
  zipCode: string;
  province?: string;
  postalCode?: string;
  country: string;
  dateFrom?: string;
  dateTo?: string; // "PRESENT" if current
}

export interface PersonName {
  first: string;
  middle?: string;
  last: string;
}

export interface FamilyMember {
  relationship: "Father" | "Mother" | "Spouse" | "Child" | "Sibling";
  name: PersonName;
  dateOfBirth: string; // ISO date
  placeOfBirth: {
    city: string;
    country: string;
  };
  isDeceased?: boolean;
  dateOfMarriage?: string; // For spouse
  placeOfMarriage?: { // For spouse
    city: string;
    state?: string;
    country: string;
  };
}

export interface MasterProfile {
  // Personal
  name: PersonName;
  otherNames?: PersonName[]; // Maiden names, aliases
  dateOfBirth: string;
  placeOfBirth: {
    city: string;
    country: string;
  };
  sex: "Male" | "Female";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "Separated" | "Annulled";
  
  // Relationship & Family (NEW)
  spouse?: {
    name: PersonName;
    dateOfBirth: string;
    placeOfBirth: {
      city: string;
      country: string;
    };
  };
  relationship?: {
    type: string; // "Spouse", "Fiance", etc.
    startDate: string; // relationship_start_date
    marriageDate?: string; // date_of_marriage
    marriagePlace?: {
      city: string;
      country: string;
    };
    howDidYouMeet?: string;
    numberOfInPersonVisits?: number;
    lastMeetingDate?: string;
    
    // Relationship Evidence
    cohabitationProof?: boolean;
    sharedFinancialAccounts?: boolean;
    weddingPhotos?: boolean;
    communicationLogs?: boolean;
    moneyTransferReceipts?: boolean;
    meetingProof?: boolean;
  };

  // Identifiers
  ssn?: string;
  alienNumber?: string;
  uscisAccountNumber?: string;
  passportNumber?: string;
  passportExpiry?: string;
  cnic?: string; // National ID

  // Contact
  phone: string;
  email: string;
  currentAddress: Address;
  mailingAddress?: Address; // If different
  
  // History
  addressHistory: Address[]; // Past 5 years
  
  // Family
  family: FamilyMember[];
  householdSize?: number; // household_size
  
  // Immigration & Travel
  visaStatus?: string;
  i94Record?: string;
  lastEntryDate?: string;
  immigrationHistory?: {
    previousVisaApplications?: boolean;
    previousVisaDenial?: boolean;
    overstayOrViolation?: boolean;
    criminalRecord?: boolean;
    removedOrDeported?: boolean;
    
    // Security Questions
    priorMilitaryService?: boolean;
    specializedWeaponsTraining?: boolean;
    unofficialArmedGroups?: boolean;
  };
  intendedUSState?: string; // intended_us_state_of_residence
  
  // Employment
  occupation: string;
  jobTitle?: string; // current_occupation_role
  industrySector?: string; // industry_sector
  employerType?: string; // employer_type
  employer: {
    name: string;
    address?: Address;
  };
  employmentHistory?: any[]; // Simplified for now
  
  // Financial
  annualIncome?: string; // Store as string
  financialProfile?: {
    hasTaxReturns?: boolean;
    hasEmploymentLetter?: boolean;
    hasPaystubs?: boolean;
    hasBankStatements?: boolean;
    
    // Sponsorship
    jointSponsorAvailable?: boolean;
    i864AffidavitSubmitted?: boolean;
    i864SupportingDocs?: boolean;
  };

  // Education
  educationLevel?: string;
  educationField?: string; // highest_education_field
  
  // Documents Available (for readiness check)
  documents?: {
    hasPassport?: boolean;
    hasBirthCertificate?: boolean;
    hasMarriageCertificate?: boolean;
    hasPoliceCertificate?: boolean;
    hasMedicalRecord?: boolean;
    hasPhotos?: boolean;
    
    // Specific Translations/Certs
    urduMarriageCertificate?: boolean;
    englishTranslationCertificate?: boolean;
    unionCouncilCertificate?: boolean;
    familyRegistrationCertificate?: boolean;
    
    // Interview Prep
    ds260Confirmation?: boolean;
    interviewLetter?: boolean;
    courierRegistration?: boolean;
    polioVaccination?: boolean;
    covidVaccination?: boolean;
  };
}
