"use client";

import React, { ReactNode } from "react";

type Variant = "info" | "success" | "warning" | "error";

interface MessageProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Message({
  children,
  variant = "info",
  className = "",
  ...props
}: MessageProps) {
  const baseClass = "text-sm text-center animate-fade-in";

  const variants: Record<Variant, string> = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  const computedClass = `${baseClass} ${variants[variant]} ${className}`;

  return (
    <p className={computedClass} {...props}>
      {children}
    </p>
  );
}
