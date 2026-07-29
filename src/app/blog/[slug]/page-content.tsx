"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import type { BlogPost } from "@/data/blog";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/cards/blog-card";
import { Button } from "@/components/ui/button";

export function BlogDetailContent({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const pathname = usePathname();
  const pageUrl = `https://teecrownconsult.org${pathname}`;

  return (
    <PageShell current="Blog">
      {({ openContact }) => (
        <>
          <section style={{ position: 'relative', overflow: 'hidden', color: '#fff' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${post.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(0,0,50,0.92), rgba(0,11,36,0.62))' }} />
            <Container style={{ position: 'relative', padding: '140px var(--container-padding) 64px', maxWidth: '820px' }}>
              <a href="/blog" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← All stories</a>
              <div style={{ margin: '16px 0 12px' }}><Badge tone="accent">{post.category}</Badge></div>
              <h1 style={{ fontFamily: 'var(--font-primary)', color: '#fff', fontWeight: 700, fontSize: 'clamp(30px,4.4vw,46px)', lineHeight: 1.12, margin: 0 }}>{post.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px', color: 'rgba(255,255,255,0.82)', fontSize: '14.5px' }}>
                <span>{post.author}</span><span style={{ opacity: 0.5 }}>•</span><span>{post.date}</span>
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
                  <Button variant="accent" onClick={openContact}>Book a trip</Button>
                </div>
              </Reveal>
              <Reveal style={{ marginTop: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"/></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" title="X" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><path d="M4 4l6.2 8.3L4 20h2.3l5-5.6L15.7 20H20l-6.7-9.2L19.5 4h-2.3l-4.6 5.4L8 4H4Z"/></svg>
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + pageUrl + '\n\n' + 'https://teecrownconsult.org' + post.image)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}><path d="M17.472 14.382c-.297-.149-1.757-.867-2.03-.967-.273-.099-.473-.149-.672.15-.2.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.76-1.653-2.059-.173-.298-.018-.46.13-.61.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.672-1.62-.922-2.219-.242-.579-.487-.5-.672-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
                <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent('Check out this story: ' + post.title + '\n\n' + pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Email" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
              </Reveal>
            </div>
          </Section>
          <Section tint="alt">
            <Reveal><Eyebrow center>Read next</Eyebrow></Reveal>
            <Reveal delay={60}><Heading center>More from the journal</Heading></Reveal>
            <div className="tcc-grid-3" style={{ marginTop: 'var(--space-lg)' }}>
              {related.map((b, n) => (
                <Reveal key={b.slug} delay={n * 80} style={{ height: '100%' }}>
                  <BlogCard image={b.image} category={b.category} title={b.title} excerpt={b.excerpt} date={b.date} readMoreLabel="Read more" href={`/blog/${b.slug}`} />
                </Reveal>
              ))}
            </div>
          </Section>
        </>
      )}
    </PageShell>
  );
}
