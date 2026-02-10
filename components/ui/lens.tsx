"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  isStatic?: boolean;
  position?: { x: number; y: number };
  hovering: boolean;
  setHovering: (hovering: boolean) => void;
}

export const Lens = ({
  children,
  zoomFactor = 2,
  lensSize = 170,
  isStatic = false,
  position: staticPosition,
  hovering,
  setHovering,
}: LensProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const position = isStatic ? staticPosition || { x: 0, y: 0 } : mousePosition;

  // Extract src if the child is an img
  const getSrc = () => {
    if (React.isValidElement(children)) {
      return (children.props as { src?: string }).src;
    }
    return "";
  };

  const src = getSrc();

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl cursor-none"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10">{children}</div>
      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute pointer-events-none z-50 overflow-hidden rounded-full border-2 border-white shadow-2xl"
            style={{
              width: lensSize,
              height: lensSize,
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
            }}
          >
            <div
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${src})`,
                backgroundSize: `${(containerRef.current?.offsetWidth || 0) * zoomFactor}px ${(containerRef.current?.offsetHeight || 0) * zoomFactor}px`,
                backgroundPosition: `${-position.x * zoomFactor + lensSize / 2}px ${-position.y * zoomFactor + lensSize / 2}px`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
