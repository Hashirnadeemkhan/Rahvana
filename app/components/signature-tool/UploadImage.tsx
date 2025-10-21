"use client";
import React from "react";

type Props = {
  onUpload: (dataURL: string) => void;
  closeModal: () => void;
};

export default function UploadImage({ onUpload, closeModal }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result as string);
      closeModal();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
}