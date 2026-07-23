# YS Systems & Software — Frontend Structure Reference

> This document is a complete map of the `ys-web` frontend. It is meant as a
> reference for any AI assistant (e.g. Claude) working on the UI, especially the
> **Hero Section** (`components/sections/HeroSection.tsx`). If you need a file
> not listed here, ask for it specifically.

---

## 0. Tech Stack (READ FIRST)

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Uses `app/` directory routing |
| Language | **TypeScript** (strict) | `tsc --noEmit` must pass |
| React | **React 19** | |
| Styling | **Tailwind CSS v3** + **CSS variables** | Colors are CSS vars, NOT Tailwind palette |
| Animations | **framer-motion v11** | ⚠️ **DO NOT use GSAP** — not installed |
| Icons | **lucide-react** | `import { Search } from 'lucide-react'` |
| State | **zustand v5** | Used for theme store |
| Classnames | **clsx + tailwind-merge** | Use `cn()` helper (not template strings when possible) |
| Fonts | Google Fonts via CSS `@import` | DM Sans, DM Mono, Space Grotesk |
| Images | `next/image` for product covers; `<img>` for logos/branding | Hero bg uses plain `<img>` |

**Build commands:** `npm run dev` · `npm run build` · `npm run lint` · `npm run type-check`

---

## 1. Directory Tree (source only)

```
ys-web/
├── app/
│   ├── layout.tsx                  # Root layout (html/body, fonts, meta)
│   └── [locale]/
│       ├── (public)/
│       │   ├── layout.tsx          # Public shell: Header + Footer + SEO JSON-LD
│       │   ├── page.tsx            # 🏠 HOMEPAGE — renders HeroSection
│       │   ├── about/page.tsx
│       │   ├── products/page.tsx + [slug]/page.tsx
│       │   ├── ecosystem/page.tsx
│       │   ├── contact/ContactClient.tsx   # the GET STARTED target
│       │   ├── docs/ / roadmap/ / updates/ / releases/ / changelog/
│       │   ├── careers/ / faq/ / security/ / status/
│       │   ├── privacy/ / terms/ / cookie-policy/
│       │   └── error.tsx / loading.tsx
│       └── admin/ ...              # CMS dashboard (NOT public, ignore for hero)
├── components/
│   ├── sections/                   # page-level sections
│   │   ├── HeroSection.tsx         # ⭐ THE HERO (main file to edit)
│   │   ├── ProductsSection.tsx
│   │   ├── WhyChooseSection.tsx    # "Security First / Bilingual / Built to Scale"
│   │   └── CTASection.tsx
│   ├── layout/
│   │   ├── Header.tsx              # floating glass navbar
│   │   └── Footer.tsx
│   ├── ui/                         # primitives
│   │   ├── Button.tsx              # variants: primary/secondary/ghost/danger
│   │   └── Badge.tsx
│   ├── shared/                     # cross-cutting
│   │   ├── AnimatedBox.tsx         # framer-motion wrapper (fade-up)
│   │   ├── SearchModal.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── CookieConsent.tsx
│   │   └── LocaleSync.tsx
│   └── admin/ ...                  # ignore
├── lib/
│   ├── api/client.ts               # axios-free fetch wrapper → backend API
│   ├── cms/
│   │   ├── schemas.ts              # zod schemas (hero, cta, whyChoose)
│   │   └── validate.ts             # validateCmsContent(), validateUrl()
│   ├── stores/theme.ts             # useThemeStore (zustand)
│   ├── seo.ts                      # buildMetadata(), JSON-LD helpers
│   ├── utils/cn.ts                 # cn() classname helper
│   └── search-verification.ts
├── types/index.ts                  # ALL shared TS interfaces
├── i18n/messages/{en,ar}.json      # static translation strings
├── public/branding/
│   ├── hero/hero.webp              # 🖼️ desktop hero bg (chrome YS logo + neon)
│   ├── hero/hero-mobile.webp       # 🖼️ mobile hero bg
│   ├── logo/logo.webp|light|dark   # YS wordmark (32px)
│   ├── products/{ys-matrix,vortex,ys-medical}/
│   ├── about/ social/ icon/ apple/ favicon/
│   └── illustrations/              # (unused illustrations)
├── styles/globals.css              # ⭐ CSS variables + hero glass classes
├── tailwind.config.ts              # Tailwind theme → maps to CSS vars
├── next.config.ts
├── package.json
└── tsconfig.json                  # path alias: @/* → project root
```

---

## 2. The Hero Section — `components/sections/HeroSection.tsx`

### Current responsibilities
- Floating glass **navbar** (72px) with logo, nav links, search, language switch, theme switch, Get Started.
- **Two-column 40/60 layout** (`grid-cols-[40fr_60fr]`):
  - **LEFT (40%)** — badge → headline → description → buttons (only text, NEVER overlaps logo).
  - **RIGHT (60%)** — chrome YS logo (from `hero.webp` bg) with **3 orbiting product cards**.
