// Sticky site header — logo, page nav, Book CTA, mobile drawer. Multi-page aware.
const { Button } = window.TeeCrownConsultDesignSystem_08f0d5;

function Header({ scrolled, solid, current, onContact }) {
  const [open, setOpen] = React.useState(false);
  const links = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'Tours', href: 'tours.html' },
    { label: 'Blog', href: 'blog.html' },
  ];
  const isSolid = solid || scrolled;
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: isSolid ? 'rgba(255,255,255,0.96)' : 'transparent',
      backdropFilter: isSolid ? 'blur(12px)' : 'none',
      borderBottom: `1px solid ${isSolid ? 'var(--color-border)' : 'transparent'}`,
      boxShadow: isSolid ? 'var(--shadow-header)' : 'none',
      transition: 'all .35s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)', height: isSolid ? '68px' : '84px', transition: 'height .35s ease' }}>
        <a href="index.html" style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
          <img src="assets/logo-landscape.png" alt="Tee'Crown Consult" style={{ height: '44px', width: 'auto', display: 'block', filter: isSolid ? 'none' : 'brightness(0) invert(1)', transition: 'filter .35s ease' }} />
        </a>
        <nav className="tcc-nav" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          {links.map((l) => {
            const active = current === l.label;
            return (
              <a key={l.label} href={l.href} className="tcc-navlink" style={{
                fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: active ? 700 : 500,
                color: active ? (isSolid ? 'var(--color-primary)' : '#fff') : (isSolid ? 'var(--color-text-strong)' : 'rgba(255,255,255,0.92)'),
                textTransform: 'uppercase', letterSpacing: '0.6px', textDecoration: 'none',
                position: 'relative', padding: '6px 0',
              }}>{l.label}</a>
            );
          })}
        </nav>
        <div className="tcc-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto' }}>
          <Button variant="accent" size="sm" onClick={onContact}>Book</Button>
        </div>
        <button className="tcc-burger" aria-label="Menu" onClick={() => setOpen(!open)} style={{
          display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
          color: isSolid ? 'var(--color-primary)' : '#fff', fontSize: '26px', lineHeight: 1,
        }}>{open ? '✕' : '☰'}</button>
      </div>
      {open && (
        <div className="tcc-mobile" style={{ background: '#fff', borderTop: '1px solid var(--color-border)', padding: '16px var(--container-padding) 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ fontFamily: 'var(--font-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', fontSize: '14px', fontWeight: current === l.label ? 700 : 500, color: current === l.label ? 'var(--color-primary)' : 'var(--color-text-strong)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--color-bg-alt)' }}>{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
            <Button variant="accent" size="sm" onClick={() => { setOpen(false); onContact(); }} style={{ flex: 1 }}>Book</Button>
          </div>
        </div>
      )}
    </header>
  );
}
window.Header = Header;
