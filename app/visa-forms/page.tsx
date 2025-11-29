// C:\Users\HP\Desktop\arachnie\Arachnie\app\visa-forms\page.tsx
"use client";

import { FileText, ArrowRight, CheckCircle, Info } from 'lucide-react';

const VISA_FORMS = [
  {
    code: 'I-130',
    name: 'Petition for Alien Relative',
    description: 'For U.S. citizen to petition for their foreign spouse to immigrate to the United States',
    stage: 'USCIS Filing Stage',
    officialLink: 'https://www.uscis.gov/i-130',
    icon: 'couples',
    difficulty: 'Medium',
    estimatedTime: '45-60 minutes'
  },
  {
    code: 'I-130A',
    name: 'Supplemental Information for Spouse Beneficiary',
    description: 'Collects biographic information about the spouse beneficiary',
    stage: 'USCIS Filing Stage',
    officialLink: 'https://www.uscis.gov/i-130a',
    icon: 'clipboard',
    difficulty: 'Easy',
    estimatedTime: '20-30 minutes'
  },
  {
    code: 'I-864',
    name: 'Affidavit of Support',
    description: 'U.S. citizen sponsor proves they can financially support the immigrant spouse',
    stage: 'NVC Processing',
    officialLink: 'https://www.uscis.gov/i-864',
    icon: 'money',
    difficulty: 'Medium',
    estimatedTime: '30-45 minutes'
  },
  {
    code: 'DS-260',
    name: 'Online Immigrant Visa Application',
    description: 'Main immigrant visa application completed online by the spouse in Pakistan',
    stage: 'NVC Processing',
    officialLink: 'https://ceac.state.gov/iv/',
    icon: 'globe',
    difficulty: 'Hard',
    estimatedTime: '60-90 minutes'
  }
];

export default function VisaFormSelector() {
const handleStartForm = (formCode: string) => {
  // Ye line sabse important hai — "I-130", "I-130A" ko "i130", "i130a" bana dega
  const normalized = formCode
    .replace(/[^a-zA-Z0-9]/g, "")  // saare hyphen, dash hata de
    .toLowerCase()

  // Ab saare forms ke liye route ban jayega
  window.location.href = `/visa-forms/${normalized}/wizard`
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            U.S. Visa Forms Made Easy
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Simple, Step-by-Step Form Filling
          </p>
          <p className="text-gray-500">
            Fill out official U.S. visa forms with helpful guidance at every step
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Choose a form below to get started</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Answer 2-3 questions at a time with helpful tips</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Your progress is saved automatically</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Review and edit before generating your filled PDF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {VISA_FORMS.map((form) => (
            <div
              key={form.code}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{form.icon}</div>
                  <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {form.stage}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{form.code}</h2>
                <p className="text-blue-100 text-sm">{form.name}</p>
              </div>

              {/* Form Body */}
              <div className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {form.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Difficulty</p>
                    <p className="font-semibold text-gray-900">{form.difficulty}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Time Needed</p>
                    <p className="font-semibold text-gray-900">{form.estimatedTime}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleStartForm(form.code)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Start Filling Form</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <a
                    href={form.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Official Form</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Spouse Immigration:</h3>
              <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
                <li>Start with <strong>I-130</strong> (Petition for spouse)</li>
                <li>Complete <strong>I-130A</strong> (Spouse information)</li>
                <li>Then file <strong>I-864</strong> (Financial support proof)</li>
                <li>Finally, <strong>DS-260</strong> (Main visa application)</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>Automatic progress saving</li>
                <li>Helpful tips for every question</li>
                <li>Examples for guidance</li>
                <li>Edit anytime before final PDF</li>
                <li>Download filled official form</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}