import { Eyebrow } from "@/components/ui/eyebrow";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede?: string;
  image?: string;
}

export function PageHero({ eyebrow, title, lede, image = '/images/hero-beach.webp' }: PageHeroProps) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,50,0.9), rgba(0,11,36,0.7))' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--container-width)', margin: '0 auto', padding: '150px var(--container-padding) 70px', textAlign: 'center' }}>
        <div className="tcc-fade-2">
          <Eyebrow center light>{eyebrow}</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(34px,5vw,56px)', lineHeight: 1.08, margin: 0, textWrap: 'balance', letterSpacing: '-0.5px' }}>{title}</h1>
          {lede && <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px', lineHeight: 1.7, maxWidth: '640px', margin: '18px auto 0' }}>{lede}</p>}
        </div>
      </div>
    </section>
  );
}
