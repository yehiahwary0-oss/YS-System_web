'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaqForm } from '../FaqForm'
import { adminGet } from '@/lib/admin/api'
import { useToast } from '@/components/admin/Toast'
import type { FaqItem } from '@/types'

export default function EditFaq({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { show } = useToast()
  const router = useRouter()
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGet<FaqItem>(`/admin/faqs/${id}`)
      .then(data => setInitial({
        question_en: data.question,
        question_ar: (data as any).question_ar ?? '',
        answer_en: data.answer,
        answer_ar: (data as any).answer_ar ?? '',
        category: (data as any).category ?? '',
        sort_order: (data as any).sort_order ?? 0,
      }))
      .catch(() => { show('error', 'Failed to load FAQ.'); router.push('/admin/faq') })
      .finally(() => setLoading(false))
  }, [id, router, show])

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</div>

  return <FaqForm faqId={id} initialData={initial as any} />
}
