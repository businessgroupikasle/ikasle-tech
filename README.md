# IKASLE Technologies — website

Multi-page marketing site for IKASLE Technologies, built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, GSAP, Motion and React Three Fiber.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in what you have
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Checks: `npm run typecheck` · `npm run lint`

Requires Node.js 20.9 or newer.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: animated brand-logo hero, tech marquee, services, featured work, process timeline, 3D architecture, terminal demo, CTA |
| `/work` | Case studies with category filtering |
| `/work/[slug]` | Case study detail (static, from `src/data/projects.ts`) |
| `/services` | Service explorer with a sticky navigator |
| `/products` | IKASLE-owned products with tabbed details |
| `/contact` | Contact form → `POST /api/contact` |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO |

## Environment variables

See `.env.example`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs, sitemap, Open Graph. **Set this in production.** |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | public | GA4 web stream ID (`G-...`); blank disables analytics. Rebuild after changes. |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` | public | Optional contact overrides. Anything left empty is hidden. The published address is centralized in `src/data/company-contact.ts`. |
| `NEXT_PUBLIC_LINKEDIN_URL` / `NEXT_PUBLIC_GITHUB_URL` | public | Footer social links (optional) |
| `RESEND_API_KEY` | server | Contact form delivery via [Resend](https://resend.com) |
| `CONTACT_TO_EMAIL` | server | Inbox(es) that receive enquiries (comma-separated) |
| `CONTACT_FROM_EMAIL` | server | Sender on a domain verified in Resend |

If the three server variables are not all set, the form does **not** pretend to send: the API returns `503 not_configured`, and the form shows an honest message (plus `NEXT_PUBLIC_CONTACT_EMAIL` if one is set).

## Analytics and search setup

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin (no path) and `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your GA4 web stream ID in the hosting environment, then rebuild and deploy. No GA ID or production domain is stored in this repository.

In GA4 Admin → Data streams → Web → Enhanced measurement → Page views → Advanced settings, enable **Page loads** and **Page changes based on browser history events**. GA4 is the sole source of page views; this app does not manually emit `page_view`. Do not install a second GA tag through Tag Manager or your host. Keep automatic form interactions off if using `generate_lead` as the enquiry conversion; mark `generate_lead` as a key event. Custom events are `contact_click` (phone/email method only), `contact_cta_click`, `view_project`, and `generate_lead` (only after a successful contact API response, excluding the honeypot). Custom events exclude enquiry contents, contact addresses and chatbot messages. GA4 also collects page URLs; do not put personal information in URL parameters.

Verify using Google Tag Assistant and GA4 DebugView: load a page, navigate to another page, then use back/forward. Expect exactly one `page_view` per navigation with the correct location and referrer. Test a phone/email link, contact link, project link, failed enquiry and successful enquiry; only the successful enquiry should emit `generate_lead`. Confirm source/medium using a test UTM campaign and GA4 acquisition reporting. Debug mode should be enabled through Tag Assistant for testing, not for all visitors. Live reporting verification requires the real GA4 property.

`/sitemap.xml` is generated on every build from the public pages, service and project registries, and published blog posts. Draft legal documents and the maintenance-mode blog are excluded. Only known article publication dates are emitted as `lastmod`; build time is not presented as a content modification date. Rebuild when content or publication status changes. `/robots.txt` allows public pages and assets, blocks `/api/`, and advertises the sitemap. These routes must be served by Next.js in production.

After deployment, check both endpoints return HTTP 200 and contain the production origin, then open the verified domain in Google Search Console → Sitemaps → submit `sitemap.xml`. Monitor its fetch status and discovered pages. Search Console submission and GA4 property settings require access to those Google accounts.

References: [GA4 single-page application setup](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Content

All copy lives in `src/data/` and is separate from the components:

- `projects.ts`: case studies. Client name, year, outcome and confirmed tech stack are **pending placeholders**. The UI labels them "to be confirmed" until you fill them in.
- `products.ts`: product modules. List only what is implemented.
- `services.ts`, `navigation.ts`, `technologies.ts`, `architecture.ts`

Interface previews (ERP, attendance) are React mockups with synthetic sample data, and they are labelled as such on the page.

## Brand

- Official logo: `public/brand/ikasle-technologies-logo.png` (transparent PNG, trimmed and resized from the supplied 3240px original; pixels and proportions unchanged).
- Palette tokens live in `src/app/globals.css` (`:root`), mirrored in `src/lib/brand.ts` for Three.js, charts and the OG image. Navy `#08283C` and blue `#008CF8` are sampled from the logo.
- Blue roles: `accent` (`#008CF8`, logo blue) for highlights, icons, borders and selected states; `accent-strong` (`#0072D1`) for button fills and small link text, because white text on the logo blue is only 3.4:1 (below WCAG AA).

## Animation system: one engine per element

| Engine | Owns |
| --- | --- |
| **GSAP + ScrollTrigger** (`@gsap/react` `useGSAP`) | Hero logo entrance, idle float and scroll parallax (`HeroLogo`, separate wrappers), headline word reveals (`AnimatedHeading`), project clip-path reveal + parallax (`ProjectReveal`), process timeline progress/active step, case-study storytelling, service and product section entrances |
| **Motion** (`motion/react`) | Component entrances (`ScrollReveal`, `RevealGroup`), hero logo pointer tilt (its own wrapper), `MagneticButton`, nav indicator, mobile menu, tabs/filters, page transitions, form states |
| **CSS** | Marquee, caret blink, ambient gradients, code rain, dashed data-flow lines, shimmer, pulse dots |
| **React Three Fiber** | Interactive architecture stack (the hero logo is flat, so it uses no WebGL) |

Every GSAP animation runs inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` and is reverted on unmount. Motion uses `<MotionConfig reducedMotion="user">`. CSS animations are disabled under the reduced-motion media query, and the marquee becomes a static wrapped list.

3D scenes are dynamically imported (`ssr: false`). They mount only near the viewport, pause their render loop offscreen, cap the DPR, use no textures, and fall back to a static HTML diagram when WebGL is unavailable or a scene throws (`SceneShell`). The architecture scene disables orbit dragging on touch so the page still scrolls, and layers stay selectable by tap or through the accessible tab list.

## Contact API hardening

`src/app/api/contact/route.ts`: same-origin check, 20 KB body limit, per-IP rate limit (5 per 10 minutes, in-memory), Zod validation shared with the client, a honeypot field, and a minimum fill-time trap. Responses are typed (`ContactResponse`). Credentials stay server-side.

The in-memory rate limiter is per instance. On serverless or multi-instance hosting, move it to a shared store such as Redis or Upstash.
