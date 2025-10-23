"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

type Props = {
  onUpload: (dataURL: string) => void;
  closeModal: () => void;
};

export default function UploadImage({ onUpload, closeModal }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sepia: 0,
    grayscale: 0,
  });
  const [showEditor, setShowEditor] = useState(false);

  const onCropComplete = useCallback(() => {}, []);

  // Upload handler
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  };

  // Apply filters on canvas & save
  const handleSave = async () => {
    const img = new Image();
    img.src = imageSrc!;
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply filters
    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
    `;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const final = canvas.toDataURL("image/png");
    onUpload(final);
    setShowEditor(false);
    closeModal();
  };

  const handleFilterChange = (name: string, value: number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      {/* Upload input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="border rounded px-3 py-2 w-full"
      />

      {/* Modal Editor */}
      {showEditor && imageSrc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] sm:w-[700px] h-[90%] p-4 shadow-2xl flex flex-col">
            <h2 className="text-lg font-semibold text-center mb-3">Edit Image</h2>

            {/* Crop Area */}
            <div className="relative flex-1 bg-gray-100 rounded overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    filter: `
                      brightness(${filters.brightness}%)
                      contrast(${filters.contrast}%)
                      saturate(${filters.saturation}%)
                      sepia(${filters.sepia}%)
                      grayscale(${filters.grayscale}%)
                    `,
                  },
                }}
              />
            </div>

            {/* Controls */}
            <div className="space-y-3 mt-4">
              <div>
                <label>Zoom: </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Filters */}
              {Object.entries(filters).map(([name, value]) => (
                <div key={name}>
                  <label className="capitalize">
                    {name}: {value}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={value}
                    onChange={(e) =>
                      handleFilterChange(name, parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditor(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
