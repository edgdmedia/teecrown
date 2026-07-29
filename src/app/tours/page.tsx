"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { packages } from "@/data/packages";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { PackageCard } from "@/components/cards/package-card";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/layout/cta-band";

const allPackages = packages;
const tags = ['All', ...Array.from(new Set(allPackages.map((p) => p.tag)))];

export default function ToursPage() {
  const [tag, setTag] = useState('All');
  const shown = tag === 'All' ? allPackages : allPackages.filter((p) => p.tag === tag);

  return (
    <PageShell current="Tours">
      {({ openContact }) => (
        <>
          <PageHero eyebrow="Curated tour packages" title="Where would you like to go?" lede="Handpicked journeys and bespoke itineraries — every detail planned around you, your budget and your dreams." image="/images/hero-dubai.webp" />
          <Section>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
              {tags.map((t) => {
                const active = t === tag;
                return (
                  <button key={t} onClick={() => setTag(t)} style={{
                    fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.4px',
                    padding: '9px 20px', borderRadius: '999px', cursor: 'pointer', transition: 'all .25s ease',
                    border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: active ? 'var(--color-primary)' : '#fff',
                    color: active ? '#fff' : 'var(--color-text-strong)',
                  }}>{t}</button>
                );
              })}
            </div>
            <div className="tcc-grid-3">
              {shown.map((p, n) => (
                <Reveal key={p.slug} delay={(n % 3) * 80} style={{ height: '100%' }}>
                  <div style={{ position: 'relative', height: '100%' }}>
                    <span style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}><Badge tone="navy">{p.tag}</Badge></span>
                    <PackageCard image={p.image} title={p.title} location={p.location} excerpt={p.excerpt} ctaLabel="View details" href={`/tours/${p.slug}`} style={{ height: '100%' }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>
          <Section tint="blue">
            <div className="tcc-split">
              <div>
                <Reveal><Eyebrow>Can't find your trip?</Eyebrow></Reveal>
                <Reveal delay={60}><Heading>Build a custom itinerary</Heading></Reveal>
                <Reveal delay={120}><p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.75, marginTop: '16px' }}>Every traveller is unique. Share your destination, dates and budget, and our team will design a bespoke journey around exactly what you want — meticulously planned, start to finish.</p></Reveal>
                <Reveal delay={180} style={{ marginTop: '24px' }}><Button variant="accent" onClick={openContact}>Request a custom trip</Button></Reveal>
              </div>
              <Reveal style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)' }}>
                <img src="/images/tour-custom.webp" alt="Custom itinerary" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
              </Reveal>
            </div>
          </Section>
          <CtaBand onContact={openContact} title="Your next adventure starts here" cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
