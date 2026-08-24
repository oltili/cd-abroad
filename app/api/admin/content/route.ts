import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAllContent, saveAllContent } from "@/lib/content"
import { isAuthenticatedAdmin } from "@/lib/auth-guard"

export async function GET() {
  try {
    // Admin yetki kontrolü
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 })
    }

    const data = await getAllContent()
    return NextResponse.json({ ok: true, data })
  } catch {
    return NextResponse.json({ ok: false, error: "İçerik yüklenemedi." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Admin yetki kontrolü
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 })
    }

    const body = await request.json()
    const updated = await saveAllContent(body)
    
    // Sayfaları anında önbellekten temizle ve yeniden derle
    try {
      revalidatePath("/", "layout")
      revalidatePath("/")
      revalidatePath("/admin")
    } catch {}

    return NextResponse.json({ ok: true, data: updated })
  } catch (error: any) {
    console.error("Save content error:", error)
    return NextResponse.json({ ok: false, error: error?.message || "İçerik kaydedilemedi." }, { status: 500 })
  }
}
