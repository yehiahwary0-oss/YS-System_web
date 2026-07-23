import Link from 'next/link'
import { headers } from 'next/headers'

const locales = ['en', 'ar'] as const
const defaultLocale = 'en'

export default async function NotFound() {
  const headersList = await headers()
  const acceptLang = headersList.get('accept-language') ?? ''
  const locale = locales.find(l => acceptLang.startsWith(l)) ?? defaultLocale

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--color-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
        <div className="font-display font-bold" style={{ fontSize: '8rem', lineHeight: 1, color: 'var(--color-background-muted)', marginBottom: '1.5rem' }}>
          404
        </div>
        <h1 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '1rem' }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--color-foreground-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href={`/${locale}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.875rem 2rem', borderRadius: 8, fontSize: '0.9375rem', fontWeight: 500,
          backgroundColor: 'var(--color-accent)', color: '#fff', textDecoration: 'none',
        }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
