"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import type { Package } from "@/data/packages";
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
import { LexicalRenderer } from "@/components/ui/lexical-renderer";

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

function BookingCard({ p, onContact, pageUrl }: { p: Package; onContact: () => void; pageUrl: string }) {
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
      <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '22px', paddingTop: '18px' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Share</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"/></svg></a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(p.title)}`} target="_blank" rel="noopener noreferrer" title="X" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><path d="M4 4l6.2 8.3L4 20h2.3l5-5.6L15.7 20H20l-6.7-9.2L19.5 4h-2.3l-4.6 5.4L8 4H4Z"/></svg></a>
          <a href={`https://wa.me/?text=${encodeURIComponent(p.title + ' - ' + pageUrl + '\n\n' + 'https://teecrownconsult.org' + p.image)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}><svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M17.472 14.382c-.297-.149-1.757-.867-2.03-.967-.273-.099-.473-.149-.672.15-.2.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.76-1.653-2.059-.173-.298-.018-.46.13-.61.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.672-1.62-.922-2.219-.242-.579-.487-.5-.672-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
          <a href={`mailto:?subject=${encodeURIComponent(p.title)}&body=${encodeURIComponent('Check out this tour: ' + p.title + '\n\n' + pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Email" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>
        </div>
      </div>
    </div>
  );
}

function Gallery({ p }: { p: Package }) {
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
            <img src={src} alt={`${p.title} ${n + 1}`} onClick={() => { setLbIdx(n); setLbOpen(true); }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </Reveal>
        ))}
      </div>
      {lbOpen && <Lightbox images={imgs} index={lbIdx} onClose={() => setLbOpen(false)} onPrev={prev} onNext={next} />}
    </Section>
  );
}

function RelatedTours({ slug, all }: { slug: string; all: Package[] }) {
  const rel = all.filter((x) => x.slug !== slug).slice(0, 3);
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

export function TourDetailContent({ pkg, allPackages }: { pkg: Package; allPackages: Package[] }) {
  const pathname = usePathname();
  const pageUrl = `https://teecrownconsult.org${pathname}`;

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
                {pkg.content.intro && <Reveal><LexicalRenderer data={pkg.content.intro} /></Reveal>}
                {pkg.content.pricing && <Reveal><div style={{ marginTop: '32px' }}><h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>Pricing</h3><div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>{pkg.content.pricing.map((r, i) => (<div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 18px', fontSize: '15px', borderTop: i ? '1px solid var(--color-border)' : 'none' }}><span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{r.label}</span><span style={{ color: 'var(--color-text-strong)', fontWeight: 600, textAlign: 'right' }}>{r.value}</span></div>))}</div>{pkg.content.validUntil && <p style={{ fontSize: '13.5px', color: 'var(--color-text-light)', marginTop: '8px', fontStyle: 'italic' }}>Valid until {pkg.content.validUntil}</p>}</div></Reveal>}
                {pkg.content.highlights && <Reveal><ListBlock title="Trip highlights" items={pkg.content.highlights} /></Reveal>}
                {pkg.content.included && <Reveal><ListBlock title="What's included" items={pkg.content.included} /></Reveal>}
                {pkg.content.requirements && <Reveal><div style={{ marginTop: '32px' }}><h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>Requirements</h3><ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>{pkg.content.requirements.map((d) => (<li key={d} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--color-text-strong)', fontSize: '15.5px', lineHeight: 1.55 }}><span style={{ color: 'var(--color-accent-dark)', flex: '0 0 auto', fontSize: '16px' }}>•</span>{d}</li>))}</ul></div></Reveal>}
                {pkg.content.itinerary && <Reveal><div style={{ marginTop: '32px' }}><h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>Itinerary</h3><div style={{ display: 'grid', gap: '12px' }}>{pkg.content.itinerary.map((d) => (<div key={d.day} style={{ display: 'flex', gap: '14px', alignItems: 'baseline', padding: '14px 18px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}><span style={{ flexShrink: 0, fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '13px', color: 'var(--color-accent-dark)', textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: '50px' }}>{d.day}</span><span style={{ color: 'var(--color-text-strong)', fontSize: '15px', lineHeight: 1.5 }}>{d.description}</span></div>))}</div></div></Reveal>}
                {pkg.content.hashtags && <Reveal style={{ marginTop: '32px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{pkg.content.hashtags.map((h) => (<span key={h} style={{ fontSize: '13px', color: 'var(--color-accent-dark)', background: 'var(--tcc-tint-blue)', padding: '4px 12px', borderRadius: '999px', fontWeight: 500 }}>{h}</span>))}</Reveal>}
              </div>
              <BookingCard p={pkg} onContact={openContact} pageUrl={pageUrl} />
            </div>
          </Section>
          <Gallery p={pkg} />
          <RelatedTours slug={pkg.slug} all={allPackages} />
          <CtaBand onContact={openContact} title="Ready to make it real?" text={`Let's tailor the ${pkg.title} experience to your exact dates, group size and budget.`} cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
