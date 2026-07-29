// Single tour / package detail page (tour.html?slug=...).
const TD = window.TeeCrownConsultDesignSystem_08f0d5;

function findBySlug(list, fallback) {
  const slug = new URLSearchParams(location.search).get('slug');
  return list.find((x) => x.slug === slug) || fallback || list[0];
}

function DetailHero({ p }) {
  const { Badge } = TD;
  return (
    <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${p.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,50,0.9), rgba(0,11,36,0.6))' }} />
      <Container style={{ position: 'relative', padding: '140px var(--container-padding) 60px' }}>
        <div className="tcc-fade-2">
          <a href="tours.html" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← All tours</a>
          <div style={{ margin: '16px 0 10px' }}><Badge tone="accent">{p.tag}</Badge></div>
          <h1 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.08, margin: 0, maxWidth: '760px', textWrap: 'balance' }}>{p.title}</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
            {[`📍 ${p.location}`, `🗓️ ${p.duration}`].map((m) => (
              <span key={m} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(6px)', borderRadius: '999px', padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}>{m}</span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ListBlock({ title, items, check }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '20px', margin: '0 0 16px' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
        {items.map((d) => (
          <li key={d} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--color-text-strong)', fontSize: '15.5px', lineHeight: 1.55 }}>
            <span style={{ color: 'var(--color-accent-dark)', fontWeight: 700, flex: '0 0 auto' }}>{check ? '✓' : '•'}</span>{d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BookingCard({ p, onContact }) {
  const { Button } = TD;
  return (
    <div style={{ position: 'sticky', top: '90px', background: '#fff', borderRadius: '14px', boxShadow: 'var(--shadow-card-hover)', padding: '30px', border: '1px solid var(--color-border)' }}>
      <div style={{ fontSize: '13px', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>Interested in this trip?</div>
      <div style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '22px', margin: '8px 0 18px', lineHeight: 1.3 }}>Tailored to your dates & budget</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button variant="accent" onClick={onContact} style={{ width: '100%' }}>Book this trip</Button>
        <Button variant="outline" href={window.waLink(`Hi Tee'Crown! I'm interested in the ${p.title} package.`)} target="_blank" rel="noopener" style={{ width: '100%' }}>💬 Ask on WhatsApp</Button>
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

function Gallery({ p }) {
  const imgs = p.gallery || [p.image];
  return (
    <Section tint="alt">
      <Reveal><Eyebrow center>A glimpse</Eyebrow></Reveal>
      <Reveal delay={60}><Heading center>{p.title} in pictures</Heading></Reveal>
      <div className="tcc-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: 'var(--space-lg)' }}>
        {imgs.map((src, n) => (
          <Reveal key={src + n} delay={n * 90} style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', gridRow: n === 0 ? 'span 2' : 'auto' }}>
            <img src={src} alt={`${p.title} ${n + 1}`} style={{ width: '100%', height: '100%', minHeight: '220px', objectFit: 'cover', display: 'block' }} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function RelatedTours({ current }) {
  const { PackageCard, Badge } = TD;
  const rel = window.TCC.packages.filter((x) => x.slug !== current.slug).slice(0, 3);
  return (
    <Section tint="alt">
      <Reveal delay={0}><Eyebrow center>Keep exploring</Eyebrow></Reveal>
      <Reveal delay={60}><Heading center>Other journeys you might love</Heading></Reveal>
      <div className="tcc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginTop: 'var(--space-lg)' }}>
        {rel.map((p, n) => (
          <Reveal key={p.slug} delay={n * 80} style={{ height: '100%' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <span style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}><Badge tone="navy">{p.tag}</Badge></span>
              <PackageCard image={p.image} title={p.title} location={p.location} excerpt={p.excerpt} ctaLabel="View details" href={`tour.html?slug=${p.slug}`} style={{ height: '100%' }} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TourDetailPage() {
  const p = findBySlug(window.TCC.packages);
  return (
    <PageShell current="Tours">
      {({ openContact }) => (
        <>
          <DetailHero p={p} />
          <Section>
            <div className="tcc-detail" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '48px', alignItems: 'start' }}>
              <div>
                <Reveal><Eyebrow>Overview</Eyebrow></Reveal>
                {p.overview.map((para, i) => (
                  <Reveal key={i} delay={i * 60}><p style={{ fontSize: '16.5px', lineHeight: 1.8, color: 'var(--color-text)', marginTop: i ? '16px' : '10px' }}>{para}</p></Reveal>
                ))}
                <Reveal><ListBlock title="Trip highlights" items={p.highlights} check /></Reveal>
                <Reveal><ListBlock title="What's included" items={p.includes} check /></Reveal>
              </div>
              <BookingCard p={p} onContact={openContact} />
            </div>
          </Section>
          <Gallery p={p} />
          <RelatedTours current={p} />
          <CtaBand onContact={openContact} title="Ready to make it real?" text={`Let's tailor the ${p.title} experience to your exact dates, group size and budget.`} cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<TourDetailPage />);
