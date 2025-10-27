"use client";

import React, { useState, useEffect, useRef } from "react";
import { SignatureImageProcessor } from "@/lib/imageProcessor";
import SignaturePerspectiveCorrection from "./SignaturePerspectiveCorrection";

type Props = {
  imageSrc: string;
  onDone: (dataURL: string) => void;
  onCancel: () => void;
};

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageFilterEditor({ imageSrc, onDone, onCancel }: Props) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(150);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🆕 NEW: Perspective correction state
  const [showPerspectiveCorrection, setShowPerspectiveCorrection] = useState(false);
  const [perspectiveCorrectedImage, setPerspectiveCorrectedImage] = useState<string | null>(null);
  
  // Crop state
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const previewRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Auto-process when filters change
  useEffect(() => {
    processImage();
  }, [brightness, contrast, imageSrc, perspectiveCorrectedImage]);

  // Auto-detect signature bounds and set crop box
  useEffect(() => {
    if (processedImage && imageRef.current && previewRef.current) {
      detectSignatureBounds();
    }
  }, [processedImage]);

  const processImage = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Use perspective-corrected image if available, otherwise original
      const sourceImage = perspectiveCorrectedImage || imageSrc;
      
      // Step 2: Apply brightness/contrast filters first
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = sourceImage;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Apply CSS filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";

      const filteredDataURL = canvas.toDataURL("image/png");

      // Step 3: Use SignatureImageProcessor for background removal
      const processor = new SignatureImageProcessor();
      
      const processed = await processor.processImage(filteredDataURL, {
        threshold: 140,
        contrast: 2.5,
        darknessFactor: 0.3,
        noiseReduction: true,
        edgeSmoothing: true,
        aggressiveMode: true,
      });

      setProcessedImage(processed);
      processor.destroy();

    } catch (error) {
      console.error("Processing error:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Detect signature bounds automatically
  const detectSignatureBounds = async () => {
    if (!processedImage || !imageRef.current || !previewRef.current) return;

    const img = new Image();
    img.src = processedImage;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const alpha = data[i + 3];
          
          if (alpha > 50) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const padding = Math.min(canvas.width, canvas.height) * 0.05;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      maxY = Math.min(canvas.height, maxY + padding);

      const displayRect = imageRef.current!.getBoundingClientRect();
      const scaleX = displayRect.width / canvas.width;
      const scaleY = displayRect.height / canvas.height;

      setCropBox({
        x: minX * scaleX,
        y: minY * scaleY,
        width: (maxX - minX) * scaleX,
        height: (maxY - minY) * scaleY,
      });
    };
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragType || !previewRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const containerRect = previewRef.current.getBoundingClientRect();

    setCropBox(prev => {
      let newBox = { ...prev };

      if (dragType === 'move') {
        newBox.x = Math.max(0, Math.min(containerRect.width - prev.width, prev.x + deltaX));
        newBox.y = Math.max(0, Math.min(containerRect.height - prev.height, prev.y + deltaY));
      } else {
        const minSize = 50;

        if (dragType === 'nw') {
          const newX = Math.max(0, prev.x + deltaX);
          const newY = Math.max(0, prev.y + deltaY);
          const newWidth = prev.width - (newX - prev.x);
          const newHeight = prev.height - (newY - prev.y);
          
          if (newWidth >= minSize && newHeight >= minSize) {
            newBox = { x: newX, y: newY, width: newWidth, height: newHeight };
          }
        } else if (dragType === 'ne') {
          const newY = Math.max(0, prev.y + deltaY);
          const newWidth = Math.max(minSize, prev.width + deltaX);
          const newHeight = prev.height - (newY - prev.y);
          
          if (newHeight >= minSize) {
            newBox = { ...prev, y: newY, width: newWidth, height: newHeight };
          }
        } else if (dragType === 'sw') {
          const newX = Math.max(0, prev.x + deltaX);
          const newWidth = prev.width - (newX - prev.x);
          const newHeight = Math.max(minSize, prev.height + deltaY);
          
          if (newWidth >= minSize) {
            newBox = { x: newX, y: prev.y, width: newWidth, height: newHeight };
          }
        } else if (dragType === 'se') {
          newBox = {
            ...prev,
            width: Math.max(minSize, prev.width + deltaX),
            height: Math.max(minSize, prev.height + deltaY),
          };
        }
      }

      return newBox;
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragType, dragStart]);

  // Apply crop and save
  const handleSave = async () => {
    if (!processedImage || !imageRef.current) return;

    try {
      const img = new Image();
      img.src = processedImage;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const displayRect = imageRef.current.getBoundingClientRect();
      const scaleX = img.width / displayRect.width;
      const scaleY = img.height / displayRect.height;

      const cropX = cropBox.x * scaleX;
      const cropY = cropBox.y * scaleY;
      const cropWidth = cropBox.width * scaleX;
      const cropHeight = cropBox.height * scaleY;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const croppedDataURL = canvas.toDataURL('image/png');
      onDone(croppedDataURL);

    } catch (error) {
      console.error('Crop error:', error);
      alert('Failed to crop image. Please try again.');
    }
  };

  // 🆕 NEW: If showing perspective correction, render that instead
  if (showPerspectiveCorrection) {
    return (
      <SignaturePerspectiveCorrection
        imageSrc={perspectiveCorrectedImage || imageSrc}
        onDone={(correctedImage) => {
          setPerspectiveCorrectedImage(correctedImage);
          setShowPerspectiveCorrection(false);
        }}
        onCancel={() => setShowPerspectiveCorrection(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 🆕 NEW: Perspective Correction Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Edit Signature</h2>
        <button
          onClick={() => setShowPerspectiveCorrection(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Fix Perspective Tilt
        </button>
      </div>

      {/* Preview Area */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
            📄 Original
          </h3>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4 min-h-[200px] flex items-center justify-center">
            <img src={perspectiveCorrectedImage || imageSrc} alt="Original" className="max-w-full max-h-[300px] object-contain" />
          </div>
        </div>

        {/* Processed with Crop Box */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
            ✨ Enhanced Preview
            {isProcessing && (
              <span className="text-xs text-blue-600 animate-pulse">Processing...</span>
            )}
          </h3>
          <div 
            ref={previewRef}
            className="border-2 border-blue-200 rounded-lg overflow-hidden p-4 min-h-[200px] flex items-center justify-center relative"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          >
            {processedImage && (
              <>
                <img 
                  ref={imageRef}
                  src={processedImage} 
                  alt="Processed" 
                  className="max-w-full max-h-[300px] object-contain select-none" 
                  draggable={false}
                />
                
                {/* Crop Box Overlay */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
                  style={{
                    left: `${cropBox.x}px`,
                    top: `${cropBox.y}px`,
                    width: `${cropBox.width}px`,
                    height: `${cropBox.height}px`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  {/* Corner Handles */}
                  <div
                    className="absolute -left-2 -top-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'nw')}
                  />
                  <div
                    className="absolute -right-2 -top-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'ne')}
                  />
                  <div
                    className="absolute -left-2 -bottom-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'sw')}
                  />
                  <div
                    className="absolute -right-2 -bottom-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'se')}
                  />
                  
                  {/* Grid Lines */}
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">☀️ Brightness</label>
            <span className="text-sm font-mono text-blue-600">{brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-gray-800 via-gray-400 to-white rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">Adjust if signature is too light or dark</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">⚡ Contrast</label>
            <span className="text-sm font-mono text-blue-600">{contrast}%</span>
          </div>
          <input
            type="range"
            min="100"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-gray-400 via-blue-400 to-blue-600 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">Increase to remove paper texture completely</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleSave}
          disabled={isProcessing || !processedImage}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Use This Signature
        </button>
      </div>
    </div>
  );
}