// Tours page — filterable grid of all packages.
const TR = window.TeeCrownConsultDesignSystem_08f0d5;

function ToursPage() {
  const { PackageCard, Badge } = TR;
  const all = window.TCC.packages;
  const tags = ['All', ...Array.from(new Set(all.map((p) => p.tag)))];
  const [tag, setTag] = React.useState('All');
  const shown = tag === 'All' ? all : all.filter((p) => p.tag === tag);
  return (
    <PageShell current="Tours">
      {({ openContact }) => (
        <>
          <PageHero eyebrow="Curated tour packages" title="Where would you like to go?" lede="Handpicked journeys and bespoke itineraries — every detail planned around you, your budget and your dreams." image="assets/tour-turkey.jpg" />

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
            <div className="tcc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
              {shown.map((p, n) => (
                <Reveal key={p.slug} delay={(n % 3) * 80} style={{ height: '100%' }}>
                  <div style={{ position: 'relative', height: '100%' }}>
                    <span style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}><Badge tone="navy">{p.tag}</Badge></span>
                    <PackageCard image={p.image} title={p.title} location={p.location} excerpt={p.excerpt} ctaLabel="View details" href={`tour.html?slug=${p.slug}`} style={{ height: '100%' }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section tint="blue">
            <div className="tcc-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
              <div>
                <Reveal><Eyebrow>Can't find your trip?</Eyebrow></Reveal>
                <Reveal delay={60}><Heading>Build a custom itinerary</Heading></Reveal>
                <Reveal delay={120}><p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.75, marginTop: '16px' }}>Every traveller is unique. Share your destination, dates and budget, and our team will design a bespoke journey around exactly what you want — meticulously planned, start to finish.</p></Reveal>
                <Reveal delay={180} style={{ marginTop: '24px' }}><TR.Button variant="accent" onClick={openContact}>Request a custom trip</TR.Button></Reveal>
              </div>
              <Reveal style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)' }}>
                <img src="assets/tour-custom.jpg" alt="Custom itinerary" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
              </Reveal>
            </div>
          </Section>

          <CtaBand onContact={openContact} title="Your next adventure starts here" cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<ToursPage />);
