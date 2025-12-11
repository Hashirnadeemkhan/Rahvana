"use client";

import { useRef, useEffect } from "react";
import { Trash2, RotateCw } from "lucide-react";

export type ShapeType = "checkmark" | "cross" | "circle" | "square";

type ShapeAnnotation = {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  size: number;
  color: string;
  pageIndex: number;
  rotation?: number;
  strokeWidth?: number;
};

export default function DraggableShape({
  data,
  onUpdate,
  onDelete,
  scale,
  isSelected,
  onSelect,
}: {
  data: ShapeAnnotation;
  onUpdate: (id: string, patch: Partial<ShapeAnnotation>) => void;
  onDelete: (id: string) => void;
  scale: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const rotation = data.rotation || 0;
  const strokeWidth = data.strokeWidth || 2;

  /* ---------------------------- DRAG --------------------------- */
  const handleDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = data.x;
    const startPosY = data.y;

    const onMove = (move: MouseEvent) => {
      onUpdate(data.id, {
        x: startPosX + (move.clientX - startX) / scale,
        y: startPosY + (move.clientY - startY) / scale,
      });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  /* --------------------------- ROTATE --------------------------- */
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();

    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const onMove = (m: MouseEvent) => {
      const angle = Math.atan2(m.clientY - cy, m.clientX - cx);
      onUpdate(data.id, { rotation: angle * (180 / Math.PI) + 90 });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  /* --------------------------- RESIZE --------------------------- */
  const startResize = (dir: "tl" | "tr" | "bl" | "br") => (e: React.MouseEvent) => {
    e.stopPropagation();

    const startSize = data.size;
    const startX = data.x;
    const startY = data.y;
    const startPageX = e.clientX;
    const startPageY = e.clientY;

    const onMove = (m: MouseEvent) => {
      const dx = (m.clientX - startPageX) / scale;
      const dy = (m.clientY - startPageY) / scale;

      let size = startSize;
      let newX = startX;
      let newY = startY;

      if (dir === "br") size = Math.max(20, startSize + Math.max(dx, dy));
      if (dir === "tr") {
        size = Math.max(20, startSize + Math.max(dx, -dy));
        newY = startY - (size - startSize);
      }
      if (dir === "bl") {
        size = Math.max(20, startSize + Math.max(-dx, dy));
        newX = startX - (size - startSize);
      }
      if (dir === "tl") {
        size = Math.max(20, startSize - Math.max(dx, dy));
        newX = startX + (startSize - size);
        newY = startY + (startSize - size);
      }

      onUpdate(data.id, { size, x: newX, y: newY });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  /* ------------------------- RENDER SHAPE ------------------------- */
  const renderShape = () => {
    const s = data.size * scale;

    const baseStyle = {
      width: s,
      height: s,
    };

    switch (data.type) {
      case "checkmark":
        return (
          <span
            style={{
              ...baseStyle,
              fontSize: s * 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: data.color,
            }}
          >
            ✓
          </span>
        );

      case "cross":
        return (
          <span
            style={{
              ...baseStyle,
              fontSize: s * 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: data.color,
            }}
          >
            ✕
          </span>
        );

      case "circle":
        return (
          <div
            style={{
              ...baseStyle,
              borderRadius: "50%",
              border: `${strokeWidth}px solid ${data.color}`,
            }}
          />
        );

      case "square":
        return (
          <div
            style={{
              ...baseStyle,
              border: `${strokeWidth}px solid ${data.color}`,
            }}
          />
        );
    }
  };

  /* ========================= JSX ========================= */

  return (
    <div
      ref={nodeRef}
      className="absolute select-none"
      style={{
        left: data.x * scale,
        top: data.y * scale,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        zIndex: isSelected ? 200 : 20,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) onSelect(data.id);
      }}
    >
      {/* Main wrapper */}
      <div
        className={`relative inline-block p-1 ${
          isSelected ? "ring-2 ring-blue-500 cursor-move" : "cursor-pointer"
        }`}
        onMouseDown={(e) => isSelected && handleDrag(e)}
      >
        {renderShape()}

        {isSelected && (
          <>
            {/* -------- Smallpdf Style Resize Handles -------- */}
            <div
              onMouseDown={startResize("tl")}
              className="absolute -top-2 -left-2 w-4 h-4 border border-blue-500 bg-white/70 backdrop-blur-md rounded-full cursor-nwse-resize shadow-sm"
            />
            <div
              onMouseDown={startResize("tr")}
              className="absolute -top-2 -right-2 w-4 h-4 border border-blue-500 bg-white/70 backdrop-blur-md rounded-full cursor-nesw-resize shadow-sm"
            />
            <div
              onMouseDown={startResize("bl")}
              className="absolute -bottom-2 -left-2 w-4 h-4 border border-blue-500 bg-white/70 backdrop-blur-md rounded-full cursor-nesw-resize shadow-sm"
            />
            <div
              onMouseDown={startResize("br")}
              className="absolute -bottom-2 -right-2 w-4 h-4 border border-blue-500 bg-white/70 backdrop-blur-md rounded-full cursor-nwse-resize shadow-sm"
            />

            {/* -------- Rotate (Smallpdf blur button) -------- */}
            <div
              onMouseDown={handleRotate}
              className="absolute top-1/2 -right-12 -translate-y-1/2
                         w-9 h-9 rounded-full border border-blue-500 
                         bg-white/70 backdrop-blur-md shadow-sm
                         flex items-center justify-center
                         cursor-grab active:cursor-grabbing"
            >
              <RotateCw className="w-4 h-4 text-blue-500" />
            </div>

            {/* -------- Delete (Smallpdf blur button) -------- */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2
                         w-9 h-9 rounded-full border border-blue-500
                         bg-white/70 backdrop-blur-md shadow-sm
                         flex items-center justify-center
                         hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4 text-blue-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
