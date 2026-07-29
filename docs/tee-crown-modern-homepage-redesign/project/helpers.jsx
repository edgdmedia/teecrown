// Shared layout + motion helpers for the Tee'Crown homepage.
const Container = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)', ...style }}>{children}</div>
);

const Section = ({ children, tint, id, style }) => (
  <section id={id} style={{
    padding: 'var(--section-pad-lg) 0',
    background: tint === 'blue' ? 'var(--tcc-tint-blue)' : tint === 'alt' ? 'var(--color-bg-alt)' : 'var(--color-bg)',
    ...style,
  }}><Container>{children}</Container></section>
);

// Scroll-reveal wrapper: fades + rises into view once, with optional stagger delay.
function Reveal({ children, delay = 0, y = 28, as = 'div', style, ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : `translateY(${y}px)`,
      transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
      ...style,
    }} {...rest}>{children}</Tag>
  );
}

// Count-up number that animates when scrolled into view.
function Counter({ to, suffix = '', duration = 1600 }) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// Eyebrow label — uppercase, letter-spaced, green, with a short rule.
function Eyebrow({ children, light, center }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: center ? 'center' : 'flex-start', marginBottom: '14px' }}>
      <span style={{ width: '28px', height: '3px', background: 'var(--color-accent)', borderRadius: '2px' }} />
      <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: light ? 'var(--color-accent)' : 'var(--color-accent-dark)' }}>{children}</span>
    </div>
  );
}

function Heading({ children, light, center, style }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-primary)', fontWeight: 700, lineHeight: 1.18,
      fontSize: 'clamp(30px, 3.6vw, 42px)', margin: 0,
      color: light ? '#fff' : 'var(--color-heading)',
      textAlign: center ? 'center' : 'left', textWrap: 'balance', ...style,
    }}>{children}</h2>
  );
}

function waLink(msg) {
  return `https://wa.me/${window.TCC.contact.wa}?text=${encodeURIComponent(msg || "Hello Tee'Crown Consult! I'd like to plan a trip.")}`;
}

const REASON_ICONS = {
  'Proudly indigenous': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z"/></svg>),
  'End-to-end concierge': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>),
  'Fast, reliable visas': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-7.5Z"/></svg>),
  'People, not tickets': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M18 15.2c2 .7 3.4 2.4 3.4 4.8"/></svg>),
};

function ReasonIcon({ title, size = 58 }) {
  return (
    <div className="tcc-svcicon" style={{ width: `${size}px`, height: `${size}px`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(97,206,112,0.12)', color: 'var(--color-primary)' }}>{REASON_ICONS[title]}</div>
  );
}

Object.assign(window, { Container, Section, Reveal, Counter, Eyebrow, Heading, waLink, ReasonIcon });
