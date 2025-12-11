"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Trash2, RotateCw } from "lucide-react";

export type PlacedText = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  pageIndex: number;
  color: string;
  font?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  bgColor?: string;
  opacity?: number;
  rotation?: number;
  width?: number;
  height?: number;
};

interface DraggableTextProProps {
  data: PlacedText;
  onUpdate: (id: string, patch: Partial<PlacedText>) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  scale: number;
  isSelected: boolean;
}

export default function DraggableTextPro({
  data,
  onUpdate,
  onDelete,
  onSelect,
  scale,
  isSelected,
}: DraggableTextProProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);

  const textWidth = data.width || 150;
  const textHeight = data.height || 50;
  const rotation = data.rotation || 0;

  // Click outside to exit editing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    if (isSelected) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelected]);

  // Drag
  const handleDrag = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = data.x * scale;
    const startPosY = data.y * scale;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onUpdate(data.id, {
        x: (startPosX + deltaX) / scale,
        y: (startPosY + deltaY) / scale,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Resize (8 handles)
  const handleResize = (direction: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = textWidth;
    const startHeight = textHeight;
    const startXPos = data.x;
    const startYPos = data.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startXPos;
      let newY = startYPos;

      switch (direction) {
        case "top-left":
          newWidth = Math.max(80, startWidth - deltaX);
          newHeight = Math.max(30, startHeight - deltaY);
          newX = startXPos + deltaX;
          newY = startYPos + deltaY;
          break;
        case "top":
          newHeight = Math.max(30, startHeight - deltaY);
          newY = startYPos + deltaY;
          break;
        case "top-right":
          newWidth = Math.max(80, startWidth + deltaX);
          newHeight = Math.max(30, startHeight - deltaY);
          newY = startYPos + deltaY;
          break;
        case "right":
          newWidth = Math.max(80, startWidth + deltaX);
          break;
        case "bottom-right":
          newWidth = Math.max(80, startWidth + deltaX);
          newHeight = Math.max(30, startHeight + deltaY);
          break;
        case "bottom":
          newHeight = Math.max(30, startHeight + deltaY);
          break;
        case "bottom-left":
          newWidth = Math.max(80, startWidth - deltaX);
          newHeight = Math.max(30, startHeight + deltaY);
          newX = startXPos + deltaX;
          break;
        case "left":
          newWidth = Math.max(80, startWidth - deltaX);
          newX = startXPos + deltaX;
          break;
      }

      onUpdate(data.id, { width: newWidth, height: newHeight, x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Rotate
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      onUpdate(data.id, { rotation: Math.round(angle) });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={nodeRef}
      className="absolute select-none"
      style={{
        left: `${data.x * scale}px`,
        top: `${data.y * scale}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        zIndex: isSelected ? 100 : 10,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) onSelect(data.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (isSelected) setIsEditing(true);
      }}
    >
      <div
        className={`relative ${
          isSelected ? "ring-1 ring-blue-400 cursor-move" : "hover:ring-1 hover:ring-blue-300 cursor-pointer"
        } rounded-md transition-all`}
        style={{
          width: `${textWidth}px`,
          height: `${textHeight}px`,
          padding: "8px",
          backgroundColor: data.bgColor || "transparent",
          opacity: (data.opacity || 100) / 100,
        }}
        onMouseDown={(e) => {
          if (!isEditing && isSelected) handleDrag(e);
        }}
      >
        {/* Editable Text */}
        {isEditing ? (
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => {
              if (editText.trim()) onUpdate(data.id, { text: editText });
              setIsEditing(false);
            }}
            className="w-full h-full bg-transparent outline-none resize-none"
            style={{
              fontSize: data.fontSize,
              color: data.color,
              fontFamily: data.font || "Arial",
              fontWeight: data.bold ? "bold" : "normal",
              fontStyle: data.italic ? "italic" : "normal",
              textDecoration: data.underline ? "underline" : "none",
              textAlign: data.align || "left",
            }}
          />
        ) : (
          <div
            className="w-full h-full overflow-hidden select-none"
            style={{
              fontSize: data.fontSize,
              color: data.color,
              fontFamily: data.font || "Arial",
              fontWeight: data.bold ? "bold" : "normal",
              fontStyle: data.italic ? "italic" : "normal",
              textDecoration: data.underline ? "underline" : "none",
              textAlign: data.align || "left",
              wordWrap: "break-word",
            }}
          >
            {data.text || "Insert text"}
          </div>
        )}

        {/* SELECTION HANDLES - SMALLPDF STYLE */}
        {isSelected && !isEditing && (
          <>
            {/* Circle Resize Handles (blue outline, white fill) */}
            {["top-left","top","top-right","right","bottom-right","bottom","bottom-left","left"].map((dir) => (
              <div
                key={dir}
                onMouseDown={handleResize(dir)}
                className="absolute w-3 h-3 bg-white border border-blue-500 rounded-full shadow-sm hover:scale-110 transition"
                style={{
                  cursor:
                    dir === "top-left" || dir === "bottom-right"
                      ? "nwse-resize"
                      : dir === "top-right" || dir === "bottom-left"
                      ? "nesw-resize"
                      : dir === "top" || dir === "bottom"
                      ? "ns-resize"
                      : "ew-resize",
                  ...(dir === "top-left" && { top: "-6px", left: "-6px" }),
                  ...(dir === "top" && { top: "-6px", left: "50%", transform: "translateX(-50%)" }),
                  ...(dir === "top-right" && { top: "-6px", right: "-6px" }),
                  ...(dir === "right" && { top: "50%", right: "-6px", transform: "translateY(-50%)" }),
                  ...(dir === "bottom-right" && { bottom: "-6px", right: "-6px" }),
                  ...(dir === "bottom" && { bottom: "-6px", left: "50%", transform: "translateX(-50%)" }),
                  ...(dir === "bottom-left" && { bottom: "-6px", left: "-6px" }),
                  ...(dir === "left" && { top: "50%", left: "-6px", transform: "translateY(-50%)" }),
                }}
              />
            ))}

            {/* ROTATE HANDLE + CONNECTOR LINE (SMALLPDF STYLE) */}
            <div
              className="absolute left-1/2 -top-10 w-0.5 h-6 bg-blue-400"
              style={{ transform: "translateX(-50%)" }}
            />

            <div
              onMouseDown={handleRotate}
              className="absolute -top-16 left-1/2 -translate-x-1/2
                         w-8 h-8 flex items-center justify-center
                         bg-white border border-blue-500 rounded-full
                         cursor-grab shadow-sm hover:scale-105 transition"
            >
              <RotateCw className="w-4 h-4 text-blue-500" />
            </div>

            {/* DELETE BUTTON (Smallpdf style) */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
              className="absolute -top-16 right-0
                         w-8 h-8 bg-white border border-blue-500 rounded-full
                         flex items-center justify-center shadow-sm
                         hover:bg-red-50 hover:border-red-400 
                         transition"
            >
              <Trash2 className="w-4 h-4 text-blue-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
