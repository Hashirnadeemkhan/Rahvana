"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Upload, ImageIcon, type File } from "lucide-react"

interface SignatureUploaderProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export default function SignatureUploader({ onFileSelect, disabled = false }: SignatureUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        border-2 rounded-lg p-8 sm:p-12 text-center
        transition-all cursor-pointer
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          isDragging
            ? "border-slate-400 bg-slate-50"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center">
        {isDragging ? (
          <ImageIcon className="w-12 h-12 text-slate-600 mb-4" />
        ) : (
          <Upload className="w-12 h-12 text-slate-400 mb-4" />
        )}

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {isDragging ? "Drop your image here" : "Upload Signature Photo"}
        </h3>

        <p className="text-slate-600 mb-6 text-sm">Drag and drop or click to browse your files</p>

        <button
          type="button"
          disabled={disabled}
          className="text-white bg-primary/90 px-6 py-2.5 rounded transition-colors text-sm
                     hover:bg-primary/100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose File
        </button>

        <p className="text-xs text-slate-500 mt-4">Supported: JPG, PNG, HEIC • Max 10MB</p>
      </div>
    </div>
  )
}
