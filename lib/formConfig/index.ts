// lib/formConfig/index.ts

import * as i130 from "./i130";
// import * as i130a from "./i130a";
import * as i864 from "./i864";
// import * as ds260 from "./ds260"
import type { FormConfig } from "./types"; // import your FormConfig type

// Define the type for the configs object
const configs: Record<string, FormConfig> = {
  i130,
  i864,
  // i130a,
  // ds260
};

// Function to get the form config based on the form code
export const getFormConfig = (formCode: string): FormConfig | null => {
  const normalized = formCode.toLowerCase().replace(/[^a-z0-9]/g, "");
  return configs[normalized] || null;
};
