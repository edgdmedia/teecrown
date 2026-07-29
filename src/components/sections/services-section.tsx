"use client";

import { services } from "@/data/services";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";
import { ServiceCard } from "@/components/cards/service-card";
import { Button } from "@/components/ui/button";
import { SvcIcon } from "@/components/sections/icons";

interface ServicesSectionProps {
  onContact?: () => void;
}

export function ServicesSection({ onContact }: ServicesSectionProps) {
  return (
    <section id="services" style={{ padding: 'var(--section-pad-lg) 0', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)' }}>
        <Reveal><Eyebrow center>What we do</Eyebrow></Reveal>
        <Reveal delay={60}><Heading center>Everything your trip needs, in one place</Heading></Reveal>
        <Reveal delay={120}>
          <p style={{ textAlign: 'center', maxWidth: '640px', margin: '16px auto 0', color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.7 }}>
            From the first fare search to the visa stamp in your passport, our consultants carry the load so you can focus on the journey ahead.
          </p>
        </Reveal>
        <div className="tcc-grid-4" style={{ marginTop: 'var(--space-lg)' }}>
          {services.map((s, n) => (
            <Reveal key={s.title} delay={n * 90} style={{ height: '100%' }}>
              <ServiceCard icon={<SvcIcon title={s.title} />} title={s.title} description={s.description} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <Button variant="accent" onClick={onContact}>Talk to a travel consultant</Button>
        </Reveal>
      </div>
    </section>
  );
}
