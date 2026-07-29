"use client";

import { PageShell } from "@/components/layout/page-shell";
import { services } from "@/data/services";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/layout/cta-band";
import { SVC_ICONS } from "@/components/sections/icons";

function ServiceRow({ s, flip, onContact }: { s: typeof services[0]; flip: boolean; onContact: () => void }) {
  const media = (
    <Reveal style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)' }}>
      <img src={s.image} alt={s.title} style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
    </Reveal>
  );
  const body = (
    <div>
      <Reveal>
        <div style={{ width: '58px', height: '58px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,206,112,0.12)', color: 'var(--color-primary)', marginBottom: '18px' }}>{SVC_ICONS[s.title]}</div>
      </Reveal>
      <Reveal delay={60}><Heading style={{ fontSize: 'clamp(26px,3vw,34px)' }}>{s.title}</Heading></Reveal>
      <Reveal delay={120}><p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.75, marginTop: '14px' }}>{s.description}</p></Reveal>
      <Reveal delay={180}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0 26px', display: 'grid', gap: '12px' }}>
          {s.details.map((d) => (
            <li key={d} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--color-text-strong)', fontSize: '15px', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--color-accent-dark)', fontWeight: 700, flex: '0 0 auto' }}>✓</span>{d}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={240}><Button variant="accent" onClick={onContact}>Enquire about {s.title.split(' ')[0]}</Button></Reveal>
    </div>
  );
  return (
    <div className="tcc-split">
      {flip ? <>{body}{media}</> : <>{media}{body}</>}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <PageShell current="Services">
      {({ openContact }) => (
        <>
          <PageHero eyebrow="What we do" title="Everything your trip needs, in one place" lede="From the first fare search to the visa stamp in your passport, our consultants carry the load so you can focus on the journey ahead." />
          {services.map((s, i) => (
            <Section key={s.title} tint={i % 2 ? 'alt' : undefined}>
              <ServiceRow s={s} flip={i % 2 === 1} onContact={openContact} />
            </Section>
          ))}
          <CtaBand onContact={openContact} title="Not sure where to start?" text="Tell us what you need and our consultants will point you the right way — no obligation, no jargon." cta="Talk to a consultant" />
        </>
      )}
    </PageShell>
  );
}
