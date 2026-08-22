import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { createClient } from "@/lib/supabase/server"
import { contactFormLimiter, getClientIp } from "@/lib/rate-limit"
import { sanitizeText, isValidEmail, isValidPhone } from "@/lib/security"

const requestsFile = path.join(process.cwd(), "data", "requests.json")

function validateAndSanitize(input: Record<string, unknown>) {
  // 1. Honeypot kontrolü (Bot tuzak alanı)
  if (input.website_url && typeof input.website_url === "string" && input.website_url.trim().length > 0) {
    return { isBot: true, data: null }
  }

  const name = sanitizeText(input.name, 100)
  const email = sanitizeText(input.email, 254).toLowerCase()
  const phone = sanitizeText(input.phone, 30)
  const service = sanitizeText(input.service, 100)
  const message = sanitizeText(input.message, 3000)

  if (name.length < 2 || name.length > 100) return { isBot: false, data: null, error: "Ad Soyad 2 ile 100 karakter arasında olmalıdır." }
  if (!isValidEmail(email)) return { isBot: false, data: null, error: "Geçerli bir e-posta adresi girin." }
  if (phone && !isValidPhone(phone)) return { isBot: false, data: null, error: "Geçerli bir telefon numarası girin." }
  if (message.length < 5 || message.length > 3000) return { isBot: false, data: null, error: "Mesajınız en az 5 karakter olmalıdır." }

  return {
    isBot: false,
    data: {
      name,
      email,
      phone,
      service: service || "Genel Danışmanlık",
      message,
    },
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)

    // 1. Rate Limiting kontrolü (Aynı IP'den aşırı form gönderimini engelleme)
    const rateCheck = contactFormLimiter.check(clientIp)
    if (!rateCheck.success) {
      const minutesLeft = Math.ceil(rateCheck.resetMs / (60 * 1000))
      return NextResponse.json(
        { error: `Kısa sürede çok fazla talep gönderdiniz. Lütfen ${minutesLeft} dakika sonra tekrar deneyin.` },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = validateAndSanitize(body)

    // Bot tespiti durumunda sessizce başarı dönerek botları şaşırt
    if (result.isBot) {
      return NextResponse.json({ ok: true })
    }

    if (!result.data) {
      return NextResponse.json({ error: result.error || "Lütfen form alanlarını kontrol edin." }, { status: 400 })
    }

    const parsed = result.data

    // 2. Yerel requests.json dosyasına kaydet
    try {
      let list: any[] = []
      try {
        const raw = await fs.readFile(requestsFile, "utf-8")
        list = JSON.parse(raw)
      } catch {}

      const newRequest = {
        id: Date.now(),
        ...parsed,
        date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
        status: "Yeni",
        note: "",
      }
      list.unshift(newRequest)
      await fs.mkdir(path.dirname(requestsFile), { recursive: true })
      await fs.writeFile(requestsFile, JSON.stringify(list, null, 2), "utf-8")
    } catch (err) {
      console.error("Local request save error:", err)
    }

    // 3. Varsa Supabase veritabanına kaydet
    try {
      const supabase = await createClient()
      await supabase.from("contact_requests").insert(parsed)
    } catch {}

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Talep gönderilirken bir hata oluştu." }, { status: 500 })
  }
}
