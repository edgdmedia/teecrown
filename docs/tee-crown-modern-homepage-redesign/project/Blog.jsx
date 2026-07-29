// Blog page — featured lead post + filterable grid.
const BL = window.TeeCrownConsultDesignSystem_08f0d5;

function BlogPage() {
  const { BlogCard, Badge, Button } = BL;
  const posts = window.TCC.blog;
  const feat = posts[0];
  const rest = posts.slice(1);
  const cats = ['All', ...Array.from(new Set(rest.map((p) => p.category)))];
  const [cat, setCat] = React.useState('All');
  const shown = cat === 'All' ? rest : rest.filter((p) => p.category === cat);
  return (
    <PageShell current="Blog">
      {({ openContact }) => (
        <>
          <PageHero eyebrow="Stories, tips & guides" title="From the Tee'Crown journal" lede="Travel guides, cultural notes and stories from the road — written to help you travel smarter and deeper." image="assets/blog-turkey-guide.jpg" />

          <Section>
            <Reveal>
              <a href={`post.html?slug=${feat.slug}`} className="tcc-featpost" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', textDecoration: 'none', background: '#fff' }}>
                <div style={{ overflow: 'hidden', minHeight: '320px' }}>
                  <img src={feat.image} alt={feat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ marginBottom: '14px' }}><Badge tone="accent">Featured · {feat.category}</Badge></div>
                  <h2 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontWeight: 700, fontSize: 'clamp(24px,2.6vw,32px)', lineHeight: 1.25, margin: '0 0 14px', textWrap: 'balance' }}>{feat.title}</h2>
                  <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: 1.7, margin: '0 0 20px' }}>{feat.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <span style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>{feat.date}</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px' }}>Read more →</span>
                  </div>
                </div>
              </a>
            </Reveal>
          </Section>

          <Section tint="alt" style={{ paddingTop: '0' }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
              {cats.map((t) => {
                const active = t === cat;
                return (
                  <button key={t} onClick={() => setCat(t)} style={{
                    fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.4px',
                    padding: '9px 20px', borderRadius: '999px', cursor: 'pointer', transition: 'all .25s ease',
                    border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: active ? 'var(--color-primary)' : '#fff', color: active ? '#fff' : 'var(--color-text-strong)',
                  }}>{t}</button>
                );
              })}
            </div>
            <div className="tcc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
              {shown.map((b, n) => (
                <Reveal key={b.title} delay={(n % 3) * 80} style={{ height: '100%' }}>
                  <BlogCard {...b} readMoreLabel="Read more" href={`post.html?slug=${b.slug}`} style={{ height: '100%' }} />
                </Reveal>
              ))}
            </div>
          </Section>

          <CtaBand onContact={openContact} title="Inspired to travel?" text="Turn a story into your own journey. Our team is ready to help you plan it." cta="Book Now" />
        </>
      )}
    </PageShell>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<BlogPage />);
