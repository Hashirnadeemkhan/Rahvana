"use client";
import React, { useState } from "react";
import SignaturePad from "./SignaturePad";
import TextSignature from "./TextSignature";
import UploadImage from "./UploadImage";

type Props = {
  onSignature: (dataURL: string) => void;
};

export default function SignatureTool({ onSignature }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"draw" | "type" | "upload">("draw");

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Sign
      </button>

      {dropdownOpen && (
        <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg z-10 border border-gray-100">
          <button
            onClick={() => {
              setSignatureMode("draw");
              setShowModal(true);
              setDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Draw Signature
          </button>
          <button
            onClick={() => {
              setSignatureMode("type");
              setShowModal(true);
              setDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Type Signature
          </button>
          <button
            onClick={() => {
              setSignatureMode("upload");
              setShowModal(true);
              setDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Upload Signature
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Create Signature</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSignatureMode("draw")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  signatureMode === "draw" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Draw
              </button>
              <button
                onClick={() => setSignatureMode("type")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  signatureMode === "type" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Type
              </button>
              <button
                onClick={() => setSignatureMode("upload")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  signatureMode === "upload" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Upload
              </button>
            </div>
            {signatureMode === "draw" && <SignaturePad onSave={onSignature} closeModal={handleCloseModal} />}
            {signatureMode === "type" && <TextSignature onGenerate={onSignature} closeModal={handleCloseModal} />}
            {signatureMode === "upload" && <UploadImage onUpload={onSignature} closeModal={handleCloseModal} />}
          </div>
        </div>
      )}
    </div>
  );
}