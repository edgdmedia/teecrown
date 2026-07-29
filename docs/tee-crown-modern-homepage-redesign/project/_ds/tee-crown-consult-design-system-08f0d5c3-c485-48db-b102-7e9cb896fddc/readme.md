# Tee'Crown Consult — Design System

Design system for **Tee'Crown Consult Limited** (teecrownconsult.org), a wholly indigenous travel & tourism company registered in Nigeria and based in Lagos. The brand promotes sustainable, responsible tourism — flight & ticket reservation, visa & student-visa assistance, insurance, and curated tour packages (honeymoon, vacation, pilgrimage, medical, custom, plus destination features like Kenya, Turkey, Singapore).

## Sources
- **Live site / `old-site/`:** the real WordPress + Elementor site is the ground truth for the visual design (photo-overlay service & package cards, background-slideshow hero with a `#040452` navy scrim, navy-overlaid photo testimonial band, light-blue "Stories" section `#DBE6FF52`, slate CTA panel, circular social icons). Global colors/type come from the Elementor kit (`assets/uploads/elementor/css/post-6.css`); per-section values from `post-2.css`. Buttons/inputs use a **5px** radius; content cards 8px.
- **Codebase:** `teecrownconsult/` — a Next.js rebuild of the same site; useful for copy and data (`data/*.js`) but its visual reinterpretation is NOT authoritative where it differs from the live site.
- **Fonts:** DM Sans (primary/headings), Roboto (secondary — nav labels, dropcap), and **Trebuchet MS** (accent — buttons + hero subtitle, per the Elementor kit). DM Sans + Roboto load from Google Fonts CDN via `@import` in `tokens/fonts.css`; Trebuchet MS is a system font with a DM Sans fallback (no webfont shipped). The compiler reports 0 bundled webfonts — flag for the user if self-hosting is required.
- **Logo:** real brand mark copied to `assets/logo-landscape.png` (navy "Tee'Crown Consult Ltd" wordmark with a "TC" monogram enclosing an airplane).

## Files (manifest)
- `styles.css` — root entry, `@import`s the four token files.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `components/` — reusable React primitives (see Components).
- `guidelines/` — foundation specimen cards (Colors done; Type/Spacing/Brand pending).
- `assets/` — logo + real photography (hero, tour, blog imagery).
- `thumbnail.html` — homepage brand tile.

## Components
Grounded in the site's actual UI inventory — no invented primitives.
- **Forms:** `Button`, `Input`, `Select`, `Textarea`
- **Primitives:** `Badge`, `Divider`, `SectionHeading`
- **Cards:** `OverlayCard`, `ServiceCard`, `PackageCard`, `BlogCard`, `TestimonialCard`

Namespace: `window.TeeCrownConsultDesignSystem_08f0d5`.

## Content fundamentals
- **Voice:** warm, professional, service-led. First-person plural company voice ("we", "our team", "let us help you"), addressing the reader as "you". Example: *"So sit back, relax, and let Tee'Crown Consult take care of all your travel booking needs."*
- **Casing:** Title Case for headings/nav (nav is UPPERCASE, letter-spaced). Sentence case for body.
- **Sign-off style:** posts often close with the tagline *"Your Trusted Partner for Global Travel Experiences"* plus phone/email/handle.
- **Emoji:** used sparingly in blog/package copy (✈️ 🛂 🎓 🛡️ as service icons; ✅ ⏳ 📞 in posts) — part of the informal Instagram-adjacent tone, not in UI chrome.
- **Themes:** sustainability, cultural appreciation, community impact (e.g. Makoko engagement), "memorable journeys".

## Visual foundations
- **Color:** navy `#000080` is the spine (headings, primary CTA, dark grounds); one green accent `#61CE70` for actions, dividers, category chips; deepest ink `#000B24` for footers and gradient tails. Neutral greys for text (`#54595F`/`#7A7A7A`) on white / `#F5F5F5` surfaces.
- **Type:** DM Sans everywhere; Roboto for uppercase nav labels and the editorial dropcap. Headings bold (700), navy, line-height 1.2. Body 16px / 1.6; long-form 17px / 1.8.
- **Backgrounds:** hero and CTA bands use a 135° navy→ink gradient, over full-bleed travel photography on heroes. Content sections alternate white and `#F5F5F5`.
- **Cards:** white, `8px` radius, soft cool shadow `0 4px 20px rgba(0,0,0,.08)`; on hover they lift `translateY(-4px)` to `0 8px 30px rgba(0,0,0,.12)` and inner images zoom `scale(1.05)` over 0.5s.
- **Buttons:** `8px` radius, 600 weight; hover darkens the fill; outline/white variants invert to navy.
- **Motion:** consistent `0.3s ease` transitions; no bounces. Nav underline grows from the left in green on hover.
- **Dividers:** signature 80×4px green rule under section titles/CTA headings.
- **Radii:** `8px` standard; `20px` pill for category chips.

## Iconography
- **Service icons are emoji** (✈️ 🛂 🎓 🛡️) rendered at 48–64px — this is the site's actual approach, not a substitution.
- No icon font or SVG icon set is used in the codebase. The only vector marks are the logo and decorative package/blog SVGs.
- Social links render as **text labels** (Facebook / X / Instagram / YouTube), not glyph icons.
- Rating stars use Unicode `★`/`☆` in amber `#F0AD4E`.
- If a consuming design needs a stroke-icon set, substitute Lucide (closest neutral match) and flag it — none exists in the source.

## Pending
Type / Spacing / Brand specimen cards, the website UI kit (`ui_kits/website/`), and `SKILL.md` are still to be built.
