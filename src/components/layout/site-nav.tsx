"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Tours', href: '/tours' },
  { label: 'Blog', href: '/blog' },
];

interface SiteNavProps {
  scrolled?: boolean;
  solid?: boolean;
  current?: string;
  onContact?: () => void;
}

export function SiteNav({ scrolled: scrolledProp, solid, current, onContact }: SiteNavProps) {
  const pathname = usePathname();
  const [scrolledState, setScrolledState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (scrolledProp !== undefined) return;
    const onScroll = () => setScrolledState(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolledProp]);

  const scrolled = scrolledProp !== undefined ? scrolledProp : scrolledState;
  const isSolid = solid || scrolled;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: isSolid ? 'rgba(255,255,255,0.96)' : 'transparent',
      backdropFilter: isSolid ? 'blur(12px)' : 'none',
      borderBottom: `1px solid ${isSolid ? 'var(--color-border)' : 'transparent'}`,
      boxShadow: isSolid ? 'var(--shadow-header)' : 'none',
      transition: 'all .35s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: 'var(--container-width)', margin: '0 auto',
        padding: '0 var(--container-padding)',
        height: isSolid ? '68px' : '84px', transition: 'height .35s ease',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
          <img src="/images/logo-landscape.png" alt="Tee'Crown Consult"
            style={{ height: '44px', width: 'auto', display: 'block',
              filter: isSolid ? 'none' : 'brightness(0) invert(1)',
              transition: 'filter .35s ease' }}
          />
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="max-lg:hidden">
          {links.map((l) => {
            const active = current
              ? current === l.label
              : isActive(l.href);
            return (
              <Link key={l.label} href={l.href}
                className="tcc-navlink"
                style={{
                  fontFamily: 'var(--font-secondary)', fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  color: active
                    ? (isSolid ? 'var(--color-primary)' : '#fff')
                    : (isSolid ? 'var(--color-text-strong)' : 'rgba(255,255,255,0.92)'),
                  textTransform: 'uppercase', letterSpacing: '0.6px',
                  textDecoration: 'none', padding: '6px 0',
                }}
              >{l.label}</Link>
            );
          })}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto' }} className="max-lg:hidden">
          <Button variant="accent" size="sm" onClick={onContact}>Book</Button>
        </div>
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', color: isSolid ? 'var(--color-primary)' : '#fff',
            fontSize: '26px', lineHeight: 1,
          }}
          className="lg:hidden"
        >{menuOpen ? '✕' : '☰'}</button>
      </div>
      {menuOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid var(--color-border)',
          padding: '16px var(--container-padding) 24px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {links.map((l) => {
            const active = current
              ? current === l.label
              : isActive(l.href);
            return (
              <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-secondary)', textTransform: 'uppercase',
                  letterSpacing: '0.6px', fontSize: '14px',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--color-primary)' : 'var(--color-text-strong)',
                  textDecoration: 'none', padding: '12px 0',
                  borderBottom: '1px solid var(--color-bg-alt)',
                }}
              >{l.label}</Link>
            );
          })}
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
            <Button variant="accent" size="sm" onClick={() => { setMenuOpen(false); onContact?.(); }} style={{ flex: 1 }}>Book</Button>
          </div>
        </div>
      )}
    </header>
  );
}
