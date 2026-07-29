// Why-us · Testimonials band · Stories · Big CTA.
const S2 = window.TeeCrownConsultDesignSystem_08f0d5;

function WhySection() {
  const d = window.TCC.reasons;
  return (
    <Section tint="blue" id="why">
      <div className="tcc-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
        <Reveal style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card-hover)', position: 'relative' }}>
          <img src="assets/tour-vacation.jpg" alt="Travellers on a Tee'Crown trip" style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', left: '20px', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '30px' }}>🌍</span>
            <div>
              <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: 'var(--color-heading)', fontSize: '16px' }}>Responsible & sustainable</div>
              <div style={{ color: 'var(--color-text)', fontSize: '13.5px' }}>Tourism that gives back to local communities.</div>
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal><Eyebrow>Why Tee'Crown</Eyebrow></Reveal>
          <Reveal delay={60}><Heading>Travel handled with genuine care</Heading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginTop: '28px' }}>
            {d.map((r, n) => (
              <Reveal key={r.title} delay={n * 90}>
                <div>
                  <div style={{ marginBottom: '12px' }}><ReasonIcon title={r.title} size={54} /></div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: '17px', margin: '0 0 6px' }}>{r.title}</h3>
                  <p style={{ color: 'var(--color-text)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function TestimonialsBand() {
  const d = window.TCC.testimonials;
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % d.length), 6000);
    return () => clearInterval(t);
  }, [d.length]);
  const t = d[i];
  return (
    <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, background: "url('assets/hero-beach.jpg') center/cover no-repeat" }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,128,0.82), rgba(0,11,36,0.88))' }} />
      <Container style={{ position: 'relative', padding: '84px var(--container-padding)', textAlign: 'center' }}>
        <Reveal><Eyebrow center light>Kind words</Eyebrow></Reveal>
        <Reveal delay={60}><Heading light center>Travellers who trusted us</Heading></Reveal>
        <div style={{ maxWidth: '760px', margin: '30px auto 0', minHeight: '150px' }}>
          <div key={i} className="tcc-fade-in" style={{ }}>
            <div style={{ color: 'var(--tcc-star)', fontSize: '20px', letterSpacing: '3px', marginBottom: '16px' }}>{'★'.repeat(t.rating)}</div>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(18px,2.2vw,23px)', lineHeight: 1.6, fontWeight: 500, margin: 0, color: '#fff' }}>&ldquo;{t.text}&rdquo;</p>
            <p style={{ marginTop: '22px', fontWeight: 700, fontSize: '16px' }}>{t.name}<span style={{ display: 'block', fontWeight: 400, fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{t.title}</span></p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '26px' }}>
          {d.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Testimonial ${n + 1}`} style={{ width: n === i ? '28px' : '9px', height: '5px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: n === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.4)', transition: 'all .4s ease' }} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function StoriesSection() {
  const { BlogCard } = S2;
  const d = window.TCC.blog;
  return (
    <Section id="stories">
      <div className="tcc-head-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div>
          <Reveal><Eyebrow>Stories, tips & guides</Eyebrow></Reveal>
          <Reveal delay={60}><Heading>From the Tee'Crown journal</Heading></Reveal>
        </div>
      </div>
      <div className="tcc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
        {d.map((b, n) => (
          <Reveal key={b.title} delay={n * 90} style={{ height: '100%' }}>
            <BlogCard {...b} readMoreLabel="Read more" href={`post.html?slug=${b.slug}`} style={{ height: '100%' }} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function BigCTA({ onContact }) {
  return (
    <Section>
      <Reveal style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px', background: 'var(--tcc-gradient-cta)', padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(97,206,112,0.18)', filter: 'blur(10px)' }} />
        <div style={{ position: 'relative' }}>
          <Heading light center style={{ maxWidth: '720px', margin: '0 auto' }}>Let's craft the most amazing experience for you</Heading>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', lineHeight: 1.7, maxWidth: '600px', margin: '18px auto 32px' }}>Tell us where you're dreaming of. We'll turn it into a real, well-planned journey — usually with a quote back the same day.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <S2.Button variant="accent" size="lg" onClick={onContact}>Book</S2.Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { WhySection, TestimonialsBand, StoriesSection, BigCTA });
