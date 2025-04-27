"use client";

import { ReactNode } from "react";

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
      className={`min-h-215 flex items-center justify-center bg-app px-4 ${className}`}
    >
        {children}
    </div>
  );
}
