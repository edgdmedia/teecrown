// Single blog post detail page (post.html?slug=...).
const PD = window.TeeCrownConsultDesignSystem_08f0d5;

function postBySlug() {
  const slug = new URLSearchParams(location.search).get('slug');
  return window.TCC.blog.find((x) => x.slug === slug) || window.TCC.blog[0];
}

function PostDetailPage() {
  const { Badge, BlogCard } = PD;
  const post = postBySlug();
  const related = window.TCC.blog.filter((x) => x.slug !== post.slug).slice(0, 3);
  return (
    <PageShell current="Blog">
      {({ openContact }) => (
        <>
          <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${post.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,50,0.92), rgba(0,11,36,0.62))' }} />
            <Container style={{ position: 'relative', padding: '140px var(--container-padding) 64px', maxWidth: '820px' }}>
              <div className="tcc-fade-2">
                <a href="blog.html" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← All stories</a>
                <div style={{ margin: '16px 0 12px' }}><Badge tone="accent">{post.category}</Badge></div>
                <h1 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(30px,4.4vw,46px)', lineHeight: 1.12, margin: 0, textWrap: 'balance' }}>{post.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px', color: 'rgba(255,255,255,0.82)', fontSize: '14.5px' }}>
                  <span>{post.author}</span><span style={{ opacity: 0.5 }}>•</span><span>{post.date}</span>
                </div>
              </div>
            </Container>
          </section>

          <Section>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <Reveal><p style={{ fontSize: '20px', lineHeight: 1.7, color: 'var(--color-text-strong)', fontWeight: 500, margin: '0 0 28px' }}>{post.excerpt}</p></Reveal>
              {post.body.map((para, i) => (
                <Reveal key={i} delay={i * 40}>
                  <p style={{ fontSize: '17px', lineHeight: 1.85, color: 'var(--color-text)', margin: '0 0 22px' }}>
                    {i === 0 && <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '58px', fontWeight: 700, float: 'left', lineHeight: 0.82, margin: '6px 14px 0 0', color: 'var(--color-primary)' }}>{para[0]}</span>}
                    {i === 0 ? para.slice(1) : para}
                  </p>
                </Reveal>
              ))}
              <Reveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '36px', padding: '26px 30px', background: 'var(--tcc-tint-blue)', borderRadius: 'var(--radius)' }}>
                  <div style={{ flex: '1 1 240px' }}>
                    <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: 'var(--color-heading)', fontSize: '18px' }}>Inspired to travel?</div>
                    <div style={{ color: 'var(--color-text)', fontSize: '14.5px', marginTop: '4px' }}>Let our team turn this into your own journey.</div>
                  </div>
                  <PD.Button variant="accent" onClick={openContact}>Book a trip</PD.Button>
                </div>
              </Reveal>
              <Reveal style={{ marginTop: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share</span>
                {Object.entries(window.TCC.contact.social).map(([name, href]) => (
                  <a key={name} href={href} target="_blank" rel="noopener" title={name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>{name[0]}</a>
                ))}
              </Reveal>
            </div>
          </Section>

          <Section tint="alt">
            <Reveal><Eyebrow center>Read next</Eyebrow></Reveal>
            <Reveal delay={60}><Heading center>More from the journal</Heading></Reveal>
            <div className="tcc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginTop: 'var(--space-lg)' }}>
              {related.map((b, n) => (
                <Reveal key={b.slug} delay={n * 80} style={{ height: '100%' }}>
                  <BlogCard {...b} readMoreLabel="Read more" href={`post.html?slug=${b.slug}`} style={{ height: '100%' }} />
                </Reveal>
              ))}
            </div>
          </Section>
        </>
      )}
    </PageShell>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<PostDetailPage />);
