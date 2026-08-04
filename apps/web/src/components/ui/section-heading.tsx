import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, text, align = "center", light = false }: SectionHeadingProps) {
  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      {eyebrow && <Eyebrow light={light} center={align === "center"}>{eyebrow}</Eyebrow>}
      <Heading light={light} center={align === "center"}>{title}</Heading>
      {text && <p style={{
        color: light ? 'rgba(255,255,255,0.82)' : 'var(--color-text)',
        fontSize: '16px', lineHeight: 1.7, maxWidth: '640px',
        textAlign: align === "center" ? "center" : "left",
        margin: '16px auto 0',
      }}>{text}</p>}
    </div>
  );
}
