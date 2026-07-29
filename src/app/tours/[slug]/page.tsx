"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { packages } from "@/data/packages";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageCard } from "@/components/cards/package-card";
import { CtaBand } from "@/components/layout/cta-band";
import { waLink } from "@/data/contact";
import { IncludeIcon } from "@/components/ui/include-icons";
import { Lightbox } from "@/components/ui/lightbox";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '14px' }}>
        {items.map((d) => (
          <li key={d} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--color-text-strong)', fontSize: '15.5px', lineHeight: 1.55 }}>
            <IncludeIcon text={d} />{d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BookingCard({ p, onContact }: { p: typeof packages[0]; onContact: () => void }) {
  return (
    <div style={{ position: 'sticky', top: '90px', background: '#fff', borderRadius: '14px', boxShadow: 'var(--shadow-card-hover)', padding: '30px', border: '1px solid var(--color-border)' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>Interested in this trip?</div>
      <div style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '22px', margin: '8px 0 18px', lineHeight: 1.3 }}>Tailored to your dates & budget</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button variant="accent" onClick={onContact} style={{ width: '100%' }}>Book this trip</Button>
        <Button variant="outline" href={waLink(`Hi Tee'Crown! I'm interested in the ${p.title} package.`)} target="_blank" rel="noopener" style={{ width: '100%' }}>💬 Ask on WhatsApp</Button>
        <a href="tel:+2348113860670" style={{ textAlign: 'center', color: 'var(--color-text-light)', fontSize: '14px', textDecoration: 'none', padding: '6px 0', borderTop: '1px solid var(--color-border)', marginTop: '6px' }}>
          📞 <strong style={{ color: 'var(--color-text-strong)' }}>+234 811 386 0670</strong>
        </a>
      </div>
      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '22px', paddingTop: '18px', display: 'grid', gap: '12px' }}>
        {[['Duration', p.duration], ['Destination', p.location], ['Category', p.tag]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px' }}>
            <span style={{ color: 'var(--color-text-light)' }}>{k}</span>
            <span style={{ color: 'var(--color-text-strong)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery({ p }: { p: typeof packages[0] }) {
  const imgs = p.gallery;
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const next = () => setLbIdx((n) => (n + 1) % imgs.length);
  const prev = () => setLbIdx((n) => (n - 1 + imgs.length) % imgs.length);

  return (
    <Section tint="alt">
      <Reveal><Eyebrow center>A glimpse</Eyebrow></Reveal>
      <Reveal delay={60}><Heading center>{p.title} in pictures</Heading></Reveal>
      <div className="tcc-gallery" style={{ marginTop: 'var(--space-lg)' }}>
        {imgs.map((src, n) => (
          <Reveal key={src + n} delay={n * 90} style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', cursor: 'zoom-in', aspectRatio: '4/3' }}>
            <img
              src={src} alt={`${p.title} ${n + 1}`}
              onClick={() => { setLbIdx(n); setLbOpen(true); }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Reveal>
        ))}
      </div>
      {lbOpen && <Lightbox images={imgs} index={lbIdx} onClose={() => setLbOpen(false)} onPrev={prev} onNext={next} />}
    </Section>
  );
}

function RelatedTours({ slug }: { slug: string }) {
  const rel = packages.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <Section tint="alt">
      <Reveal><Eyebrow center>Keep exploring</Eyebrow></Reveal>
      <Reveal delay={60}><Heading center>Other journeys you might love</Heading></Reveal>
      <div className="tcc-grid-3" style={{ marginTop: 'var(--space-lg)' }}>
        {rel.map((p, n) => (
          <Reveal key={p.slug} delay={n * 80} style={{ height: '100%' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <span style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}><Badge tone="navy">{p.tag}</Badge></span>
              <PackageCard image={p.image} title={p.title} location={p.location} excerpt={p.excerpt} ctaLabel="View details" href={`/tours/${p.slug}`} style={{ height: '100%' }} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) {
    return (
      <PageShell current="Tours">
        {() => (
          <div style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center' }}>
            <Container>
              <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontSize: '28px', fontWeight: 700 }}>Tour not found</h1>
              <p style={{ color: 'var(--color-text)', marginTop: '8px' }}>The package you&apos;re looking for doesn&apos;t exist.</p>
              <Button variant="outline" href="/tours" style={{ marginTop: '24px' }}>Back to tours</Button>
            </Container>
          </div>
        )}
      </PageShell>
    );
  }

  return (
    <PageShell current="Tours">
      {({ openContact }) => (
        <>
          <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${pkg.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,50,0.9), rgba(0,11,36,0.6))' }} />
            <Container style={{ position: 'relative', padding: '140px var(--container-padding) 60px' }}>
              <a href="/tours" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← All tours</a>
              <div style={{ margin: '16px 0 10px' }}><Badge tone="accent">{pkg.tag}</Badge></div>
              <h1 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.08, margin: 0, maxWidth: '760px' }}>{pkg.title}</h1>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
                {[`📍 ${pkg.location}`, `🗓️ ${pkg.duration}`].map((m) => (
                  <span key={m} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', borderRadius: '999px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>{m}</span>
                ))}
              </div>
            </Container>
          </section>
          <Section>
            <div className="tcc-detail" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '48px', alignItems: 'start' }}>
              <div>
                <Reveal><Eyebrow>Overview</Eyebrow></Reveal>
                {pkg.content.intro.map((para, i) => (
                  <Reveal key={i} delay={i * 60}><p style={{ fontSize: '16.5px', lineHeight: 1.8, color: 'var(--color-text)', marginTop: i ? '16px' : '10px' }}>{para}</p></Reveal>
                ))}

                {pkg.content.pricing && (
                  <Reveal>
                    <div style={{ marginTop: '32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>Pricing</h3>
                      <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                        {pkg.content.pricing.map((r, i) => (
                          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 18px', fontSize: '15px', borderTop: i ? '1px solid var(--color-border)' : 'none' }}>
                            <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{r.label}</span>
                            <span style={{ color: 'var(--color-text-strong)', fontWeight: 600, textAlign: 'right' }}>{r.value}</span>
                          </div>
                        ))}
                      </div>
                      {pkg.content.validUntil && (
                        <p style={{ fontSize: '13.5px', color: 'var(--color-text-light)', marginTop: '8px', fontStyle: 'italic' }}>
                          Valid until {pkg.content.validUntil}
                        </p>
                      )}
                    </div>
                  </Reveal>
                )}

                {pkg.content.highlights && (<Reveal><ListBlock title="Trip highlights" items={pkg.content.highlights} /></Reveal>)}
                {pkg.content.included && (<Reveal><ListBlock title="What's included" items={pkg.content.included} /></Reveal>)}

                {pkg.content.requirements && (
                  <Reveal>
                    <div style={{ marginTop: '32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>Requirements</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
                        {pkg.content.requirements.map((d) => (
                          <li key={d} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--color-text-strong)', fontSize: '15.5px', lineHeight: 1.55 }}>
                            <span style={{ color: 'var(--color-accent-dark)', flex: '0 0 auto', fontSize: '16px' }}>•</span>{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                )}

                {pkg.content.itinerary && (
                  <Reveal>
                    <div style={{ marginTop: '32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>Itinerary</h3>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {pkg.content.itinerary.map((d, i) => (
                          <div key={d.day} style={{ display: 'flex', gap: '14px', alignItems: 'baseline', padding: '14px 18px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                            <span style={{ flexShrink: 0, fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '13px', color: 'var(--color-accent-dark)', textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: '50px' }}>{d.day}</span>
                            <span style={{ color: 'var(--color-text-strong)', fontSize: '15px', lineHeight: 1.5 }}>{d.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}

                {pkg.content.hashtags && (
                  <Reveal style={{ marginTop: '32px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {pkg.content.hashtags.map((h) => (
                      <span key={h} style={{ fontSize: '13px', color: 'var(--color-accent-dark)', background: 'var(--tcc-tint-blue)', padding: '4px 12px', borderRadius: '999px', fontWeight: 500 }}>{h}</span>
                    ))}
                  </Reveal>
                )}
              </div>
              <BookingCard p={pkg} onContact={openContact} />
            </div>
          </Section>
          <Gallery p={pkg} />
          <RelatedTours slug={pkg.slug} />
          <CtaBand onContact={openContact} title="Ready to make it real?" text={`Let's tailor the ${pkg.title} experience to your exact dates, group size and budget.`} cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
