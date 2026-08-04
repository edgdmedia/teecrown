"use client";

import Link from "next/link";

type Variant = "primary" | "accent" | "outline" | "white" | "link" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-[var(--tcc-navy)] text-white hover:bg-[var(--tcc-navy-dark)]",
  accent: "bg-[var(--tcc-green)] text-white hover:bg-[var(--tcc-green-dark)]",
  outline: "bg-transparent text-[var(--tcc-navy)] border-2 border-[var(--tcc-navy)] hover:bg-[var(--tcc-navy)] hover:text-white",
  white: "bg-white text-[var(--tcc-navy)] hover:bg-[var(--tcc-navy)] hover:text-white",
  link: "bg-none text-[var(--tcc-navy)] hover:text-[var(--tcc-green-dark)] p-0 font-semibold font-primary",
  ghost: "bg-transparent text-[var(--tcc-navy)] hover:bg-[var(--tcc-bg-alt)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3 text-base",
  lg: "px-10 py-4 text-lg",
};

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function Button({ variant = "primary", size = "md", href, disabled, onClick, type = "button", className = "", style, children, target, rel }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-accent font-medium rounded-[var(--radius-btn)] no-underline transition-all duration-300 whitespace-nowrap cursor-pointer border-none";

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`} style={style}>
      {children}
    </button>
  );
}
