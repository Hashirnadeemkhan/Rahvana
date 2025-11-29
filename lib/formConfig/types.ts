export type FieldType =
  | "text"
  | "radio"
  | "checkbox"
  | "date"
  | "hidden"
  | "select"
  | "combo"
  | "textarea";

export type Field = {
  key: string;
  pdfKey: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  options?: { label: string; value: string; pdfKey: string }[];
  condition?: (data: Record<string, string>) => boolean;
  section?: string;
  value?: string;
  repeatable?: boolean;
  groupId?: string;
};

// ✅ Add this: FormConfig type
export type FormConfig = {
  formTitle?: string;
  formSubtitle?: string;
  formFields: Field[];
  getInitialFormData: () => Record<string, string>;
};
