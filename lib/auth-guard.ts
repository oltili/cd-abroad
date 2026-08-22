import crypto from "crypto"
import fs from "fs/promises"
import path from "path"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

import os from "os"

const SECRET = process.env.ADMIN_SESSION_SECRET || "danismanlik-super-secret-key-2026-fallback"
const adminConfigFile = path.join(process.cwd(), "data", "admin-config.json")
const tempAdminConfigFile = path.join(os.tmpdir(), "cdabroad_admin_config.json")

const globalForAuth = global as unknown as { __ADMIN_CONFIG__?: AdminConfig }

interface AdminConfig {
  email: string
  passwordHash: string
  salt: string
  updatedAt: string
}

/**
 * Güvenli PBKDF2 şifre hash'i üretir.
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
}

/**
 * Kayıtlı admin kimlik bilgilerini getirir.
 */
export async function getAdminConfig(): Promise<{ email: string; isConfigured: boolean; config: AdminConfig | null }> {
  // 1. In-memory cache
  if (globalForAuth.__ADMIN_CONFIG__) {
    return { email: globalForAuth.__ADMIN_CONFIG__.email, isConfigured: true, config: globalForAuth.__ADMIN_CONFIG__ }
  }

  // 2. /tmp cache
  try {
    const rawTemp = await fs.readFile(tempAdminConfigFile, "utf-8")
    const config: AdminConfig = JSON.parse(rawTemp)
    globalForAuth.__ADMIN_CONFIG__ = config
    return { email: config.email, isConfigured: true, config }
  } catch {}

  // 3. Local data directory
  try {
    const raw = await fs.readFile(adminConfigFile, "utf-8")
    const config: AdminConfig = JSON.parse(raw)
    globalForAuth.__ADMIN_CONFIG__ = config
    return { email: config.email, isConfigured: true, config }
  } catch {
    const defaultEmail = process.env.ADMIN_EMAIL || "admin@cdabroad.com"
    return { email: defaultEmail, isConfigured: false, config: null }
  }
}

/**
 * Girilen şifrenin doğruluğunu kontrol eder.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const { isConfigured, config } = await getAdminConfig()
  
  if (isConfigured && config) {
    const inputHash = hashPassword(password, config.salt)
    return timingSafeCompare(inputHash, config.passwordHash)
  }

  // Varsayılan .env / başlangıç şifresi kontrolü
  const envPassword = process.env.ADMIN_PASSWORD || "admin123"
  return timingSafeCompare(password, envPassword)
}

/**
 * Admin şifresini güvenli şekilde günceller ve kaydeder.
 */
export async function updateAdminPassword(newPassword: string, newEmail?: string): Promise<void> {
  const current = await getAdminConfig()
  const salt = crypto.randomBytes(16).toString("hex")
  const passwordHash = hashPassword(newPassword, salt)
  
  const updatedConfig: AdminConfig = {
    email: newEmail || current.email,
    passwordHash,
    salt,
    updatedAt: new Date().toISOString(),
  }

  globalForAuth.__ADMIN_CONFIG__ = updatedConfig

  try {
    await fs.mkdir(path.dirname(adminConfigFile), { recursive: true })
    await fs.writeFile(adminConfigFile, JSON.stringify(updatedConfig, null, 2), "utf-8")
  } catch {
    try {
      await fs.writeFile(tempAdminConfigFile, JSON.stringify(updatedConfig, null, 2), "utf-8")
    } catch {}
  }
}

/**
 * Güvenli HMAC-SHA256 imzalı admin oturum token'ı oluşturur.
 */
export function generateAdminToken(email: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 gün
  const payload = `${email}|${expiresAt}`
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex")
  return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

/**
 * Verilen token'ın geçerliliğini ve imzasını doğrular.
 */
export function verifyAdminToken(token: string): boolean {
  try {
    const [payloadB64, signature] = token.split(".")
    if (!payloadB64 || !signature) return false

    const payload = Buffer.from(payloadB64, "base64url").toString("utf-8")
    const [email, expStr] = payload.split("|")
    const expiresAt = parseInt(expStr, 10)

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false
    }

    const expectedSignature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex")
    
    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature, "hex")
    const expBuffer = Buffer.from(expectedSignature, "hex")
    if (sigBuffer.length !== expBuffer.length) return false
    return crypto.timingSafeEqual(sigBuffer, expBuffer)
  } catch {
    return false
  }
}

/**
 * Zamanlama saldırılarını (timing attack) önleyen güvenli karşılaştırma
 */
export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    const hashA = crypto.createHash("sha256").update(a).digest()
    const hashB = crypto.createHash("sha256").update(b).digest()
    return crypto.timingSafeEqual(hashA, hashB) && a === b
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Sunucu API isteklerinde ve sayfalarda admin yetkilendirmesini doğrular.
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value

  // 1. İmzalı yerel oturum token'ı kontrolü
  if (token && verifyAdminToken(token)) {
    return true
  }

  // 2. Supabase Auth oturum kontrolü
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: admin } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()

    return !!admin
  } catch {
    return false
  }
}
