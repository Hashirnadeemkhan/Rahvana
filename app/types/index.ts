export interface FormMetadata {
  id: number;
  form_id: string;
  field_name: string;
  question_text: string;
}

export interface FormResponse {
  user_id: string;
  form_id: string;
  responses: Record<string, string>;
}