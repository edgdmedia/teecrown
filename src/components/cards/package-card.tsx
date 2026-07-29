import Link from "next/link";

import { CSSProperties } from "react";

interface PackageCardProps {
  image: string;
  title: string;
  location?: string;
  excerpt: string;
  ctaLabel?: string;
  href: string;
  style?: CSSProperties;
}

export function PackageCard({ image, title, location, excerpt, ctaLabel = "View details", href, style }: PackageCardProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all .3s ease', ...style }}>
      <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '19px', margin: '0 0 6px', lineHeight: 1.25 }}>{title}</h3>
        {location && <p style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-text-light)', fontSize: '13.5px', margin: '0 0 12px' }}>{location}</p>}
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.65, margin: '0 0 18px', flex: 1 }}>{excerpt}</p>
        <Link href={href} style={{ fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {ctaLabel} &rarr;
        </Link>
      </div>
    </div>
  );
}
