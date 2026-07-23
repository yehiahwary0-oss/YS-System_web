'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, ArrowLeft, Box, Activity, HeartPulse } from 'lucide-react'
import type { PublicSettings, HomepageSection } from '@/types'
import { cn } from '@/lib/utils/cn'
import { buttonVariants } from '@/components/ui/Button'
import { heroContentSchema } from '@/lib/cms/schemas'
import { validateCmsContent, validateUrl } from '@/lib/cms/validate'

interface HeroSectionProps {
  locale: string
  settings?: PublicSettings
  cmsSection?: HomepageSection
}

// ── Static fallback copy (used until CMS/settings provide real content) ──
const fallback = {
  en: {
    badge: 'Software Products Company',
    headline_l1: 'Building the Next',
    headline_l2: 'Generation of',
    headline_hl: 'Business Software',
    subline: 'Scalable SaaS platforms and digital ecosystems designed to power modern businesses worldwide.',
    cta_primary: 'Explore Ecosystem',
    cta_secondary: 'View Products',
    ecosystem_line: '3 Products',
    ecosystem_line_hl: 'One Ecosystem',
    trust_line_1: 'Trusted by 1,000+ businesses',
    trust_line_2: 'across the globe',
  },
  ar: {
    badge: 'شركة المنتجات البرمجية',
    headline_l1: 'بناء الجيل التالي',
    headline_l2: 'من البرمجيات',
    headline_hl: 'التجارية',
    subline: 'منصات SaaS قابلة للتوسع وأنظمة رقمية مصممة لتمكين الأعمال الحديثة في جميع أنحاء العالم.',
    cta_primary: 'استكشف المنظومة',
    cta_secondary: 'عرض المنتجات',
    ecosystem_line: '٣ منتجات',
    ecosystem_line_hl: 'منظومة واحدة',
    trust_line_1: 'موثوق من أكثر من 1,000 شركة',
    trust_line_2: 'حول العالم',
  },
}

// Generic trust-avatar placeholders — initials + accent-tinted gradients,
// not fabricated customer photos. Swap for real logos/photos via CMS later.
const TRUST_AVATAR_INITIALS = ['AK', 'MS', 'RH', 'NY'] as const
const TRUST_AVATAR_COLORS = ['#2F7BFF', '#8B5CF6', '#10B981', '#F59E0B'] as const

// NOTE — product slugs are assumed (`/products/[slug]`) as `ys-matrix`,
// `ys-sports`, `ys-care`. If the real slugs differ, only this array needs
// updating — nothing else in the component depends on the exact string.
const products = [
  {
    slug: 'ys-matrix',
    title: 'YS-Matrix',
    desc_en: 'ERP & Business Management Platform',
    desc_ar: 'منصة ERP وإدارة الأعمال',
    icon: Box,
    // A dedicated, saturated brand blue — NOT var(--color-accent). That
    // variable is reused for every button/link across the whole site, so
    // using it here made the flagship product card look identical to
    // generic UI chrome instead of having its own brand identity, like the
    // vivid blue in the target mockup.
    color: '#2F7BFF',
    bg: 'rgba(47,123,255,0.14)',
  },
  {
    slug: 'ys-sports',
    title: 'YS-Sports',
    desc_en: 'Sports Coaching Marketplace & Management',
    desc_ar: 'سوق تدريب رياضي وإدارة',
    icon: Activity,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    slug: 'ys-care',
    title: 'YS-Care',
    desc_en: 'Healthcare Management & Service Platform',
    desc_ar: 'إدارة وخدمات الرعاية الصحية',
    icon: HeartPulse,
    color: 'var(--color-success)',
    bg: 'rgba(16,185,129,0.12)',
  },
] as const

