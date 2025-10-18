// src/components/ui/textarea.tsx
"use client";
import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { className = "", ...rest } = props;
    return (
      <textarea
        ref={ref}
        {...rest}
        className={`min-h-[120px] resize-none outline-none ${className}`}
      />
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
export default Textarea;
