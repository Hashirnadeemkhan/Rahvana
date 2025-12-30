"use client";
import { FileText, ArrowRight, CheckCircle, Info, Clock, AlertCircle, Users, Clipboard, DollarSign, Globe, LucideIcon } from 'lucide-react';

interface VisaForm {
  code: string;
  name: string;
  description: string;
  stage: string;
  officialLink: string;
  icon: 'couples' | 'clipboard' | 'money' | 'globe';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
}

const VISA_FORMS: VisaForm[] = [
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

const getIconComponent = (iconName: 'couples' | 'clipboard' | 'money' | 'globe'): LucideIcon => {
  const icons: Record<'couples' | 'clipboard' | 'money' | 'globe', LucideIcon> = {
    couples: Users,
    clipboard: Clipboard,
    money: DollarSign,
    globe: Globe
  };
  return icons[iconName];
};

const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard'): string => {
  const colors: Record<'Easy' | 'Medium' | 'Hard', string> = {
    Easy: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Hard: 'text-red-600 bg-red-50'
  };
  return colors[difficulty];
};

export default function VisaFormSelector() {
  const handleStartForm = (formCode: string): void => {
    const normalized = formCode
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    window.location.href = `/visa-forms/${normalized}/wizard`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary/90" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            U.S. Visa Forms Made Easy
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Simple, Step-by-Step Form Filling
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Fill out official U.S. visa forms with helpful guidance at every step
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-primary/90 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How It Works
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                  <span>Choose a form below to get started</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                  <span>Answer 2-3 questions at a time with helpful tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                  <span>Your progress is saved automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                  <span>Review and edit before generating your filled PDF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {VISA_FORMS.map((form) => {
            const IconComponent = getIconComponent(form.icon);
            return (
              <div
                key={form.code}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Form Header */}
                <div className="bg-primary/90 p-5 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-white/80 mb-1">
                        {form.stage}
                      </div>
                      <div className="text-xl font-bold">{form.code}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{form.name}</h3>
                </div>

                {/* Form Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {form.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Difficulty</div>
                        <div className={`text-sm font-semibold px-2 py-0.5 rounded inline-block ${getDifficultyColor(form.difficulty)}`}>
                          {form.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Time Needed</div>
                        <div className="text-sm font-semibold text-gray-700">
                          {form.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleStartForm(form.code)}
                      className="w-full bg-primary/90 hover:bg-primary/100 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                    >
                      Start Filling Form
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href={form.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-colors duration-200"
                    >
                      View Official Form
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Process Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Need Help Choosing?
            </h3>
            <div className="space-y-3">
              <p className="font-semibold text-gray-900">For Spouse Immigration:</p>
              <ol className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary/90 text-sm font-semibold flex-shrink-0">1</span>
                  <span>Start with <strong>I-130</strong> (Petition for spouse)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary/90 text-sm font-semibold flex-shrink-0">2</span>
                  <span>Complete <strong>I-130A</strong> (Spouse information)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary/90 text-sm font-semibold flex-shrink-0">3</span>
                  <span>Then file <strong>I-864</strong> (Financial support proof)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary/90 text-sm font-semibold flex-shrink-0">4</span>
                  <span>Finally, <strong>DS-260</strong> (Main visa application)</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl shadow-sm border border-primary/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Automatic progress saving</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Helpful tips for every question</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Examples for guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Edit anytime before final PDF</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary/90 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Download filled official form</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}