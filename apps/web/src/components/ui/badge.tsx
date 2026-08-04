import { ReactNode } from "react";

type Tone = "accent" | "navy" | "soft";

const tones: Record<Tone, string> = {
  accent: "bg-[var(--tcc-green)] text-white",
  navy: "bg-[var(--tcc-navy)] text-white",
  soft: "bg-[var(--tcc-bg-alt)] text-[var(--tcc-navy)]",
};

export function Badge({ tone = "accent", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-[var(--radius-pill)] font-primary text-xs font-semibold uppercase tracking-[var(--ls-nav,0.5px)] leading-relaxed ${tones[tone]}`}>
      {children}
    </span>
  );
}
