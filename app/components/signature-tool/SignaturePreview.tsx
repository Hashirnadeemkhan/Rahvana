'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCcw, Check, Move } from 'lucide-react';

interface SignaturePreviewProps {
  originalImage: string;
  processedImage: string;
  onDownload: () => void;
  onReset: () => void;
}

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Corner {
  x: number;
  y: number;
}

export default function SignaturePreview({
  originalImage,
  processedImage,
  onDownload,
  onReset,
}: SignaturePreviewProps) {
  // Perspective correction state
  const [showPerspective, setShowPerspective] = useState(false);
  const [perspectiveCorrectedImage, setPerspectiveCorrectedImage] = useState<string | null>(null);
  const [corners, setCorners] = useState<Corner[]>([
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ]);
  const [draggingCorner, setDraggingCorner] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Crop state
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const perspectiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const perspectivePreviewRef = useRef<HTMLCanvasElement>(null);
  const perspectiveContainerRef = useRef<HTMLDivElement>(null);

  // Current image to display (perspective corrected or original processed)
  const currentImage = perspectiveCorrectedImage || processedImage;

  // Load image dimensions
  useEffect(() => {
    if (processedImage) {
      const img = new Image();
      img.src = processedImage;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    }
  }, [processedImage]);

  // Auto-detect signature bounds on load
  useEffect(() => {
    if (currentImage && imageRef.current && previewRef.current && !showPerspective) {
      detectSignatureBounds();
    }
  }, [currentImage, showPerspective]);

  // Initialize perspective corners
  useEffect(() => {
    if (showPerspective && processedImage && imageDimensions) {
      setCorners([
        { x: 0, y: 0 },
        { x: imageDimensions.width, y: 0 },
        { x: imageDimensions.width, y: imageDimensions.height },
        { x: 0, y: imageDimensions.height },
      ]);

      const canvas = perspectiveCanvasRef.current;
      if (canvas) {
        canvas.width = imageDimensions.width;
        canvas.height = imageDimensions.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.src = processedImage;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
        }
      }
    }
  }, [showPerspective, processedImage, imageDimensions]);

  // Apply perspective transformation
  useEffect(() => {
    if (!showPerspective || !imageDimensions) return;
    applyPerspective();
  }, [corners, showPerspective, imageDimensions]);

  const applyPerspective = () => {
    const previewCanvas = perspectivePreviewRef.current;
    const sourceCanvas = perspectiveCanvasRef.current;
    if (!previewCanvas || !sourceCanvas || !imageDimensions) return;

    const img = new Image();
    img.src = processedImage;

    img.onload = () => {
      const ctx = previewCanvas.getContext('2d');
      if (!ctx) return;

      const width = Math.max(
        Math.abs(corners[1].x - corners[0].x),
        Math.abs(corners[2].x - corners[3].x)
      );
      const height = Math.max(
        Math.abs(corners[3].y - corners[0].y),
        Math.abs(corners[2].y - corners[1].y)
      );

      previewCanvas.width = width;
      previewCanvas.height = height;
      ctx.clearRect(0, 0, width, height);

      try {
        const steps = 20;
        for (let i = 0; i < steps; i++) {
          for (let j = 0; j < steps; j++) {
            const u = i / steps;
            const v = j / steps;

            const srcX =
              (1 - u) * (1 - v) * 0 +
              u * (1 - v) * imageDimensions.width +
              u * v * imageDimensions.width +
              (1 - u) * v * 0;

            const srcY =
              (1 - u) * (1 - v) * 0 +
              u * (1 - v) * 0 +
              u * v * imageDimensions.height +
              (1 - u) * v * imageDimensions.height;

            const dstX =
              (1 - u) * (1 - v) * corners[0].x +
              u * (1 - v) * corners[1].x +
              u * v * corners[2].x +
              (1 - u) * v * corners[3].x;

            const dstY =
              (1 - u) * (1 - v) * corners[0].y +
              u * (1 - v) * corners[1].y +
              u * v * corners[2].y +
              (1 - u) * v * corners[3].y;

            const cellWidth = imageDimensions.width / steps;
            const cellHeight = imageDimensions.height / steps;
            const targetWidth = width / steps;
            const targetHeight = height / steps;

            ctx.drawImage(
              img,
              srcX,
              srcY,
              cellWidth,
              cellHeight,
              i * targetWidth,
              j * targetHeight,
              targetWidth,
              targetHeight
            );
          }
        }
      } catch (error) {
        console.error('Perspective error:', error);
      }
    };
  };

  const detectSignatureBounds = async () => {
    if (!currentImage || !imageRef.current || !previewRef.current) return;

    const img = document.createElement('img');
    img.src = currentImage;

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

      if (imageRef.current) {
        const displayRect = imageRef.current.getBoundingClientRect();
        const scaleX = displayRect.width / canvas.width;
        const scaleY = displayRect.height / canvas.height;

        setCropBox({
          x: minX * scaleX,
          y: minY * scaleY,
          width: (maxX - minX) * scaleX,
          height: (maxY - minY) * scaleY,
        });
      }
    };
  };

  // Perspective corner dragging
  const handlePerspectiveMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCorner(index);
  };

  const handlePerspectiveMouseMove = (e: MouseEvent) => {
    if (draggingCorner === null || !perspectiveContainerRef.current || !imageDimensions) return;

    const rect = perspectiveContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;

    setCorners((prev) => {
      const newCorners = [...prev];
      newCorners[draggingCorner] = {
        x: Math.max(0, Math.min(imageDimensions.width, x * scaleX)),
        y: Math.max(0, Math.min(imageDimensions.height, y * scaleY)),
      };
      return newCorners;
    });
  };

  const handlePerspectiveMouseUp = () => {
    setDraggingCorner(null);
  };

  useEffect(() => {
    if (draggingCorner !== null) {
      document.addEventListener('mousemove', handlePerspectiveMouseMove);
      document.addEventListener('mouseup', handlePerspectiveMouseUp);
      return () => {
        document.removeEventListener('mousemove', handlePerspectiveMouseMove);
        document.removeEventListener('mouseup', handlePerspectiveMouseUp);
      };
    }
  }, [draggingCorner, imageDimensions]);

  // Crop box dragging
  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragType || !previewRef.current) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const containerRect = previewRef.current.getBoundingClientRect();

    setCropBox((prev) => {
      let newBox = { ...prev };
      const minSize = 50;

      if (dragType === 'move') {
        newBox.x = Math.max(0, Math.min(containerRect.width - prev.width, prev.x + deltaX));
        newBox.y = Math.max(0, Math.min(containerRect.height - prev.height, prev.y + deltaY));
      } else {
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

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

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

  const applyCrop = async () => {
    if (!currentImage || !imageRef.current) return;

    try {
      const img = document.createElement('img');
      img.src = currentImage;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      if (!imageRef.current) return;

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

      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      setCroppedImage(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Crop error:', error);
      alert('Failed to crop image. Please try again.');
    }
  };

  const applyPerspectiveCorrection = () => {
    const canvas = perspectivePreviewRef.current;
    if (canvas) {
      setPerspectiveCorrectedImage(canvas.toDataURL('image/png'));
      setShowPerspective(false);
      setCroppedImage(null); // Reset crop to allow re-cropping
    }
  };

  const handleDownloadCropped = () => {
    const imageToDownload = croppedImage || currentImage;
    const link = document.createElement('a');
    link.download = `signature-transparent-${new Date().getTime()}.png`;
    link.href = imageToDownload;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload();
  };

  const cornerLabels = ['Top Left', 'Top Right', 'Bottom Right', 'Bottom Left'];

  // Perspective correction UI
  if (showPerspective) {
    return (
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Move className="w-8 h-8" />
            Fix Perspective Tilt
          </h2>
          <p className="text-blue-100">Drag the blue corner handles to straighten your signature</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Interactive Editor */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4 font-bold text-lg flex items-center justify-between">
              <span>🎯 Drag Corners to Adjust</span>
              <button
                onClick={() => {
                  if (imageDimensions) {
                    setCorners([
                      { x: 0, y: 0 },
                      { x: imageDimensions.width, y: 0 },
                      { x: imageDimensions.width, y: imageDimensions.height },
                      { x: 0, y: imageDimensions.height },
                    ]);
                  }
                }}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded-lg transition text-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            <div
              ref={perspectiveContainerRef}
              className="relative p-6 bg-gray-900 flex items-center justify-center min-h-[500px]"
            >
              <canvas
                ref={perspectiveCanvasRef}
                className="max-w-full max-h-[450px] object-contain"
              />

              {/* Corner Handles */}
              {imageDimensions &&
                corners.map((corner, index) => {
                  const rect = perspectiveContainerRef.current?.getBoundingClientRect();
                  const scaleX = rect ? rect.width / imageDimensions.width : 1;
                  const scaleY = rect ? rect.height / imageDimensions.height : 1;

                  return (
                    <div
                      key={index}
                      className="absolute w-8 h-8 bg-blue-500 border-4 border-white rounded-full cursor-move hover:scale-125 transition-transform shadow-2xl z-10"
                      style={{
                        left: `${corner.x * scaleX}px`,
                        top: `${corner.y * scaleY}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onMouseDown={(e) => handlePerspectiveMouseDown(index, e)}
                      title={cornerLabels[index]}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition pointer-events-none font-semibold">
                        {cornerLabels[index]}
                      </div>
                    </div>
                  );
                })}

              {/* Connection Lines */}
              {imageDimensions && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                >
                  {corners.map((corner, index) => {
                    const rect = perspectiveContainerRef.current?.getBoundingClientRect();
                    const scaleX = rect ? rect.width / imageDimensions.width : 1;
                    const scaleY = rect ? rect.height / imageDimensions.height : 1;
                    const nextIndex = (index + 1) % 4;

                    return (
                      <line
                        key={index}
                        x1={corner.x * scaleX}
                        y1={corner.y * scaleY}
                        x2={corners[nextIndex].x * scaleX}
                        y2={corners[nextIndex].y * scaleY}
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeDasharray="8,8"
                      />
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Preview Result */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 font-bold text-lg flex items-center gap-3">
              <Check className="w-6 h-6" />
              <span>✨ Straightened Preview</span>
            </div>
            <div
              className="p-6 flex items-center justify-center min-h-[500px]"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                `,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
              }}
            >
              <canvas
                ref={perspectivePreviewRef}
                className="max-w-full max-h-[450px] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
            <Move className="w-6 h-6" />
            How to Use:
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold">Drag Corner Handles</p>
                <p className="text-sm text-blue-700">Move blue circles to match signature edges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold">Fix Top Corners</p>
                <p className="text-sm text-blue-700">Align upper tilt and slant</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold">Adjust Bottom Corners</p>
                <p className="text-sm text-blue-700">Correct lower perspective distortion</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold">Preview & Apply</p>
                <p className="text-sm text-blue-700">See live results on the right</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowPerspective(false)}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all transform hover:scale-105 flex items-center gap-3 text-lg shadow-lg"
          >
            <RotateCcw className="w-6 h-6" />
            Cancel
          </button>
          <button
            onClick={applyPerspectiveCorrection}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-3 text-lg shadow-lg"
          >
            <Check className="w-6 h-6" />
            Apply & Continue
          </button>
        </div>
      </div>
    );
  }

  // Main preview UI
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Check className="w-8 h-8" />
              Your Signature is Ready!
            </h2>
            <p className="text-green-100">Professional quality • Transparent background • High resolution</p>
          </div>
          <button
            onClick={() => setShowPerspective(true)}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <Move className="w-5 h-5" />
            Fix Perspective Tilt
          </button>
        </div>
      </div>

      {/* Before & After Comparison */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Original Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
          <div className="bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base">
            📸 Original Photo
          </div>
          <div className="p-4 sm:p-6 bg-gray-50">
            <div className="relative">
              <img
                src={originalImage}
                alt="Original signature"
                className="w-full h-auto rounded-lg border-2 border-gray-200 max-h-[350px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Processed Image with Crop Box */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 font-semibold flex items-center justify-between text-sm sm:text-base">
            <span>✨ Enhanced Signature</span>
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div
            ref={previewRef}
            className="p-4 sm:p-6 relative"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          >
            <div className="relative">
              <img
                ref={imageRef}
                src={croppedImage || currentImage}
                alt="Processed signature with transparent background"
                className="w-full h-auto rounded-lg select-none max-h-[350px] object-contain"
                draggable={false}
              />

              {/* Crop Box Overlay */}
              {!croppedImage && (
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
              )}
            </div>

            {/* Apply Crop Button */}
            {!croppedImage && (
              <button
                onClick={applyCrop}
                className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply Crop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={handleDownloadCropped}
          className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          Download Transparent PNG
        </button>
        <button
          onClick={onReset}
          className="bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          Upload New Signature
        </button>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <p className="text-green-800 font-semibold text-base sm:text-lg">
          🎉 Your signature is ready!
        </p>
        <p className="text-green-700 mt-1 text-sm sm:text-base">
          {croppedImage ? 'Cropped & Enhanced' : 'Transparent background • Enhanced contrast'} • Professional quality
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-green-600">
          <span className="bg-white px-3 py-1 rounded-full">✓ PNG Format</span>
          <span className="bg-white px-3 py-1 rounded-full">✓ High Resolution</span>
          <span className="bg-white px-3 py-1 rounded-full">✓ No Background</span>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">
          💡 How to Use Your Signature:
        </h3>
        <ul className="space-y-2 text-blue-800 text-xs sm:text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Insert into PDF documents and contracts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Add to email signatures and business cards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use in digital signing applications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Add watermark to your creative work</span>
          </li>
        </ul>
      </div>
    </div>
  );
}