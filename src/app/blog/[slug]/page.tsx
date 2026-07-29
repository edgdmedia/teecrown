import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog";
import { BlogDetailContent } from "./page-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Tee'Crown Consult`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://teecrownconsult.org/blog/${post.slug}`,
      type: "article",
      images: [{ url: post.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  const related = blogPosts.filter((x) => x.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center' }}>
        <Container>
          <h1 style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-heading)', fontSize: '28px', fontWeight: 700 }}>Post not found</h1>
          <p style={{ color: 'var(--color-text)', marginTop: '8px' }}>The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog"><Button variant="outline" style={{ marginTop: '24px' }}>Back to blog</Button></Link>
        </Container>
      </div>
    );
  }

  return <BlogDetailContent post={post} related={related} />;
}
