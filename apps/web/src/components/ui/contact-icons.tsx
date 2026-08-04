import { contact } from "@/data/contact";

export function SocialIcons() {
  const icons: Record<string, React.ReactNode> = {
    Facebook: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" />
      </svg>
    ),
    Instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
        <rect x="3" y="3" width="18" height="18" rx="5" /><path d="M16.5 7.5v0" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
    X: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
        <path d="M4 4l6.2 8.3L4 20h2.3l5-5.6L15.7 20H20l-6.7-9.2L19.5 4h-2.3l-4.6 5.4L8 4H4Z" />
      </svg>
    ),
    YouTube: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
        <path d="M22.5 7.5a2.9 2.9 0 0 0-2-2C18.7 5 12 5 12 5s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 1 12a30 30 0 0 0 .5 4.5 2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 23 12a30 30 0 0 0-.5-4.5Z" /><path d="m9.5 9 6 3-6 3V9Z" />
      </svg>
    ),
  };

  return (
    <>
      {Object.entries(contact.social).map(([name, href]) => (
        <a key={name} href={href} target="_blank" rel="noopener" title={name}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: '#fff', textDecoration: 'none', transition: 'background .25s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >{icons[name] || name[0]}</a>
      ))}
    </>
  );
}

export function ContactIcon({ type }: { type: 'address' | 'phone' | 'whatsapp' | 'email' }) {
  const icon = () => {
    switch (type) {
      case 'address':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
          </svg>
        );
      case 'phone':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
            <path d="M22 16.9v1.1a2 2 0 0 1-2 2h-1.5A13.5 13.5 0 0 1 4 6.5V5a2 2 0 0 1 2-2h1.1a1 1 0 0 1 1 .9l.5 3a1 1 0 0 1-.6 1.1L6.5 8.8a10 10 0 0 0 4.7 4.7l1.8-1.5a1 1 0 0 1 1.1-.6l3 .5a1 1 0 0 1 .9 1Z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
            <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.5L3 21l2-5.8A8.5 8.5 0 1 1 21 11.5Z" /><path d="M9.5 10.5a9 9 0 0 1 4 4" />
          </svg>
        );
      case 'email':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
            <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
          </svg>
        );
    }
  };

  return <>{icon()}</>;
}
