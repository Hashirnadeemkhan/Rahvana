import Tesseract from 'tesseract.js';

// Define document types and their validation requirements
export type DocumentType = 
  | 'passport'
  | 'nikah_nama'
  | 'birth_certificate'
  | 'marriage_certificate'
  | 'divorce_certificate'
  | 'death_certificate'
  | 'police_certificate'
  | 'medical_examination'
  | 'i864_affidavit'
  | 'translation'
  | 'irs_transcript'
  | 'form_1040'
  | 'w2'
  | 'form_1099';

export interface DocumentValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  score: number; // 0-100
  extractedData?: Record<string, any>;
}

export interface ValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
}

// Define keyword structure with mandatory and optional keywords
interface DocumentKeywords {
  mandatory: string[]; // Must match at least 1 of these
  optional: string[];  // Must match at least 3 of these
}

// Helper for fuzzy string matching (Levenshtein distance based)
const fuzzyContains = (text: string, keyword: string, maxDistance: number = 1): boolean => {
  // exact match check first for performance
  if (text.includes(keyword)) return true;
  
  // If text is very short, don't fuzzy match
  if (text.length < keyword.length) return false;

  // Simple sliding window fuzzy match
  const textLen = text.length;
  const keyLen = keyword.length;
  
  for (let i = 0; i <= textLen - keyLen; i++) {
    const sub = text.substr(i, keyLen);
    let distance = 0;
    for (let j = 0; j < keyLen; j++) {
      if (sub[j] !== keyword[j]) distance++;
      if (distance > maxDistance) break;
    }
    if (distance <= maxDistance) return true;
  }
  return false;
};