- **3 product cards** (220×120): YS-Matrix (top-right), YS-Sports (bottom-left), Vortex Trader_Y (bottom-right).
- Subtle **framer-motion** animations: fade-up, floating cards, mouse-parallax on logo.
- Mobile: stacked vertical layout with product cards below hero content.

### Props
```ts
interface HeroSectionProps {
  locale: string                       // 'en' | 'ar'
  settings?: PublicSettings           // from API (optional)
  cmsSection?: HomepageSection        // from API (optional)
}
```
> NOTE: the *current* component only uses `locale`. `settings`/`cmsSection`
> are passed from `page.tsx` but the hero currently hardcodes EN/AR fallback
> text. Keep this prop signature so `page.tsx` doesn't break.

### Hardcoded content (fallbacks)
- Badge EN: `Software Ecosystem Company`
- Headline EN: `Building the Next Generation of Business Software`
  (highlight `Business Software` with `.text-gradient-blue`)
- Subline EN: `Scalable SaaS platforms and digital ecosystems designed to power modern businesses worldwide.`
- CTA primary: `Explore Ecosystem` → `/{locale}/ecosystem`
- CTA secondary: `View Products` → `/{locale}/products`
- Arabic equivalents exist in the `fallback.ar` object.

### Key CSS classes used (defined in `styles/globals.css`)
| Class | Purpose |
|---|---|
| `.glass-nav` | fixed navbar glassmorphism |
| `.glass-card` / `.glass-badge` | product cards / badge glass |
| `.btn-hero-primary` / `.btn-hero-secondary` | CTA buttons |
| `.text-gradient-blue` | blue gradient text |
| `.bg-grid` | subtle grid overlay |
| `.animate-float` / `.animate-pulse-glow` | floating / glow loops |

### Background images (DO NOT replace)
```tsx
<img src="/branding/hero/hero.webp"        className="hidden md:block" />  // desktop
<img src="/branding/hero/hero-mobile.webp" className="md:hidden" />       // mobile
```
The chrome **YS logo** lives *inside* these images — never add a separate
`<img>` of the logo in the hero; use the bg image as the visual centerpiece.

---

## 3. Design System — `styles/globals.css` (MUST FOLLOW)

### CSS Variables (light & dark defined)
```css
:root {                         [data-theme="dark"], .dark {
  --color-background         #FAFAFA      --color-background         #09090B
  --color-background-subtle  #F4F4F5      --color-background-subtle  #111113
  --color-foreground         #09090B      --color-foreground         #FAFAFA
  --color-foreground-muted   #71717A      --color-foreground-muted   #71717A
  --color-accent             #4F46E5      --color-accent             #6366F1
  --color-accent-hover       #4338CA      --color-accent-hover       #818CF8
  --color-accent-subtle  rgba(99,102,241,.12)
  --color-border             #E4E4E7      --color-border             #27272A
  --color-surface            #FFFFFF      --color-surface            #111113
  --font-sans    'DM Sans'               --font-display 'Space Grotesk'
  --font-mono    'DM Mono'
}
```
**Rule:** Always reference colors via `var(--color-*)`, never hex/rgb literals
(except for glows/accents where intentional). Dark mode is automatic via
`data-theme="dark"` or `.dark` class (set by `lib/stores/theme.ts`).

### Fonts
- `--font-display` (Space Grotesk) → headings, logos, product titles.
- `--font-sans` (DM Sans) → body text.
- `--font-mono` (DM Mono) → versions, code, kbd.

### Tailwind → CSS var mapping (`tailwind.config.ts`)
`colors.background`, `colors.foreground`, `colors.accent`, `colors.border`,
`colors.surface` all map to the CSS vars above. So `text-foreground`,
`bg-accent`, `border-border` etc. work.

### Fluid type utilities (already in globals.css)
`text-fluid-sm → text-fluid-hero` (clamp-based). Hero headline uses
`clamp(56px, 6vw, 84px)` directly via inline style.

---

## 4. Navigation — `components/layout/Header.tsx`

- `fixed top-0` glass navbar, height `h-16` (64px) — the hero has its own 72px
  navbar internally; on the real page the public `Header` is used. **If you
  edit the hero's internal navbar, keep it consistent with `Header.tsx`.**
- Uses `useThemeStore()` for dark/light toggle.
- Search opens `SearchModal` (Cmd/Ctrl+K).
- Language switch swaps `/en` ↔ `/ar` in the path.
- Get Started → `/{locale}/contact`.

---

## 5. Data Flow (Server → Client)

