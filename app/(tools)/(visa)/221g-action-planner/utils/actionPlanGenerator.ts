import type { ClassificationResult } from "./classifier"

export interface ActionPlan {
  title: string
  description: string
  stages: ActionStage[]
  selected221gItems?: string[]
}

export interface ActionStage {
  title: string
  timeframe: string
  actions: string[]
  tips: string[]
  documents?: string[]
}

/**
 * Generates a personalized action plan based on the classified scenario
 */
export function generateActionPlan(classification: ClassificationResult, selected221gItems: string[] = []): ActionPlan {
  const scenario = classification.scenarioCode

  const hasCivilDocs = selected221gItems.some(
    (item) =>
      item.includes("CIVIL_DOCUMENTS") ||
      item.includes("BIRTH_CERT") ||
      item.includes("MARRIAGE_CERT") ||
      item.includes("NIKAH_NAMA") ||
      item.includes("POLICE_CERTIFICATE") ||
      item.includes("NADRA"),
  )

  const hasLegalDocs = selected221gItems.some(
    (item) => item.includes("LEGAL_DOCUMENTS") || item.includes("DIVORCE_CERT") || item.includes("DEATH_CERTIFICATE"),
  )

  const hasTranslation = selected221gItems.includes("TRANSLATION_REQUIREMENTS")

  switch (scenario) {
    case "221G_DOCS_REQUESTED_FINANCIAL":
      return {
        title: "Financial Documents Required - Action Plan",
        description:
          "Your case requires additional financial documentation. Follow this plan to prepare and submit the required documents correctly.",
        selected221gItems,
        stages: [
          {
            title: "Do Now (Today)",
            timeframe: "Immediate Actions",
            actions: [
              "Gather your most recent tax transcripts from the IRS (Form 1040 with all schedules)",
              "Collect employment verification letter from your sponsor's employer",
              "Compile recent pay stubs (last 6 months) from sponsor's employment",
              "Verify all financial documents match the information provided in your I-864 Affidavit of Support",
            ],
            tips: [
              "Use the IRS Transcript Delivery System (TDS) for free tax transcripts",
              "Employment verification should include job title, salary, employment dates, and company letterhead",
              "Ensure all documents are dated within the last 30 days if possible",
            ],
            documents: [
              "Federal Tax Transcripts (last 3 years)",
              "Employment Verification Letter",
              "Recent Pay Stubs (last 6 months)",
              "Bank Statements (if showing significant assets)",
              "Asset Documentation (if relying on assets)",
            ],
          },
          {
            title: "Next 3-7 Days",
            timeframe: "Document Preparation",
            actions: [
              "Ensure all documents are properly translated if not in English",
              "Make copies of all documents for your records",
              "Verify that all names and dates match across all documents",
              "Prepare a cover letter explaining what you're submitting",
            ],
            tips: [
              "Use certified translators for document translations",
              "Keep original documents separate from copies",
              "Check that all signatures are present on documents that require them",
            ],
            documents: ["Cover Letter", "Document Checklist", "Certified Translations (if needed)"],
          },
          {
            title: "Submit Documents",
            timeframe: "Within 30 Days",
            actions: [
              "Submit all required financial documents according to embassy instructions",
              "Keep proof of submission (receipts, tracking numbers)",
              "Monitor your CEAC status for updates",
            ],
            tips: [
              "Follow the specific submission method outlined in your 221(g) letter",
              "Use trackable shipping method if sending physical documents",
              "Never send original documents unless specifically requested",
            ],
          },
          {
            title: "If No Update After 30-60 Days",
            timeframe: "Follow-up Actions",
            actions: [
              "Check CEAC status regularly",
              "Send a polite inquiry if no update after 60 days",
              "Consider reaching out to your Congressman if appropriate",
            ],
            tips: [
              "Be patient - financial document reviews can take time",
              "Only inquire if there's been no status update after the expected timeframe",
              "Keep all correspondence organized for reference",
            ],
          },
        ],
      }

    case "221G_DOCS_REQUESTED_CIVIL":
      return {
        title: "Civil Documents Required - Action Plan",
        description:
          "Your case requires additional civil documentation. Follow this plan to prepare and submit the required documents correctly.",
        selected221gItems,
        stages: [
          {
            title: "Do Now (Today)",
            timeframe: "Immediate Actions",
            actions: [
              "Identify which civil documents are required based on your 221(g) form",
              "Contact relevant authorities to obtain certified copies",
              "Start the process for any documents that take longer to obtain (police certificates, etc.)",
            ],
            tips: [
              "Police certificates typically take 3-7 days to process in Pakistan",
              "Birth certificates from NADRA can be obtained online or in person",
              "Marriage certificates may require translation if in Urdu",
            ],
            documents: [
              hasCivilDocs ? "Birth Certificate (NADRA)" : "",
              hasCivilDocs ? "Marriage Certificate (Nikah Nama)" : "",
              hasCivilDocs ? "Police Certificate" : "",
              hasLegalDocs ? "Divorce Decree (if applicable)" : "",
              hasLegalDocs ? "Death Certificate (if applicable)" : "",
            ].filter(Boolean),
          },
          {
            title: "Next 3-7 Days",
            timeframe: "Document Gathering",
            actions: [
              "Obtain certified copies of all required civil documents",
              "Arrange for professional translations if documents are not in English",
              "Ensure all documents are current (police certificates typically valid for 1 year)",
            ],
            tips: [
              "Request extra certified copies in case additional documents are needed",
              "Use certified translators familiar with immigration documents",
              "Verify that all documents have official seals and signatures",
            ],
            documents: [
              hasCivilDocs ? "Certified Birth Certificate" : "",
              hasCivilDocs ? "Certified Marriage Certificate" : "",
              hasCivilDocs ? "Police Certificate" : "",
              hasTranslation ? "Certified Translations" : "",
              "Official Seals and Signatures",
            ].filter(Boolean),
          },
          {
            title: "Next 7-14 Days",
            timeframe: "Document Preparation",
            actions: [
              "Prepare all documents according to embassy specifications",
              "Create a cover letter explaining the submission",
              "Organize documents in the order specified in your 221(g) letter",
            ],
            tips: [
              "Scan all documents before submission for your records",
              "Follow the exact format requested in your 221(g) letter",
              "Keep copies separate from originals if originals are required",
            ],
          },
          {
            title: "Submit Documents",
            timeframe: "Within 30 Days",
            actions: [
              "Submit all required civil documents according to embassy instructions",
              "Keep proof of submission (receipts, tracking numbers)",
              "Monitor your CEAC status for updates",
            ],
            tips: [
              "Follow the specific submission method outlined in your 221(g) letter",
              "Use trackable shipping method if sending physical documents",
              "Never send original documents unless specifically requested",
            ],
          },
        ],
      }

    case "221G_DOCS_REQUESTED_SECURITY":
      return {
        title: "Security Review - Action Plan",
        description: "Your case is undergoing security review. This typically requires no additional action from you.",
        selected221gItems,
        stages: [
          {
            title: "Do Now (Today)",
            timeframe: "Immediate Actions",
            actions: [
              "Understand that security reviews are standard for many visa applications",
              "Avoid making unnecessary inquiries during the security review process",
              "Continue to monitor your CEAC status periodically",
            ],
            tips: [
              "Security reviews can take anywhere from a few weeks to several months",
              "Making frequent inquiries can actually slow down the process",
              "There is typically no way to expedite a security review",
            ],
          },
          {
            title: "While Waiting",
            timeframe: "Ongoing",
            actions: [
              "Keep your passport and travel documents ready",
              "Stay in contact with your petitioner",
              "Prepare for your visa interview once cleared",
            ],
            tips: [
              "Use this time to prepare for potential questions at your visa interview",
              "Ensure all your documents are organized and accessible",
              "Keep your contact information updated with the embassy",
            ],
          },
          {
            title: "If Extended Review (>6 Months)",
            timeframe: "Extended Timeline",
            actions: [
              "Consider reaching out to your Congressman for case assistance",
              "Consult with an immigration attorney if appropriate",
              "Verify that your case is still actively being processed",
            ],
            tips: [
              "Congressional inquiries can sometimes help with transparency",
              "An attorney can provide guidance on your options",
              "Keep detailed records of all communications",
            ],
          },
        ],
      }

    case "AP_ONLY_NO_DOCS":
      return {
        title: "Administrative Processing - No Additional Documents",
        description:
          "Your case is in administrative processing. This typically requires no additional action from you.",
        selected221gItems,
        stages: [
          {
            title: "Do Now (Today)",
            timeframe: "Immediate Actions",
            actions: [
              "Understand that administrative processing is standard for certain visa applications",
              "Avoid making unnecessary inquiries during the processing period",
              "Continue to monitor your CEAC status periodically",
            ],
            tips: [
              "Administrative processing can take anywhere from a few weeks to several months",
              "Making frequent inquiries can actually slow down the process",
              "There is typically no way to expedite administrative processing",
            ],
          },
          {
            title: "While Waiting",
            timeframe: "Ongoing",
            actions: [
              "Keep your passport and travel documents ready",
              "Stay in contact with your petitioner",
              "Prepare for your visa interview once processed",
            ],
            tips: [
              "Use this time to prepare for potential questions at your visa interview",
              "Ensure all your documents are organized and accessible",
              "Keep your contact information updated with the embassy",
            ],
          },
          {
            title: "If Extended Processing (>6 Months)",
            timeframe: "Extended Timeline",
            actions: [
              "Consider reaching out to your Congressman for case assistance",
              "Consult with an immigration attorney if appropriate",
              "Verify that your case is still actively being processed",
            ],
            tips: [
              "Congressional inquiries can sometimes help with transparency",
              "An attorney can provide guidance on your options",
              "Keep detailed records of all communications",
            ],
          },
        ],
      }

    case "DOCS_SUBMITTED_WAITING_UPDATE":
      return {
        title: "Documents Submitted - Waiting for Update",
        description: "Your documents have been submitted. Now you're waiting for an update on your case status.",
        selected221gItems,
        stages: [
          {
            title: "Do Now (Today)",
            timeframe: "Immediate Actions",
            actions: [
              "Keep your submission proof and tracking information handy",
              "Begin monitoring CEAC status more frequently (every 2-3 days)",
              "Prepare for next steps based on potential outcomes",
            ],
            tips: [
              "Don't expect immediate updates after submission",
              "Status changes can take several weeks to appear in the system",
              "Keep all documentation organized for reference",
            ],
          },
          {
            title: "Next 2-4 Weeks",
            timeframe: "Monitoring Period",
            actions: [
              "Check CEAC status regularly but avoid excessive checking",
              "Prepare for potential next steps based on outcome",
              "Keep your passport and travel documents accessible",
            ],
            tips: [
              "Some cases resolve quickly after document submission",
              "Others may require additional processing time",
              "Stay patient during this period",
            ],
          },
          {
            title: "If No Update After 4-6 Weeks",
            timeframe: "Follow-up Actions",
            actions: [
              "Send a polite inquiry to the embassy",
              "Consider reaching out to your Congressman if appropriate",
              "Consult with an immigration attorney if needed",
            ],
            tips: [
              "A status update after document submission is expected within 4-6 weeks",
              "Inquiries should be polite and include your case details",
              "Keep all correspondence organized",
            ],
          },
        ],
      }

    default:
      return {
        title: "General Action Plan",
        description: "Based on your situation, here's a general plan to help you navigate the process.",
        selected221gItems,
        stages: [
          {
            title: "Immediate Actions",
            timeframe: "Today",
            actions: [
              "Review your 221(g) letter carefully for specific requirements",
              "Gather any documents that you know are needed",
              "Research the specific requirements for your embassy",
            ],
            tips: [
              "Keep all original documents secure and use copies when possible",
              "Organize your documents in a clear, logical manner",
              "Keep digital copies of all documents",
            ],
          },
          {
            title: "Next Steps",
            timeframe: "This Week",
            actions: [
              "Prepare required documents according to embassy guidelines",
              "Consider consulting with an immigration attorney if requirements are complex",
              "Plan your document submission strategy",
            ],
            tips: [
              "Follow embassy instructions precisely",
              "Use certified translations when required",
              "Keep detailed records of all submissions",
            ],
          },
        ],
      }
  }
}
