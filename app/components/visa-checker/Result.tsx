// frontend/components/visa-checker/Result.tsx
import { AlertTriangle } from 'lucide-react';

type WaitEstimate = {
  formatted?: string;
  avg_movement?: number;
  years?: number;
};

type VisaData = {
  status: 'current' | 'waiting' | 'unavailable' | string;
  categoryFull: string;
  priorityDate: string;
  country: string;
  applicationType: string;
  chartUsed: string;
  cutoffDate: string;
  currentBulletin: string;
  daysBehind: number;
  waitEstimate?: WaitEstimate | null;
};

export default function Result({ data }: { data: VisaData }) {
  const {
    status,
    categoryFull,
    priorityDate,
    country,
    applicationType,
    chartUsed,
    cutoffDate,
    currentBulletin,
    daysBehind,
    waitEstimate
  } = data;

  // Safe access
  const hasWaitEstimate = waitEstimate && waitEstimate.formatted;

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className={`p-4 rounded-t-xl text-white font-bold text-xl ${
        status === 'current' ? 'bg-green-600' :
        status === 'waiting' ? 'bg-blue-600' :
        'bg-orange-600'
      }`}>
        {status === 'current' && 'Your Priority Date is Current!'}
        {status === 'waiting' && "You're Still Waiting in Line"}
        {status === 'unavailable' && 'Category Temporarily Unavailable'}
      </div>

      <div className="p-6 space-y-6">

        {/* Your Information */}
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Your Information:</h3>
          <ul className="space-y-1 text-gray-700">
            <li>• <strong>Category:</strong> {categoryFull}</li>
            <li>• <strong>Priority Date:</strong> {priorityDate}</li>
            <li>• <strong>Country:</strong> {country}</li>
            <li>• <strong>Application Type:</strong> {applicationType}</li>
          </ul>
        </div>

        {/* Current Bulletin */}
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Current Visa Bulletin ({currentBulletin}):</h3>
          <ul className="space-y-1 text-gray-700">
            <li>• <strong>Chart Used:</strong> {chartUsed}</li>
            <li>• <strong>Cut-off Date:</strong> {cutoffDate}</li>
          </ul>
        </div>

        {/* Waiting Status */}
        {status === 'waiting' && daysBehind > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800">
              You filed your petition on <strong>{priorityDate}</strong>. 
              The government is currently processing cases from <strong>{cutoffDate}</strong>.
            </p>
            <p className="mt-2 font-bold text-lg">
              You are: <span className="text-blue-700">
                {hasWaitEstimate ? waitEstimate.formatted : `${daysBehind} days`}
              </span> behind the current cut-off date
            </p>
          </div>
        )}

        {/* Estimate Box */}
        {hasWaitEstimate && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-bold">Estimated Wait Time:</p>
                <p>Based on the last 12 months of Visa Bulletin movement for {categoryFull}:</p>
                <ul className="mt-1 space-y-1 text-sm">
                  <li>• Average monthly forward movement: <strong>{waitEstimate.avg_movement} days</strong></li>
                  <li>• Estimated time until current: <strong>~{waitEstimate.years} years</strong></li>
                  <li>• Approximate year: <strong>2039-2040</strong></li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <p className="text-sm"><strong>Note:</strong> This is an ESTIMATE only. Actual wait times can vary.</p>
            </div>
          </div>
        )}

        {/* Current Status */}
        {status === 'current' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-bold text-green-800">Great News! Your visa number is available.</p>
            <p>File Form I-485 immediately. Act fast before retrogression!</p>
          </div>
        )}

        {/* Action Items */}
        <div>
          <h3 className="font-bold text-gray-800 mb-2">What You Should Do:</h3>
          <ul className="space-y-1 text-gray-700">
            <li>Check the Visa Bulletin monthly (8th-15th)</li>
            <li>Prepare documents now (&#39;don&#39;t wait)</li>
            <li>Keep USCIS updated on address changes</li>
            <li>Consider alternative categories if situation changes</li>
          </ul>
        </div>

        Email
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="font-bold text-indigo-800">Want Updates?</p>
          <p className="text-sm">Enter your email to receive monthly notifications</p>
          <input type="email" placeholder="your@email.com" className="mt-2 w-full p-2 border rounded" />
          <button className="mt-2 w-full bg-indigo-600 text-white py-2 rounded font-bold">Subscribe</button>
        </div>
      </div>
    </div>
  );
}