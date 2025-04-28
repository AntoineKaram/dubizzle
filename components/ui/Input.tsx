"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    const baseClasses = `w-full p-3 border rounded-md focus:outline-none transition`;
    const validClasses = error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 ";

    return (
      <div className="w-full">
        <input
          ref={ref}
          {...props}
          className={`${baseClasses} ${validClasses} ${className}`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
