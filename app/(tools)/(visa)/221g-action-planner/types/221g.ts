// types/221g.ts

export interface FormSelections {
  admin_processing?: boolean;
  passport?: boolean;
  medical_examination?: boolean;
  nadra_family_reg?: boolean;
  nadra_birth_cert?: boolean;
  nadra_birth_cert_petitioner?: boolean;
  nadra_birth_cert_beneficiary?: boolean;
  nadra_marriage_cert?: boolean;
  nikah_nama?: boolean;
  nadra_divorce_cert?: boolean;
  nadra_divorce_cert_petitioner?: boolean;
  nadra_divorce_cert_beneficiary?: boolean;
  us_divorce_decree?: boolean;
  death_certificate?: boolean;
  death_certificate_name?: string;
  police_certificate?: boolean;
  police_certificate_country?: string;
  english_translation?: boolean;
  english_translation_document?: string;
  i864_affidavit?: boolean;
  i864_courier?: boolean;
  i864_online?: boolean;
  i864_petitioner?: boolean;
  i864_joint_sponsor?: boolean;
  i864a?: boolean;
  i134?: boolean;
  i864w?: boolean;
  tax_1040?: boolean;
  w2?: boolean;
  irs_transcript?: boolean;
  proof_citizenship?: boolean;
  domicile?: boolean;
  dna_test?: boolean;
  dna_test_name?: string;
  other?: boolean;
  other_details?: string;
  caseId?: string;
}

export interface FormData {
  visaType: string;
  visaTypeOther: string;
  interviewDate: string;
  embassy: string;
  embassyOther: string;
  letterReceived: boolean | null;
  officerRequests: string[];
  officerRequestOther: string;
  passportKept: boolean | null;
  ceacStatus: string;
  ceacUpdateDate: string;
  caseNumber: string;
  additionalNotes: string;
}