// Function to check if the document is of the correct type
export const checkDocumentType = (text: string, type: DocumentType): { isValid: boolean; reason?: string; matchedKeywords?: string[] } => {
  // Define keywords for each document type with mandatory and optional
  const typeKeywords: Record<DocumentType, DocumentKeywords> = {
    passport: {
      mandatory: ['PASSPORT', 'REPUBLIC', 'UNITED STATES', 'PAKISTAN', 'INDIA', 'BANGLADESH', 'TRAVEL DOCUMENT'],
      optional: ['SURNAME', 'GIVEN NAME', 'NATIONALITY', 'DATE OF BIRTH', 'SEX', 'PLACE OF BIRTH', 'AUTHORITY', 'EXPIRY', 'ISSUED', 'P<']
    },
    nikah_nama: {
      mandatory: ['NIKAH', 'MARRIAGE', 'UNION COUNCIL'],
      optional: ['BRIDE', 'GROOM', 'QAZI', 'WITNESS', 'MAHR', 'WALIMA', 'HUSBAND', 'WIFE', 'REGISTRATION']
    },
    birth_certificate: {
      mandatory: ['BIRTH', 'CERTIFICATE', 'LIVE BIRTH'],
      optional: ['FATHER', 'MOTHER', 'REGISTRATION', 'REGISTRAR', 'VITAL', 'BORN', 'SEX', 'DATE']
    },
    marriage_certificate: {
      mandatory: ['MARRIAGE', 'CERTIFICATE', 'WEDDING'],
      optional: ['HUSBAND', 'WIFE', 'OFFICIANT', 'MINISTER', 'WITNESS', 'VITAL', 'GROOM', 'BRIDE']
    },
    divorce_certificate: {
      mandatory: ['DIVORCE', 'DECREE', 'DISSOLUTION'],
      optional: ['PETITIONER', 'RESPONDENT', 'PLAINTIFF', 'DEFENDANT', 'COURT', 'JUDGE', 'FINAL']
    },
    death_certificate: {
      mandatory: ['DEATH', 'CERTIFICATE'],
      optional: ['DECEASED', 'DECEDENT', 'CAUSE', 'REGISTRAR', 'VITAL', 'DIED']
    },
    police_certificate: {
      mandatory: ['POLICE', 'CLEARANCE', 'CHARACTER', 'CRIMINAL'],
      optional: ['RECORD', 'CONDUCT', 'DEPARTMENT', 'HISTORY', 'CHECK', 'INSPECTOR']
    },
    medical_examination: {
      mandatory: ['MEDICAL', 'EXAMINATION', 'I-693', 'VACCINATION'],
      optional: ['PHYSICIAN', 'SURGEON', 'USCIS', 'IMMUNIZATION', 'HEALTH', 'CLINIC']
    },
    i864_affidavit: {
      mandatory: ['I-864', 'AFFIDAVIT', 'SUPPORT'],
      optional: ['SPONSOR', 'PETITIONER', 'BENEFICIARY', 'INCOME', 'HOUSEHOLD', 'ASSETS']
    },
    translation: {
      mandatory: ['TRANSLATION', 'TRANSLATOR', 'CERTIFIED'],
      optional: ['SWORN', 'ACCURATE', 'LANGUAGE', 'ENGLISH', 'URDU', 'ATTEST']
    },
    irs_transcript: {
      mandatory: ['IRS', 'REVENUE', 'TRANSCRIPT'],
      optional: ['TAX', '1040', 'INCOME', 'FILING', 'RETURN', 'AGI']
    },
    form_1040: {
      mandatory: ['1040', 'TAX RETURN'],
      optional: ['IRS', 'INCOME', 'DEDUCTION', 'REFUND', 'TAX', 'FILING']
    },
    w2: {
      mandatory: ['W-2', 'WAGE'],
      optional: ['EMPLOYER', 'EMPLOYEE', 'TAX', 'SECURITY', 'MEDICARE', 'TIPS']
    },
    form_1099: {
      mandatory: ['1099'],
      optional: ['PAYER', 'RECIPIENT', 'INCOME', 'COMPENSATION', 'INTEREST']
    }
  };

  const keywords = typeKeywords[type];
  if (!keywords) {
    return { isValid: false, reason: 'Unknown document type' };
  }

  // Check for mandatory keywords (at least 1 must match) - using fuzzy match
  // Allow 1 char error for short words (<5), 2 chars for longer
  const foundMandatory = keywords.mandatory.filter(keyword => {
    const tolerance = keyword.length > 5 ? 2 : 1;
    return fuzzyContains(text, keyword, tolerance);
  });
  
  if (foundMandatory.length === 0) {
    return { 
      isValid: false, 
      reason: `Document is missing required identifier for ${type.replace('_', ' ')}. We looked for: ${keywords.mandatory.join(', ')}`,
      matchedKeywords: []
    };
  }

  // Check for optional keywords (at least 2 must match) - using fuzzy match
  const foundOptional = keywords.optional.filter(keyword => {
    const tolerance = keyword.length > 5 ? 2 : 1;
    return fuzzyContains(text, keyword, tolerance);
  });
  
  // Special case for passports: if we found "PASSPORT" and at least 1 other key field like "SURNAME" or "NATIONALITY", it's likely valid
  const minOptional = type === 'passport' ? 1 : 2;
  
  if (foundOptional.length < minOptional) {
    const missingCount = minOptional - foundOptional.length;
    return { 
      isValid: false, 
      reason: `Document looks like a ${type.replace('_', ' ')} but is missing ${missingCount} more supporting details. We found: ${foundOptional.join(', ') || 'none'}. We need at least ${minOptional} of: ${keywords.optional.join(', ')}`,
      matchedKeywords: [...foundMandatory, ...foundOptional]
    };
  }

  // Check for conflicting document types (exclusion logic)
  const conflictingType = detectConflictingDocumentType(text, type, typeKeywords);
  if (conflictingType) {
    return {
      isValid: false,
      reason: `Document appears to be a ${conflictingType.replace('_', ' ')} instead of ${type.replace('_', ' ')}`,
      matchedKeywords: [...foundMandatory, ...foundOptional]
    };
  }

  // All checks passed
  return { 
    isValid: true, 
    matchedKeywords: [...foundMandatory, ...foundOptional]
  };
};

