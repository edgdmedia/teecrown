"use client";

import { contact, waLink } from "@/data/contact";
import { services } from "@/data/services";
import { SocialIcons, ContactIcon } from "@/components/ui/contact-icons";

interface SiteFooterProps {
  onContact?: () => void;
}

const col = (title: string, items: React.ReactNode) => (
  <div>
    <h4 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '0.3px', margin: '0 0 16px' }}>{title}</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{items}</div>
  </div>
);

export function SiteFooter({ onContact }: SiteFooterProps) {
  const link = (label: string, href?: string, onClick?: (e: React.MouseEvent) => void) => (
    <a key={label} href={href || '#'} onClick={onClick}
      target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener"
      style={{ color: 'rgba(255,255,255,0.66)', fontSize: '14px', textDecoration: 'none', transition: 'color .2s ease', cursor: 'pointer' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.66)')}
    >{label}</a>
  );

  return (
    <footer style={{ background: 'var(--tcc-ink)', color: '#fff' }}>
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '64px var(--container-padding) 30px' }}>
        <div className="tcc-foot">
          <div>
            <img src="/images/logo-landscape.webp" alt="Tee'Crown Consult" style={{ height: '46px', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '18px' }} />
            <p style={{ color: 'rgba(255,255,255,0.66)', fontSize: '14px', lineHeight: 1.7, maxWidth: '320px', margin: 0 }}>A wholly indigenous Nigerian travel &amp; tourism company, promoting sustainable and responsible tourism. Your trusted partner for global travel experiences.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <SocialIcons />
            </div>
          </div>
          {col('Services', services.map((s) => link(s.title, '/services')))}
          {col('Explore', [
            link('Tours & Packages', '/tours'),
            link('About Us', '/about'),
            link('Stories & Guides', '/blog'),
            link('Book a Trip', '#', (e) => { e.preventDefault(); onContact?.(); }),
          ])}
          {col('Get in touch', [
            <div key="a" style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.66)', fontSize: '14px', lineHeight: 1.6 }}><ContactIcon type="address" /><span>{contact.address}</span></div>,
            <a key="p" href={'tel:' + contact.phoneIntl} style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.66)', fontSize: '14px', textDecoration: 'none', transition: 'color .2s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.66)')}
            ><ContactIcon type="phone" /><span>{contact.phone}</span></a>,
            <a key="w" href={waLink()} target="_blank" rel="noopener" style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.66)', fontSize: '14px', textDecoration: 'none', transition: 'color .2s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.66)')}
            ><ContactIcon type="whatsapp" /><span>Chat on WhatsApp</span></a>,
            <a key="e" href={'mailto:' + contact.email} style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.66)', fontSize: '14px', textDecoration: 'none', transition: 'color .2s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.66)')}
            ><ContactIcon type="email" /><span>{contact.email}</span></a>,
          ])}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '44px', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          <span>&copy; {new Date().getFullYear()} Tee'Crown Consult Limited. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '20px' }}>
            {link('Terms of Use')}{link('Privacy Policy')}
          </span>
        </div>
      </div>
    </footer>
  );
}
