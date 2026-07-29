// Footer — navy, brand blurb + link columns + contact + socials, bottom bar.
function Footer({ onContact }) {
  const c = window.TCC.contact;
  const col = (title, items) => (
    <div>
      <h4 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '0.3px', margin: '0 0 16px' }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{items}</div>
    </div>
  );
  const link = (label, href, onClick) => (
    <a key={label} href={href || '#'} onClick={onClick} target={href && href.startsWith('http') ? '_blank' : undefined} rel="noopener" style={{ color: 'rgba(255,255,255,0.66)', fontSize: '14px', textDecoration: 'none', transition: 'color .2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.66)')}>{label}</a>
  );
  const scrollTo = (sel) => (e) => { e.preventDefault(); const el = document.querySelector(sel); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' }); else window.location.href = 'index.html'; };
  return (
    <footer style={{ background: 'var(--tcc-ink)', color: '#fff' }}>
      <Container style={{ padding: '64px var(--container-padding) 30px' }}>
        <div className="tcc-foot" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr', gap: '40px' }}>
          <div>
            <img src="assets/logo-landscape.png" alt="Tee'Crown Consult" style={{ height: '46px', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '18px' }} />
            <p style={{ color: 'rgba(255,255,255,0.66)', fontSize: '14px', lineHeight: 1.7, maxWidth: '320px', margin: 0 }}>A wholly indigenous Nigerian travel & tourism company, promoting sustainable and responsible tourism. Your trusted partner for global travel experiences.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {Object.entries(c.social).map(([name, href]) => (
                <a key={name} href={href} target="_blank" rel="noopener" title={name} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'background .25s ease' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>{name[0]}</a>
              ))}
            </div>
          </div>
          {col('Services', window.TCC.services.map((s) => link(s.title, 'services.html')))}
          {col('Explore', [
            link('Tours & Packages', 'tours.html'),
            link('About Us', 'about.html'),
            link('Stories & Guides', 'blog.html'),
            link('Book a Trip', '#', (e) => { e.preventDefault(); onContact(); }),
          ])}
          {col('Get in touch', [
            <div key="a" style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.66)', fontSize: '14px', lineHeight: 1.6 }}><span>📍</span><span>{c.address}</span></div>,
            link('📞 ' + c.phone, 'tel:' + c.phoneIntl),
            link('💬 Chat on WhatsApp', window.waLink()),
            link('✉️ ' + c.email, 'mailto:' + c.email),
          ])}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '44px', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          <span>© {new Date().getFullYear()} Tee'Crown Consult Limited. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '20px' }}>{link('Terms of Use', '#')}{link('Privacy Policy', '#')}</span>
        </div>
      </Container>
    </footer>
  );
}
window.Footer = Footer;
