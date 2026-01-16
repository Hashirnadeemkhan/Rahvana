// Types for our scenario classification
export type ScenarioCode =
  | "221G_DOCS_REQUESTED_FINANCIAL"
  | "221G_DOCS_REQUESTED_CIVIL"
  | "221G_DOCS_REQUESTED_SECURITY"
  | "221G_DOCS_REQUESTED_LEGAL"
  | "221G_DOCS_REQUESTED_MEDICAL"
  | "221G_DOCS_REQUESTED_TRANSLATION"
  | "221G_DOCS_REQUESTED_OTHER"
  | "AP_ONLY_NO_DOCS"
  | "DS5535_REQUESTED"
  | "DOCS_SUBMITTED_WAITING_UPDATE"
  | "UNKNOWN"

export type ConfidenceLevel = "high" | "medium" | "low"

export interface ClassificationResult {
  scenarioCode: ScenarioCode
  confidence: ConfidenceLevel
  description: string
  nextSteps: string[]
}

import type { FormData } from "../types/221g"

/**
 * Classifies the user's 221(g) or administrative processing situation
 * based on the intake form data and parsed letter items
 */
export function classifySituation(formData: FormData, parsedItems: string[] = []): ClassificationResult {
  let confidence: ConfidenceLevel = formData.letterReceived ? 'medium' : 'low';
  let scenarioCode: ScenarioCode = 'UNKNOWN';

  // Boost confidence if parsed items exist and not blurry
  if (parsedItems.length > 0) {
    confidence = 'high';
  }

  // If no letter, likely AP
  if (formData.letterReceived === false) {
    if (formData.ceacStatus.toLowerCase().includes("administrative")) {
      scenarioCode = "AP_ONLY_NO_DOCS";
      confidence = 'high';
      return {
        scenarioCode,
        confidence,
        description: "Administrative Processing Only - No Additional Documents Requested",
        nextSteps: [
          "Wait for processing to complete",
          "Monitor CEAC status regularly",
          "Avoid unnecessary inquiries during processing",
          "Prepare for potential extended wait times",
        ],
      }
    }
  }

  // Use parsedItems to determine requests if available, else fall back to officerRequests
  const requests = parsedItems.length > 0 ? parsedItems : formData.officerRequests;

  if (formData.letterReceived === true) {
    // Financial
    if (requests.some(r => r.includes('financial') || r.includes('I-864') || r.includes('TAX'))) {
      scenarioCode = "221G_DOCS_REQUESTED_FINANCIAL";
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Financial Documents Requested",
        nextSteps: [
          "Gather requested financial documents (I-864, tax transcripts, employment letters)",
          "Ensure all documents are properly translated if needed",
          "Submit complete packet as soon as possible",
          "Keep copies of all submitted documents",
        ],
      }
    }

    // Civil
    if (requests.some(r => r.includes('civil') || r.includes('BIRTH_CERT') || r.includes('POLICE_CERT'))) {
      scenarioCode = "221G_DOCS_REQUESTED_CIVIL";
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Civil Documents Requested",
        nextSteps: [
          "Gather requested civil documents (birth certificates, marriage certificates, police certificates)",
          "Ensure all documents are properly translated if needed",
          "Submit complete packet as soon as possible",
          "Keep copies of all submitted documents",
        ],
      }
    }

    // Security
    if (requests.some(r => r.includes('security') || r.includes('DS5535'))) {
      scenarioCode = "221G_DOCS_REQUESTED_SECURITY";
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Security Clearance Required",
        nextSteps: [
          "No additional documents typically needed for security clearance",
          "Wait for processing to complete",
          "Monitor CEAC status regularly",
          "Avoid unnecessary inquiries during processing",
        ],
      }
    }

    // Legal
    if (requests.some(r => r.includes('legal') || r.includes('DIVORCE') || r.includes('DEATH_CERT'))) {
      scenarioCode = "221G_DOCS_REQUESTED_LEGAL";
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Legal Documents Requested",
        nextSteps: [
          "Gather requested legal documents (divorce decrees, death certificates, court records)",
          "Ensure all documents are properly translated if needed",
          "Submit complete packet as soon as possible",
          "Keep copies of all submitted documents",
        ],
      }
    }

    // Medical
    if (requests.some(r => r.includes('medical'))) {
      scenarioCode = "221G_DOCS_REQUESTED_MEDICAL";
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Medical Examination Corrections",
        nextSteps: [
          "Contact the medical facility that conducted your exam",
          "Follow their instructions for corrections",
          "Resubmit corrected medical documents",
          "Keep copies of all submitted documents",
        ],
      }
    }

    // Translation
    if (requests.some(r => r.includes('translation'))) {
      scenarioCode = "221G_DOCS_REQUESTED_TRANSLATION";
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Document Translations Required",
        nextSteps: [
          "Obtain certified translations for requested documents",
          "Ensure translations are by qualified translators",
          "Submit translated documents along with originals",
          "Keep copies of all submitted documents",
        ],
      }
    }

    // Other
    if (requests.some(r => r.includes('other'))) {
      scenarioCode = "221G_DOCS_REQUESTED_OTHER";
      confidence = 'medium';
      return {
        scenarioCode,
        confidence,
        description: "221(g) - Other Documents Requested",
        nextSteps: [
          "Clarify exactly what documents are needed",
          "Gather requested documents",
          "Submit complete packet as soon as possible",
          "Keep copies of all submitted documents",
        ],
      }
    }
  }

  // Submitted waiting
  if (
    formData.ceacStatus.toLowerCase().includes("submitted") ||
    formData.ceacStatus.toLowerCase().includes("received")
  ) {
    scenarioCode = "DOCS_SUBMITTED_WAITING_UPDATE";
    return {
      scenarioCode,
      confidence: 'high',
      description: "Documents Submitted - Waiting for Update",
      nextSteps: [
        "Wait for CEAC status update",
        "Monitor status regularly but avoid excessive checking",
        "Prepare for next steps based on outcome",
        "Keep submission proof for reference",
      ],
    }
  }

  // Unknown
  return {
    scenarioCode: "UNKNOWN",
    confidence: 'low',
    description: "Unable to Determine Specific Situation",
    nextSteps: [
      "Double-check your 221(g) letter for specific requirements",
      "Contact the embassy if requirements are unclear",
      "Consult with an immigration attorney if needed",
      "Continue monitoring CEAC status",
    ],
  }
}