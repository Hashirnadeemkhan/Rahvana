"use client";

import React, { useEffect, useState } from "react";

interface FieldOverlayProps {
  fields: { x: number; y: number; width: number; height: number }[];
}

const FieldOverlay: React.FC<FieldOverlayProps> = ({ fields }) => {
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    setValues(new Array(fields.length).fill(""));
  }, [fields]);

  const handleChange = (index: number, val: string) => {
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);
  };

  return (
    <>
      {fields.map((field, i) => (
        <input
          key={i}
          type="text"
          value={values[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          style={{
            position: "absolute",
            left: field.x,
            top: field.y,
            width: field.width,
            height: field.height,
            border: "1px solid red",
            background: "rgba(255,255,255,0.3)",
          }}
        />
      ))}
    </>
  );
};

export default FieldOverlay;
