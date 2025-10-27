"use client";

import React, { useRef, useState, useEffect } from "react";
import { Check, RotateCcw, ArrowLeft } from "lucide-react";

interface Props {
  imageSrc: string;
  onDone: (img: string) => void;
  onCancel: () => void;
}

export default function SignaturePerspectiveCorrection({
  imageSrc,
  onDone,
  onCancel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [vertical, setVertical] = useState(0);
  const [horizontal, setHorizontal] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
      draw();
    };
  }, [imageSrc]);

  const draw = () => {
    if (!canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(
      1,
      vertical * 0.02,
      horizontal * 0.02,
      1,
      0,
      0
    );

    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    draw();
  }, [vertical, horizontal, loaded]);

  const handleReset = () => {
    setVertical(0);
    setHorizontal(0);
  };

  const handleApply = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    onDone(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
            <span>Perspective Correction</span>
            <button
              onClick={handleReset}
              className="p-1 rounded hover:bg-blue-700 transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-gray-900 flex items-center justify-center min-h-[300px]">
            {!loaded && <p className="text-gray-300">Loading image…</p>}
            <canvas
              ref={canvasRef}
              style={{
                display: loaded ? "block" : "none",
                borderRadius: "8px",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-5 flex flex-col justify-center gap-6">
          <div>
            <label className="font-medium">Vertical ({vertical})</label>
            <input
              type="range"
              min={-20}
              max={20}
              value={vertical}
              onChange={(e) => setVertical(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-medium">Horizontal ({horizontal})</label>
            <input
              type="range"
              min={-20}
              max={20}
              value={horizontal}
              onChange={(e) => setHorizontal(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>

        <button
          disabled={!loaded}
          onClick={handleApply}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <Check className="w-5 h-5" />
          Apply & Continue
        </button>
      </div>
    </div>
  );
}
