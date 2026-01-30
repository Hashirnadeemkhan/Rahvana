"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import SelectionHandles from "../../shared/SelectionHandles";

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
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);
  
  // Update local state when data changes (unless we are editing)
  useEffect(() => {
    if (!isEditing) {
      setEditText(data.text);
    }
  }, [data.text, isEditing]);

  // Auto-enter edit mode if selected and text is "Insert text" (implies new text)
  useEffect(() => {
    if (isSelected && data.text === "Insert text" && !isEditing) {
      setIsEditing(true);
    }
  }, [isSelected, data.text]); 

  // Auto-focus and select all text when entering edit mode
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      // Only select if it's the placeholder
      if (editText === "Insert text") {
        textAreaRef.current.select();
      }
    }
  }, [isEditing]);

  const textWidth = data.width || 150;
  const textHeight = data.height || 50;
  const rotation = data.rotation || 0;

  // Click outside to exit editing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && nodeRef.current.contains(e.target as Node)) return;
      if (isEditing) finishEditing();
    };

    if (isSelected || isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelected, isEditing, editText]); 

  const finishEditing = () => {
      const trimmed = editText.trim();
      if (trimmed.length === 0) {
        setEditText(data.text || "Insert text");
        onUpdate(data.id, { text: data.text || "Insert text" });
      } else {
        onUpdate(data.id, { text: trimmed });
      }
      setIsEditing(false);
  };

  // Improved Drag Handler
  const handleDrag = (e: React.MouseEvent) => {
    // If we are clicking inside the textarea while editing, let the textarea handle it
    if (isEditing && e.target === textAreaRef.current) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    // Select on click
    if (!isSelected) {
      onSelect(data.id);
    }

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
          newWidth = Math.max(30, startWidth - deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newX = startXPos + deltaX;
          newY = startYPos + deltaY;
          break;
        case "top":
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startYPos + deltaY;
          break;
        case "top-right":
          newWidth = Math.max(30, startWidth + deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startYPos + deltaY;
          break;
        case "right":
          newWidth = Math.max(30, startWidth + deltaX);
          break;
        case "bottom-right":
          newWidth = Math.max(30, startWidth + deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case "bottom":
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case "bottom-left":
          newWidth = Math.max(30, startWidth - deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          newX = startXPos + deltaX;
          break;
        case "left":
          newWidth = Math.max(30, startWidth - deltaX);
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
      className="absolute"
      style={{
        left: `${data.x * scale}px`,
        top: `${data.y * scale}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        zIndex: isSelected || isEditing ? 100 : 10,
      }}
      onMouseDown={handleDrag}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <div
        className={`relative ${
          isSelected || isEditing 
            ? "ring-2 ring-blue-500 shadow-md" 
            : "hover:ring-1 hover:ring-blue-300 cursor-move"
        } rounded-sm transition-all`}
        style={{
          width: `${textWidth}px`,
          height: `${textHeight}px`,
          padding: "4px",
          backgroundColor: data.bgColor || "transparent",
          opacity: (data.opacity || 100) / 100,
        }}
      >
        {/* Editable Text */}
        {isEditing ? (
          <textarea
            ref={textAreaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-full bg-transparent outline-none resize-none overflow-hidden"
            style={{
              fontSize: data.fontSize,
              color: data.color,
              fontFamily: data.font || "Arial",
              fontWeight: data.bold ? "bold" : "normal",
              fontStyle: data.italic ? "italic" : "normal",
              textDecoration: data.underline ? "underline" : "none",
              textAlign: data.align || "left",
              lineHeight: "1.2",
            }}
          />
        ) : (
          <div
            className="w-full h-full overflow-hidden select-none whitespace-pre-wrap break-words"
            style={{
              fontSize: data.fontSize,
              color: data.color,
              fontFamily: data.font || "Arial",
              fontWeight: data.bold ? "bold" : "normal",
              fontStyle: data.italic ? "italic" : "normal",
              textDecoration: data.underline ? "underline" : "none",
              textAlign: data.align || "left",
              lineHeight: "1.2",
            }}
          >
            {data.text || "Insert text"}
          </div>
        )}

        {/* SELECTION HANDLES - Always show if selected */}
        {isSelected && (
          <SelectionHandles
            rotation={rotation}
            onResize={handleResize}
            onRotate={handleRotate}
            onDelete={() => onDelete(data.id)}
          />
        )}
      </div>
    </div>
  );
}
