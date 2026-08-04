"use client";

import { steps } from "@/data/steps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { waLink } from "@/data/contact";

export function StepsSection() {
  return (
    <section id="how" style={{ padding: 'var(--section-pad-lg) 0', background: 'var(--color-bg-alt)' }}>
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)' }}>
        <div className="tcc-split">
          <div>
            <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
            <Reveal delay={60}><Heading>Booking your next trip is simple</Heading></Reveal>
            <Reveal delay={120}>
              <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.75, marginTop: '18px' }}>
                No confusing portals, no jargon. A real person guides you from idea to boarding pass — start the conversation however suits you.
              </p>
            </Reveal>
            <Reveal delay={180} style={{ marginTop: '26px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="accent" href={waLink()} target="_blank" rel="noopener">💬 Start on WhatsApp</Button>
            </Reveal>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map((s, n) => (
              <Reveal key={s.n} delay={n * 110}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#fff', borderRadius: 'var(--radius)', padding: '24px 26px', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '30px', color: 'var(--color-accent)', lineHeight: 1, flex: '0 0 auto', width: '54px' }}>{s.n}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '19px', margin: '0 0 6px' }}>{s.title}</h3>
                    <p style={{ color: 'var(--color-text)', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
