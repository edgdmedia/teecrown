import { ReactNode, CSSProperties } from "react";
import { Container } from "@/components/layout/container";

interface SectionProps {
  children: ReactNode;
  tint?: "blue" | "alt";
  id?: string;
  style?: CSSProperties;
}

export function Section({ children, tint, id, style }: SectionProps) {
  const bg = tint === 'blue' ? 'var(--tcc-tint-blue)' : tint === 'alt' ? 'var(--color-bg-alt)' : 'var(--color-bg)';
  return (
    <section id={id} style={{ padding: 'var(--section-pad-lg) 0', background: bg, ...style }}>
      <Container>{children}</Container>
    </section>
  );
}
