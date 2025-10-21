"use client";
import React, { useRef, useState } from "react";
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
          background: "rgba(255,255,255,0.8)",
          borderRadius: "2px",
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowControls(true);
        }}
      >
        <Image
          src={data.image}
          alt="Signature"
          height={10}
          width={10}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        {showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 z-30"
            style={{ pointerEvents: "auto" }}
            aria-label="Delete signature"
          >
            ×
          </button>
        )}
      </div>
    </Draggable>
  );
}