import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAuthenticatedAdmin } from "@/lib/auth-guard"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 })
    }

    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    const isConfigured = envUrl.length > 0 && !envUrl.includes("placeholder") && envKey.length > 20

    let supabaseConnected = false
    let tableExists = false
    let writeTestPassed = false
    let errorMessage = ""

    if (isConfigured) {
      try {
        const supabase = await createClient()
        
        // 1. Tablo okuma testi
        const { data, error: readError } = await supabase
          .from("website_content")
          .select("id, content")
          .eq("id", 1)
          .maybeSingle()

        if (readError) {
          errorMessage = `Tablo okuma hatası: ${readError.message} (Kod: ${readError.code})`
        } else {
          tableExists = true
          supabaseConnected = true

          // 2. Tablo yazma testi
          const testPayload = data?.content || { init: true, date: new Date().toISOString() }
          const { error: writeError } = await supabase
            .from("website_content")
            .upsert({ id: 1, content: testPayload, updated_at: new Date().toISOString() })

          if (writeError) {
            errorMessage = `Tablo yazma yetkisi hatası: ${writeError.message}`
          } else {
            writeTestPassed = true
          }
        }
      } catch (err: any) {
        errorMessage = `Supabase istemci hatası: ${err?.message || "Bilinmeyen hata"}`
      }
    }

    // Dosya sistemi yazılabilirlik kontrolü
    let fsWritable = false
    try {
      const testPath = path.join(process.cwd(), "data", ".test_write")
      await fs.writeFile(testPath, "test", "utf-8")
      await fs.unlink(testPath)
      fsWritable = true
    } catch {
      fsWritable = false
    }

    return NextResponse.json({
      ok: true,
      diagnostics: {
        supabase: {
          configured: isConfigured,
          url: envUrl ? `${envUrl.slice(0, 20)}...` : "Tanımlanmamış",
          keyDetected: envKey.length > 20,
          connected: supabaseConnected,
          tableExists,
          writeTestPassed,
          errorMessage: errorMessage || null,
        },
        filesystem: {
          writable: fsWritable,
          mode: fsWritable ? "Yazılabilir (Localhost / VPS)" : "Salt Okunur (Vercel Serverless)",
        },
        environment: process.env.NODE_ENV || "development",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Teşhis çalıştırılamadı." }, { status: 500 })
  }
}
