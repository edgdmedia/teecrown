"use client";

type LexNode = Record<string, unknown> & { type?: string; children?: LexNode[]; text?: string; format?: number };

function InlineText({ node }: { node: LexNode }) {
  const text = node.text ?? '';
  const f = node.format ?? 0;
  const cls = [
    f & 1 ? 'fw-600' : '',
    f & 2 ? 'fst-italic' : '',
    f & 4 ? 'text-underline' : '',
    f & 8 ? 'text-strikethrough' : '',
  ].filter(Boolean).join(' ');
  if (node.code) return <code>{text}</code>;
  return <span className={cls || undefined}>{text}</span>;
}

function rn(node: LexNode, key: string): React.ReactNode {
  if (node.type === 'text') return <InlineText key={key} node={node} />;
  if (node.type === 'linebreak') return <br key={key} />;

  const children = node.children ? node.children.map((c, i) => rn(c, `${key}-${i}`)) : null;

  if (node.type === 'paragraph') {
    return <p key={key} style={{ fontSize: '17px', lineHeight: 1.85, color: 'var(--color-text)', margin: '0 0 22px' }}>{children}</p>;
  }

  if (node.type === 'heading') {
    const Tag = (node.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') ?? 'h2';
    return <Tag key={key} style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, color: 'var(--color-heading)', margin: '28px 0 12px' }}>{children}</Tag>;
  }

  if (node.type === 'list') {
    const listType = node.listType as string;
    const Tag = listType === 'number' ? 'ol' : 'ul';
    return <Tag key={key} style={{ paddingLeft: '24px', margin: '0 0 22px' }}>{children}</Tag>;
  }

  if (node.type === 'listitem') {
    return <li key={key} style={{ fontSize: '17px', lineHeight: 1.7, color: 'var(--color-text)', marginBottom: '6px' }}>{children}</li>;
  }

  if (node.type === 'quote') {
    return <blockquote key={key} style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '20px', margin: '0 0 22px', fontSize: '17px', lineHeight: 1.7, color: 'var(--color-text-strong)', fontStyle: 'italic' }}>{children}</blockquote>;
  }

  if (node.type === 'upload') {
    const val = node.value as { url?: string; alt?: string } | undefined;
    const src = val?.url ?? '';
    return <img key={key} src={src} alt={val?.alt ?? ''} style={{ width: '100%', borderRadius: '12px', margin: '16px 0', display: 'block' }} />;
  }

  if (node.type === 'link') {
    return <a key={key} href={node.url as string} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{children}</a>;
  }

  if (children) return <span key={key}>{children}</span>;
  return null;
}

export function LexicalRenderer({ data }: { data: { root: Record<string, unknown> } | Record<string, unknown> }) {
  const root = 'root' in data ? data.root : data;
  const children = (root as LexNode).children ?? [];
  return <>{children.map((c, i) => rn(c, `r-${i}`))}</>;
}