// Helper function to detect if document matches a different type more strongly
const detectConflictingDocumentType = (
  text: string, 
  expectedType: DocumentType, 
  allKeywords: Record<DocumentType, DocumentKeywords>
): DocumentType | null => {
  const scores: Record<string, number> = {};
  
  // Score each document type based on mandatory + optional keyword matches
  Object.entries(allKeywords).forEach(([docType, keywords]) => {
    if (docType === expectedType) return; // Skip the expected type
    
    const mandatoryMatches = keywords.mandatory.filter(k => text.includes(k.toUpperCase())).length;
    const optionalMatches = keywords.optional.filter(k => text.includes(k.toUpperCase())).length;
    
    // Mandatory keywords are weighted more heavily
    scores[docType] = (mandatoryMatches * 5) + optionalMatches;
  });
  
  // If any other document type has a strong match (score >= 8), consider it conflicting
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore >= 8) {
    const conflictingType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    return conflictingType as DocumentType;
  }
  
  return null;
};

// Validate based on document type
export const validateByDocumentType = (text: string, type: DocumentType): DocumentValidationResult => {
  // Check if the OCR extracted text is substantial enough to be valid
  if (!text || text.trim().length < 50) {
    return {
      isValid: false,
      issues: [{
        severity: 'critical',
        message: 'Document appears to have insufficient text content',
        suggestion: 'Document may be blank, corrupted, or OCR failed to extract text. Please try uploading a clearer image.'
      }],
      score: 0
    };
  }

  // Convert text to uppercase for easier pattern matching
  const upperText = text.toUpperCase();

  // First, check if the document contains keywords that indicate it's the correct type
  const typeCheckResult = checkDocumentType(upperText, type);

  if (!typeCheckResult.isValid) {
    return {
      isValid: false,
      issues: [{
        severity: 'critical',
        message: typeCheckResult.reason || `Uploaded document does not appear to be a ${type.replace('_', ' ')}`,
        suggestion: 'Please upload the correct document type for validation'
      }],
      score: 0,
      extractedData: {
        matchedKeywords: typeCheckResult.matchedKeywords || [],
        textLength: text.length
      }
    };
  }

  // Document type is correct, now validate specific requirements
  switch (type) {
    case 'passport':
      return validatePassport(upperText);
    case 'nikah_nama':
      return validateNikahNama(upperText);
    case 'birth_certificate':
      return validateBirthCertificate(upperText);
    case 'marriage_certificate':
      return validateMarriageCertificate(upperText);
    case 'divorce_certificate':
      return validateDivorceCertificate(upperText);
    case 'death_certificate':
      return validateDeathCertificate(upperText);
    case 'police_certificate':
      return validatePoliceCertificate(upperText);
    case 'medical_examination':
      return validateMedicalExamination(upperText);
    case 'i864_affidavit':
      return validateI864Affidavit(upperText);
    case 'translation':
      return validateTranslation(upperText);
    case 'irs_transcript':
      return validateIrsTranscript(upperText);
    case 'form_1040':
      return validateForm1040(upperText);
    case 'w2':
      return validateW2(upperText);
    case 'form_1099':
      return validate1099(upperText);
    default:
      return {
        isValid: false,
        issues: [{
          severity: 'critical',
          message: 'Unknown document type',
          suggestion: 'Please select a valid document type'
        }],
        score: 0
      };
  }
};

