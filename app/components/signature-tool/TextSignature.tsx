"use client";
import React, { useState } from "react";
import ImageFilterEditor from "./ImageFilterEditor";

export default function TextSignature({ onGenerate, closeModal }: { onGenerate: (dataURL: string) => void; closeModal: () => void }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);

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
    setImage(canvas.toDataURL("image/png")); // open filter editor
  };

  return (
    <div className="p-4">
      {!image ? (
        <>
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
        </>
      ) : (
        <ImageFilterEditor
          imageSrc={image}
          onDone={(final) => {
            onGenerate(final);
            closeModal();
          }}
          onCancel={() => setImage(null)}
        />
      )}
    </div>
  );
}
