export type BirthStepId =
  | "person_type"
  | "document_need"
  | "case_type"
  | "location"
  | "roadmap"
  | "office_finder"
  | "validation";


export interface BirthWizardState {
  personType: string | null;
  documentNeed: string | null;
  caseType: string | null;
  province: string | null;
  district: string | null;
  city: string | null;
  checkedDocuments: string[];
  validationChecks: string[];
  uploadedFile: boolean;
}

