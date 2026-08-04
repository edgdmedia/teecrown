"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/data/blog";

interface HeroProps {
  onContact?: () => void;
  onExplore?: () => void;
}

export function Hero({ onContact, onExplore }: HeroProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {heroSlides.map((src, n) => (
        <div key={src} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: n === i ? 1 : 0,
          transition: 'opacity 1.6s ease',
          transform: n === i ? 'scale(1.08)' : 'scale(1)',
          transitionProperty: 'opacity, transform',
          transitionDuration: '1.6s, 7s',
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(0,0,50,0.86) 0%, rgba(0,0,80,0.6) 45%, rgba(0,11,36,0.35) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,11,36,0.75), transparent 40%)' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 'var(--container-width)', margin: '0 auto', padding: '90px var(--container-padding) 40px' }}>
        <div style={{ maxWidth: '760px' }}>
          <div className="tcc-fade-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', borderRadius: '999px', padding: '7px 16px', marginBottom: '22px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 0 4px rgba(97,206,112,0.3)' }} />
            <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '12.5px', letterSpacing: '0.8px', textTransform: 'uppercase', color: '#fff', fontWeight: 500 }}>Your trusted partner for global travel</span>
          </div>
          <h1 className="tcc-fade-2" style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(40px, 6vw, 74px)', lineHeight: 1.04, margin: 0, textWrap: 'balance', letterSpacing: '-0.5px' }}>
            Let the Journey<br /><span style={{ color: 'var(--color-accent)' }}>Begin.</span>
          </h1>
          <p className="tcc-fade-3" style={{ fontFamily: 'var(--font-accent)', color: 'rgba(255,255,255,0.92)', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.6, margin: '22px 0 34px', maxWidth: '560px' }}>
            Flights, visas, insurance and unforgettable tours — handled end to end by a proudly Nigerian team who treat every trip as their own.
          </p>
          <div className="tcc-fade-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <Button variant="accent" size="lg" onClick={onContact}>Book</Button>
            <Button variant="white" size="lg" onClick={onExplore}
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(6px)' }}
            >Explore</Button>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '26px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
        {heroSlides.map((_, n) => (
          <button key={n} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`}
            style={{ width: n === i ? '30px' : '10px', height: '5px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: n === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.45)', transition: 'all .4s ease' }}
          />
        ))}
      </div>
    </section>
  );
}
