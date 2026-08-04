"use client";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

interface CtaBandProps {
  onContact?: () => void;
  title?: string;
  text?: string;
  cta?: string;
}

export function CtaBand({ onContact, title = "Ready when you are", text = "Tell us where you're dreaming of. We'll turn it into a real, well-planned journey — usually with a quote back the same day.", cta = "Book Now" }: CtaBandProps) {
  return (
    <Section>
      <Reveal className="tcc-cta-pad" style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px', background: 'var(--tcc-gradient-cta)', padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(97,206,112,0.18)', filter: 'blur(10px)' }} />
        <div style={{ position: 'relative' }}>
          <Heading light center style={{ maxWidth: '720px', margin: '0 auto' }}>{title}</Heading>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', lineHeight: 1.7, maxWidth: '600px', margin: '18px auto 32px' }}>{text}</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="accent" size="lg" onClick={onContact}>{cta}</Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
