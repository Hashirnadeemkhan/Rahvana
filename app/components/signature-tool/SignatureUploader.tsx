'use client';

import React, { useRef, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';

interface SignatureUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function SignatureUploader({ onFileSelect, disabled = false }: SignatureUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        border-4 border-dashed rounded-2xl p-8 sm:p-16 text-center
        transition-all cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
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
          <FileImage className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 mb-4 sm:mb-6 animate-bounce" />
        ) : (
          <Upload className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4 sm:mb-6" />
        )}

        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
          {isDragging ? 'Drop your image here' : 'Upload Signature Photo'}
        </h3>

        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Drag and drop or click to browse
        </p>

        <button
          type="button"
          disabled={disabled}
          className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg 
                     font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose File
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Supported formats: JPG, PNG, HEIC • Max size: 10MB
        </p>
      </div>
    </div>
  );
}