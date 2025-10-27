"use client";
import React, { useState } from "react";
import ImageFilterEditor from "./ImageFilterEditor";

type Props = {
  onUpload: (dataURL: string) => void;
  closeModal: () => void;
};

export default function UploadImage({ onUpload, closeModal }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, HEIC)');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = event.target?.result as string;
      setImage(img);
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      {!image ? (
        <div className="space-y-4">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="signature-upload"
            />
            <label
              htmlFor="signature-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <span className="text-lg text-gray-700 font-semibold block">Click to upload signature image</span>
                <span className="text-sm text-gray-500 mt-1 block">PNG, JPG, HEIC supported (max 10MB)</span>
              </div>
            </label>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips for Best Results
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>White paper:</strong> Use clean white or light-colored paper</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Good lighting:</strong> Bright, even lighting without shadows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Dark ink:</strong> Use blue or black pen for clear contrast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Clear photo:</strong> Take a straight, focused photo</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <ImageFilterEditor
          imageSrc={image}
          onDone={(final) => {
            onUpload(final);
            closeModal();
          }}
          onCancel={() => setImage(null)}
        />
      )}
    </div>
  );
}