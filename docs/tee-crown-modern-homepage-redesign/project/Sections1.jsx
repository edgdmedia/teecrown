// Stats band · Services · How-it-works · Featured tours.
const S1 = window.TeeCrownConsultDesignSystem_08f0d5;

function StatsBand() {
  const stats = window.TCC.stats;
  return (
    <section style={{ background: 'var(--tcc-gradient-cta)', position: 'relative', marginTop: '-1px' }}>
      <Container style={{ padding: '46px var(--container-padding)' }}>
        <div className="tcc-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
          {stats.map((s, n) => (
            <Reveal key={s.label} delay={n * 90} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: '#fff', fontSize: 'clamp(32px,4vw,46px)', lineHeight: 1 }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.72)', fontSize: '14px', letterSpacing: '0.3px' }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const SVC_ICONS = {
  'Flight & Ticket Reservation': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15.5 3.5 11V7.8l2 .6 2.2 2 5-.2L9 3.2l2.6.5 5 6.7 3.6 1c.9.3 1.4.9 1.4 1.7 0 1.1-.9 2-2.2 2.4Z"/><path d="M6 20.5h12"/></svg>),
  'Visa Assistance': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="2.4"/><path d="M8.5 15.5c.7-1.6 2-2.4 3.5-2.4s2.8.8 3.5 2.4"/><path d="M8 18.5h8"/></svg>),
  'Student Visa Assistance': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8.5 12 4l9.5 4.5L12 13Z"/><path d="M6 10.6V15c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.4"/><path d="M21.5 8.5v5"/></svg>),
  'Travel Insurance': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5 5 6v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6Z"/><path d="m9.2 11.8 2 2 3.6-4"/></svg>),
};

function SvcIcon({ title }) {
  return (
    <div className="tcc-svcicon" style={{ width: '58px', height: '58px', borderRadius: '14px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,206,112,0.12)', color: 'var(--color-primary)' }}>{SVC_ICONS[title]}</div>
  );
}

function ServicesSection({ onContact }) {
  const { ServiceCard } = S1;
  const d = window.TCC.services;
  return (
    <Section id="services">
      <Reveal><Eyebrow center>What we do</Eyebrow></Reveal>
      <Reveal delay={60}><Heading center>Everything your trip needs, in one place</Heading></Reveal>
      <Reveal delay={120}><p style={{ textAlign: 'center', maxWidth: '640px', margin: '16px auto 0', color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.7 }}>From the first fare search to the visa stamp in your passport, our consultants carry the load so you can focus on the journey ahead.</p></Reveal>
      <div className="tcc-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '22px', marginTop: 'var(--space-lg)' }}>
        {d.map((s, n) => (
          <Reveal key={s.title} delay={n * 90} style={{ height: '100%' }}>
            <ServiceCard icon={<SvcIcon title={s.title} />} title={s.title} description={s.description} style={{ height: '100%', padding: '30px 24px' }} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={120} style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
        <S1.Button variant="outline" onClick={onContact}>Talk to a travel consultant</S1.Button>
      </Reveal>
    </Section>
  );
}

function StepsSection() {
  const steps = window.TCC.steps;
  return (
    <Section tint="alt" id="how">
      <div className="tcc-split" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: '56px', alignItems: 'center' }}>
        <div>
          <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
          <Reveal delay={60}><Heading>Booking your next trip is simple</Heading></Reveal>
          <Reveal delay={120}><p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.75, marginTop: '18px' }}>No confusing portals, no jargon. A real person guides you from idea to boarding pass — start the conversation however suits you.</p></Reveal>
          <Reveal delay={180} style={{ marginTop: '26px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <S1.Button variant="accent" href={window.waLink()} target="_blank" rel="noopener">💬 Start on WhatsApp</S1.Button>
          </Reveal>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((s, n) => (
            <Reveal key={s.n} delay={n * 110}>
              <div className="tcc-step" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#fff', borderRadius: 'var(--radius)', padding: '24px 26px', boxShadow: 'var(--shadow-card)' }}>
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
    </Section>
  );
}

function useCarousel(count) {
  const [perView, setPerView] = React.useState(3);
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const calc = () => setPerView(window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  const maxI = Math.max(0, count - perView);
  React.useEffect(() => { setI((v) => Math.min(v, maxI)); }, [maxI]);
  return { perView, i, maxI, prev: () => setI((v) => Math.max(0, v - 1)), next: () => setI((v) => Math.min(maxI, v + 1)), go: setI };
}

function CarArrow({ dir, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={dir === 'prev' ? 'Previous' : 'Next'} style={{
      width: '46px', height: '46px', borderRadius: '50%', flex: '0 0 auto', cursor: disabled ? 'default' : 'pointer',
      border: '1.5px solid var(--color-border)', background: '#fff', color: 'var(--color-primary)',
      fontSize: '22px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.35 : 1, transition: 'all .25s ease', boxShadow: 'var(--shadow-card)',
    }} onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; } }} onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-primary)'; }}>{dir === 'prev' ? '‹' : '›'}</button>
  );
}

function ToursSection({ onContact }) {
  const { PackageCard, Badge } = S1;
  const d = window.TCC.packages;
  const c = useCarousel(d.length);
  const step = 100 / c.perView;
  return (
    <Section id="tours">
      <div className="tcc-head-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div>
          <Reveal><Eyebrow>Curated tour packages</Eyebrow></Reveal>
          <Reveal delay={60}><Heading>Where would you like to go?</Heading></Reveal>
        </div>
        <Reveal delay={120} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CarArrow dir="prev" onClick={c.prev} disabled={c.i === 0} />
          <CarArrow dir="next" onClick={c.next} disabled={c.i >= c.maxI} />
        </Reveal>
      </div>
      <Reveal style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '0', transform: `translateX(-${c.i * step}%)`, transition: 'transform .55s cubic-bezier(.22,.61,.36,1)' }}>
          {d.map((p) => (
            <div key={p.slug} style={{ flex: `0 0 ${step}%`, padding: '0 12px', boxSizing: 'border-box' }}>
              <div style={{ position: 'relative', height: '100%' }}>
                <span style={{ position: 'absolute', top: '14px', left: '26px', zIndex: 2 }}><Badge tone="navy">{p.tag}</Badge></span>
                <PackageCard image={p.image} title={p.title} location={p.location} excerpt={p.excerpt} ctaLabel="View details" href={`tour.html?slug=${p.slug}`} style={{ height: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
        {Array.from({ length: c.maxI + 1 }).map((_, n) => (
          <button key={n} onClick={() => c.go(n)} aria-label={`Page ${n + 1}`} style={{ width: n === c.i ? '26px' : '9px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: n === c.i ? 'var(--color-accent)' : 'var(--tcc-border)', transition: 'all .35s ease' }} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
        <S1.Button variant="link" href="tours.html">View all tours & packages →</S1.Button>
      </div>
    </Section>
  );
}

Object.assign(window, { StatsBand, ServicesSection, StepsSection, ToursSection });
