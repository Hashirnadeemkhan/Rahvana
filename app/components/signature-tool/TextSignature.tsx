"use client";
import React, { useState } from "react";

type Props = {
  onGenerate: (dataURL: string) => void;
  closeModal: () => void;
};

export default function TextSignature({ onGenerate, closeModal }: Props) {
  const [name, setName] = useState("");

  const handleGenerate = () => {
    if (!name.trim()) {
      alert("Please enter a name before generating.");
      return;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 400;
    canvas.height = 100;
    ctx.font = "40px cursive";
    ctx.fillStyle = "black";
    ctx.fillText(name, 20, 60);
    onGenerate(canvas.toDataURL("image/png"));
    closeModal();
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
      <button
        onClick={handleGenerate}
        className="ml-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
      >
        Generate
      </button>
    </div>
  );
}