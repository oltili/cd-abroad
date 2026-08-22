// In-memory sliding window rate limiter
interface RateLimitOptions {
  interval: number // milliseconds
  max: number // max attempts allowed in the interval
}

interface RateLimitRecord {
  count: number
  expiresAt: number
}

const stores = new Map<string, Map<string, RateLimitRecord>>()

export function createRateLimiter(name: string, options: RateLimitOptions) {
  if (!stores.has(name)) {
    stores.set(name, new Map())
  }
  const store = stores.get(name)!

  return {
    check: (ip: string): { success: boolean; remaining: number; resetMs: number } => {
      const now = Date.now()
      
      // Expired records cleanup
      for (const [key, record] of store.entries()) {
        if (record.expiresAt < now) {
          store.delete(key)
        }
      }

      const existing = store.get(ip)
      if (!existing || existing.expiresAt < now) {
        store.set(ip, { count: 1, expiresAt: now + options.interval })
        return { success: true, remaining: options.max - 1, resetMs: options.interval }
      }

      if (existing.count >= options.max) {
        return { success: false, remaining: 0, resetMs: Math.max(0, existing.expiresAt - now) }
      }

      existing.count += 1
      return { success: true, remaining: options.max - existing.count, resetMs: Math.max(0, existing.expiresAt - now) }
    },
    reset: (ip: string) => {
      store.delete(ip)
    },
  }
}

// Global rate limiters
export const contactFormLimiter = createRateLimiter("contact-form", {
  interval: 10 * 60 * 1000, // 10 dakika
  max: 5, // 10 dakika içinde en fazla 5 başvuru
})

export const loginLimiter = createRateLimiter("login-attempts", {
  interval: 15 * 60 * 1000, // 15 dakika
  max: 5, // 15 dakika içinde en fazla 5 deneme
})

export function getClientIp(request: Request): string {
  const headers = request.headers
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip") || "127.0.0.1"
}