```
app/[locale]/(public)/page.tsx  (Server Component)
   ├─ Promise.allSettled([
   │     api.products(locale),
   │     api.settings(locale),
   │     api.homepageSections(locale),
   │   ])
   └─ <HeroSection locale settings cmsSection={heroSection} />
```

- `lib/api/client.ts` → fetches from `NEXT_PUBLIC_API_URL` (default
  `http://localhost:8000/api/v1`). All GETs cached 60s.
- `types/index.ts` defines `PublicSettings`, `Product`, `HomepageSection`,
  `Menu`, etc. Import these, **do not redefine** them.

### `PublicSettings` (relevant fields)
```ts
brand:        { company_name, company_tagline_en/ar, contact_email }
contacts?:    { support_email, sales_email, ... }
content?: {
  hero_headline_en/ar, hero_subline_en/ar,
  homepage_stats: [{label_en, label_ar, value}],
  why_choose_items: [{icon, title_en/ar, description_en/ar}],
}
```

### `HomepageSection` (CMS driven)
```ts
{ id, type: 'hero'|'why_choose'|'products'|'cta', title, subtitle, content, sort_order }
```
The hero reads `cmsSection` where `type === 'hero'`.

---

## 6. CMS Schemas — `lib/cms/schemas.ts`

```ts
heroContentSchema = z.object({
  badge_en, badge_ar,
  cta_primary_en/ar, cta_secondary_en/ar,
  cta_primary_url, cta_secondary_url,
})
whyChooseContentSchema, ctaContentSchema  // similar
```
Validate with `validateCmsContent(section, schema)` from `lib/cms/validate.ts`.
Use `validateUrl(url, default)` for any href from CMS.

---

## 7. Theme Store — `lib/stores/theme.ts`

```ts
const { theme, setTheme, resolvedTheme } = useThemeStore()
// theme: 'light'|'dark'|'system'
// resolvedTheme(): 'light'|'dark'  (guard for SSR)
```
Apply via `data-theme` attr + `.dark` class. Always guard `mounted` before
reading `resolvedTheme()` to avoid hydration mismatch (see Header.tsx pattern).

---

## 8. Animation Helpers

- `components/shared/AnimatedBox.tsx` — generic fade-up wrapper using
  framer-motion; respects `prefers-reduced-motion`. Use for sections below hero.
- Inside `HeroSection.tsx`, framer-motion is used directly (`motion.*`,
  `useScroll`, `useTransform`, `useSpring`, `useMotionValue`).
- **Reduced motion:** globals.css disables animations under
  `prefers-reduced-motion: reduce`.

---

## 9. i18n & RTL

- Locales: `en` (LTR) and `ar` (RTL).
- `app/layout.tsx` injects a script setting `dir="rtl"` for `/ar`.
- All user-facing strings in hero are in `fallback.en` / `fallback.ar`.
- When adding text, provide BOTH languages. Use `isAr = locale === 'ar'`.

---

## 10. Conventions / Rules for AI edits

1. **Use `cn()`** from `@/lib/utils/cn` for conditional classes.
2. **Colors → CSS vars** (`var(--color-*)`). Never hardcode brand hex in body
   text/borders (glows/accents may use indigo `#6366F1` intentionally).
3. **No GSAP** — framer-motion only.
4. **Keep prop signature** of `HeroSection` compatible with `page.tsx`.
5. **Don't replace** `hero.webp` / `hero-mobile.webp` — design *around* the
   chrome YS logo that's already in them.
6. **Don't break `tsc --noEmit`** and `next build`.
7. **Server vs Client:** `HeroSection` is `'use client'` (animations). `page.tsx`
   is a Server Component — don't add `'use client'` there.
8. Import shared types from `@/types`, never redeclare.
9. Keep EN + AR copies for every visible string.
10. Respect `prefers-reduced-motion`.

---

## 11. Files you will most likely need for Hero work

| File | Why |
|---|---|
| `components/sections/HeroSection.tsx` | the component |
| `styles/globals.css` | design tokens + glass/hero classes |
| `tailwind.config.ts` | theme mapping |
| `types/index.ts` | `PublicSettings`, `HomepageSection` |
| `lib/stores/theme.ts` | theme toggle |
| `lib/api/client.ts` | data fetching pattern |
| `lib/cms/schemas.ts` + `validate.ts` | CMS content |
| `app/[locale]/(public)/page.tsx` | how hero is mounted |
| `app/[locale]/(public)/layout.tsx` | public shell + SEO |
| `components/layout/Header.tsx` | navbar consistency |
| `public/branding/hero/*.webp` | background assets (reference only) |
| `package.json` | dependency check (framer-motion ✓, GSAP ✗) |

If you need anything else (e.g. `Footer.tsx`, `Button.tsx`, `SearchModal.tsx`,
`i18n/messages/*.json`), request it explicitly.
