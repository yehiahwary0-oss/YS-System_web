'use client'

import { Mail, Send, FileText, MessageSquare, Layout, Server } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function MailPage() {
  const { kernel, loaded } = usePlatform()
  const mail = loaded && kernel ? kernel.resolve<any>('mailManager') : null
  const drivers = mail?.getDrivers() ?? []
  const defaultDriver = mail?.getDefaultDriver()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Mail Manager" subtitle="Driver-based email sending with SMTP support — future Resend, SES, Mailgun, Postmark" />

      <SectionCard title="Mail Drivers" description={`${drivers.length} driver(s) registered`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {drivers.length > 0 ? drivers.map((d: string) => (
            <div key={d} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={20} style={{ color: '#EC4899' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize' }}>{d}</div>
                {d === defaultDriver && <Badge variant="success">Default</Badge>}
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          )) : (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No mail drivers registered. Register an SMTP driver or cloud provider.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Available Drivers" description="Driver architecture — current and planned">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'SMTP', status: 'implemented' as const, desc: 'Standard SMTP with TLS/SSL, auth, attachments' },
            { name: 'Resend', status: 'pending' as const, desc: 'Resend.com API integration' },
            { name: 'Amazon SES', status: 'pending' as const, desc: 'AWS Simple Email Service' },
            { name: 'Mailgun', status: 'pending' as const, desc: 'Mailgun API integration' },
            { name: 'Postmark', status: 'pending' as const, desc: 'Postmark API integration' },
          ].map(d => (
            <div key={d.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <MessageSquare size={14} style={{ color: d.status === 'implemented' ? '#10B981' : '#F59E0B' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{d.name}</span>
                <Badge variant={d.status === 'implemented' ? 'success' : 'warning'}>{d.status}</Badge>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Mail Manager API" description="Send emails through the unified MailManager interface">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Simple send
await mail.send({
  from: { email: 'noreply@ysplatform.com', name: 'YS Platform' },
  to: [{ email: 'user@example.com', name: 'User' }],
  subject: 'Welcome!',
  html: '<h1>Welcome</h1><p>Thank you for joining.</p>',
  text: 'Welcome! Thank you for joining.',
})

// With attachments
await mail.send({
  from: { email: 'noreply@ysplatform.com' },
  to: [{ email: 'user@example.com' }],
  subject: 'Invoice',
  html: '<p>Your invoice is attached.</p>',
  attachments: [{ filename: 'invoice.pdf', content: pdfBuffer }],
})

// Quick send
await mail.sendTo('user@example.com', 'Hello', '<p>Hello!</p>')`}
        </pre>
      </SectionCard>
    </div>
  )
}
