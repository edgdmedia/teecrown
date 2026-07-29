import { ReactNode, CSSProperties } from "react";

interface HeadingProps {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
  style?: CSSProperties;
}

export function Heading({ children, light, center, style }: HeadingProps) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-primary)', fontWeight: 700, lineHeight: 1.18,
      fontSize: 'clamp(30px, 3.6vw, 42px)', margin: 0,
      color: light ? '#fff' : 'var(--color-heading)',
      textAlign: center ? 'center' : 'left',
      textWrap: 'balance', ...style,
    }}>{children}</h2>
  );
}
