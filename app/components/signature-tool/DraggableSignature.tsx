"use client";
import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
type SignatureAnnotation = {
  id: string;
  pageIndex: number;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

  // Local resize state
  const resizingRef = useRef(false);
  const startRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!resizingRef.current || !startRef.current) return;
      const dx = e.clientX - startRef.current.mouseX;
      const dy = e.clientY - startRef.current.mouseY;

      // Convert pixel delta to PDF units using scale
      const newWidth = Math.max(20, startRef.current.startW + dx / scale);
      const newHeight = Math.max(10, startRef.current.startH + dy / scale);

      onUpdate(data.id, { width: newWidth, height: newHeight });
    };

    const handleUp = () => {
      resizingRef.current = false;
      startRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    if (resizingRef.current) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [scale, data.id, onUpdate]);

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizingRef.current = true;
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: data.width,
      startH: data.height,
    };
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      defaultPosition={{ x: data.x * scale, y: data.y * scale }}
      position={{ x: data.x * scale, y: data.y * scale }}
      onStop={(_, d) => {
        const newX = d.x / scale;
        const newY = d.y / scale;
        onUpdate(data.id, { x: newX, y: newY });
      }}
    >
      <div
        ref={nodeRef}
        className="absolute z-20 select-none"
        style={{
          left: 0,
          top: 0,
          width: `${data.width * scale}px`,
          height: `${data.height * scale}px`,
          cursor: "move",
          pointerEvents: "auto",
          userSelect: "none",
          background: "transparent",
          borderRadius: "2px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowControls(true);
        }}
        aria-label="Signature annotation"
      >
        {/* Use <img /> to preserve PNG transparency; set pointerEvents none so drag is handled by wrapper */}
        <Image
  src={data.image}
  alt="Signature"
  width={data.width * scale}
  height={data.height * scale}
  style={{
    objectFit: "contain",
    pointerEvents: "none",
  }}
/>

        {/* Delete Button */}
        {showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700 z-30"
            style={{ pointerEvents: "auto" }}
            aria-label="Delete signature"
            title="Delete signature"
          >
            ×
          </button>
        )}

        {/* Resize handle (bottom-right) */}
        {showControls && (
          <div
            onMouseDown={onResizeMouseDown}
            title="Resize"
            style={{
              position: "absolute",
              right: -6,
              bottom: -6,
              width: 12,
              height: 12,
              cursor: "nwse-resize",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: 2,
              zIndex: 40,
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: "#333",
            }}
          >
            ↘
          </div>
        )}
      </div>
    </Draggable>
  );
}
