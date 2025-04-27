"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full p-3 border border-gray-300 rounded-md transition ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