// Passport validation
const validatePassport = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  // Check for essential elements
  if (!text.includes('PASSPORT')) {
    issues.push({
      severity: 'warning',
      message: 'Passport designation not found',
      suggestion: 'Ensure the document is clearly marked as a passport'
    });
  }

  if (!text.match(/PASSPORT\s+NO\.?|NUMBER|NO\.?\s+[A-Z0-9]+/)) {
    issues.push({
      severity: 'critical',
      message: 'Passport number not found',
      suggestion: 'Verify that the passport number is visible and legible'
    });
  }

  if (!text.match(/SURNAME|LAST NAME|NAME|GIVEN NAME/)) {
    issues.push({
      severity: 'critical',
      message: 'Name not found',
      suggestion: 'Verify that the name is visible and legible'
    });
  }

  if (!text.match(/NATIONALITY|CITIZENSHIP/)) {
    issues.push({
      severity: 'warning',
      message: 'Nationality not found',
      suggestion: 'Verify that the nationality is visible'
    });
  }

  if (!text.match(/DATE OF BIRTH|DOB|BIRTH DATE/)) {
    issues.push({
      severity: 'critical',
      message: 'Date of birth not found',
      suggestion: 'Verify that the date of birth is visible and legible'
    });
  }

  if (!text.match(/EXPIRY DATE|EXPIRES ON|VALID UNTIL/)) {
    issues.push({
      severity: 'critical',
      message: 'Expiry date not found',
      suggestion: 'Verify that the expiry date is visible and legible'
    });
  } else {
    // Check if passport is expired
    const expiryMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})|(\d{2}[\/\-]\d{2}[\/\-]\d{2})/);
    if (expiryMatch) {
      const expiryDateStr = expiryMatch[0];
      const expiryDate = new Date(expiryDateStr.replace(/[\/\-]/g, '/'));
      const currentDate = new Date();

      if (currentDate > expiryDate) {
        issues.push({
          severity: 'critical',
          message: 'Passport is expired',
          suggestion: 'You need a valid passport for your visa application'
        });
      }
    }
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Nikah Nama validation (special handling for Urdu documents)
const validateNikahNama = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  // Since Nikah Nama is often in Urdu, OCR might not capture everything well
  // So we'll provide a checklist-based validation instead of pure OCR

  // Check for common English terms that might appear
  if (!text.includes('NIKAH') && !text.includes('MARRIAGE')) {
    issues.push({
      severity: 'info',
      message: 'Nikah/Marriage term not found in English',
      suggestion: 'This is common for Urdu documents. Verify manually that this is a Nikah Nama'
    });
  }

  // For Urdu documents, we recommend manual verification
  issues.push({
    severity: 'info',
    message: 'Urdu document detected - manual verification recommended',
    suggestion: 'Please verify: 1) Names of bride and groom 2) Date of marriage 3) Signature of Nikah Khwan 4) Witnesses\' names and signatures 5) Official seal'
  });

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Birth certificate validation
const validateBirthCertificate = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('BIRTH') && !text.includes('CERTIFICATE')) {
    issues.push({
      severity: 'warning',
      message: 'Birth certificate designation not found',
      suggestion: 'Ensure the document is clearly marked as a birth certificate'
    });
  }

  if (!text.match(/NAME|FULL NAME/)) {
    issues.push({
      severity: 'critical',
      message: 'Name not found',
      suggestion: 'Verify that the full name is visible and legible'
    });
  }

  if (!text.match(/DATE OF BIRTH|DOB|BIRTH DATE/)) {
    issues.push({
      severity: 'critical',
      message: 'Date of birth not found',
      suggestion: 'Verify that the date of birth is visible and legible'
    });
  }

  if (!text.match(/PLACE OF BIRTH|BIRTH PLACE|BORN IN/)) {
    issues.push({
      severity: 'warning',
      message: 'Place of birth not found',
      suggestion: 'Verify that the place of birth is visible'
    });
  }

  if (!text.match(/FATHER|FATHER'S NAME|PATERNAL/)) {
    issues.push({
      severity: 'warning',
      message: 'Father\'s name not found',
      suggestion: 'Verify that the father\'s name is visible'
    });
  }

  if (!text.match(/MOTHER|MOTHER'S NAME|MATERNAL/)) {
    issues.push({
      severity: 'warning',
      message: 'Mother\'s name not found',
      suggestion: 'Verify that the mother\'s name is visible'
    });
  }

  if (!text.match(/REGISTRATION|REGISTERED|CERTIFIED/)) {
    issues.push({
      severity: 'warning',
      message: 'Registration status not found',
      suggestion: 'Verify this is a certified/registered birth certificate'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Marriage certificate validation
const validateMarriageCertificate = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('MARRIAGE') && !text.includes('CERTIFICATE')) {
    issues.push({
      severity: 'warning',
      message: 'Marriage certificate designation not found',
      suggestion: 'Ensure the document is clearly marked as a marriage certificate'
    });
  }

  if (!text.match(/HUSBAND|SPOUSE|GROOM/) && !text.match(/WIFE|BRIDE/)) {
    issues.push({
      severity: 'critical',
      message: 'Names of spouses not found',
      suggestion: 'Verify that both spouses\' names are visible and legible'
    });
  }

  if (!text.match(/DATE OF MARRIAGE|MARRIAGE DATE|WEDDING DATE/)) {
    issues.push({
      severity: 'critical',
      message: 'Date of marriage not found',
      suggestion: 'Verify that the date of marriage is visible and legible'
    });
  }

  if (!text.match(/OFFICIANT|MINISTER|PRIEST|IMAM|NIKAH KHAWAN/)) {
    issues.push({
      severity: 'warning',
      message: 'Officiant not found',
      suggestion: 'Verify that the officiant\'s name is visible'
    });
  }

  if (!text.match(/WITNESS|ATTEST|SIGNATURE/)) {
    issues.push({
      severity: 'warning',
      message: 'Witness signatures not found',
      suggestion: 'Verify that witness signatures are present'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Divorce certificate validation
const validateDivorceCertificate = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('DIVORCE') && !text.includes('DECREE') && !text.match(/DISSOLUTION/)) {
    issues.push({
      severity: 'warning',
      message: 'Divorce designation not found',
      suggestion: 'Ensure the document is clearly marked as a divorce decree'
    });
  }

  if (!text.match(/PETITIONER|PLAINTIFF/) && !text.match(/RESPONDENT|DEFENDANT/)) {
    issues.push({
      severity: 'critical',
      message: 'Parties to divorce not found',
      suggestion: 'Verify that both parties\' names are visible'
    });
  }

  if (!text.match(/DATE OF DIVORCE|DIVORCE DATE|FINALIZED/)) {
    issues.push({
      severity: 'critical',
      message: 'Date of divorce not found',
      suggestion: 'Verify that the date of divorce is visible and legible'
    });
  }

  if (!text.match(/COURT|JUDGE|COMMISSIONER/)) {
    issues.push({
      severity: 'critical',
      message: 'Court authorization not found',
      suggestion: 'Verify this is an official court document with judge\'s signature'
    });
  }

  if (!text.match(/CASE NUMBER|DOCKET|FILE NUMBER/)) {
    issues.push({
      severity: 'warning',
      message: 'Case number not found',
      suggestion: 'Verify that the case number is visible'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Death certificate validation
const validateDeathCertificate = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('DEATH') && !text.includes('CERTIFICATE')) {
    issues.push({
      severity: 'warning',
      message: 'Death certificate designation not found',
      suggestion: 'Ensure the document is clearly marked as a death certificate'
    });
  }

  if (!text.match(/DECEASED|DECEDENT|DEATH OF/)) {
    issues.push({
      severity: 'critical',
      message: 'Deceased person\'s name not found',
      suggestion: 'Verify that the deceased person\'s name is visible and legible'
    });
  }

  if (!text.match(/DATE OF DEATH|DEATH DATE|DIED ON/)) {
    issues.push({
      severity: 'critical',
      message: 'Date of death not found',
      suggestion: 'Verify that the date of death is visible and legible'
    });
  }

  if (!text.match(/PLACE OF DEATH|DEATH PLACE|DIED IN/)) {
    issues.push({
      severity: 'warning',
      message: 'Place of death not found',
      suggestion: 'Verify that the place of death is visible'
    });
  }

  if (!text.match(/CAUSE OF DEATH|CAUSE|REASON FOR DEATH/)) {
    issues.push({
      severity: 'warning',
      message: 'Cause of death not found',
      suggestion: 'Verify that the cause of death is visible (may be redacted for privacy)'
    });
  }

  if (!text.match(/REGISTRAR|AUTHORITY|ISSUED BY/)) {
    issues.push({
      severity: 'critical',
      message: 'Issuing authority not found',
      suggestion: 'Verify this is an official document from the vital records office'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Police certificate validation
const validatePoliceCertificate = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('POLICE') && !text.includes('CLEARANCE') && !text.includes('CERTIFICATE')) {
    issues.push({
      severity: 'warning',
      message: 'Police certificate designation not found',
      suggestion: 'Ensure the document is clearly marked as a police clearance certificate'
    });
  }

  if (!text.match(/NAME|FULL NAME/) && !text.match(/SUBJECT|APPLICANT/)) {
    issues.push({
      severity: 'critical',
      message: 'Applicant name not found',
      suggestion: 'Verify that the applicant\'s name is visible and legible'
    });
  }

  if (!text.match(/DATE|ISSUE DATE|ISSUED ON/)) {
    issues.push({
      severity: 'critical',
      message: 'Issue date not found',
      suggestion: 'Verify that the issue date is visible and legible'
    });
  }

  if (!text.match(/NO RECORD|CLEARED|GOOD STANDING|NO CRIMINAL RECORD/)) {
    issues.push({
      severity: 'critical',
      message: 'Clearance status not found',
      suggestion: 'Verify that the certificate indicates criminal record status'
    });
  }

  if (!text.match(/AUTHORITY|ISSUED BY|DEPARTMENT|AGENCY/)) {
    issues.push({
      severity: 'critical',
      message: 'Issuing authority not found',
      suggestion: 'Verify this is an official document from a recognized authority'
    });
  }

  // Check if certificate is expired (police certificates often have expiration)
  const issueMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})|(\d{2}[\/\-]\d{2}[\/\-]\d{2})/);
  if (issueMatch) {
    const issueDateStr = issueMatch[0];
    const issueDate = new Date(issueDateStr.replace(/[\/\-]/g, '/'));
    const currentDate = new Date();

    // Police certificates are often valid for 1 year
    const oneYearFromIssue = new Date(issueDate);
    oneYearFromIssue.setFullYear(oneYearFromIssue.getFullYear() + 1);

    if (currentDate > oneYearFromIssue) {
      issues.push({
        severity: 'warning',
        message: 'Police certificate may be expired (older than 1 year)',
        suggestion: 'Consider obtaining a newer certificate if yours is older than 1 year'
      });
    }
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Medical examination validation
const validateMedicalExamination = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('MEDICAL') && !text.includes('PHYSICIAN') && !text.match(/EXAMINATION|EXAM/)) {
    issues.push({
      severity: 'warning',
      message: 'Medical examination designation not found',
      suggestion: 'Ensure the document is clearly marked as a medical examination report'
    });
  }

  if (!text.match(/FORM I-693|I-693|MEDICAL REPORT/)) {
    issues.push({
      severity: 'critical',
      message: 'Form I-693 designation not found',
      suggestion: 'Verify this is a Form I-693 Report of Medical Examination'
    });
  }

  if (!text.match(/PHYSICIAN|DOCTOR|MEDICAL OFFICER|PANEL PHYSICIAN/)) {
    issues.push({
      severity: 'critical',
      message: 'Examining physician not found',
      suggestion: 'Verify that the examining physician\'s name and credentials are visible'
    });
  }

  if (!text.match(/VACCINATION|VACCINE|IMMUNIZATION/)) {
    issues.push({
      severity: 'warning',
      message: 'Vaccination status not found',
      suggestion: 'Verify that vaccination records are included'
    });
  }

  if (!text.match(/CLASSIFICATION|CLASS|INELIGIBLE|ELIGIBLE/)) {
    issues.push({
      severity: 'critical',
      message: 'Medical eligibility determination not found',
      suggestion: 'Verify that the medical officer\'s determination is visible'
    });
  }

  if (!text.match(/DATE|EXAM DATE|EXAMINED ON/)) {
    issues.push({
      severity: 'critical',
      message: 'Examination date not found',
      suggestion: 'Verify that the examination date is visible and legible'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// I-864 Affidavit validation
const validateI864Affidavit = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('I-864') && !text.includes('AFFIDAVIT') && !text.includes('SUPPORT')) {
    issues.push({
      severity: 'critical',
      message: 'Form I-864 designation not found',
      suggestion: 'Verify this is Form I-864 Affidavit of Support'
    });
  }

  if (!text.match(/SPONSOR|PETITIONER/)) {
    issues.push({
      severity: 'critical',
      message: 'Sponsor information not found',
      suggestion: 'Verify that the sponsor\'s information is visible'
    });
  }

  if (!text.match(/BENEFICIARY|IMMIGRANT|APPLICANT/)) {
    issues.push({
      severity: 'critical',
      message: 'Beneficiary information not found',
      suggestion: 'Verify that the beneficiary\'s information is visible'
    });
  }

  if (!text.match(/INCOME|TAX RETURN|W-2|1040/)) {
    issues.push({
      severity: 'warning',
      message: 'Income evidence not found',
      suggestion: 'Verify that supporting income documents are attached'
    });
  }

  if (!text.match(/SIGNATURE|SIGNED|SUBSCRIBED/)) {
    issues.push({
      severity: 'critical',
      message: 'Signature not found',
      suggestion: 'Verify that the sponsor\'s signature is present'
    });
  }

  if (!text.match(/DATE|SIGNED ON|DATED/)) {
    issues.push({
      severity: 'critical',
      message: 'Signature date not found',
      suggestion: 'Verify that the signature date is visible'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Translation document validation
const validateTranslation = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('TRANSLATION') && !text.match(/TRANSLATED FROM|TRANSLATED TO/)) {
    issues.push({
      severity: 'info',
      message: 'Translation designation not found',
      suggestion: 'Ensure the document is clearly marked as a translation'
    });
  }

  if (!text.match(/CERTIFIED|SWORN|ACKNOWLEDGED/)) {
    issues.push({
      severity: 'critical',
      message: 'Certification not found',
      suggestion: 'Verify this is a certified translation by a qualified translator'
    });
  }

  if (!text.match(/TRANSLATOR|INTERPRETER|CERTIFY/)) {
    issues.push({
      severity: 'critical',
      message: 'Translator identification not found',
      suggestion: 'Verify that the translator\'s name and credentials are visible'
    });
  }

  if (!text.match(/SIGNATURE|SIGNED|CERTIFIED CORRECT/)) {
    issues.push({
      severity: 'critical',
      message: 'Translator signature not found',
      suggestion: 'Verify that the translator\'s signature is present'
    });
  }

  if (!text.match(/DATE|TRANSLATED ON|CERTIFIED ON/)) {
    issues.push({
      severity: 'warning',
      message: 'Translation date not found',
      suggestion: 'Verify that the translation date is visible'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// IRS Tax Transcript validation
const validateIrsTranscript = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('IRS') && !text.includes('TRANSCRIPT') && !text.match(/INTERNAL REVENUE SERVICE/)) {
    issues.push({
      severity: 'critical',
      message: 'IRS Transcript designation not found',
      suggestion: 'Verify this is an official IRS Tax Transcript'
    });
  }

  if (!text.match(/SSN|SOCIAL SECURITY NUMBER|TAX YEAR|YEAR|FORM \d{4}/)) {
    issues.push({
      severity: 'critical',
      message: 'Taxpayer identification not found',
      suggestion: 'Verify that SSN, name, and tax year are visible'
    });
  }

  if (!text.match(/FORM \d{4}|1040|1099|W-2/)) {
    issues.push({
      severity: 'warning',
      message: 'Form type not clearly identified',
      suggestion: 'Verify that the transcript shows which tax form it relates to'
    });
  }

  if (!text.match(/TOTAL INCOME|ADJUSTED GROSS|TAX|LIABILITY/)) {
    issues.push({
      severity: 'critical',
      message: 'Income information not found',
      suggestion: 'Verify that income figures are clearly shown'
    });
  }

  if (!text.match(/DATE ISSUED|ISSUE DATE|REQUESTED ON/)) {
    issues.push({
      severity: 'warning',
      message: 'Issue date not found',
      suggestion: 'Verify that the transcript issue date is visible'
    });
  }

  // Check if transcript is recent (within last year)
  const issueMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})|(\d{2}[\/\-]\d{2}[\/\-]\d{2})/);
  if (issueMatch) {
    const issueDateStr = issueMatch[0];
    const issueDate = new Date(issueDateStr.replace(/[\/\-]/g, '/'));
    const currentDate = new Date();

    // Tax transcripts are typically valid for 1 year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (issueDate < oneYearAgo) {
      issues.push({
        severity: 'warning',
        message: 'Tax transcript may be outdated (older than 1 year)',
        suggestion: 'Consider requesting a newer transcript if yours is older than 1 year'
      });
    }
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// Form 1040 validation
const validateForm1040 = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('1040') && !text.includes('INDIVIDUAL') && !text.includes('INCOME TAX')) {
    issues.push({
      severity: 'critical',
      message: 'Form 1040 designation not found',
      suggestion: 'Verify this is Form 1040 U.S. Individual Income Tax Return'
    });
  }

  if (!text.match(/SSN|SOCIAL SECURITY NUMBER|TAX YEAR|YEAR|FORM 1040/)) {
    issues.push({
      severity: 'critical',
      message: 'Taxpayer identification not found',
      suggestion: 'Verify that SSN, name, and tax year are visible'
    });
  }

  if (!text.match(/TOTAL INCOME|ADJUSTED GROSS|TAX|LIABILITY|REFUND|OWING/)) {
    issues.push({
      severity: 'critical',
      message: 'Income information not found',
      suggestion: 'Verify that income figures are clearly shown'
    });
  }

  if (!text.match(/SIGNATURE|SIGNED|ELECTRONICALLY FILED/)) {
    issues.push({
      severity: 'critical',
      message: 'Signature not found',
      suggestion: 'Verify that the taxpayer\'s signature is present (or electronic filing confirmation)'
    });
  }

  if (!text.match(/DATE|SIGNED ON|FILED ON/)) {
    issues.push({
      severity: 'warning',
      message: 'Filing date not found',
      suggestion: 'Verify that the filing date is visible'
    });
  }

  // Check if form is complete (not just first page)
  if (text.length < 500) {
    issues.push({
      severity: 'warning',
      message: 'Form may be incomplete (appears to be only first page)',
      suggestion: 'Verify that all pages of Form 1040 are included'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// W-2 Form validation
const validateW2 = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('W-2') && !text.includes('WAGE AND TAX STATEMENT')) {
    issues.push({
      severity: 'critical',
      message: 'Form W-2 designation not found',
      suggestion: 'Verify this is Form W-2 Wage and Tax Statement'
    });
  }

  if (!text.match(/EMPLOYEE|SSN|SOCIAL SECURITY NUMBER|EMPLOYER|EIN|EMPLOYER ID/)) {
    issues.push({
      severity: 'critical',
      message: 'Employee/Employer identification not found',
      suggestion: 'Verify that employee SSN and employer EIN are visible'
    });
  }

  if (!text.match(/WAGES|TIPS|OTHER COMPENSATION|INCOME|SALARY/)) {
    issues.push({
      severity: 'critical',
      message: 'Income information not found',
      suggestion: 'Verify that wages/income figures are clearly shown'
    });
  }

  if (!text.match(/BOX 1|BOX 2|BOX 16|BOX 17|FEDERAL|STATE/)) {
    issues.push({
      severity: 'warning',
      message: 'W-2 boxes not clearly identified',
      suggestion: 'Verify that important boxes (1, 2, 16, 17) are visible'
    });
  }

  if (!text.match(/YEAR|TAX YEAR|\d{4}/)) {
    issues.push({
      severity: 'critical',
      message: 'Tax year not found',
      suggestion: 'Verify that the tax year is clearly shown'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};

// 1099 Form validation
const validate1099 = (text: string): DocumentValidationResult => {
  const issues: ValidationIssue[] = [];

  if (!text.includes('1099') && !text.match(/INDEPENDENT CONTRACTOR|SELF-EMPLOYED/)) {
    issues.push({
      severity: 'warning',
      message: 'Form 1099 designation not found',
      suggestion: 'Verify this is Form 1099 for self-employed income'
    });
  }

  if (!text.match(/SSN|TIN|PAYER|RECIPIENT/)) {
    issues.push({
      severity: 'critical',
      message: 'Taxpayer identification not found',
      suggestion: 'Verify that recipient SSN/TIN and payer information are visible'
    });
  }

  if (!text.match(/INCOME|AMOUNT|REPORTABLE|EARNINGS/)) {
    issues.push({
      severity: 'critical',
      message: 'Income information not found',
      suggestion: 'Verify that income figures are clearly shown'
    });
  }

  if (!text.match(/YEAR|TAX YEAR|\d{4}/)) {
    issues.push({
      severity: 'critical',
      message: 'Tax year not found',
      suggestion: 'Verify that the tax year is clearly shown'
    });
  }

  // Calculate score based on issues
  let score = 100;
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    if (issue.severity === 'warning') score -= 10;
    if (issue.severity === 'info') score -= 5;
  });
  score = Math.max(0, score);

  return {
    isValid: issues.filter(i => i.severity === 'critical').length === 0,
    issues,
    score
  };
};