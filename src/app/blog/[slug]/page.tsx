"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { blogPosts } from "@/data/blog";
import { contact } from "@/data/contact";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/cards/blog-card";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const pageUrl = `https://teecrownconsult.org${pathname}`;
  const post = blogPosts.find((b) => b.slug === slug);
  const related = blogPosts.filter((x) => x.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <PageShell current="Blog">
        {() => (
          <div style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center' }}>
            <Container>
              <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontSize: '28px', fontWeight: 700 }}>Post not found</h1>
              <p style={{ color: 'var(--color-text)', marginTop: '8px' }}>The article you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/blog"><Button variant="outline" style={{ marginTop: '24px' }}>Back to blog</Button></Link>
            </Container>
          </div>
        )}
      </PageShell>
    );
  }

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
                <a href={contact.social.Instagram} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M16.5 7.5v0"/><circle cx="12" cy="12" r="4"/></svg>
                </a>
                <a href={contact.social.YouTube} target="_blank" rel="noopener noreferrer" title="YouTube" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}><path d="M22.5 7.5a2.9 2.9 0 0 0-2-2C18.7 5 12 5 12 5s-6.7 0-8.5.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 1 12a30 30 0 0 0 .5 4.5 2.9 2.9 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 23 12a30 30 0 0 0-.5-4.5Z"/><path d="m9.5 9 6 3-6 3V9Z"/></svg>
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
