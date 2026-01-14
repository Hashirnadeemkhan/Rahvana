# 221(g) Action Planner Tool Documentation

## Overview
Ye tool U.S. visa case ke baad interview ke baad stuck hone wale logon ke liye hai - ya to "additional documents (221(g))" ke liye ya "additional review (Administrative Processing)" ke liye.

Ye sirf samjhay nahi keh 221(g) ya AP kya hai. Ye user ke "exact situation" diagnose karta hai, phir "next steps" batata hai (step-by-step), aur phir "correctly submit" karne mein madad karta hai (templates, checklists, packaging).

## File Structure
```
app/(tools)/(visa)/221g-action-planner/
├── page.tsx                    # Main page component
├── layout.tsx                  # Layout with metadata
├── components/                 # Reusable UI components
│   ├── CombinedIntakeForm.tsx
│   ├── CombinedIntakeFormWrapper.tsx
│   ├── Actual221GFormChecker.tsx
│   ├── DocumentChecklist.tsx
│   ├── DocumentQualityChecker.tsx
│   └── ActionPlanResults.tsx
├── utils/                      # Business logic utilities
│   ├── classifier.ts
│   ├── actionPlanGenerator.ts
│   └── formSelectionMapper.ts
├── types/                      # TypeScript definitions
│   └── 221g.ts
└── constants/                  # Static data
    └── embassyGuidance.ts
```

## Detailed Component Descriptions

### 1. page.tsx
- **Purpose**: Main page component that manages the overall flow
- **Functionality**: 
  - State management for form data, classification, and action plans
  - Handles form submission and navigation between form and results view
  - Calls classifier and action plan generator functions
- **Key Functions**:
  - `handleSubmit()`: Processes form data and generates action plan
  - `handleBackToForm()`: Allows users to return to form for updates

### 2. layout.tsx
- **Purpose**: Provides metadata and layout structure for the page
- **Functionality**: Sets up page title and description for SEO

### 3. CombinedIntakeForm.tsx
- **Purpose**: Multi-step form that collects user information
- **Functionality**:
  - Step 1: Visa details (type, embassy, interview date)
  - Step 2: Interview outcome (passport kept, officer requests)
  - Step 3: 221(g) letter details (received, case number)
  - Step 4: CEAC status tracking
  - Step 5: Additional information
- **Features**:
  - Progress tracking with step indicators
  - Validation and navigation controls
  - Dynamic form fields based on user selections

### 4. CombinedIntakeFormWrapper.tsx
- **Purpose**: Wrapper component to handle SSR/hydration issues
- **Functionality**: Dynamically imports CombinedIntakeForm to avoid server/client mismatches

### 5. Actual221GFormChecker.tsx
- **Purpose**: Interactive form that mirrors the actual 221(g) letter
- **Functionality**:
  - Displays all possible 221(g) form items as checkboxes
  - Allows users to select items that match their actual letter
  - Provides input fields for additional details where needed
- **Features**:
  - Comprehensive list of 221(g) requirements
  - Detailed descriptions for each item
  - Ability to track multiple selections

### 6. DocumentChecklist.tsx
- **Purpose**: Dynamic checklist based on user's specific requirements
- **Functionality**:
  - Generates checklist based on selected 221(g) items
  - Tracks document status (missing, in-progress, ready, submitted)
  - Categorizes documents by type (financial, civil, legal, etc.)
- **Features**:
  - Status tracking for each document
  - Required vs recommended document distinction
  - Progress visualization

### 7. DocumentQualityChecker.tsx
- **Purpose**: Automated document quality assessment
- **Functionality**:
  - Checks for common document issues
  - Identifies missing signatures/dates
  - Verifies translation requirements
  - Ensures consistency across documents
- **Features**:
  - Issue detection with severity levels
  - Improvement suggestions
  - Quality scoring system

### 8. ActionPlanResults.tsx
- **Purpose**: Displays personalized action plan to user
- **Functionality**:
  - Shows classified situation and confidence level
  - Presents step-by-step action plan
  - Integrates document checklist and quality checker
- **Features**:
  - Time-based stages (Do Now, Next 3-7 Days, etc.)
  - Detailed actions and recommendations
  - Tips and best practices

## Utility Files

### 1. classifier.ts
- **Purpose**: Converts intake data into scenario codes
- **Functionality**:
  - Analyzes form data to determine situation type
  - Assigns scenario codes (221G_DOCS_REQUESTED_FINANCIAL, AP_ONLY_NO_DOCS, etc.)
  - Provides confidence levels for classifications
- **Scenario Codes**:
  - `221G_DOCS_REQUESTED_FINANCIAL`: Financial documents required
  - `221G_DOCS_REQUESTED_CIVIL`: Civil documents required
  - `AP_ONLY_NO_DOCS`: Administrative processing only
  - `DOCS_SUBMITTED_WAITING_UPDATE`: Documents submitted, waiting for update

