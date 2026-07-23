'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

function infoItems(contactEmail: string) {
  return {
    en: [
      { icon: '✉', label: 'Email', value: contactEmail },
      { icon: '🌐', label: 'Website', value: 'ys-systems.com' },
    ],
    ar: [
      { icon: '✉', label: 'البريد', value: contactEmail },
      { icon: '🌐', label: 'الموقع', value: 'ys-systems.com' },
    ],
  }
}

const content = {
  en: {
    title: 'Get in Touch', subtitle: "Have a question or want to work with us? We'd love to hear from you.",
    name: 'Full Name', email: 'Email Address', subject: 'Subject (optional)',
    message: 'Message', type_label: 'Inquiry Type', submit: 'Send Message',
    success: '✓ Your message has been sent. We will get back to you soon.',
    error: 'Something went wrong. Please try again.',
    types: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'sales', label: 'Sales' },
      { value: 'support', label: 'Support' },
      { value: 'partnership', label: 'Partnership' },
    ],
  },
  ar: {
    title: 'تواصل معنا', subtitle: 'هل لديك سؤال أو تريد العمل معنا؟ يسعدنا الاستماع إليك.',
    name: 'الاسم الكامل', email: 'البريد الإلكتروني', subject: 'الموضوع (اختياري)',
    message: 'الرسالة', type_label: 'نوع الاستفسار', submit: 'إرسال الرسالة',
    success: '✓ تم إرسال رسالتك بنجاح. سنرد عليك قريباً.',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    types: [
      { value: 'general', label: 'استفسار عام' },
      { value: 'sales', label: 'مبيعات' },
      { value: 'support', label: 'دعم فني' },
      { value: 'partnership', label: 'شراكة' },
    ],
  },
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

import type { PublicSettings } from '@/types'

interface ContactClientProps {
  locale: string
  settings?: PublicSettings
}

export default function ContactClient({ locale, settings }: ContactClientProps) {
  const t = content[locale as keyof typeof content] ?? content.en

  const contactEmail = settings?.contacts?.support_email ?? 'cantactys@gmail.com'
  const info = infoItems(contactEmail)[locale as keyof ReturnType<typeof infoItems>] ?? infoItems(contactEmail).en

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'general' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      const res = await fetch(`${API}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json()
      if (!res.ok || !body.success) throw new Error(body.message)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '', type: 'general' })
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      {/* Hero */}
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Contact</p>
          <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1rem' }}>{t.title}</h1>
          <p className="text-fluid-base" style={{ color: 'var(--color-foreground-muted)', maxWidth: '40rem' }}>{t.subtitle}</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Info */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {info.map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '0.125rem' }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{label}</p>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-foreground)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </aside>

            {/* Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div style={{ padding: '2rem', borderRadius: '1rem', backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: '1rem', fontWeight: 500 }}>
                  {t.success}
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {status === 'error' && (
                    <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-error)', fontSize: '0.875rem' }}>
                      {t.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground-subtle)', marginBottom: '0.375rem' }}>{t.name}</label>
                      <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Yahya Hassan" className="input-base" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground-subtle)', marginBottom: '0.375rem' }}>{t.email}</label>
                      <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="input-base" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground-subtle)', marginBottom: '0.375rem' }}>{t.type_label}</label>
                      <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-base">
                        {t.types.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground-subtle)', marginBottom: '0.375rem' }}>{t.subject}</label>
                      <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="..." className="input-base" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground-subtle)', marginBottom: '0.375rem' }}>{t.message}</label>
                    <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={6}
                      placeholder={locale === 'ar' ? 'أخبرنا عن استفسارك...' : 'Tell us about your inquiry...'}
                      className="input-base" style={{ resize: 'vertical', minHeight: 140 }} />
                  </div>

                  <Button type="submit" variant="primary" size="lg" loading={loading} style={{ alignSelf: 'flex-start' }}>
                    {t.submit}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
