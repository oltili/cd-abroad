/**
 * XSS ve HTML enjeksiyonlarını önlemek için metinleri temizler.
 */
export function sanitizeText(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return ""
  return input
    .trim()
    .replace(/[<>]/g, "") // HTML tag işaretlerini kaldır
    .slice(0, maxLength)
}

/**
 * E-posta formatını doğrular.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return emailRegex.test(email)
}

/**
 * Telefon numarası formatını kontrol eder.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.length > 30) return false
  return /^[0-9+\s().-]{7,30}$/.test(phone.trim())
}
