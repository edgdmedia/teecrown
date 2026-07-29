"use client";

import { useState, useEffect } from "react";
import { packages } from "@/data/packages";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { PackageCard } from "@/components/cards/package-card";
import { Button } from "@/components/ui/button";

function useCarousel(count: number) {
  const [perView, setPerView] = useState(3);
  const [i, setI] = useState(0);
  useEffect(() => {
    const calc = () => setPerView(window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  const maxI = Math.max(0, count - perView);
  useEffect(() => { setI((v) => Math.min(v, maxI)); }, [maxI]);
  return { perView, i, maxI, prev: () => setI((v) => Math.max(0, v - 1)), next: () => setI((v) => Math.min(maxI, v + 1)), go: setI };
}

function CarArrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={dir === 'prev' ? 'Previous' : 'Next'} style={{
      width: '46px', height: '46px', borderRadius: '50%', flex: '0 0 auto', cursor: disabled ? 'default' : 'pointer',
      border: '1.5px solid var(--color-border)', background: '#fff', color: 'var(--color-primary)',
      fontSize: '22px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.35 : 1, transition: 'all .25s ease', boxShadow: 'var(--shadow-card)',
    }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-primary)'; }}
    >{dir === 'prev' ? '‹' : '›'}</button>
  );
}

export function ToursSection() {
  const d = packages;
  const c = useCarousel(d.length);
  const step = 100 / c.perView;

  return (
    <section id="tours" style={{ padding: 'var(--section-pad-lg) 0', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)' }}>
        <div className="tcc-head-row" style={{ marginBottom: 'var(--space-lg)' }}>
          <div>
            <Reveal><Eyebrow>Curated tour packages</Eyebrow></Reveal>
            <Reveal delay={60}><Heading>Where would you like to go?</Heading></Reveal>
          </div>
          <Reveal delay={120} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CarArrow dir="prev" onClick={c.prev} disabled={c.i === 0} />
            <CarArrow dir="next" onClick={c.next} disabled={c.i >= c.maxI} />
          </Reveal>
        </div>
        <Reveal style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '0', transform: `translateX(-${c.i * step}%)`, transition: 'transform .55s cubic-bezier(.22,.61,.36,1)' }}>
            {d.map((p) => (
              <div key={p.slug} style={{ flex: `0 0 ${step}%`, padding: '0 12px', boxSizing: 'border-box' }}>
                <div style={{ position: 'relative', height: '100%' }}>
                  <span style={{ position: 'absolute', top: '14px', left: '26px', zIndex: 2 }}><Badge tone="navy">{p.tag}</Badge></span>
                  <PackageCard image={p.image} title={p.title} location={p.location} excerpt={p.excerpt} ctaLabel="View details" href={`/tours/${p.slug}`} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
          {Array.from({ length: c.maxI + 1 }).map((_, n) => (
            <button key={n} onClick={() => c.go(n)} aria-label={`Page ${n + 1}`}
              style={{ width: n === c.i ? '26px' : '9px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: n === c.i ? 'var(--color-accent)' : 'var(--tcc-border)', transition: 'all .35s ease' }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
          <Button variant="link" href="/tours">View all tours &amp; packages &rarr;</Button>
        </div>
      </div>
    </section>
  );
}
