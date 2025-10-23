"use client";

import React, { useState } from "react";
import Cropper from "react-easy-crop";

type Props = {
  imageSrc: string;
  onDone: (dataURL: string) => void;
  onCancel: () => void;
};

export default function ImageFilterEditor({ imageSrc, onDone, onCancel }: Props) {
  const [zoom, setZoom] = useState(1);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
 
  });

  const handleFilterChange = (name: string, value: number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
     
    `;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    onDone(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[95%] sm:w-[700px] h-[90%] p-4 shadow-2xl flex flex-col">
        <h2 className="text-lg font-semibold text-center mb-3">Enhance Your Signature</h2>

        <div className="relative flex-1 bg-gray-100 rounded overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={{ x: 0, y: 0 }}
            zoom={zoom}
            aspect={4 / 1}
            onCropChange={() => {}}
            onZoomChange={setZoom}
            onCropComplete={() => {}}
            style={{
              containerStyle: {
                filter: `
                  brightness(${filters.brightness}%)
                  contrast(${filters.contrast}%)
               
                `,
              },
            }}
          />
        </div>

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

        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
