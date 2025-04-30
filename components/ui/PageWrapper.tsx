"use client";

import React, { ReactNode } from "react";
import AnimatedBackground from "./AnimatedBackground";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  return (
    <div
      className={`min-h-215 flex items-center justify-center bg-app pt-16 px-4 ${className}`}
    >
      <AnimatedBackground />
      <div className="relative z-10 p-6 w-screen flex justify-center">
        {children}
      </div>
    </div>
  );
}
