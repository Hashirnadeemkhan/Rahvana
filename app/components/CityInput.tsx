// // components/CityInput.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { ChevronDown, AlertCircle } from 'lucide-react';
// import { CITY_SUGGESTIONS } from '@/lib/cities';

// interface Props {
//   city: string;
//   setCity: (city: string) => void;
//   onConfirmCity: (city: string) => void;
//   visaCategory: string; // Add this
// }

// export default function CityInput({ city, setCity, onConfirmCity, visaCategory }: Props) {
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [pendingCity, setPendingCity] = useState('');
//   const [checkingData, setCheckingData] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const debounceRef = useRef<NodeJS.Timeout | null>(null);

//   // Autocomplete
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       if (city.trim().length >= 2) {
//         const filtered = CITY_SUGGESTIONS.filter(c =>
//           c.toLowerCase().includes(city.toLowerCase())
//         ).slice(0, 8);
//         setSuggestions(filtered);
//         setShowSuggestions(true);
//       } else {
//         setSuggestions([]);
//         setShowSuggestions(false);
//       }
//     }, 300);
//     return () => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, [city]);

//   const handleSelect = (selected: string) => {
//     setCity(selected);
//     setShowSuggestions(false);
//     setShowConfirm(false);
//     onConfirmCity(selected);
//   };

//   const handleKeyDown = async (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && city.trim()) {
//       e.preventDefault();

//       const typedCity = city.trim();
//       const isInList = CITY_SUGGESTIONS.some(c => c.toLowerCase() === typedCity.toLowerCase());

//       if (isInList) {
//         // City list mein hai → backend se check karo data hai ya nahi
//         setCheckingData(true);
//         const hasData = await checkDataExists(typedCity);
//         setCheckingData(false);

//         if (hasData) {
//           handleSelect(typedCity);
//         } else {
//           setPendingCity(typedCity);
//           setShowConfirm(true);
//         }
//       } else {
//         // City list mein nahi → direct confirm
//         setPendingCity(typedCity);
//         setShowConfirm(true);
//       }

//       setShowSuggestions(false);
//     }
//   };

//   // Backend se check: kya is city+category ka data hai?
//   const checkDataExists = async (cityName: string): Promise<boolean> => {
//     try {
//       const res = await fetch('/api/iv-status', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ city: cityName, visaCategory }),
//       });
//       const data = await res.json();
//       return data.success === true && data.data.length > 0;
//     } catch {
//       return false;
//     }
//   };

//   const confirmYes = () => {
//     setShowConfirm(false);
//     onConfirmCity(pendingCity);
//   };

//   const confirmNo = () => {
//     setShowConfirm(false);
//     setCity('');
//     inputRef.current?.focus();
//   };

//   return (
//     <div className="relative">
//       <label htmlFor="city" className="block text-sm font-semibold text-gray-800 mb-2">
//         U.S. Embassy or Consulate City <span className="text-red-600">*</span>
//       </label>
//       <p className="text-xs text-gray-600 mb-2">
//         Examples: Islamabad, Mumbai, Dubai, Ankara, New Delhi
//       </p>

//       <div className="relative">
//         <input
//           id="city"
//           ref={inputRef}
//           type="text"
//           placeholder="Start typing city name..."
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           onFocus={() => city.length >= 2 && setShowSuggestions(true)}
//           onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//           onKeyDown={handleKeyDown}
//           disabled={checkingData}
//           className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 disabled:opacity-50"
//         />
//         {city && !checkingData && (
//           <button
//             type="button"
//             onClick={() => setCity('')}
//             className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
//           >
//             ×
//           </button>
//         )}
//         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
//         {checkingData && (
//           <div className="absolute right-10 top-1/2 -translate-y-1/2">
//             <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
//           </div>
//         )}
//       </div>

//       {/* Suggestions */}
//       {showSuggestions && suggestions.length > 0 && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
//           {suggestions.map((s, i) => (
//             <div
//               key={i}
//               onMouseDown={() => handleSelect(s)}
//               className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
//             >
//               {s}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Confirmation */}
//       {showConfirm && (
//         <div className="mt-3 p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3 animate-in fade-in">
//           <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
//           <div className="flex-1">
//             <p className="text-sm font-medium text-amber-900">
//               Are you looking for the U.S. Embassy or Consulate in <strong>"{pendingCity}"</strong>?
//             </p>
//             <p className="text-xs text-amber-700 mt-1">
//               No scheduling data found for this city in the selected category.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={confirmYes} className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700">
//               Yes, search anyway
//             </button>
//             <button onClick={confirmNo} className="px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 rounded hover:bg-amber-200">
//               No
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }