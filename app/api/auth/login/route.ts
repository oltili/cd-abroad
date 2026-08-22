import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { generateAdminToken, timingSafeCompare, getAdminConfig, verifyAdminPassword } from "@/lib/auth-guard"
import { loginLimiter, getClientIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    
    // 1. Rate limiting kontrolü (Kaba kuvvet / Brute-force koruması)
    const rateCheck = loginLimiter.check(clientIp)
    if (!rateCheck.success) {
      const minutesLeft = Math.ceil(rateCheck.resetMs / (60 * 1000))
      return NextResponse.json(
        { error: `Çok fazla hatalı giriş denemesi yapıldı. Lütfen ${minutesLeft} dakika sonra tekrar deneyin.` },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json({ error: "Lütfen e-posta ve şifrenizi girin." }, { status: 400 })
    }

    const { email: adminEmail } = await getAdminConfig()

    // 2. Yerel admin şifre kontrolü
    const isEmailValid = timingSafeCompare(email.toLowerCase(), adminEmail.toLowerCase())
    const isPasswordValid = isEmailValid ? await verifyAdminPassword(password) : false

    if (isEmailValid && isPasswordValid) {
      loginLimiter.reset(clientIp) // Başarılı girişte limiti sıfırla
      const token = generateAdminToken(adminEmail)
      const cookieStore = await cookies()
      cookieStore.set("admin_session", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 gün
      })
      return NextResponse.json({ ok: true })
    }

    // 3. Supabase Auth kontrolü
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data?.user) {
        const { data: admin } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", data.user.id)
          .maybeSingle()
        if (admin) {
          loginLimiter.reset(clientIp)
          return NextResponse.json({ ok: true })
        }
      }
    } catch {}

    return NextResponse.json({ error: "E-posta veya şifre geçersiz." }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Giriş işlemi sırasında bir hata oluştu." }, { status: 500 })
  }
}
