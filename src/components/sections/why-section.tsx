"use client";

import { reasons } from "@/data/reasons";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";
import { ReasonIcon } from "@/components/sections/icons";

export function WhySection() {
  return (
    <section id="why" style={{ padding: 'var(--section-pad-lg) 0', background: 'var(--tcc-tint-blue)' }}>
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)' }}>
        <div className="tcc-split">
          <Reveal style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)', position: 'relative' }}>
            <img src="/images/tour-vacation.webp" alt="Travellers on a Tee'Crown trip" style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', left: '20px', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '30px' }}>🌍</span>
              <div>
                <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: 'var(--color-heading)', fontSize: '16px' }}>Responsible &amp; sustainable</div>
                <div style={{ color: 'var(--color-text)', fontSize: '13.5px' }}>Tourism that gives back to local communities.</div>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal><Eyebrow>Why Tee'Crown</Eyebrow></Reveal>
            <Reveal delay={60}><Heading>Travel handled with genuine care</Heading></Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginTop: '28px' }}>
              {reasons.map((r, n) => (
                <Reveal key={r.title} delay={n * 90}>
                  <div style={{ marginBottom: '12px' }}><ReasonIcon title={r.title} size={54} /></div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '17px', margin: '0 0 6px' }}>{r.title}</h3>
                  <p style={{ color: 'var(--color-text)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
