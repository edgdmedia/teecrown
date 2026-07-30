"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/data/blog";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";
import { BlogCard } from "@/components/cards/blog-card";
import { Button } from "@/components/ui/button";

function useCarousel(count: number) {
  const [perView, setPerView] = useState(3);
  const [i, setI] = useState(0);
  useEffect(() => {
    const calc = () => setPerView(window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  const maxI = Math.max(0, count - perView);
  useEffect(() => { setI((v) => Math.min(v, maxI)); }, [maxI]);
  return { perView, i, maxI, prev: () => setI((v) => Math.max(0, v - 1)), next: () => setI((v) => Math.min(maxI, v + 1)), go: setI };
}

function CarArrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={dir === 'prev' ? 'Previous' : 'Next'} style={{
      width: '46px', height: '46px', borderRadius: '50%', flex: '0 0 auto', cursor: disabled ? 'default' : 'pointer',
      border: '1.5px solid var(--color-border)', background: '#fff', color: 'var(--color-primary)',
      fontSize: '22px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.35 : 1, transition: 'all .25s ease', boxShadow: 'var(--shadow-card)',
    }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-primary)'; }}
    >{dir === 'prev' ? '‹' : '›'}</button>
  );
}

export function StoriesSection({ posts }: { posts: BlogPost[] }) {
  const d = posts;
  const c = useCarousel(d.length);
  const step = 100 / c.perView;

  return (
    <section id="stories" style={{ padding: 'var(--section-pad-lg) 0', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto', padding: '0 var(--container-padding)' }}>
        <div className="tcc-head-row" style={{ marginBottom: 'var(--space-lg)' }}>
          <div>
            <Reveal><Eyebrow>Stories, tips &amp; guides</Eyebrow></Reveal>
            <Reveal delay={60}><Heading>From the Tee'Crown journal</Heading></Reveal>
          </div>
          <Reveal delay={120} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CarArrow dir="prev" onClick={c.prev} disabled={c.i === 0} />
            <CarArrow dir="next" onClick={c.next} disabled={c.i >= c.maxI} />
          </Reveal>
        </div>
        <Reveal style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '0', transform: `translateX(-${c.i * step}%)`, transition: 'transform .55s cubic-bezier(.22,.61,.36,1)' }}>
            {d.map((b) => (
              <div key={b.slug} style={{ flex: `0 0 ${step}%`, padding: '0 12px', boxSizing: 'border-box' }}>
                <BlogCard image={b.image} category={b.category} title={b.title} excerpt={b.excerpt} date={b.date} readMoreLabel="Read more" href={`/blog/${b.slug}`} />
              </div>
            ))}
          </div>
        </Reveal>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
          {Array.from({ length: c.maxI + 1 }).map((_, n) => (
            <button key={n} onClick={() => c.go(n)} aria-label={`Page ${n + 1}`}
              style={{ width: n === c.i ? '26px' : '9px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', padding: 0, background: n === c.i ? 'var(--color-accent)' : 'var(--tcc-border)', transition: 'all .35s ease' }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
          <Button variant="link" href="/blog">Read more from the journal &rarr;</Button>
        </div>
      </div>
    </section>
  );
}
