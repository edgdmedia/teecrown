// Services page — detailed alternating service rows with SVG icons.
const SV = window.TeeCrownConsultDesignSystem_08f0d5;

const SVC_SVG = {
  'Flight & Ticket Reservation': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15.5 3.5 11V7.8l2 .6 2.2 2 5-.2L9 3.2l2.6.5 5 6.7 3.6 1c.9.3 1.4.9 1.4 1.7 0 1.1-.9 2-2.2 2.4Z"/><path d="M6 20.5h12"/></svg>,
  'Visa Assistance': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="2.4"/><path d="M8.5 15.5c.7-1.6 2-2.4 3.5-2.4s2.8.8 3.5 2.4"/><path d="M8 18.5h8"/></svg>,
  'Student Visa Assistance': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8.5 12 4l9.5 4.5L12 13Z"/><path d="M6 10.6V15c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.4"/><path d="M21.5 8.5v5"/></svg>,
  'Travel Insurance': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5 5 6v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6Z"/><path d="m9.2 11.8 2 2 3.6-4"/></svg>,
};

function ServiceRow({ s, flip, onContact }) {
  const media = (
    <Reveal y={20} style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)' }}>
      <img src={s.image} alt={s.title} style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
    </Reveal>
  );
  const body = (
    <div>
      <Reveal>
        <div className="tcc-svcicon" style={{ width: '58px', height: '58px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,206,112,0.12)', color: 'var(--color-primary)', marginBottom: '18px' }}>{SVC_SVG[s.title]}</div>
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
      <Reveal delay={240}><SV.Button variant="accent" onClick={onContact}>Enquire about {s.title.split(' ')[0]}</SV.Button></Reveal>
    </div>
  );
  return (
    <div className="tcc-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
      {flip ? <>{body}{media}</> : <>{media}{body}</>}
    </div>
  );
}

function ServicesPage() {
  const d = window.TCC.services;
  return (
    <PageShell current="Services">
      {({ openContact }) => (
        <>
          <PageHero eyebrow="What we do" title="Everything your trip needs, in one place" lede="From the first fare search to the visa stamp in your passport, our consultants carry the load so you can focus on the journey ahead." image="assets/hero-travel-1.jpg" />
          {d.map((s, i) => (
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
ReactDOM.createRoot(document.getElementById('root')).render(<ServicesPage />);
