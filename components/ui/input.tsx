// src/components/ui/input.tsx
"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className = "", ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={`appearance-none outline-none ${className}`}
    />
  );
});

Input.displayName = "Input";
export { Input };
export default Input;
