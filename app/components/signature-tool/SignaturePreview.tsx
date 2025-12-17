"use client"

import React, { useState } from "react"
import NextImage from "next/image"
import { Download, RotateCcw, Check, Crop, Move } from "lucide-react"
import TiltCorrectionTool from "./TiltCorrectionTool"
import CropTool from "./CropTool"

interface SignaturePreviewProps {
  originalImage: string
  processedImage: string
  onDownload: () => void
  onReset: () => void
}

export default function SignaturePreview({
  originalImage,
  processedImage,
  onDownload,
  onReset,
}: SignaturePreviewProps) {
  const [showCropMode, setShowCropMode] = useState(false)
  const [showTiltMode, setShowTiltMode] = useState(false)

  // ✅ Step 1: Single State for the latest image
  const [editedImage, setEditedImage] = useState<string | null>(null)

  // ✅ Step 2: Determine which image to show
  const currentImage = editedImage || processedImage

  const handleDownloadCropped = () => {
    const link = document.createElement("a")
    link.download = `signature-final-${new Date().getTime()}.png`
    link.href = currentImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onDownload()
  }

  const handleReset = () => {
    setEditedImage(null)
    onReset()
  }

  // ✅ Step 3: Callback when Tilt is applied
  const handleTiltApply = (newImage: string) => {
    console.log("📸 New Tilt Image Received, Length:", newImage.length)
    setEditedImage(newImage) // Update State
    setShowTiltMode(false)   // Close Modal
  }

  // ✅ Step 4: Callback when Crop is applied
  const handleCropApply = (newImage: string) => {
    console.log("✂️ New Crop Image Received")
    setEditedImage(newImage)
    setShowCropMode(false)
  }

  if (showTiltMode) {
    return (
      <TiltCorrectionTool
        processedImage={currentImage} // Pass latest image
        onApply={handleTiltApply}
        onCancel={() => setShowTiltMode(false)}
      />
    )
  }

  if (showCropMode) {
    return (
      <CropTool
        currentImage={currentImage}
        onApplyCrop={handleCropApply}
        onToggleTilt={() => setShowTiltMode(true)}
        onExit={() => setShowCropMode(false)}
      />
    )
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-end">
        <button
          onClick={handleDownloadCropped}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
        >
          <Download className="w-6 h-6" />
          Download Signature
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Adjust Your Signature</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCropMode(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 text-base shadow-md"
            >
              <Crop className="w-5 h-5" />
              Crop
            </button>
            <button
              onClick={() => setShowTiltMode(true)}
              className="px-6 py-3 bg-primary/90 hover:bg-primary/100 text-white rounded-lg font-semibold transition-all flex items-center gap-2 text-base shadow-md"
            >
              <Move className="w-5 h-5" />
              Tilt / Rotate
            </button>
            <button
              onClick={handleDownloadCropped}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 text-base shadow-md"
            >
              <Check className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 px-6 py-4">
            <p className="text-gray-900 font-bold text-xl">Original Photo</p>
          </div>
          <div className="p-8 bg-white">
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm min-h-[200px]">
              <NextImage
                src={originalImage}
                alt="Original signature"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-300 px-6 py-4">
            <p className="text-gray-900 font-bold text-xl">
              {editedImage ? "Final Signature" : "Transparent Background"}
            </p>
          </div>
          <div
            className="p-8"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
              `,
              backgroundSize: "20px 20px",
            }}
          >
            <div className="relative min-h-[200px]">
              {/* ✅ CRITICAL FIX: key={currentImage} forces React to re-render the image tag when the source changes */}
              <NextImage
                key={currentImage}
                src={currentImage}
                alt="Enhanced signature"
                fill
                className="rounded-xl object-contain border-2 border-gray-300 shadow-md"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-md"
        >
          <RotateCcw className="w-6 h-6" />
          Start Over
        </button>
      </div>
    </div>
  )
}