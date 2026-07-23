export class CsrfManager {
  private tokens = new Map<string, { token: string; expiresAt: number }>()
  private tokenValidityMs = 3600000
  private maxTokens = 100

  generateToken(sessionId: string): string {
    const token = Buffer.from(`${sessionId}:${Date.now()}:${Math.random().toString(36).slice(2)}`).toString('base64')
    this.tokens.set(sessionId, { token, expiresAt: Date.now() + this.tokenValidityMs })

    if (this.tokens.size > this.maxTokens) {
      const oldest = this.tokens.keys().next().value
      if (oldest !== undefined) this.tokens.delete(oldest)
    }

    return token
  }

  validateToken(sessionId: string, token: string): boolean {
    const entry = this.tokens.get(sessionId)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      this.tokens.delete(sessionId)
      return false
    }
    return entry.token === token
  }

  invalidateToken(sessionId: string): void {
    this.tokens.delete(sessionId)
  }

  clearExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.tokens) {
      if (now > entry.expiresAt) this.tokens.delete(key)
    }
  }

  getStats() {
    return {
      activeTokens: this.tokens.size,
      maxTokens: this.maxTokens,
      validityMs: this.tokenValidityMs,
    }
  }

  clear(): void {
    this.tokens.clear()
  }
}

let csrfCleanupTimer: ReturnType<typeof setInterval> | null = null

export function startCsrfCleanup(csrfManager: CsrfManager, intervalMs = 300000): () => void {
  if (csrfCleanupTimer) clearInterval(csrfCleanupTimer)
  csrfCleanupTimer = setInterval(() => csrfManager.clearExpired(), intervalMs)
  return () => {
    if (csrfCleanupTimer) {
      clearInterval(csrfCleanupTimer)
      csrfCleanupTimer = null
    }
  }
}

let cacheCleanupTimer: ReturnType<typeof setInterval> | null = null

export function startCacheCleanup(memoryDriver: { clearExpired: () => Promise<number> }, intervalMs = 60000): () => void {
  if (cacheCleanupTimer) clearInterval(cacheCleanupTimer)
  cacheCleanupTimer = setInterval(() => { memoryDriver.clearExpired().catch(() => {}) }, intervalMs)
  return () => {
    if (cacheCleanupTimer) {
      clearInterval(cacheCleanupTimer)
      cacheCleanupTimer = null
    }
  }
}
