export type BirthStepId =
  | "case_type"
  | "location"
  | "roadmap"
  | "office_finder"
  | "validation";

export interface BirthWizardState {
  caseType: string | null;
  province: string | null;
  district: string | null;
  city: string | null;
  checkedDocuments: string[];
  validationChecks: string[];
  uploadedFile: boolean;
}
