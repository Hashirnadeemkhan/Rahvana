"use client";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

type PlacedText = {
  id: string;
  text: string;
  x: number;  // Scaled PDF coords
  y: number;
  fontSize: number;
  pageIndex: number;
  color: string;
};

export default function DraggableText({
  data,
  onUpdate,
  onDelete,
  scale,  // 🆕 Pass scale from parent
}: {
  data: PlacedText;
  onUpdate: (id: string, patch: Partial<PlacedText>) => void;
  onDelete: (id: string) => void;
  scale: number;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(false);  // 🆕 Renamed for clarity

  // 🆕 Console for debug
  console.log(`Rendering text ${data.id} at scaled pos: x=${data.x * scale}, y=${data.y * scale}, font=${data.fontSize}`);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"  // 🆕 Use parent bounds (container)
      defaultPosition={{ x: data.x * scale, y: data.y * scale }}  // 🆕 Scale position!
      position={{ x: data.x * scale, y: data.y * scale }}  // 🆕 Force current position
      onDrag={(_, d) => console.log(`Dragging ${data.id}: delta x=${d.x}, y=${d.y}`)}  // 🆕 Debug drag
      onStop={(_, d) => {
        const newX = d.x / scale;  // 🆕 Unscale for storage
        const newY = d.y / scale;
        console.log(`Stopped ${data.id} at unscaled: x=${newX}, y=${newY}`);
        onUpdate(data.id, { x: newX, y: newY });
      }}
    >
      <div
        ref={nodeRef}
        className="absolute z-20 select-none"  // 🆕 Higher z-index
        style={{ 
          left: 0,  // 🆕 No transform - use left/top for better dragging
          top: 0,
          fontSize: `${data.fontSize}px`,  // 🆕 px unit
          color: data.color,
          fontFamily: "Arial, sans-serif",
          whiteSpace: "nowrap",  // 🆕 Prevent wrapping
          cursor: "move",
          pointerEvents: "auto",
          userSelect: "none",
          padding: "2px",
          background: "rgba(255,255,255,0.8)",  // 🆕 Semi-transparent bg like smallpdf
          borderRadius: "2px"
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowControls(true);
          console.log(`Clicked ${data.id} - showing controls`);
        }}
      >
        {data.text}
        
        {/* 🆕 Fixed Red Cross */}
        {showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Deleting ${data.id}`);
              onDelete(data.id);
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 z-30"
            style={{ pointerEvents: "auto" }}
          >
            ×
          </button>
        )}
        
        {/* 🆕 Fixed Font Controls */}
        {showControls && (
          <div className="absolute -bottom-8 left-0 bg-white border rounded p-1 text-xs shadow-lg flex items-center gap-1 z-30"
               style={{ pointerEvents: "auto" }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newSize = Math.max(8, data.fontSize - 1);
                console.log(`Font - for ${data.id}: ${newSize}`);
                onUpdate(data.id, { fontSize: newSize });
              }}
              className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="min-w-[20px] text-center">{data.fontSize}px</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newSize = Math.min(72, data.fontSize + 1);
                console.log(`Font + for ${data.id}: ${newSize}`);
                onUpdate(data.id, { fontSize: newSize });
              }}
              className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
}