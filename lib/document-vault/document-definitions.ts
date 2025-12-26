// Document Definitions Database
// This file contains all document definitions for various visa categories

import {
  DocumentDefinition,
  DocumentCategory,
} from './types';

// ============================================================================
// CIVIL DOCUMENTS
// ============================================================================

const CIVIL_DOCS: DocumentDefinition[] = [
  {
    id: 'birth-cert-beneficiary',
    key: 'BIRTH_CERT',
    name: 'Birth Certificate',
    description: 'Official birth certificate with English translation',
    category: 'CIVIL',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'none',
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Obtain Original Birth Certificate',
        description: 'Visit NADRA office or apply online to get your original birth certificate (Form-B or computerized NICOP/CNIC with date of birth).',
        resources: [
          {
            name: 'NADRA E-Sahulat Portal',
            url: 'https://www.nadra.gov.pk/',
            type: 'link',
          },
        ],
        tips: [
          'Ensure the certificate shows your full name exactly as in your passport',
          'If name differs from passport, get a name match certificate',
        ],
        estimatedTime: '1-3 days',
        cost: 'PKR 400-800',
      },
      {
        stepNumber: 2,
        title: 'Get English Translation',
        description: 'If certificate is in Urdu, get it translated by a certified translator.',
        tips: [
          'Translator must certify that translation is accurate',
          'Include translator credentials and stamp',
        ],
        estimatedTime: '1-2 days',
        cost: 'PKR 1,000-2,000',
      },
    ],
  },
  {
    id: 'nikah-nama',
    key: 'NIKAH_NAMA',
    name: 'Nikah Nama (Marriage Certificate)',
    description: 'Original Nikah Nama with English translation',
    category: 'CIVIL',
    roles: ['BENEFICIARY'],
    stages: ['USCIS', 'NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'none',
    requiredWhen: {
      visaCategories: ['IR-1', 'CR-1'],
    },
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Locate Original Nikah Nama',
        description: 'Find your original Nikah Nama document issued at the time of marriage.',
        tips: [
          'Must be signed by Nikah Registrar',
          'Should have serial number and registration details',
        ],
      },
      {
        stepNumber: 2,
        title: 'Get Certified Translation',
        description: 'Get a certified English translation of the Nikah Nama.',
        resources: [
          {
            name: 'List of Certified Translators in Pakistan',
            url: 'https://pk.usembassy.gov/u-s-citizen-services/local-resources-of-u-s-citizens/attorneys/',
            type: 'link',
          },
        ],
        estimatedTime: '2-3 days',
        cost: 'PKR 2,000-5,000',
      },
    ],
  },
  {
    id: 'passport-beneficiary',
    key: 'PASSPORT_COPY',
    name: 'Passport Copy',
    description: 'Valid passport copy (biographical page)',
    category: 'CIVIL',
    roles: ['BENEFICIARY'],
    stages: ['USCIS', 'NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'fixed_days',
    validityDays: 180, // 6 months validity required
    defaultWarnDays: 60,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Check Passport Validity',
        description: 'Ensure your passport is valid for at least 6 months beyond your intended travel date.',
        tips: [
          'If passport expires soon, renew it before uploading',
          'Scan the biographical page (page with photo and details)',
        ],
      },
      {
        stepNumber: 2,
        title: 'Scan Biographical Page',
        description: 'Scan or take a clear photo of the biographical page of your passport.',
        tips: [
          'Ensure all text is readable',
          'No shadows or reflections',
          'Save as PDF or high-quality JPG',
        ],
      },
    ],
  },
  {
    id: 'cnic-beneficiary',
    key: 'CNIC',
    name: 'CNIC (Computerized National Identity Card)',
    description: 'Copy of Pakistani CNIC (both sides)',
    category: 'CIVIL',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'user_set',
    defaultWarnDays: 90,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Scan Both Sides of CNIC',
        description: 'Make clear scans or photos of both front and back of your CNIC.',
        tips: [
          'Ensure CNIC is not expired',
          'If expired, renew at NADRA office',
          'Combine both sides into one PDF file',
        ],
      },
    ],
  },
  {
    id: 'divorce-decree-beneficiary',
    key: 'DIVORCE_DECREE',
    name: 'Divorce Decree / Talaq Nama',
    description: 'Official divorce decree with translation if prior marriage',
    category: 'CIVIL',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: true, // Can have multiple if married multiple times
    validityType: 'none',
    requiredWhen: {
      scenarioFlags: { prior_marriage_beneficiary: true },
    },
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Obtain Divorce Certificate',
        description: 'Get certified copy of divorce decree from Family Court or Union Council.',
        resources: [
          {
            name: 'Union Council Divorce Certificate Guide',
            url: 'https://www.nadra.gov.pk/services/divorce-certificate/',
            type: 'link',
          },
        ],
        tips: [
          'Court-issued decrees must be certified copies',
          'Union Council certificates should have registration number',
        ],
      },
      {
        stepNumber: 2,
        title: 'Get English Translation',
        description: 'If document is in Urdu, get certified English translation.',
        estimatedTime: '2-3 days',
        cost: 'PKR 2,000-4,000',
      },
    ],
  },
  {
    id: 'death-cert-prior-spouse',
    key: 'DEATH_CERT_SPOUSE',
    name: 'Death Certificate of Former Spouse',
    description: 'Death certificate if prior spouse is deceased',
    category: 'CIVIL',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'none',
    requiredWhen: {
      scenarioFlags: { prior_marriage_beneficiary: true },
    },
  },
];

