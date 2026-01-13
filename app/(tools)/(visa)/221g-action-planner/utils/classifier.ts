// Types for our scenario classification
export type ScenarioCode = 
  | '221G_DOCS_REQUESTED_FINANCIAL'
  | '221G_DOCS_REQUESTED_CIVIL'
  | '221G_DOCS_REQUESTED_SECURITY'
  | '221G_DOCS_REQUESTED_LEGAL'
  | '221G_DOCS_REQUESTED_MEDICAL'
  | '221G_DOCS_REQUESTED_TRANSLATION'
  | '221G_DOCS_REQUESTED_OTHER'
  | 'AP_ONLY_NO_DOCS'
  | 'DS5535_REQUESTED'
  | 'DOCS_SUBMITTED_WAITING_UPDATE'
  | 'UNKNOWN';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ClassificationResult {
  scenarioCode: ScenarioCode;
  confidence: ConfidenceLevel;
  description: string;
  nextSteps: string[];
}

// Import the FormData type from the types file
import type { FormData } from '../types/221g';

/**
 * Classifies the user's 221(g) or administrative processing situation
 * based on the intake form data
 */
export function classifySituation(formData: FormData): ClassificationResult {
  // If no letter was received, it might be administrative processing only
  if (formData.letterReceived === false) {
    if (formData.ceacStatus.toLowerCase().includes('administrative')) {
      return {
        scenarioCode: 'AP_ONLY_NO_DOCS',
        confidence: 'high',
        description: 'Administrative Processing Only - No Additional Documents Requested',
        nextSteps: [
          'Wait for processing to complete',
          'Monitor CEAC status regularly',
          'Avoid unnecessary inquiries during processing',
          'Prepare for potential extended wait times'
        ]
      };
    }
  }

  // If a letter was received, determine what was requested
  if (formData.letterReceived === true) {
    // Check for financial document requests
    if (formData.officerRequests.includes('financial')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_FINANCIAL',
        confidence: 'high',
        description: '221(g) - Financial Documents Requested',
        nextSteps: [
          'Gather requested financial documents (I-864, tax transcripts, employment letters)',
          'Ensure all documents are properly translated if needed',
          'Submit complete packet as soon as possible',
          'Keep copies of all submitted documents'
        ]
      };
    }

    // Check for civil document requests
    if (formData.officerRequests.includes('civil')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_CIVIL',
        confidence: 'high',
        description: '221(g) - Civil Documents Requested',
        nextSteps: [
          'Gather requested civil documents (birth certificates, marriage certificates, police certificates)',
          'Ensure all documents are properly translated if needed',
          'Submit complete packet as soon as possible',
          'Keep copies of all submitted documents'
        ]
      };
    }

    // Check for security-related requests
    if (formData.officerRequests.includes('security')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_SECURITY',
        confidence: 'high',
        description: '221(g) - Security Clearance Required',
        nextSteps: [
          'No additional documents typically needed for security clearance',
          'Wait for processing to complete',
          'Monitor CEAC status regularly',
          'Avoid unnecessary inquiries during processing'
        ]
      };
    }

    // Check for legal document requests
    if (formData.officerRequests.includes('legal')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_LEGAL',
        confidence: 'high',
        description: '221(g) - Legal Documents Requested',
        nextSteps: [
          'Gather requested legal documents (divorce decrees, death certificates, court records)',
          'Ensure all documents are properly translated if needed',
          'Submit complete packet as soon as possible',
          'Keep copies of all submitted documents'
        ]
      };
    }

    // Check for medical document requests
    if (formData.officerRequests.includes('medical')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_MEDICAL',
        confidence: 'high',
        description: '221(g) - Medical Examination Corrections',
        nextSteps: [
          'Contact the medical facility that conducted your exam',
          'Follow their instructions for corrections',
          'Resubmit corrected medical documents',
          'Keep copies of all submitted documents'
        ]
      };
    }

    // Check for translation requests
    if (formData.officerRequests.includes('translation')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_TRANSLATION',
        confidence: 'high',
        description: '221(g) - Document Translations Required',
        nextSteps: [
          'Obtain certified translations for requested documents',
          'Ensure translations are by qualified translators',
          'Submit translated documents along with originals',
          'Keep copies of all submitted documents'
        ]
      };
    }

    // Check for other requests
    if (formData.officerRequests.includes('other')) {
      return {
        scenarioCode: '221G_DOCS_REQUESTED_OTHER',
        confidence: 'medium',
        description: '221(g) - Other Documents Requested',
        nextSteps: [
          'Clarify exactly what documents are needed',
          'Gather requested documents',
          'Submit complete packet as soon as possible',
          'Keep copies of all submitted documents'
        ]
      };
    }
  }

  // If user has submitted documents and is waiting for an update
  if (formData.ceacStatus.toLowerCase().includes('submitted') || 
      formData.ceacStatus.toLowerCase().includes('received')) {
    return {
      scenarioCode: 'DOCS_SUBMITTED_WAITING_UPDATE',
      confidence: 'high',
      description: 'Documents Submitted - Waiting for Update',
      nextSteps: [
        'Wait for CEAC status update',
        'Monitor status regularly but avoid excessive checking',
        'Prepare for next steps based on outcome',
        'Keep submission proof for reference'
      ]
    };
  }

  // If we can't determine the situation clearly
  return {
    scenarioCode: 'UNKNOWN',
    confidence: 'low',
    description: 'Unable to Determine Specific Situation',
    nextSteps: [
      'Double-check your 221(g) letter for specific requirements',
      'Contact the embassy if requirements are unclear',
      'Consult with an immigration attorney if needed',
      'Continue monitoring CEAC status'
    ]
  };
}