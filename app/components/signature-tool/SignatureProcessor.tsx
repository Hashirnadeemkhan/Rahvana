'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface SignatureProcessorProps {
  progress?: number;
}

export default function SignatureProcessor({ progress = 0 }: SignatureProcessorProps) {
  const steps = [
    { id: 1, label: 'Analyzing image...', icon: '🔍' },
    { id: 2, label: 'Removing background...', icon: '🎨' },
    { id: 3, label: 'Enhancing signature...', icon: '✨' },
    { id: 4, label: 'Finalizing...', icon: '🎯' },
  ];

  const currentStep = Math.min(Math.floor(progress / 25) + 1, 4);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-2xl mx-auto">
      {/* Animated Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Processing Your Signature
      </h2>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Please wait while we enhance your signature...
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="w-full h-full bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
      </div>

      {/* Processing Steps */}
      <div className="space-y-3 sm:space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all ${
              step.id === currentStep
                ? 'bg-blue-50 border-2 border-blue-300 scale-105'
                : step.id < currentStep
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-gray-50 border-2 border-gray-200 opacity-50'
            }`}
          >
            <div className="text-2xl sm:text-3xl">{step.icon}</div>
            <div className="flex-1 text-left">
              <p className={`font-semibold text-sm sm:text-base ${
                step.id === currentStep ? 'text-blue-700' : 
                step.id < currentStep ? 'text-green-700' : 'text-gray-500'
              }`}>
                {step.label}
              </p>
            </div>
            {step.id === currentStep && (
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-spin" />
            )}
            {step.id < currentStep && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fun Message */}
      <p className="text-xs sm:text-sm text-gray-500 mt-6 italic">
        ✨ Creating professional quality signature...
      </p>
    </div>
  );
}