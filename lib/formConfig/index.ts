// lib/formConfig/index.ts

import * as i130 from "./i130"
// import * as i130a from "./i130a"
import * as i864 from "./i864"
// import * as ds260 from "./ds260"

// Yeh function export karo — ab error nahi aayega!
export const getFormConfig = (formCode: string) => {
  const normalized = formCode.toLowerCase().replace(/[^a-z0-9]/g, "")
  const configs: Record<string, any> = { i130, i864}
  return configs[normalized] || null
}