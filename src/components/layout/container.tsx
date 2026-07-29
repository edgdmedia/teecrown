import { ReactNode, CSSProperties } from "react";

export function Container({ children, style, className = "" }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={className} style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)', ...style }}>
      {children}
    </div>
  );
}
