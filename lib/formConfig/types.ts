export type FieldType =
  | "text"
  | "radio"
  | "checkbox"
  | "date"
  | "hidden"
  | "select"
  | "combo"      // <-- Added: for state/province dropdowns
  | "textarea";

export type Field = {
  key: string;
  pdfKey: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;                    // <-- Added
  options?: { label: string; value: string; pdfKey: string }[];
  
  // Condition function must return boolean
  condition?: (data: Record<string, string>) => boolean;
  
  section?: string;
  value?: string;
  
  // Optional: for repeatable sections (like household members)
  repeatable?: boolean;
  groupId?: string;
};