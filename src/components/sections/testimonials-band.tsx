"use client";

import { useState, useEffect } from "react";
import { testimonials } from "@/data/testimonials";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";

export function TestimonialsBand() {
  const d = testimonials;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % d.length), 6000);
    return () => clearInterval(t);
  }, [d.length]);
  const t = d[i];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, background: "url('/images/hero-beach.webp') center/cover no-repeat" }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,128,0.82), rgba(0,11,36,0.88))' }} />
      <Container style={{ position: 'relative', padding: '84px 0', textAlign: 'center' }}>
        <Reveal><Eyebrow center light>Kind words</Eyebrow></Reveal>
        <Reveal delay={60}><Heading light center>Travellers who trusted us</Heading></Reveal>
        <div style={{ maxWidth: '760px', margin: '30px auto 0', minHeight: '150px' }}>
          <div key={i} className="tcc-fade-in">
            <div style={{ color: 'var(--tcc-star)', fontSize: '20px', letterSpacing: '3px', marginBottom: '16px' }}>{'★'.repeat(t.rating)}</div>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(18px,2.2vw,23px)', lineHeight: 1.6, fontWeight: 500, margin: 0, color: '#fff' }}>&ldquo;{t.text}&rdquo;</p>
            <p style={{ marginTop: '22px', fontWeight: 700, fontSize: '16px' }}>{t.name}<span style={{ display: 'block', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{t.title}</span></p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '26px' }}>
          {d.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Testimonial ${n + 1}`}
              style={{ width: n === i ? '28px' : '9px', height: '5px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: n === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.4)', transition: 'all .4s ease' }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
