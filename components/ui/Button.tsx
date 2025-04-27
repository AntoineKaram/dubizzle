"use client";

import { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: Variant;
  href?: string;
}

export default function Button({
  loading = false,
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center cursor-pointer justify-center gap-2 px-6 py-3 font-semibold text-white transition rounded-md";
  const variants: Record<Variant, string> = {
    primary: "bg-red-600 hover:bg-red-700",
    secondary: "bg-black hover:bg-gray-800",
  };
  const disabledClass = "bg-gray-400 cursor-not-allowed";
  const computedClass = `${baseClass} ${
    loading ? disabledClass : variants[variant]
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={computedClass}>
        {loading && <FaSpinner className="animate-spin" />}
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={loading || props.disabled}
      className={computedClass}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin" />}
      {children}
    </button>
  );
}
