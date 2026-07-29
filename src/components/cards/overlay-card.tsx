"use client";

import { useState } from "react";

interface OverlayCardProps {
  image: string;
  title: string;
  subtitle?: string;
  height?: number;
  onClick?: () => void;
}

export function OverlayCard({ image, title, subtitle, height = 300, onClick }: OverlayCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative block rounded-[var(--radius-card)] overflow-hidden no-underline cursor-pointer transition-shadow duration-300"
      style={{ height, boxShadow: hover ? "var(--shadow-card-hover)" : "var(--shadow-card)" }}
    >
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms]" style={{ transform: hover ? "scale(1.06)" : "scale(1)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,11,36,0.82) 0%, rgba(0,11,36,0.15) 55%, rgba(0,11,36,0) 100%)" }} />
      <div className="absolute inset-0 bg-[var(--tcc-navy)] transition-opacity duration-300" style={{ opacity: hover ? 0.28 : 0 }} />
      <div className="absolute left-0 right-0 bottom-0 p-6">
        <h3 className="font-primary text-white font-bold text-[var(--fs-h4,24px)] leading-tight m-0" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>{title}</h3>
        {subtitle && <p className="text-white/90 text-sm mt-1.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}
