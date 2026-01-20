// 'use client';

// import { useState } from 'react';
// import { AlertCircle, CheckCircle2, Loader, HelpCircle } from 'lucide-react';

// interface VisaStatusResult {
//   status: string;
//   caseNumber: string;
//   applicationType: string;
//   location: string;
//   statusDate: string;
//   message: string;
//   additionalInfo?: string;
// }

// export default function VisaStatusChecker() {
//   const [applicationType, setApplicationType] = useState<'IV' | 'NIV'>('IV');
//   const [caseNumber, setCaseNumber] = useState<string>('');
//   const [passportNumber, setPassportNumber] = useState<string>('');
//   const [surname, setSurname] = useState<string>('');
//   const [results, setResults] = useState<VisaStatusResult | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!caseNumber.trim()) {
//       setError('Case Number is required.');
//       return;
//     }

//     // For applications before Jan 1, 2022, passport and surname should be 'NA'
//     const useNAForOldApps = !passportNumber.trim() && !surname.trim();
//     const finalPassport = useNAForOldApps ? 'NA' : passportNumber;
//     const finalSurname = useNAForOldApps ? 'NA' : surname;

//     setLoading(true);
//     setError(null);
//     setResults(null);

//     try {
//       const response = await fetch('/api/visa-status-check', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           applicationType,
//           caseNumber: caseNumber.trim(),
//           passportNumber: finalPassport.trim(),
//           surname: finalSurname.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || 'Failed to fetch visa status');
//         return;
//       }

//       if (!data.success) {
//         setError(data.message || 'No status found for the provided information.');
//         return;
//       }

//       setResults(data.result);
//     } catch (err) {
//       setError('An error occurred while checking visa status. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-blue-900 mb-2">Visa Status Checker</h1>
//         <p className="text-gray-600 mb-6">Check the status of your US visa application</p>

//         <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-gray-700 text-sm leading-relaxed border-l-4 border-blue-500">
//           <p className="mb-3">
//             The CEAC Visa Status Tracker allows you to check the status of your US visa application. 
//             You will need your case number and other application details to proceed.
//           </p>
//           <p>
//             <strong>For applications completed before January 1, 2022:</strong> Enter 'NA' in both the 
//             Passport Number and Surname fields.
//           </p>
//         </div>

//         <div className="bg-gray-100 p-8 rounded-lg shadow-sm mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Check Your Visa Status</h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-800 mb-2">
//                 Visa Application Type <span className="text-red-600">*</span>
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {[
//                   { value: 'IV', label: 'Immigrant Visa (IV)', desc: 'For those intending to live permanently in the US' },
//                   { value: 'NIV', label: 'Nonimmigrant Visa (NIV)', desc: 'For temporary visits to the US' }
//                 ].map((option) => (
//                   <label 
//                     key={option.value} 
//                     className={`flex items-start cursor-pointer p-4 rounded-md border ${
//                       applicationType === option.value 
//                         ? 'border-blue-500 bg-blue-50' 
//                         : 'border-gray-300 bg-white'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="applicationType"
//                       value={option.value}
//                       checked={applicationType === option.value}
//                       onChange={(e) => setApplicationType(e.target.value as 'IV' | 'NIV')}
//                       className="mt-1 mr-3 h-4 w-4 text-blue-600 cursor-pointer"
//                     />
//                     <div>
//                       <span className="text-gray-700 font-medium">{option.label}</span>
//                       <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label htmlFor="caseNumber" className="block text-sm font-semibold text-gray-800 mb-2">
//                 Case Number <span className="text-red-600">*</span>
//               </label>
//               <input
//                 id="caseNumber"
//                 type="text"
//                 placeholder="Enter your case number (e.g., MTL1999626025)"
//                 value={caseNumber}
//                 onChange={(e) => setCaseNumber(e.target.value.toUpperCase())}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
//               />
//               <p className="text-xs text-gray-600 mt-1">Usually consists of letters followed by numbers</p>
//             </div>

//             <div>
//               <label htmlFor="passportNumber" className="block text-sm font-semibold text-gray-800 mb-2">
//                 Passport Number
//               </label>
//               <input
//                 id="passportNumber"
//                 type="text"
//                 placeholder="Enter your passport number (or 'NA' if applied before Jan 1, 2022)"
//                 value={passportNumber}
//                 onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
//               />
//             </div>

//             <div>
//               <label htmlFor="surname" className="block text-sm font-semibold text-gray-800 mb-2">
//                 Last Name / Surname
//               </label>
//               <input
//                 id="surname"
//                 type="text"
//                 placeholder="Enter your last name (or 'NA' if applied before Jan 1, 2022)"
//                 value={surname}
//                 onChange={(e) => setSurname(e.target.value.toUpperCase())}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading || !caseNumber.trim()}
//               className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <Loader className="h-4 w-4 animate-spin" />
//                   Checking Status...
//                 </>
//               ) : (
//                 'Check Status'
//               )}
//             </button>
//           </form>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8 flex gap-3 items-start">
//             <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
//             <div>
//               <p className="font-semibold text-red-900">Error</p>
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           </div>
//         )}

//         {results && (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 mb-4">
//               <CheckCircle2 className="h-6 w-6 text-green-600" />
//               <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
//             </div>

//             <div className="bg-gradient-to-r from-green-50 to-white border border-green-200 p-6 rounded-lg hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Case Number</span>
//                       <p className="text-lg font-bold text-gray-800">{results.caseNumber}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Application Type</span>
//                       <p className="text-lg font-bold text-gray-800">
//                         {results.applicationType === 'IV' ? 'Immigrant Visa' : 'Nonimmigrant Visa'}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</span>
//                       <p className="text-base text-gray-800">{results.location}</p>
//                     </div>
//                     <div>
//                       <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status Date</span>
//                       <p className="text-base text-gray-800">{results.statusDate}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4">
//                     <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Current Status</span>
//                     <p className={`text-xl font-bold mt-1 ${
//                       results.status.toLowerCase().includes('ready') || results.status.toLowerCase().includes('approved') 
//                         ? 'text-green-600' 
//                         : results.status.toLowerCase().includes('pending') || results.status.toLowerCase().includes('processing')
//                           ? 'text-blue-600'
//                           : 'text-red-600'
//                     }`}>
//                       {results.status}
//                     </p>
//                   </div>

//                   <div className="mt-4">
//                     <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status Message</span>
//                     <p className="text-base text-gray-800 mt-1">{results.message}</p>
//                   </div>

//                   {results.additionalInfo && (
//                     <div className="mt-4">
//                       <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Additional Information</span>
//                       <p className="text-sm text-gray-700 mt-1">{results.additionalInfo}</p>
//                     </div>
//                   )}
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-lg ml-4">
//                   <CheckCircle2 className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
//               <HelpCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
//               <div>
//                 <p className="font-semibold text-amber-900">Important Information</p>
//                 <p className="text-amber-800 text-sm">
//                   This status reflects the current stage of your visa application. Regularly check for updates as 
//                   application statuses can change. Contact the nearest US embassy or consulate if you have questions 
//                   about your specific case.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }