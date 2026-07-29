import { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
}

export function Eyebrow({ children, light, center }: EyebrowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      justifyContent: center ? 'center' : 'flex-start',
      marginBottom: '14px',
    }}>
      <span style={{ width: '28px', height: '3px', background: 'var(--color-accent)', borderRadius: '2px', flexShrink: 0 }} />
      <span style={{
        fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: 600,
        letterSpacing: '1.5px', textTransform: 'uppercase',
        color: light ? 'var(--color-accent)' : 'var(--color-accent-dark)',
      }}>{children}</span>
    </div>
  );
}
