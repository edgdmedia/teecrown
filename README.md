# Tee'Crown Consult

Travel and tourism website for Tee'Crown Consult Limited — a Nigerian travel and tourism company offering flights, visas, insurance, tours, and vacation packages.

Built with [Next.js](https://nextjs.org) (App Router) and deployed on [Cloudflare Workers](https://workers.cloudflare.com) via `@opennextjs/cloudflare`.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + inline styles
- **Deployment:** Cloudflare Workers (`@opennextjs/cloudflare` + Wrangler)

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── about/
│   ├── blog/
│   ├── services/
│   └── tours/
├── components/
│   ├── cards/        # Reusable card components
│   ├── layout/       # Shell, nav, footer, containers
│   ├── motion/       # Animation wrappers
│   ├── sections/     # Homepage section components
│   └── ui/           # Primitives (buttons, badges, icons, lightbox)
├── data/             # Content data (packages, services, blog posts, etc.)
└── lib/              # Shared context and utilities
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Adding a Tour Package

Tour packages are defined in `src/data/packages.ts`. Each package uses a flexible content structure:

```typescript
{
  slug: 'my-package',
  title: 'My Package',
  location: 'City · Region',
  image: '/images/tour-my-package.webp',
  duration: '5 days',
  gallery: ['/images/tour-my-package.webp', '/images/gallery-2.webp'],
  excerpt: 'Short description',
  tag: 'Tag',
  content: {
    intro: ['Paragraph one.', 'Paragraph two.'],
    highlights: ['Highlight 1', 'Highlight 2'],
    included: ['Service 1', 'Service 2'],
    pricing: [{ label: 'Price', value: '₦1,000,000' }],
    itinerary: [{ day: 'Day 1', description: 'Arrival' }],
    requirements: ['Passport', 'Photo'],
    hashtags: ['#Tag1', '#Tag2'],
    validUntil: 'December 31, 2026',
  },
}
```

All sections except `intro` are optional — only render what the package needs.

## Deploying to Cloudflare

### Prerequisites

```bash
npx wrangler login
npx wrangler whoami
```

### Build & Deploy

```bash
npm run build:cloudflare   # Build for Cloudflare Workers
npm run deploy             # Build + deploy
```

### Local Preview

```bash
npm run preview
```

### Manual Deploy

```bash
npm run build:cloudflare
npx wrangler deploy
```

The worker runs at `https://teecrownconsult.<account-id>.workers.dev`. Add a custom domain in the Cloudflare Dashboard under Workers & Pages → your worker → Settings → Triggers → Custom Domains.

## Image Guidelines

- All images should be in **WebP** format for optimal performance
- Place images in `public/images/`
- Reference as `/images/your-image.webp`
- Gallery images should use a 4:3 aspect ratio for consistent display

## Branching

- Work on the `development` branch
- Merge `development` into `main` when ready to deploy
- Cloudflare auto-deploys when `main` is updated (if Git integration is configured)
