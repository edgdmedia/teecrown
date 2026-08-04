# Keystatic Content Model

Editor-facing content model for the Tee'Crown Consult site after migrating from Payload to Keystatic (GitHub mode).

**Storage:** content is plain files committed to the repo at `src/content/**`, written by the Keystatic admin UI at `dash.teecrownconsult.org`. The public site reads these files at build time; deploys rebuild on push to `main`.

## Singletons

- **Site settings** (`src/content/site.yaml`) — brand identity shown in the nav, footer, and metadata.
- **Contact details** (`src/content/contact.yaml`) — phone, WhatsApp, email, address, social links.

## Collections

- **Blog posts** (`src/content/blog/*`) — each post is one file keyed by slug.
- **Tours** (`src/content/tours/*`) — each tour package is one file keyed by slug.
- **Testimonials** (`src/content/testimonials/*`) — customer quotes shown on the homepage.

## Field choices

### Site settings (singleton)
| Field | Type | Notes |
| --- | --- | --- |
| name | text | Short brand name (nav/footer) |
| fullName | text | Registered company name |
| tagline | text | Homepage hero tagline |
| description | text (multiline) | Meta description / footer blurb |
| url | text | Canonical site URL |

### Contact details (singleton)
| Field | Type | Notes |
| --- | --- | --- |
| phone | text | Local display format |
| phoneIntl | text | `+234...` for tel: links |
| wa | text | WhatsApp number (no `+`) |
| email | text | Contact email |
| address | text | Street address |
| social | object | Facebook / Instagram / X / YouTube URLs |

### Blog posts (collection)
| Field | Type | Notes |
| --- | --- | --- |
| title | text | Post headline |
| slug | slug | URL segment under `/blog/` |
| category | select | Blog / Guide / Impact / Adventure / Tourism |
| date | text | Display date, e.g. `June 4, 2026` |
| author | text | Author name |
| excerpt | text (multiline) | Card + meta description |
| image | image | Cover image (Cloudflare-hosted URL) |
| body | document (Markdoc) | Article body; rendered on the public site |

### Tours (collection)
| Field | Type | Notes |
| --- | --- | --- |
| title | text | Package name |
| slug | slug | URL segment under `/tours/` |
| location | text | `City · Region` |
| duration | text | e.g. `7–10 days` |
| tag | text | Badge label (Popular, Safari, …) |
| excerpt | text (multiline) | Card + meta description |
| image | image | Hero image URL |
| gallery | array(image) | Lightbox gallery URLs |
| intro | document (Markdoc) | Overview paragraphs |
| included | array(text) | "What's included" list |
| highlights | array(text) | "Trip highlights" list |
| pricing | array(object) | `label` / `value` rows |
| itinerary | array(object) | `day` / `description` rows |
| requirements | array(text) | Visa/documentation requirements |
| hashtags | array(text) | Social hashtags |
| validUntil | text | Optional pricing validity date |

### Testimonials (collection)
| Field | Type | Notes |
| --- | --- | --- |
| name | text | Customer name |
| title | text | Role/context label |
| text | text (multiline) | The quote |
| rating | number | 1–5 (default 5) |

## Kept as static code (not CMS-editable)

These drive marketing-page structure and are unlikely to change via the editor; they stay as TypeScript data:

- `src/data/services.ts` — services section (icons, images, detail bullets)
- `src/data/reasons.ts` — "why choose us" cards
- `src/data/stats.ts` — homepage stat band
- `src/data/steps.ts` — how-it-works steps
- `src/data/blog.ts` `heroSlides` — homepage hero carousel images

They can be promoted to Keystatic singletons/collections later if needed.

## Rendering decisions

- **Rich text:** Keystatic `fields.document` writes Markdoc (`.mdoc`). The public site renders it with `@markdoc/next.js` (or a lightweight Markdoc-to-JSX renderer), replacing the current `LexicalRenderer` for CMS-sourced fields.
- **Images:** stored as public Cloudflare-hosted URLs in content files (Option A in the migration plan). No R2 upload integration in the first cutover.
- **Build model:** all content pages are fully static. Content changes land in a Git commit (made by Keystatic) → push to `main` → GitHub Actions rebuild + deploy. No runtime CMS fetch, no ISR revalidation on the Worker.

## Coverage check

| Route | Source | Satisfied? |
| --- | --- | --- |
| `/` | site, testimonials, tours, blog, services, reasons, stats, steps | Yes |
| `/about` | reasons (static) | Yes |
| `/services` | services (static) | Yes |
| `/blog` | blog collection | Yes |
| `/blog/[slug]` | blog collection | Yes |
| `/tours` | tours collection | Yes |
| `/tours/[slug]` | tours collection | Yes |
| `/sitemap.xml` | tours + blog collections | Yes (reads repo files at build) |
