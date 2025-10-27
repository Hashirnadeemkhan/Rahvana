"use client";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

type PlacedText = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  pageIndex: number;
  color: string;
};

export default function DraggableText({
  data,
  onUpdate,
  onDelete,
  scale,
}: {
  data: PlacedText;
  onUpdate: (id: string, patch: Partial<PlacedText>) => void;
  onDelete: (id: string) => void;
  scale: number;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={{ x: data.x * scale, y: data.y * scale }}
      onStop={(_, d) => {
        onUpdate(data.id, { x: d.x / scale, y: d.y / scale });
      }}
      disabled={isEditing}
    >
      <div
        ref={nodeRef}
        className="absolute group"
        style={{
          left: 0,
          top: 0,
          cursor: isEditing ? "text" : "move",
          pointerEvents: "auto",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsSelected(true);
          setIsEditing(true); // Enable editing on single click
        }}
        // Removed onDoubleClick handler since it's no longer needed
      >
        {/* Blue Border Box (SmallPDF style) */}
        <div
          className={`relative border-2 rounded transition-all ${
            isSelected
              ? "border-blue-500 bg-transparent"
              : "border-transparent bg-transparent group-hover:border-blue-300"
          }`}
          style={{
            minWidth: "80px",
            minHeight: "30px",
            padding: "6px 10px",
          }}
        >
          {/* Text or Input Field */}
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => {
                if (editText.trim()) {
                  onUpdate(data.id, { text: editText });
                }
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (editText.trim()) {
                    onUpdate(data.id, { text: editText });
                  }
                  setIsEditing(false);
                }
                if (e.key === "Escape") {
                  setEditText(data.text);
                  setIsEditing(false);
                }
              }}
              autoFocus
              className="w-full bg-transparent outline-none"
              style={{
                fontSize: `${data.fontSize}px`,
                color: data.color,
                fontFamily: "Arial, sans-serif",
              }}
            />
          ) : (
            <span
              style={{
                fontSize: `${data.fontSize}px`,
                color: data.color,
                fontFamily: "Arial, sans-serif",
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {data.text || "Insert text here"}
            </span>
          )}

          {/* Delete Button (Top Right Corner) */}
          {isSelected && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg z-50 transition-transform hover:scale-110"
              title="Delete"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Control Toolbar (Bottom) - SmallPDF Style */}
          {isSelected && !isEditing && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-2 py-1.5 flex items-center gap-2 z-50">
              {/* Font Size Controls */}
              <div className="flex items-center gap-1 border-r pr-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(data.id, { fontSize: Math.max(8, data.fontSize - 2) });
                  }}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold transition"
                  title="Decrease font size"
                >
                  −
                </button>
                <span className="text-xs font-medium min-w-[30px] text-center">
                  {data.fontSize}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(data.id, { fontSize: Math.min(72, data.fontSize + 2) });
                  }}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold transition"
                  title="Increase font size"
                >
                  +
                </button>
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={data.color}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdate(data.id, { color: e.target.value });
                  }}
                  className="w-6 h-6 rounded cursor-pointer"
                  title="Text color"
                />
              </div>

              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="w-6 h-6 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded transition"
                title="Edit text"
              >
                <svg
                  className="w-3 h-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Resize Handles (Bottom Right Corner) */}
        {isSelected && !isEditing && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-50" />
        )}
      </div>
    </Draggable>
  );
}