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
      // Ensure we get a transparent PNG by using canvas.toDataURL and not forcing a white bg.
      const canvas = sigRef.current.getCanvas();

      // If the signature library produced a trimmed canvas and you want padding,
      // you can create an offscreen canvas and draw the signature onto it with transparent bg.
      // For now, just use existing canvas (transparent background preserved).
      const dataURL = canvas.toDataURL("image/png");
      onSave(dataURL);
      closeModal();
    } else {
      alert("Please draw a signature before saving.");
    }
  };

  const handleClear = () => sigRef.current?.clear();

  return (
    <div className="p-4">
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          className: "border rounded-md w-full h-40",
          style: { background: "transparent", touchAction: "none" },
        }}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}
