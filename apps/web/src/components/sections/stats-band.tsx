"use client";

import { stats } from "@/data/stats";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";

export function StatsBand() {
  return (
    <section style={{ background: 'var(--tcc-gradient-cta)', position: 'relative', marginTop: '-1px' }}>
      <div className="mx-auto w-full px-5" style={{ maxWidth: 'var(--container-width)', padding: '46px 20px' }}>
        <div className="tcc-stats">
          {stats.map((s, n) => (
            <Reveal key={s.label} delay={n * 90} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: '#fff', fontSize: 'clamp(32px,4vw,46px)', lineHeight: 1 }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.72)', fontSize: '14px', letterSpacing: '0.3px' }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
