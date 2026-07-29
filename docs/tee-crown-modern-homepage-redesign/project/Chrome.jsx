// Shared page chrome — contact drawer, floating WhatsApp, interior page hero, shell.
const CH = window.TeeCrownConsultDesignSystem_08f0d5;

function ContactDrawer({ open, onClose }) {
  const { Button, Input, Select, Textarea } = CH;
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => { if (open) setSent(false); }, [open]);
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tcc-overlay" onClick={onClose}>
      <div className="tcc-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="tcc-close" onClick={onClose} aria-label="Close">&times;</button>
        <div style={{ marginBottom: '20px' }}>
          <Eyebrow>Book your trip</Eyebrow>
          <h3 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontSize: '26px', fontWeight: 700, margin: 0 }}>Let's start planning</h3>
          <p style={{ color: 'var(--color-text)', fontSize: '14.5px', lineHeight: 1.6, marginTop: '8px' }}>Prefer to chat? <a href={window.waLink()} target="_blank" rel="noopener" style={{ color: 'var(--color-accent-dark)', fontWeight: 600 }}>Message us on WhatsApp →</a></p>
        </div>
        {sent ? (
          <div style={{ padding: '26px', background: 'var(--tcc-success-bg)', borderRadius: 'var(--radius)', color: 'var(--tcc-success-fg)', textAlign: 'center' }}>
            <div style={{ fontSize: '34px', marginBottom: '8px' }}>✅</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Thank you! Our team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <Input label="Name" placeholder="Your full name" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Phone" type="tel" placeholder="080..." />
              <Input label="Email" type="email" placeholder="you@email.com" required />
            </div>
            <Select label="Which service?" options={['Flight & Ticket Reservation', 'Visa Assistance', 'Student Visa Assistance', 'Travel Insurance', 'Tour Package', 'Custom Itinerary']} />
            <Textarea label="Tell us about your trip" placeholder="Destination, dates, number of travellers, budget..." />
            <Select label="Where did you hear about us?" options={['Google', 'Social Media', 'Family and Friends', 'Referral', 'Other']} />
            <Button variant="accent" type="submit" style={{ width: '100%', marginTop: '10px' }}>Send my request</Button>
          </form>
        )}
      </div>
    </div>
  );
}

function WhatsAppFab() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setShow(true), 1000); return () => clearTimeout(t); }, []);
  return (
    <a href={window.waLink()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp" style={{
      position: 'fixed', right: '22px', bottom: '22px', zIndex: 90,
      width: '58px', height: '58px', borderRadius: '50%', background: '#25D366',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px',
      boxShadow: '0 8px 24px rgba(37,211,102,0.45)', textDecoration: 'none',
      transform: show ? 'scale(1)' : 'scale(0)', transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
    }} className="tcc-fab">💬</a>
  );
}

// Interior page hero — navy scrim over a photo, eyebrow + big title + optional lede.
function PageHero({ eyebrow, title, lede, image = 'assets/hero-beach.jpg' }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,50,0.9), rgba(0,11,36,0.7))' }} />
      <Container style={{ position: 'relative', padding: '150px var(--container-padding) 70px', textAlign: 'center' }}>
        <div className="tcc-fade-2">
          <Eyebrow center light>{eyebrow}</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(34px,5vw,56px)', lineHeight: 1.08, margin: 0, textWrap: 'balance', letterSpacing: '-0.5px' }}>{title}</h1>
          {lede && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', lineHeight: 1.7, maxWidth: '640px', margin: '18px auto 0' }}>{lede}</p>}
        </div>
      </Container>
    </section>
  );
}

// Shell that wires scroll + contact state and renders header/footer/chrome around children.
function PageShell({ current, children }) {
  const [scrolled, setScrolled] = React.useState(true);
  const [contact, setContact] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const openContact = () => setContact(true);
  return (
    <>
      <Header solid current={current} scrolled={scrolled} onContact={openContact} />
      <main>{typeof children === 'function' ? children({ openContact }) : children}</main>
      <Footer onContact={openContact} />
      <WhatsAppFab />
      <ContactDrawer open={contact} onClose={() => setContact(false)} />
    </>
  );
}

// Reusable closing CTA band for interior pages.
function CtaBand({ onContact, title = "Ready when you are", text = "Tell us where you're dreaming of. We'll turn it into a real, well-planned journey — usually with a quote back the same day.", cta = 'Book Now' }) {
  return (
    <Section>
      <Reveal style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px', background: 'var(--tcc-gradient-cta)', padding: '60px 44px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(97,206,112,0.18)', filter: 'blur(10px)' }} />
        <div style={{ position: 'relative' }}>
          <Heading light center style={{ maxWidth: '720px', margin: '0 auto' }}>{title}</Heading>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', lineHeight: 1.7, maxWidth: '600px', margin: '16px auto 30px' }}>{text}</p>
          <CH.Button variant="accent" size="lg" onClick={onContact}>{cta}</CH.Button>
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { ContactDrawer, WhatsAppFab, PageHero, PageShell, CtaBand });
