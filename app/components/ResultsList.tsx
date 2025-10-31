// // components/ResultsList.tsx
// import { CheckCircle2 } from 'lucide-react';
// import { SchedulingResult } from '@/types';

// interface Props {
//   results: SchedulingResult[];
// }

// export default function ResultsList({ results }: Props) {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2 mb-4">
//         <CheckCircle2 className="h-6 w-6 text-green-600" />
//         <h3 className="text-lg font-semibold text-gray-800">
//           Found {results.length} result{results.length !== 1 ? 's' : ''}
//         </h3>
//       </div>

//       {results.map((r, i) => (
//         <div
//           key={i}
//           className="bg-gradient-to-r from-green-50 to-white border border-green-200 p-6 rounded-lg hover:shadow-md transition-shadow"
//         >
//           <div className="flex items-start justify-between mb-3">
//             <div className="flex-1">
//               <h4 className="text-lg font-bold text-green-900 mb-1">{r.Post}</h4>
//               <div className="space-y-2">
//                 <div>
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Visa Category
//                   </span>
//                   <p className="text-sm text-gray-800 font-medium">{r['Visa Category']}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Documentarily Complete Date
//                   </span>
//                   <p className="text-lg font-bold text-green-700">
//                     {r['Case Documentarily Complete']}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <CheckCircle2 className="h-6 w-6 text-green-600" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }