"use client";
import React, { useState } from "react";

type Props = {
  onGenerate: (dataURL: string) => void;
  closeModal: () => void;
};

export default function TextSignature({ onGenerate, closeModal }: Props) {
  const [name, setName] = useState("");
  const [font, setFont] = useState("cursive");

  const fonts = [
    { name: "Cursive", value: "cursive" },
    { name: "Brush Script", value: "'Brush Script MT', cursive" },
    { name: "Lucida Handwriting", value: "'Lucida Handwriting', cursive" },
    { name: "Monotype Corsiva", value: "'Monotype Corsiva', cursive" },
  ];

  const handleGenerate = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = 600;
    canvas.height = 150;

    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.font = `bold 60px ${font}`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    const dataURL = canvas.toDataURL("image/png");
    onGenerate(dataURL);
    closeModal();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enter Your Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none transition"
          onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Choose Font Style
        </label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none transition"
        >
          {fonts.map((f) => (
            <option key={f.value} value={f.value}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview */}
      {name && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <p style={{ fontFamily: font, fontSize: "2rem" }}>{name}</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!name.trim()}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Signature
      </button>
    </div>
  );
}