'use client';

import React from 'react';
import { Download, RotateCcw, Check } from 'lucide-react';
import Image from 'next/image';

interface SignaturePreviewProps {
  originalImage: string;
  processedImage: string;
  onDownload: () => void;
  onReset: () => void;
}

export default function SignaturePreview({
  originalImage,
  processedImage,
  onDownload,
  onReset,
}: SignaturePreviewProps) {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Before & After Comparison */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Original Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
          <div className="bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base">
            📸 Original Photo
          </div>
          <div className="p-4 sm:p-6 bg-gray-50">
            <div className="relative">
              <Image
                height={200}
                width={400}
                src={originalImage}
                alt="Original signature"
                className="w-full h-auto rounded-lg border-2 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Processed Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold flex items-center justify-between text-sm sm:text-base">
            <span>✨ Enhanced Signature</span>
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="p-4 sm:p-6 checkered-bg">
            <div className="relative">
              <Image
                height={200}
                width={400}
                src={processedImage}
                alt="Processed signature with transparent background"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Transparent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={onDownload}
          className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg 
                     font-semibold hover:bg-green-700 transition-all transform hover:scale-105
                     flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          Download Transparent PNG
        </button>

        <button
          onClick={onReset}
          className="bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg 
                     font-semibold hover:bg-gray-700 transition-all transform hover:scale-105
                     flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          Upload New Signature
        </button>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <p className="text-green-800 font-semibold text-base sm:text-lg">
          🎉 Your signature is ready!
        </p>
        <p className="text-green-700 mt-1 text-sm sm:text-base">
          Transparent background • Enhanced contrast • Professional quality
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-green-600">
          <span className="bg-white px-3 py-1 rounded-full">✓ PNG Format</span>
          <span className="bg-white px-3 py-1 rounded-full">✓ High Resolution</span>
          <span className="bg-white px-3 py-1 rounded-full">✓ No Background</span>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">
          💡 How to Use Your Signature:
        </h3>
        <ul className="space-y-2 text-blue-800 text-xs sm:text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Insert into PDF documents and contracts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Add to email signatures and business cards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use in digital signing applications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Add watermark to your creative work</span>
          </li>
        </ul>
      </div>
    </div>
  );
}