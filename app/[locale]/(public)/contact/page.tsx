import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { api } from '@/lib/api/client'
import ContactClient from './ContactClient'
import type { PublicSettings } from '@/types'

const locales = ['en', 'ar'] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    locale,
    path: '/contact',
    title: locale === 'ar' ? 'تواصل معنا' : 'Contact',
    description: locale === 'ar' ? 'تواصل مع فريق YS Systems & Software. استفسارات، دعم فني، وشراكات — نحن هنا لمساعدتك.' : 'Get in touch with YS Systems & Software. Sales inquiries, technical support, partnerships — we are here to help.',
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()

  let settings: PublicSettings | undefined
  try { settings = await api.settings(locale) } catch { /* graceful */ }

  return <ContactClient locale={locale} settings={settings} />
}
