// utils/formSelectionMapper.ts

/**
 * Maps detailed 221(g) form selections to scenario codes
 */
export function mapFormSelectionsToScenario(selectedItems: Record<string, boolean>): string[] {
  const scenarios: string[] = [];
  
  // Map form selections to scenario codes
  if (selectedItems.admin_processing) {
    scenarios.push('ADMIN_PROCESSING');
  }
  
  if (selectedItems.passport) {
    scenarios.push('PASSPORT_ISSUES');
  }
  
  if (selectedItems.medical_examination) {
    scenarios.push('MEDICAL_EXAMINATION_ISSUES');
  }
  
  if (selectedItems.nadra_family_reg) {
    scenarios.push('CIVIL_DOCUMENTS_NADRA_FAMILY_REG');
  }
  
  if (selectedItems.nadra_birth_cert) {
    scenarios.push('CIVIL_DOCUMENTS_BIRTH_CERT');
    if (selectedItems.nadra_birth_cert_petitioner) {
      scenarios.push('BIRTH_CERT_PETITIONER');
    }
    if (selectedItems.nadra_birth_cert_beneficiary) {
      scenarios.push('BIRTH_CERT_BENEFICIARY');
    }
  }
  
  if (selectedItems.nadra_marriage_cert) {
    scenarios.push('CIVIL_DOCUMENTS_MARRIAGE_CERT');
  }
  
  if (selectedItems.nikah_nama) {
    scenarios.push('CIVIL_DOCUMENTS_NIKAH_NAMA');
  }
  
  if (selectedItems.nadra_divorce_cert) {
    scenarios.push('CIVIL_DOCUMENTS_DIVORCE_CERT');
    if (selectedItems.nadra_divorce_cert_petitioner) {
      scenarios.push('DIVORCE_CERT_PETITIONER');
    }
    if (selectedItems.nadra_divorce_cert_beneficiary) {
      scenarios.push('DIVORCE_CERT_BENEFICIARY');
    }
  }
  
  if (selectedItems.us_divorce_decree) {
    scenarios.push('LEGAL_DOCUMENTS_US_DIVORCE_DECREE');
  }
  
  if (selectedItems.death_certificate) {
    scenarios.push('LEGAL_DOCUMENTS_DEATH_CERTIFICATE');
  }
  
  if (selectedItems.police_certificate) {
    scenarios.push('CIVIL_DOCUMENTS_POLICE_CERTIFICATE');
  }
  
  if (selectedItems.english_translation) {
    scenarios.push('TRANSLATION_REQUIREMENTS');
  }
  
  if (selectedItems.i864_affidavit) {
    scenarios.push('FINANCIAL_DOCUMENTS_I864_AFFIDAVIT');
    if (selectedItems.i864_petitioner) {
      scenarios.push('FINANCIAL_I864_PETITIONER');
    }
    if (selectedItems.i864_joint_sponsor) {
      scenarios.push('FINANCIAL_I864_JOINT_SPONSOR');
    }
    if (selectedItems.i864a) {
      scenarios.push('FINANCIAL_I864A');
    }
    if (selectedItems.i134) {
      scenarios.push('FINANCIAL_I134');
    }
    if (selectedItems.i864w) {
      scenarios.push('FINANCIAL_I864W');
    }
    if (selectedItems.tax_1040) {
      scenarios.push('FINANCIAL_TAX_1040');
    }
    if (selectedItems.w2) {
      scenarios.push('FINANCIAL_W2');
    }
    if (selectedItems.irs_transcript) {
      scenarios.push('FINANCIAL_IRS_TRANSCRIPT');
    }
    if (selectedItems.proof_citizenship) {
      scenarios.push('FINANCIAL_PROOF_CITIZENSHIP');
    }
    if (selectedItems.domicile) {
      scenarios.push('FINANCIAL_DOMICILE');
    }
  }
  
  if (selectedItems.dna_test) {
    scenarios.push('DNA_TEST_REQUIRED');
  }
  
  if (selectedItems.other) {
    scenarios.push('OTHER_REQUIREMENTS');
  }
  
  return scenarios;
}