### 2. actionPlanGenerator.ts
- **Purpose**: Creates personalized action plans based on scenario codes
- **Functionality**:
  - Generates time-based action stages
  - Provides specific actions for each scenario
  - Includes tips and recommendations
- **Stages**:
  - Do Now (immediate actions)
  - Next 3-7 Days (preparation phase)
  - Submit Documents (submission guidance)
  - Follow-up Actions (if no update after time period)

### 3. formSelectionMapper.ts
- **Purpose**: Maps form selections to scenario codes
- **Functionality**: Converts detailed form selections into actionable scenario codes

## Type Definitions (types/221g.ts)

### FormData Interface
- Contains all form fields:
  - visaType: string
  - interviewDate: string
  - embassy: string
  - letterReceived: boolean | null
  - officerRequests: string[]
  - passportKept: boolean | null
  - ceacStatus: string
  - ceacUpdateDate: string
  - caseNumber: string
  - additionalNotes: string

### FormSelections Interface
- Contains all possible 221(g) form selections:
  - admin_processing?: boolean
  - passport?: boolean
  - medical_examination?: boolean
  - nadra_family_reg?: boolean
  - nadra_birth_cert?: boolean
  - And many more specific document requirements

## Constants (constants/embassyGuidance.ts)

### EmbassyGuidance Data
- Contains detailed submission guidance for different embassies
- Includes submission methods, prerequisites, and special notes
- Specifically configured for Islamabad embassy initially

## How the Tool Works

### 1. User Input Phase
- User fills out multi-step intake form
- Provides visa details, interview outcome, and 221(g) letter information
- Uses 221(g) form checker to select items matching their actual letter

### 2. Processing Phase
- Classifier analyzes user input and assigns scenario code
- Action plan generator creates personalized plan based on scenario
- Document checklist and quality checker are populated with relevant items

### 3. Results Phase
- User receives personalized action plan with step-by-step guidance
- Document checklist shows required items with status tracking
- Quality checker provides document assessment and improvement suggestions
- Embassy-specific guidance is provided for submission

### 4. Iteration Phase
- Users can return to form to update information
- Action plan updates dynamically based on new information
- Progress tracking continues throughout the process

## Key Features Explained

### Situation Classification
The tool analyzes user responses and assigns one of several scenario codes:
- Determines if user needs financial documents, civil documents, or administrative processing
- Provides confidence level in classification
- Tailors action plan based on specific scenario

### Personalized Action Plans
Each action plan includes:
- Time-based stages (Do Now, Next 3-7 Days, etc.)
- Specific actions to take in each stage
- Tips and recommendations for success
- Required documents list

### Document Management
- Dynamic checklist generation based on user's situation
- Status tracking for each document (missing, in-progress, ready, submitted)
- Quality assessment with issue detection
- Submission guidance with packaging instructions

### Embassy-Specific Guidance
- Detailed submission instructions for specific embassies
- Prerequisites and special requirements
- Contact information and procedures
- Updated guidance as embassy procedures change

## Technical Architecture

### Frontend
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for responsive styling
- Radix UI for accessible components
- Client-side state management

### State Management
- React hooks for component state
- Prop drilling for data flow between components
- Form data persistence across steps

### Data Flow
1. User input collected via CombinedIntakeForm
2. Data processed by classifier.ts to determine scenario
3. Action plan generated by actionPlanGenerator.ts
4. Results displayed in ActionPlanResults.tsx
5. Document checklist and quality checker updated dynamically

## Error Handling and Validation

### Input Validation
- Form validation at each step
- Required field checks
- Data type validation
- Cross-field consistency checks

### Error Recovery
- Graceful handling of invalid inputs
- Clear error messages to users
- Ability to return to previous steps
- Data preservation during navigation

## Deployment Notes

### Environment Requirements
- Next.js 15 runtime
- Node.js 18+ (recommended)
- Client-side JavaScript enabled
- Modern browser support

### Performance Optimization
- Dynamic imports to reduce initial bundle size
- Lazy loading of heavy components
- Efficient state management to minimize re-renders
- Optimized image handling

## Maintenance and Updates

### Adding New Embassies
- Update embassyGuidance.ts with new embassy information
- Add new submission methods and requirements
- Update classifier for new scenarios

### Updating 221(g) Requirements
- Modify Actual221GFormChecker.tsx to add new form items
- Update classifier.ts for new scenario codes
- Adjust actionPlanGenerator.ts for new requirements

### Extending Functionality
- New components can be added to the components directory
- Utility functions can be added to the utils directory
- Type definitions can be extended in types/221g.ts

This documentation provides a comprehensive overview of the 221(g) Action Planner tool, explaining each component's purpose and functionality in detail.