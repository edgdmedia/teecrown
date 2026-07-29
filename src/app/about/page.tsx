"use client";

import { PageShell } from "@/components/layout/page-shell";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { CtaBand } from "@/components/layout/cta-band";
import { reasons } from "@/data/reasons";
import { ReasonIcon } from "@/components/sections/icons";

const story = [
  "Tee'Crown Consult Limited is a wholly indigenous travel and tourism company registered in Nigeria and based in Lagos. Our commitment to responsible tourism sets us apart — we believe travel should be enjoyable, sustainable, and beneficial to the communities that host us.",
  "We work closely with local communities to ensure that the benefits of tourism are shared equitably, and we are dedicated to preserving the uniquely rich heritage of Nigeria for generations to come.",
  "At TCC, every traveller is unique. From leisure vacations to corporate travel, pilgrimage tours to medical tourism, we craft personalised travel solutions handled with genuine professionalism and care.",
];

export default function AboutPage() {
  return (
    <PageShell current="About">
      {({ openContact }) => (
        <>
          <PageHero
            eyebrow="About Tee'Crown"
            title="Travel with people who genuinely care"
            lede="A proudly Nigerian team on a mission to make global travel simple, responsible and unforgettable."
          />

          <Section>
            <div className="tcc-split">
              <Reveal style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)' }}>
                <img src="/images/kenya1.webp" alt="Our travellers" style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block' }} />
              </Reveal>
              <div>
                <Reveal><Eyebrow>Who we are</Eyebrow></Reveal>
                <Reveal delay={60}><Heading>Your trusted partner for global travel</Heading></Reveal>
                {story.map((p, i) => (
                  <Reveal key={i} delay={120 + i * 60}>
                    <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-text)', marginTop: '16px' }}>
                      {i === 0 && <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '58px', fontWeight: 700, float: 'left', lineHeight: 0.85, margin: '6px 14px 0 0', color: 'var(--color-primary)' }}>T</span>}
                      {i === 0 ? p.slice(1) : p}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </Section>

          <Section tint="alt">
            <Reveal><Eyebrow center>What drives us</Eyebrow></Reveal>
            <Reveal delay={60}><Heading center>Vision & mission</Heading></Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: 'var(--space-lg)' }}>
              {[
                { tag: 'Our Vision', title: 'To lead travel & tourism in Africa', text: 'Known across the continent for sustainability, innovation and exceptional customer service — setting the standard for how travel should feel.' },
                { tag: 'Our Mission', title: 'Memorable journeys, handled with care', text: 'To deliver seamless, personalised travel experiences that are responsible by design, giving every client confidence from first enquiry to safe return.' },
              ].map((c, n) => (
                <Reveal key={c.tag} delay={n * 100}>
                  <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '38px 34px', boxShadow: 'var(--shadow-card)', height: '100%', borderTop: '4px solid var(--color-accent)' }}>
                    <Eyebrow>{c.tag}</Eyebrow>
                    <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '24px', margin: '0 0 12px', lineHeight: 1.25 }}>{c.title}</h3>
                    <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.75, margin: 0 }}>{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section>
            <Reveal><Eyebrow center>Our values</Eyebrow></Reveal>
            <Reveal delay={60}><Heading center>Why travellers choose Tee'Crown</Heading></Reveal>
            <div className="tcc-grid-4" style={{ marginTop: 'var(--space-lg)' }}>
              {reasons.map((r, n) => (
                <Reveal key={r.title} delay={n * 90}>
                  <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '30px 26px', boxShadow: 'var(--shadow-card)', height: '100%' }}>
                    <div style={{ marginBottom: '14px' }}><ReasonIcon title={r.title} /></div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '18px', margin: '0 0 8px' }}>{r.title}</h3>
                    <p style={{ color: 'var(--color-text)', fontSize: '14.5px', lineHeight: 1.65, margin: 0 }}>{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
            <div style={{ position: 'absolute', inset: 0, background: "url('/images/pilgrimage1.webp') center/cover no-repeat" }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,80,0.9), rgba(0,11,36,0.75))' }} />
            <Container style={{ position: 'relative', padding: '80px var(--container-padding)', maxWidth: '820px', textAlign: 'center' }}>
              <Reveal><Eyebrow center light>Responsible tourism</Eyebrow></Reveal>
              <Reveal delay={60}><Heading light center>Tourism that gives back</Heading></Reveal>
              <Reveal delay={120}><p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', lineHeight: 1.8, marginTop: '18px' }}>From our community engagement in Makoko to sustainable itinerary design, we use tourism as a platform for measurable social impact — because the places we love deserve to thrive long after we leave.</p></Reveal>
            </Container>
          </section>

          <CtaBand onContact={openContact} title="Let's plan your next journey" cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
