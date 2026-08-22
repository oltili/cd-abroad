import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  isAuthenticatedAdmin,
  verifyAdminPassword,
  updateAdminPassword,
  generateAdminToken,
  getAdminConfig,
} from "@/lib/auth-guard"
import { sanitizeText, isValidEmail } from "@/lib/security"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 })
    }

    const body = await request.json()
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : ""
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : ""
    const newEmail = typeof body.newEmail === "string" ? sanitizeText(body.newEmail, 254).toLowerCase() : ""

    if (!currentPassword) {
      return NextResponse.json({ ok: false, error: "Lütfen mevcut şifrenizi girin." }, { status: 400 })
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ ok: false, error: "Yeni şifre en az 6 karakter olmalıdır." }, { status: 400 })
    }

    if (newEmail && !isValidEmail(newEmail)) {
      return NextResponse.json({ ok: false, error: "Geçerli bir e-posta adresi girin." }, { status: 400 })
    }

    // 1. Mevcut şifreyi doğrula
    const isCurrentValid = await verifyAdminPassword(currentPassword)
    if (!isCurrentValid) {
      return NextResponse.json({ ok: false, error: "Mevcut şifreniz hatalı." }, { status: 400 })
    }

    // 2. Yeni şifreyi ve varsa e-postayı güvenli şekilde hashleyip kaydet
    await updateAdminPassword(newPassword, newEmail || undefined)

    // 3. Supabase kullanıcısı varsa Supabase şifresini de güncelle
    try {
      const supabase = await createClient()
      await supabase.auth.updateUser({ password: newPassword, email: newEmail || undefined })
    } catch {}

    // 4. Oturum çerezini yenile
    const { email } = await getAdminConfig()
    const newToken = generateAdminToken(email)
    const cookieStore = await cookies()
    cookieStore.set("admin_session", newToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json({ ok: true, message: "Giriş şifreniz başarıyla güncellendi." })
  } catch {
    return NextResponse.json({ ok: false, error: "Şifre güncellenirken bir hata oluştu." }, { status: 500 })
  }
}
