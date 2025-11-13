'use client';

import React, { useState } from 'react';
import { Sparkles,  AlertCircle } from 'lucide-react';

import SignatureUploader from '../components/signature-tool/SignatureUploader';

import SignatureProcessor from '../components/signature-tool/SignatureProcessor';
import SignaturePreview from '../components/signature-tool/SignaturePreview';
import {
  SignatureImageProcessor,
  validateImageFile,
  readFileAsDataURL,
  downloadImage,
} from '@/formConfig.ts/imageProcessor';

export default function SignatureRemoverPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    // Reset states
    setError(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setProcessingProgress(0);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsProcessing(true);

      // Read file
      setProcessingProgress(10);
      const imageData = await readFileAsDataURL(file);
      setOriginalImage(imageData);
      setProcessingProgress(25);

      // Process image
      const processor = new SignatureImageProcessor();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const processed = await processor.processImage(imageData, {
     // For MORE background removal:
threshold: 140,  // Lower = more aggressive

// For DARKER signature:
darknessFactor: 0.3,  // Lower = darker

// For MORE contrast:
contrast: 2.5,  // Higher = more separation
        noiseReduction: true,
        edgeSmoothing: true,
        aggressiveMode: true,
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      setProcessedImage(processed);
      processor.destroy();

      // Small delay for UX
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process image. Please try again.');
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const timestamp = new Date().getTime();
      downloadImage(processedImage, `signature-transparent-${timestamp}.png`);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setProcessingProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Signature Background Remover
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto px-4">
            Transform your handwritten signature into a professional, transparent PNG in seconds. 
            Perfect for documents, contracts, and digital signing.
          </p>
        </header>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            
            How to Get Best Results
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                step: '1',
                title: 'Use White Paper',
                description: 'Write your signature on clean white or light-colored paper',
                icon: '📄',
              },
              {
                step: '2',
                title: 'Good Lighting',
                description: 'Take photo in bright, even lighting without shadows',
                icon: '💡',
              },
              {
                step: '3',
                title: 'Dark Ink',
                description: 'Use blue or black pen for clear, bold signature',
                icon: '🖊️',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 sm:gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                  {item.step}
                </div>
                <div>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!originalImage && !isProcessing && (
            <SignatureUploader onFileSelect={handleFileSelect} disabled={isProcessing} />
          )}

          {isProcessing && <SignatureProcessor progress={processingProgress} />}

          {processedImage && originalImage && !isProcessing && (
            <SignaturePreview
              originalImage={originalImage}
              processedImage={processedImage}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our Tool?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚀', title: 'Lightning Fast', desc: 'Process in seconds' },
              { icon: '🔒', title: '100% Private', desc: 'All processing in browser' },
              { icon: '✨', title: 'High Quality', desc: 'Professional results' },
              { icon: '💯', title: 'Free Forever', desc: 'No hidden costs' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 text-sm">
          <p>Made with for professionals who value quality</p>
          <p className="mt-2">All processing happens in your browser. Your images never leave your device.</p>
        </footer>
      </div>
    </div>
  );
}