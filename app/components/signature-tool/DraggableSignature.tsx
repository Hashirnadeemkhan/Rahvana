// C:\Users\HP\Desktop\arachnie\Arachnie\app\components\signature-tool\DraggableSignature.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";

type SignatureAnnotation = {
  id: string;
  pageIndex: number;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

export default function DraggableSignature({
  data,
  onUpdate,
  onDelete,
  scale,
}: {
  data: SignatureAnnotation;
  onUpdate: (id: string, patch: Partial<SignatureAnnotation>) => void;
  onDelete: (id: string) => void;
  scale: number;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [rotation, setRotation] = useState(data.rotation || 0);
  const [isRotating, setIsRotating] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      const newWidth = Math.max(40, resizeStartRef.current.width + deltaX / scale);
      const newHeight = Math.max(20, resizeStartRef.current.height + deltaY / scale);

      onUpdate(data.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, scale, data.id, onUpdate]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: data.width,
      height: data.height,
    };
    
    document.body.style.cursor = "nwse-resize";
  };

  // Handle rotation with circular handle
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
  };

  const handleRotateMove = (e: MouseEvent) => {
    if (!isRotating || !nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + (data.width * scale) / 2;
    const centerY = rect.top + (data.height * scale) / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = (angle * 180) / Math.PI;
    setRotation(Math.round(degrees));
    onUpdate(data.id, { rotation: degrees });
  };

  const handleRotateEnd = () => {
    setIsRotating(false);
  };

  useEffect(() => {
    if (isRotating) {
      document.addEventListener("mousemove", handleRotateMove);
      document.addEventListener("mouseup", handleRotateEnd);
      return () => {
        document.removeEventListener("mousemove", handleRotateMove);
        document.removeEventListener("mouseup", handleRotateEnd);
      };
    }
  }, [isRotating]);

  // Handle mouse enter/leave for controls
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={{ x: data.x * scale, y: data.y * scale }}
      disabled={isResizing}
      onStop={(_, d) => {
        const newX = d.x / scale;
        const newY = d.y / scale;
        onUpdate(data.id, { x: newX, y: newY });
      }}
    >
      <div
        ref={nodeRef}
        className="absolute select-none"
        style={{
          left: 0,
          top: 0,
          width: `${data.width * scale}px`,
          height: `${data.height * scale}px`,
          cursor: isResizing ? "nwse-resize" : "move",
          pointerEvents: "auto",
          zIndex: showControls ? 50 : 20,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.stopPropagation();
          setShowControls(true);
        }}
      >
        {/* Selection Border with Clean Blue Dashed Box */}
        {showControls && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "2px dashed #3B82F6",
              borderRadius: "4px",
            }}
          />
        )}

        {/* Signature Image */}
        <img
          src={data.image}
          alt="Signature"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            transform: `rotate(${rotation}deg)`,
            transition: isRotating ? "none" : "transform 0.2s ease",
            userSelect: "none",
          }}
        />

        {/* Control Toolbar (Moved to Bottom) */}
        {showControls && (
          <div 
            className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white shadow-xl rounded-lg p-2 border-2 border-blue-500"
            style={{ zIndex: 100 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Delete Button */}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
              title="Delete signature"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Corner Blue Dots (4 corners) */}
        {showControls && (
          <>
            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-md pointer-events-none" />
            <div className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-md pointer-events-none" />
            <div className="absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-md pointer-events-none" />
            <div className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-md pointer-events-none" />
          </>
        )}

        {/* Bottom-right Resize Handle */}
        {showControls && (
          <div
            onMouseDown={handleResizeStart}
            onMouseEnter={handleMouseEnter}
            className="absolute -right-2 -bottom-2 w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-lg hover:scale-125 hover:bg-blue-600 transition-all flex items-center justify-center"
            style={{ zIndex: 110 }}
            title="Drag to resize"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 17L17 7M17 17L7 7" />
            </svg>
          </div>
        )}

        {/* Circular Rotation Handle with Gap (SmallPDF Style, Removed Blue Line) */}
        {showControls && (
          <div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-grab active:cursor-grabbing"
            style={{ top: '-60px', zIndex: 110 }} // Increased gap from top
            onMouseDown={handleRotateStart}
          >
            {/* Removed the blue connection line */}
            
            {/* Rotation Circle */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 border-3 border-white rounded-full hover:scale-125 transition-transform shadow-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            
            {/* Degree Display While Rotating */}
            {isRotating && (
              <div className="absolute -bottom-10 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-pulse">
                {rotation}°
              </div>
            )}
          </div>
        )}
      </div>
    </Draggable>
  );
}