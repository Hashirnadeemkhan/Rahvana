// C:\Users\HP\Desktop\arachnie\Arachnie\app\visa-checker\page.tsx
'use client';

import Form from '@/app/components/visa-checker/Form';

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2">
          Visa Progress Checker
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your USCIS Case Number – We will auto-fetch your Priority Date!
        </p>
        <Form />
      </div>
    </div>
  );
}