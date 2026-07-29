import Link from "next/link";

interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readMoreLabel?: string;
  href: string;
}

export function BlogCard({ image, category, title, excerpt, date, readMoreLabel = "Read more", href }: BlogCardProps) {
  return (
    <article style={{ background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'all .3s ease', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
        <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {category && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: 'var(--color-text)' }}>{category}</span>
          </div>
        )}
        <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '18px', lineHeight: 1.3, margin: '0 0 10px' }}>{title}</h3>
        <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text)', fontSize: '14px', lineHeight: 1.65, margin: '0 0 16px', flex: 1 }}>{excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: 'var(--color-text-light)', fontSize: '13px' }}>{date}</span>
          <Link href={href} style={{ fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none' }}>{readMoreLabel}</Link>
        </div>
      </div>
    </article>
  );
}
