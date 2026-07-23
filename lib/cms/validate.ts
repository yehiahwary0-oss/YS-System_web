import type { HomepageSection } from '@/types'
import type { z } from 'zod'

const SAFE_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:']

export function validateUrl(url: unknown, defaultUrl: string): string {
  if (typeof url !== 'string') return defaultUrl

  const trimmed = url.trim()
  if (!trimmed) return defaultUrl

  if (trimmed.startsWith('/')) return trimmed

  try {
    const parsed = new URL(trimmed)
    if (SAFE_PROTOCOLS.includes(parsed.protocol)) return trimmed
  } catch {
    // not a valid URL, fall through to default
  }

  return defaultUrl
}

export function validateCmsContent<T>(
  section: HomepageSection | undefined | null,
  schema: z.ZodType<T>,
): T | null {
  if (!section?.content) return null

  const result = schema.safeParse(section.content)
  if (!result.success) {
    console.warn(
      `[CMS] Schema validation failed for section "${section.type}":`,
      result.error.message,
    )
    return null
  }

  return result.data as T
}
