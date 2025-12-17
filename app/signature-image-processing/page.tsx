"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"


import SignatureUploader from "../components/signature-tool/SignatureUploader"

import SignaturePreview from "../components/signature-tool/SignaturePreview"
import { SignatureImageProcessor, validateImageFile, readFileAsDataURL, downloadImage } from "@/lib/imageProcessor"

export default function SignatureRemoverPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setError(null)
    setOriginalImage(null)
    setProcessedImage(null)


    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      return
    }

    try {
      setIsProcessing(true)

      const imageData = await readFileAsDataURL(file)
      setOriginalImage(imageData)
 

      const processor = new SignatureImageProcessor()


      const processed = await processor.processImage(imageData, {
        threshold: 140,
        darknessFactor: 0.3,
        contrast: 2.5,
        noiseReduction: true,
        edgeSmoothing: true,
        aggressiveMode: true,
      })

 
      setProcessedImage(processed)
      processor.destroy()

      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    } catch (err) {
      console.error("Processing error:", err)
      setError("Failed to process image. Please try again.")
      setIsProcessing(false)
     
    }
  }

  const handleDownload = () => {
    if (processedImage) {
      const timestamp = new Date().getTime()
      downloadImage(processedImage, `signature-transparent-${timestamp}.png`)
    }
  }

  const handleReset = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setError(null)
   
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Signature Background Remover
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            Convert your handwritten signature into a professional, transparent PNG. Ideal for documents, contracts, and
            digital signing.
          </p>
        </header>

        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 sm:p-8 mb-8 max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Best Practices</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "White Paper",
                description: "Write on clean, white or light-colored paper",
              },
              {
                title: "Good Lighting",
                description: "Ensure even lighting without shadows or glare",
              },
              {
                title: "Dark Ink",
                description: "Use blue or black pen for maximum contrast",
              },
            ].map((item, idx) => (
              <div key={idx} className="border-l-2 border-slate-300 pl-4">
                <h3 className="font-medium text-slate-900 mb-1 text-sm">{item.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!originalImage && !isProcessing && (
            <SignatureUploader onFileSelect={handleFileSelect} disabled={isProcessing} />
          )}


          {processedImage && originalImage && !isProcessing && (
            <SignaturePreview
              originalImage={originalImage}
              processedImage={processedImage}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  )
}