// ── Product card — fully built with code: glass, border, blur, glow,
// hover + idle-float motion, clickable, links to its own product page. ──
function ProductCard({
  product,
  isAr,
  locale,
  index,
  compact = false,
  className,
  style,
}: {
  product: typeof products[number]
  isAr: boolean
  locale: string
  index: number
  compact?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const desc = isAr ? product.desc_ar : product.desc_en
  const Arrow = isAr ? ArrowLeft : ArrowRight
  const Icon = product.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: 1,
        y: [0, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.5 + index * 0.12, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 },
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn('absolute', className)}
      style={style}
    >
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group block cursor-pointer rounded-2xl transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          padding: compact ? 12 : 16,
          width: compact ? 158 : 220,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = product.color
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.35), 0 0 24px -4px ${product.color}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)'
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 flex items-center justify-center rounded-xl"
            style={{ width: compact ? 32 : 40, height: compact ? 32 : 40, backgroundColor: product.bg }}
          >
            <Icon size={compact ? 16 : 18} style={{ color: product.color }} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span
                className="font-display font-semibold tracking-tight truncate"
                style={{ fontSize: compact ? 12.5 : 14, color: 'rgba(255,255,255,0.95)' }}
              >
                {product.title}
              </span>
              <Arrow size={12} className="shrink-0 opacity-50 group-hover:opacity-90 transition-opacity" style={{ color: 'rgba(255,255,255,0.6)' }} aria-hidden="true" />
            </div>
            {!compact && (
              <p className="mt-1 leading-relaxed" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                {desc}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Connector lines — CSS/SVG only, animated glow, never baked into the
// image. Coordinates are % of whatever "stage" wraps this component: on
// desktop that's now the full section (absolute inset-0), on mobile it's
// still the dedicated 340×300 stage below. Cards always share the same
// coordinate space as the lines pointing at them. ──
function ConnectorLines({ variant }: { variant: 'desktop' | 'mobile' }) {
  // Each line is tinted to match the card it belongs to — measured directly
  // from the reference design (not guessed): Matrix's own stem uses its
  // brand blue, everything touching Sports uses Sports' periwinkle-purple,
  // everything touching Care uses Care's teal-green.
  const MATRIX_GLOW = 'rgba(47,123,255,0.85)'
  const SPORTS_GLOW = 'rgba(139,126,212,0.85)'
  const CARE_GLOW = 'rgba(63,194,221,0.85)'

  const paths =
    variant === 'desktop'
      ? [
          // Matrix — simple stem straight down onto the top of the "Y".
          // x=64 is Matrix's true center now that positioning uses calc()
          // instead of the transform framer-motion was silently dropping.
          { d: 'M 64 16 L 64 37', color: MATRIX_GLOW },
          // Matrix → Sports.
          { d: 'M 60 16 L 60 32 L 50 32 L 50 35', color: SPORTS_GLOW },
          // Matrix → Care.
          { d: 'M 68 16 L 68 32 L 85 32 L 85 35', color: CARE_GLOW },
          // Sports card's OWN second line, separate from the one above,
          // running from its bottom edge down to the platform.
          { d: 'M 50 54 L 50 80', color: SPORTS_GLOW },
          // Mirror for Care.
          { d: 'M 85 54 L 85 80', color: CARE_GLOW },
        ]
      : [
          { d: 'M 50 20 L 50 40', color: MATRIX_GLOW },
          { d: 'M 14 66 L 14 50 L 50 50 L 50 40', color: SPORTS_GLOW },
          { d: 'M 86 66 L 86 50 L 50 50 L 50 40', color: CARE_GLOW },
        ]

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {paths.map(({ d, color }, i) => (
        <path
          key={i}
          d={d}
          vectorEffect="non-scaling-stroke"
          style={{
            stroke: color,
            strokeWidth: 1.5,
            fill: 'none',
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
      ))}
    </svg>
  )
}

export function HeroSection({ locale, settings, cmsSection }: HeroSectionProps) {
  const isAr = locale === 'ar'
  const f = fallback[locale as keyof typeof fallback] ?? fallback.en
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4])

  // Very soft parallax for the illustration + card cluster together.
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springX = useSpring(mouseX, { stiffness: 120, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25 })
  const parallaxX = useTransform(springX, [0, 1], [6, -6])
  const parallaxY = useTransform(springY, [0, 1], [6, -6])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  // ── CMS-driven content, falling back to static copy ──────────────────
  const cmsContent = validateCmsContent(cmsSection, heroContentSchema)

  const badge = isAr
    ? (cmsContent?.badge_ar || f.badge)
    : (cmsContent?.badge_en || f.badge)

  const headline_en = settings?.content?.hero_headline_en
  const headline_ar = settings?.content?.hero_headline_ar
  const subline = isAr
    ? (settings?.content?.hero_subline_ar || f.subline)
    : (settings?.content?.hero_subline_en || f.subline)

  const ctaPrimaryText = isAr
    ? (cmsContent?.cta_primary_ar || f.cta_primary)
    : (cmsContent?.cta_primary_en || f.cta_primary)
  const ctaSecondaryText = isAr
    ? (cmsContent?.cta_secondary_ar || f.cta_secondary)
    : (cmsContent?.cta_secondary_en || f.cta_secondary)

  const ctaPrimaryUrl = validateUrl(cmsContent?.cta_primary_url, `/${locale}/ecosystem`)
  const ctaSecondaryUrl = validateUrl(cmsContent?.cta_secondary_url, `/${locale}/products`)

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/*
        No internal navbar here — the global <Header/> (rendered once in
        app/[locale]/(public)/layout.tsx) covers the whole site including
        this page. See layout.tsx: <main> already reserves 4rem of top
        padding for the fixed Header.
      */}

      {/* Desktop — hero.webp is now a TRUE full-bleed background across the
          whole section (same treatment as mobile below), not a boxed image
          confined to a column. Its own baked-in ghost duplicate of the "YS"
          mark provides the ambient depth we previously had to fake with a
          separate masked layer — so that layer is gone; keeping both would
          have doubled the ghost.
          object-position is intentionally biased toward the logo (measured
          at ~68% across / ~43% down in the source file) so that cover-crop
          on ultra-wide or narrower desktop widths keeps it comfortably in
          frame instead of drifting toward center. */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/branding/hero/hero.webp"
          alt={isAr ? 'منظومة YS Systems' : 'YS Systems ecosystem platform'}
          fill
          className="object-cover"
          style={{ objectPosition: '68% 50%' }}
          sizes="100vw"
          priority
        />
      </div>

      {/* Legibility scrim for the text block. Deliberately NOT mirrored by
          locale: hero.webp is a single fixed illustration — the logo lives
          at one physical spot inside it, it cannot flip sides just because
          the page is RTL. So unlike the old 2-column CSS Grid (which *did*
          auto-mirror), the text now stays anchored to the physical LEFT and
          the illustration stays anchored to the physical RIGHT in both EN
          and AR. Arabic copy is still fully right-aligned / RTL-formatted
          inside that fixed box — only the box's page position is fixed.
          This trade-off avoids reintroducing the RTL card/text overlap bug
          we fixed earlier (see PR history) now that cards are pinned to a
          baked illustration instead of a mirror-aware grid column. */}
      <div
        className="hidden lg:block absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.72) 30%, rgba(9,9,11,0.25) 50%, transparent 65%)' }}
        aria-hidden="true"
      />

      {/* Mobile — full-bleed background + dark overlay, unchanged from the
          previous pass. */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/branding/hero/hero-mobile.webp"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: '50% 100%' }}
          sizes="100vw"
          priority
        />
      </div>
      <div
        className="lg:hidden absolute inset-0 z-[1] pointer-events-none"
        style={{ backgroundColor: 'rgba(9, 9, 11, 0.55)' }}
        aria-hidden="true"
      />

      {/* Ambient accent glow — desktop only, purely CSS */}
      <div className="hidden lg:block absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 68% 48%, rgba(99,165,255,0.18) 0%, transparent 65%)' }}
        />
      </div>

      {/* Main content */}
      <motion.div className="relative z-10 lg:flex-1 flex lg:items-center" style={{ opacity }}>
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 pt-7 pb-6 sm:pt-8 lg:py-10">
          <div className="relative">
            {/* TEXT — always capped + physically left on desktop (see the
                scrim comment above for why this no longer mirrors in RTL).
                On mobile it's centered (badge/headline/subline/CTAs) to match
                the target design — desktop stays physically left. */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-[460px]">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="glass-badge inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase"
                  style={{ color: 'rgba(99, 102, 241, 0.85)' }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: '#6366F1' }} />
                  {badge}
                </span>
              </motion.div>

              <div className="h-2.5 lg:h-5" />

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold tracking-tight"
                style={{
                  fontSize: 'clamp(36px, 3.4vw, 52px)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                {headline_en || headline_ar ? (
                  <>{isAr ? headline_ar : headline_en}</>
                ) : (
                  <>
                    {f.headline_l1}
                    <br />
                    {f.headline_l2}
                    <br />
                    <span className="text-gradient-blue">{f.headline_hl}</span>
                  </>
                )}
              </motion.h1>

              <div className="h-2.5 lg:h-5" />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.72)', maxWidth: 480, lineHeight: 1.7 }}
              >
                {subline}
              </motion.p>

              <div className="h-4 lg:h-8" />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto"
              >
                <Link
                  href={ctaPrimaryUrl}
                  className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'btn-hero-primary w-full sm:w-auto')}
                >
                  {ctaPrimaryText}
                  <ArrowIcon size={18} />
                </Link>
                <Link
                  href={ctaSecondaryUrl}
                  className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'btn-hero-secondary text-white w-full sm:w-auto')}
                >
                  {ctaSecondaryText}
                </Link>
              </motion.div>

              <div className="h-4 lg:h-8" />

              {/* Trust bar — avatar cluster + social-proof line. Avatars are
                  generic initials-on-gradient placeholders (no fabricated
                  customer photos) until real logos/photos are supplied via
                  settings/CMS. */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <div className="flex -space-x-2.5 rtl:space-x-reverse shrink-0" aria-hidden="true">
                  {TRUST_AVATAR_INITIALS.map((initials, i) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        border: '2px solid #09090B',
                        background: `linear-gradient(135deg, ${TRUST_AVATAR_COLORS[i]} 0%, rgba(255,255,255,0.15) 150%)`,
                        color: 'rgba(255,255,255,0.92)',
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-left rtl:text-right text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {f.trust_line_1}
                  <br />
                  {f.trust_line_2}
                </p>
              </motion.div>

              <div className="h-3 lg:h-7" />

              {/* Ecosystem positioning line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                <span style={{ color: '#FFFFFF' }}>{f.ecosystem_line}</span>
                <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: 999, background: 'var(--color-accent)' }} />
                <span style={{ color: '#FFFFFF' }}>{f.ecosystem_line_hl}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Desktop card stage — a separate layer sitting on top of the
          full-bleed hero.webp background above, absolutely positioned
          across the WHOLE section (not a 720px column anymore). Each card's
          top/left % below was calibrated against pixel-measured positions
          of the "YS" mark inside the source image (letters centroid ≈ 68%
          across / 43% down; platform centroid ≈ 68% across / 80% down),
          combined with the object-position bias set above so the crop stays
          consistent across common desktop widths (~1280–1920px).
          ⚠️ Because this is now a fixed illustration rather than a mirrored
          grid column, these numbers are a calibrated *estimate* — please
          eyeball it at a couple of real browser widths and nudge the
          percentages below if the cards drift off the platform. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: parallaxX, y: parallaxY }}
        className="hidden lg:block absolute inset-0 z-[5]"
        onMouseMove={handleMouseMove}
      >
        <ConnectorLines variant="desktop" />

        <ProductCard
          product={products[0]}
          isAr={isAr}
          locale={locale}
          index={0}
          style={{ top: '11%', left: 'calc(64% - 110px)' }}
        />
        <ProductCard
          product={products[1]}
          isAr={isAr}
          locale={locale}
          index={1}
          style={{ top: '35%', left: '42%' }}
        />
        <ProductCard
          product={products[2]}
          isAr={isAr}
          locale={locale}
          index={2}
          style={{ top: '35%', left: '77%' }}
        />
      </motion.div>

      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to top, #09090B, transparent)' }}
        aria-hidden="true"
      />

      {/* Mobile — hero-mobile.webp is already the full-bleed background
          (Layer 1 above). This is just the floating "stage" for the
          product cards + connector lines, stacked after the CTAs. */}
      <div className="lg:hidden relative z-10 px-6 pt-1 pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto"
          style={{ maxWidth: 300, height: 250 }}
        >
          <ConnectorLines variant="mobile" />

          <ProductCard
            product={products[0]}
            isAr={isAr}
            locale={locale}
            index={0}
            compact
            style={{ top: '2%', left: '50%', transform: 'translateX(-50%)' }}
          />
          <ProductCard
            product={products[1]}
            isAr={isAr}
            locale={locale}
            index={1}
            compact
            style={{ top: '62%', left: '0%' }}
          />
          <ProductCard
            product={products[2]}
            isAr={isAr}
            locale={locale}
            index={2}
            compact
            style={{ top: '62%', right: '0%' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
