'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Moon, Sun, Globe, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { Menu as CmsMenu } from '@/types'
import { useThemeStore } from '@/lib/stores/theme'
import { Button } from '@/components/ui/Button'
import { SearchModal } from '@/components/shared/SearchModal'

const navContent = {
  en: {
    products: 'Products', ecosystem: 'Ecosystem', docs: 'Docs',
    roadmap: 'Roadmap', updates: 'Updates', about: 'About',
    get_started: 'Get Started', search: 'Search...',
  },
  ar: {
    products: 'المنتجات', ecosystem: 'المنظومة', docs: 'التوثيق',
    roadmap: 'خارطة الطريق', updates: 'المستجدات', about: 'عن الشركة',
    get_started: 'ابدأ الآن', search: 'ابحث...',
  },
}

interface HeaderProps {
  locale: string
  menu?: CmsMenu
}

export function Header({ locale, menu }: HeaderProps) {
  const t        = navContent[locale as keyof typeof navContent] ?? navContent.en
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useThemeStore()

  const [open,        setOpen]        = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [mounted,     setMounted]     = useState(false)  // ← fix hydration
  const [searchOpen,  setSearchOpen]  = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  // Global keyboard shortcut: Cmd/Ctrl+K opens search from anywhere
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isDark      = mounted ? resolvedTheme() === 'dark' : false
  const otherLocale = locale === 'en' ? 'ar' : 'en'
  const switchHref  = pathname.replace(`/${locale}`, `/${otherLocale}`)
  const isMac       = mounted && typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC')

  const navLinks = menu?.items?.length
    ? menu.items.map(i => ({ href: i.url ?? '#', label: i.title }))
    : [
        { href: '/products',  label: t.products },
        { href: '/ecosystem', label: t.ecosystem },
        { href: '/docs',      label: t.docs },
        { href: '/roadmap',   label: t.roadmap },
        { href: '/updates',   label: t.updates },
        { href: '/about',     label: t.about },
      ]

  return (
    <>
      <header
        className={cn('fixed top-0 inset-x-0 z-50 header-glass transition-all duration-300', scrolled ? 'scrolled border-b' : '')}
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="container-site">
          <nav aria-label="Main navigation" className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
              <img
                src="/branding/logo/logo-light.webp"
                alt="YS Systems"
                width={32}
                height={32}
                className="block dark:hidden"
                style={{ width: 32, height: 32, borderRadius: 8 }}
              />
              <img
                src="/branding/logo/logo-dark.webp"
                alt="YS Systems"
                width={32}
                height={32}
                className="hidden dark:block"
                style={{ width: 32, height: 32, borderRadius: 8 }}
              />
              <span className="font-display font-semibold text-sm tracking-tight hidden sm:block"
                style={{ color: 'var(--color-foreground)' }}>
                YS Systems
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center gap-1" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {navLinks.map(({ href, label }) => {
                const full     = `/${locale}${href}`
                const isActive = pathname === full
                return (
                  <li key={href}>
                    <Link href={full} style={{
                      display: 'block', padding: '0.5rem 0.875rem', borderRadius: 8,
                      fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                      color:           isActive ? 'var(--color-foreground)' : 'var(--color-foreground-muted)',
                      backgroundColor: isActive ? 'var(--color-background-subtle)' : 'transparent',
                      transition: 'all 150ms',
                    }}>
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex"
                style={{
                  alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.625rem',
                  borderRadius: 8, border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background-subtle)', cursor: 'pointer',
                  color: 'var(--color-foreground-muted)', fontSize: '0.8125rem',
                }}
              >
                <Search size={14} />
                <span className="hidden md:inline">{t.search}</span>
                {mounted && (
                  <kbd style={{
                    display: 'inline-flex', alignItems: 'center', gap: 2, padding: '0.1rem 0.35rem',
                    borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
                    fontSize: '0.65rem', fontFamily: 'monospace',
                  }} className="hidden md:inline-flex">
                    {isMac ? '⌘' : 'Ctrl'}K
                  </kbd>
                )}
              </button>

              {/* Mobile search icon only */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden"
                style={{ padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-foreground-muted)' }}
              >
                <Search size={18} />
              </button>

              <Link href={switchHref} className="sm:flex hidden items-center gap-1.5" style={{
                padding: '0.5rem 0.75rem', borderRadius: 8,
                fontSize: '0.875rem', color: 'var(--color-foreground-muted)', textDecoration: 'none',
              }}>
                <Globe size={15} /> {otherLocale.toUpperCase()}
              </Link>

              {/* Theme toggle — only render icon after mount to avoid hydration mismatch */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                suppressHydrationWarning
                style={{
                  padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent', color: 'var(--color-foreground-muted)',
                }}
              >
                {mounted
                  ? (isDark ? <Sun size={17} /> : <Moon size={17} />)
                  : <Moon size={17} />
                }
              </button>

              <Button
                variant="primary" size="sm"
                className="hidden lg:inline-flex"
                onClick={() => window.location.href = `/${locale}/contact`}
              >
                {t.get_started}
              </Button>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden"
                style={{
                  padding: '0.5rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent', color: 'var(--color-foreground-muted)',
                }}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
              className="lg:hidden border-b"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
            >
              <div className="container-site py-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={`/${locale}${href}`} style={{
                    display: 'block', padding: '0.75rem 1rem', borderRadius: 12,
                    fontSize: '0.875rem', fontWeight: 500,
                    color: 'var(--color-foreground-muted)', textDecoration: 'none',
                  }}>
                    {label}
                  </Link>
                ))}
                <div style={{ paddingTop: '0.75rem' }}>
                  <Button variant="primary" size="sm" style={{ width: '100%' }}
                    onClick={() => window.location.href = `/${locale}/contact`}>
                    {t.get_started}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal locale={locale} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
