import { ReactNode, CSSProperties } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  style?: CSSProperties;
}

export function ServiceCard({ icon, title, description, style }: ServiceCardProps) {
  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius)', textAlign: 'center',
      boxShadow: 'var(--shadow-card)', transition: 'all .3s ease',
      height: '100%', padding: '30px 24px', ...style,
    }}>
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '19px', margin: '0 0 10px', lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>{description}</p>
    </div>
  );
}
