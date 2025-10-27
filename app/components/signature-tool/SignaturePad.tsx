"use client";
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type Props = {
  onSave: (dataURL: string) => void;
  closeModal: () => void;
};

export default function SignaturePad({ onSave, closeModal }: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null);

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const canvas = sigRef.current.getCanvas();
      
      // Ensure transparent background
      const dataURL = canvas.toDataURL("image/png");
      onSave(dataURL);
      closeModal();
    } else {
      alert("Please draw a signature before saving.");
    }
  };

  const handleClear = () => sigRef.current?.clear();

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 touch-none",
            style: { 
              background: "transparent",
              touchAction: "none",
            },
          }}
        />
      </div>

      <p className="text-xs text-gray-500 text-center">
        ✍️ Draw your signature above
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}