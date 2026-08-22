import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { isAuthenticatedAdmin } from "@/lib/auth-guard"
import { sanitizeText } from "@/lib/security"

const requestsFile = path.join(process.cwd(), "data", "requests.json")

export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim." }, { status: 401 })
    }

    let list = []
    try {
      const raw = await fs.readFile(requestsFile, "utf-8")
      list = JSON.parse(raw)
    } catch {}
    return NextResponse.json({ ok: true, data: list })
  } catch {
    return NextResponse.json({ ok: false, error: "Talepler alınamadı." }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim." }, { status: 401 })
    }

    const { id, status, note } = await request.json()
    const raw = await fs.readFile(requestsFile, "utf-8")
    const list = JSON.parse(raw)
    
    const index = list.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      if (status !== undefined) list[index].status = sanitizeText(status, 50)
      if (note !== undefined) list[index].note = sanitizeText(note, 2000)
      await fs.writeFile(requestsFile, JSON.stringify(list, null, 2), "utf-8")
      return NextResponse.json({ ok: true, data: list[index] })
    }
    return NextResponse.json({ ok: false, error: "Talep bulunamadı." }, { status: 404 })
  } catch {
    return NextResponse.json({ ok: false, error: "Güncelleme başarısız." }, { status: 500 })
  }
}