// ============================================================================
// FINANCIAL / SPONSOR DOCUMENTS
// ============================================================================

const FINANCIAL_DOCS: DocumentDefinition[] = [
  {
    id: 'i-864-affidavit',
    key: 'I864_AFFIDAVIT',
    name: 'Form I-864 (Affidavit of Support)',
    description: 'Completed and signed I-864 form',
    category: 'FINANCIAL',
    roles: ['PETITIONER'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'policy_variable',
    defaultWarnDays: 90,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Download Form I-864',
        description: 'Download the latest version of Form I-864 from USCIS website.',
        resources: [
          {
            name: 'USCIS Form I-864',
            url: 'https://www.uscis.gov/i-864',
            type: 'link',
          },
        ],
        tips: [
          'Always use the latest version of the form',
          'Fill out completely - no blank fields',
        ],
      },
      {
        stepNumber: 2,
        title: 'Complete and Sign',
        description: 'Fill out all sections accurately and sign the form.',
        tips: [
          'Use your legal name as it appears on tax returns',
          'Include household size calculation',
          'Sign and date - signature must be original',
        ],
      },
    ],
  },
  {
    id: 'tax-returns-petitioner',
    key: 'TAX_RETURNS',
    name: 'IRS Tax Returns (3 years)',
    description: 'Federal tax transcripts or returns for last 3 years',
    category: 'FINANCIAL',
    roles: ['PETITIONER'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'policy_variable',
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Request IRS Tax Transcripts',
        description: 'Order tax transcripts from IRS website or by mail.',
        resources: [
          {
            name: 'Get IRS Tax Transcripts',
            url: 'https://www.irs.gov/individuals/get-transcript',
            type: 'link',
          },
        ],
        tips: [
          'Tax transcripts are preferred over returns',
          'Need last 3 years (most recent)',
          'Free service from IRS',
        ],
        estimatedTime: '5-10 business days (by mail)',
        cost: 'Free',
      },
    ],
  },
  {
    id: 'employment-letter',
    key: 'EMPLOYMENT_LETTER',
    name: 'Employment Verification Letter',
    description: 'Letter from employer confirming employment and salary',
    category: 'FINANCIAL',
    roles: ['PETITIONER'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'fixed_days',
    validityDays: 180, // 6 months validity
    defaultWarnDays: 60,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Request Letter from Employer',
        description: 'Contact your HR department to request an employment verification letter.',
        tips: [
          'Letter must be on company letterhead',
          'Include: job title, salary, start date, employment type (full-time/part-time)',
          'Should be dated within 6 months of submission',
          'Include HR contact information',
        ],
      },
    ],
  },
  {
    id: 'pay-stubs',
    key: 'PAY_STUBS',
    name: 'Recent Pay Stubs',
    description: 'Most recent 6 pay stubs or pay statements',
    category: 'FINANCIAL',
    roles: ['PETITIONER'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'fixed_days',
    validityDays: 180,
    defaultWarnDays: 30,
  },
  {
    id: 'w2-forms',
    key: 'W2_FORMS',
    name: 'W-2 Forms',
    description: 'W-2 forms for last tax year',
    category: 'FINANCIAL',
    roles: ['PETITIONER'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'none',
  },
  {
    id: 'bank-statements',
    key: 'BANK_STATEMENTS',
    name: 'Bank Statements',
    description: 'Recent bank statements (last 12 months)',
    category: 'FINANCIAL',
    roles: ['PETITIONER'],
    stages: ['NVC', 'INTERVIEW'],
    required: false,
    multipleFilesAllowed: true,
    validityType: 'fixed_days',
    validityDays: 90,
  },
];

// ============================================================================
// RELATIONSHIP EVIDENCE
// ============================================================================

const RELATIONSHIP_DOCS: DocumentDefinition[] = [
  {
    id: 'wedding-photos',
    key: 'WEDDING_PHOTOS',
    name: 'Wedding Photos',
    description: 'Photos from wedding ceremony',
    category: 'RELATIONSHIP',
    roles: ['BENEFICIARY', 'PETITIONER'],
    stages: ['USCIS', 'NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'none',
    requiredWhen: {
      visaCategories: ['IR-1', 'CR-1'],
    },
  },
  {
    id: 'relationship-photos',
    key: 'RELATIONSHIP_PHOTOS',
    name: 'Relationship Photos',
    description: 'Photos together throughout relationship',
    category: 'RELATIONSHIP',
    roles: ['BENEFICIARY', 'PETITIONER'],
    stages: ['USCIS', 'NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'none',
    requiredWhen: {
      visaCategories: ['IR-1', 'CR-1'],
    },
  },
  {
    id: 'communication-evidence',
    key: 'COMMUNICATION_EVIDENCE',
    name: 'Communication Evidence',
    description: 'Chat logs, call records, emails demonstrating ongoing relationship',
    category: 'RELATIONSHIP',
    roles: ['BENEFICIARY', 'PETITIONER'],
    stages: ['USCIS', 'NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'none',
    requiredWhen: {
      visaCategories: ['IR-1', 'CR-1'],
    },
  },
  {
    id: 'joint-financial-docs',
    key: 'JOINT_FINANCIAL',
    name: 'Joint Financial Documents',
    description: 'Joint bank accounts, property, insurance, etc.',
    category: 'RELATIONSHIP',
    roles: ['BENEFICIARY', 'PETITIONER'],
    stages: ['NVC', 'INTERVIEW'],
    required: false,
    multipleFilesAllowed: true,
    validityType: 'fixed_days',
    validityDays: 180,
    requiredWhen: {
      visaCategories: ['IR-1', 'CR-1'],
    },
  },
];

// ============================================================================
// POLICE / COURT / MILITARY
// ============================================================================

const POLICE_DOCS: DocumentDefinition[] = [
  {
    id: 'police-certificate-pakistan',
    key: 'POLICE_CERT_PK',
    name: 'Police Certificate (Pakistan)',
    description: 'Police clearance certificate from Pakistan',
    category: 'POLICE',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'fixed_days',
    validityDays: 365, // Valid for 1 year
    defaultWarnDays: 90,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Apply at Local Police Station',
        description: 'Visit your local police station or apply through NADRA for a police clearance certificate.',
        resources: [
          {
            name: 'Pakistan Police Verification',
            url: 'https://www.nadra.gov.pk/services/police-verification/',
            type: 'link',
          },
        ],
        tips: [
          'Bring original CNIC',
          'May require fingerprinting',
          'Valid for 1 year from issue date',
        ],
        estimatedTime: '2-4 weeks',
        cost: 'PKR 500-1,500',
      },
      {
        stepNumber: 2,
        title: 'Get English Translation',
        description: 'If certificate is in Urdu, get certified translation.',
        estimatedTime: '2-3 days',
        cost: 'PKR 1,500-3,000',
      },
    ],
  },
  {
    id: 'court-records',
    key: 'COURT_RECORDS',
    name: 'Court Records',
    description: 'Records of any arrests, convictions, or court proceedings',
    category: 'POLICE',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: false,
    multipleFilesAllowed: true,
    validityType: 'none',
    requiredWhen: {
      scenarioFlags: { criminal_history: true },
    },
  },
  {
    id: 'military-records',
    key: 'MILITARY_RECORDS',
    name: 'Military Service Records',
    description: 'Military service records if applicable',
    category: 'POLICE',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: false,
    multipleFilesAllowed: true,
    validityType: 'none',
    requiredWhen: {
      scenarioFlags: { military_service: true },
    },
  },
];

// ============================================================================
// MEDICAL
// ============================================================================

const MEDICAL_DOCS: DocumentDefinition[] = [
  {
    id: 'medical-exam-ds2019',
    key: 'MEDICAL_EXAM',
    name: 'Medical Examination (Form DS-2019)',
    description: 'Medical examination report from panel physician',
    category: 'MEDICAL',
    roles: ['BENEFICIARY'],
    stages: ['INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'fixed_days',
    validityDays: 180, // 6 months validity
    defaultWarnDays: 30,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Schedule Medical Exam',
        description: 'Book appointment with panel physician approved by U.S. Embassy Islamabad.',
        resources: [
          {
            name: 'Panel Physicians in Pakistan',
            url: 'https://pk.usembassy.gov/u-s-citizen-services/local-resources-of-u-s-citizens/doctors/',
            type: 'link',
          },
        ],
        tips: [
          'Schedule only after receiving interview date',
          'Bring passport, photos, and vaccination records',
          'Exam includes physical, blood tests, and X-ray',
        ],
        estimatedTime: '3-4 hours for exam',
        cost: 'Approximately PKR 20,000-30,000',
      },
      {
        stepNumber: 2,
        title: 'Collect Medical Report',
        description: 'Pick up sealed medical report - DO NOT OPEN',
        tips: [
          'Report is sealed and must remain sealed',
          'Bring to interview appointment',
          'Valid for 6 months',
        ],
      },
    ],
  },
  {
    id: 'vaccination-records',
    key: 'VACCINATION_RECORDS',
    name: 'Vaccination Records',
    description: 'Proof of required vaccinations',
    category: 'MEDICAL',
    roles: ['BENEFICIARY'],
    stages: ['INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'none',
  },
];

// ============================================================================
// PHOTOS
// ============================================================================

const PHOTO_DOCS: DocumentDefinition[] = [
  {
    id: 'passport-photos',
    key: 'PASSPORT_PHOTOS',
    name: 'Passport-Style Photos',
    description: 'U.S. visa-compliant passport photos (2x2 inches)',
    category: 'PHOTOS',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'fixed_days',
    validityDays: 180, // Should be recent (6 months)
    defaultWarnDays: 30,
    wizardSteps: [
      {
        stepNumber: 1,
        title: 'Get Compliant Photos',
        description: 'Get 2x2 inch photos that meet U.S. visa photo requirements.',
        resources: [
          {
            name: 'U.S. Visa Photo Requirements',
            url: 'https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html',
            type: 'link',
          },
        ],
        tips: [
          'White or off-white background',
          'Taken within last 6 months',
          'Face directly facing camera',
          'No glasses, headphones, or accessories',
          'Neutral expression',
        ],
        estimatedTime: '30 minutes',
        cost: 'PKR 500-1,000',
      },
    ],
  },
];

// ============================================================================
// TRANSLATIONS
// ============================================================================

const TRANSLATION_DOCS: DocumentDefinition[] = [
  {
    id: 'translator-certification',
    key: 'TRANSLATOR_CERT',
    name: 'Translator Certification',
    description: 'Certification statement from translator for all translated documents',
    category: 'TRANSLATIONS',
    roles: ['BENEFICIARY'],
    stages: ['NVC', 'INTERVIEW'],
    required: false,
    multipleFilesAllowed: true,
    validityType: 'none',
  },
];

// ============================================================================
// MISC / CASE EVIDENCE
// ============================================================================

const MISC_DOCS: DocumentDefinition[] = [
  {
    id: 'ds-260',
    key: 'DS260',
    name: 'Form DS-260',
    description: 'Online Immigrant Visa Application confirmation page',
    category: 'MISC',
    roles: ['BENEFICIARY'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'none',
  },
  {
    id: 'i-130-approval',
    key: 'I130_APPROVAL',
    name: 'Form I-130 Approval Notice',
    description: 'USCIS approval notice for Form I-130',
    category: 'MISC',
    roles: ['PETITIONER'],
    stages: ['NVC', 'INTERVIEW'],
    required: true,
    multipleFilesAllowed: false,
    validityType: 'none',
  },
  {
    id: 'nvc-fee-receipts',
    key: 'NVC_FEE_RECEIPTS',
    name: 'NVC Fee Payment Receipts',
    description: 'Proof of payment for NVC processing fees',
    category: 'MISC',
    roles: ['PETITIONER'],
    stages: ['NVC'],
    required: true,
    multipleFilesAllowed: true,
    validityType: 'none',
  },
];

// ============================================================================
// MASTER DOCUMENT DATABASE
// ============================================================================

export const ALL_DOCUMENTS: DocumentDefinition[] = [
  ...CIVIL_DOCS,
  ...FINANCIAL_DOCS,
  ...RELATIONSHIP_DOCS,
  ...POLICE_DOCS,
  ...MEDICAL_DOCS,
  ...PHOTO_DOCS,
  ...TRANSLATION_DOCS,
  ...MISC_DOCS,
];

// Index by key for quick lookup
export const DOCUMENTS_BY_KEY = ALL_DOCUMENTS.reduce(
  (acc, doc) => {
    acc[doc.key] = doc;
    return acc;
  },
  {} as Record<string, DocumentDefinition>
);

// Index by category
export const DOCUMENTS_BY_CATEGORY = ALL_DOCUMENTS.reduce(
  (acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  },
  {} as Record<DocumentCategory, DocumentDefinition[]>
);
