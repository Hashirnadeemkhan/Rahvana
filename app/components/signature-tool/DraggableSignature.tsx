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
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ 
    x: number; 
    y: number; 
    width: number; 
    height: number;
  } | null>(null);

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      // Convert screen delta to PDF units
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

  const handleRotateLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = (rotation - 15) % 360;
    setRotation(newRotation);
    onUpdate(data.id, { rotation: newRotation });
  };

  const handleRotateRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = (rotation + 15) % 360;
    setRotation(newRotation);
    onUpdate(data.id, { rotation: newRotation });
  };

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
        {/* Selection Border with Blue Dashed Box */}
        {showControls && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: "2px dashed #3B82F6",
              borderRadius: "4px",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
            transition: "transform 0.2s ease",
            userSelect: "none",
          }}
        />

        {/* Control Toolbar */}
        {showControls && (
          <div 
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white shadow-xl rounded-lg p-1.5 border-2 border-blue-500"
            style={{ zIndex: 100 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Rotate Left */}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleRotateLeft}
              className="w-9 h-9 bg-gray-100 hover:bg-blue-100 rounded-md flex items-center justify-center transition text-gray-700 hover:text-blue-600"
              title="Rotate left (15°)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>

            {/* Rotate Right */}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleRotateRight}
              className="w-9 h-9 bg-gray-100 hover:bg-blue-100 rounded-md flex items-center justify-center transition text-gray-700 hover:text-blue-600"
              title="Rotate right (15°)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>

            {/* Delete */}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
              className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition"
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

        {/* Bottom-right Resize Handle - LARGER & MORE VISIBLE */}
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
      </div>
    </Draggable>
  );
}