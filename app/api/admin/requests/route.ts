import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import os from "os"
import { isAuthenticatedAdmin } from "@/lib/auth-guard"
import { sanitizeText } from "@/lib/security"

const requestsFile = path.join(process.cwd(), "data", "requests.json")
const tempRequestsFile = path.join(os.tmpdir(), "cdabroad_requests.json")

const globalForRequests = global as unknown as { __REQUESTS__?: any[] }

async function getStoredRequests(): Promise<any[]> {
  if (globalForRequests.__REQUESTS__) {
    return globalForRequests.__REQUESTS__
  }
  try {
    const rawTemp = await fs.readFile(tempRequestsFile, "utf-8")
    const list = JSON.parse(rawTemp)
    globalForRequests.__REQUESTS__ = list
    return list
  } catch {}

  try {
    const raw = await fs.readFile(requestsFile, "utf-8")
    const list = JSON.parse(raw)
    globalForRequests.__REQUESTS__ = list
    return list
  } catch {
    return []
  }
}

async function saveStoredRequests(list: any[]) {
  globalForRequests.__REQUESTS__ = list
  try {
    await fs.mkdir(path.dirname(requestsFile), { recursive: true })
    await fs.writeFile(requestsFile, JSON.stringify(list, null, 2), "utf-8")
  } catch {
    try {
      await fs.writeFile(tempRequestsFile, JSON.stringify(list, null, 2), "utf-8")
    } catch {}
  }
}

export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin()
    if (!isAuth) {
      return NextResponse.json({ ok: false, error: "Yetkisiz erişim." }, { status: 401 })
    }

    const list = await getStoredRequests()
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
    const list = await getStoredRequests()
    
    const index = list.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      if (status !== undefined) list[index].status = sanitizeText(status, 50)
      if (note !== undefined) list[index].note = sanitizeText(note, 2000)
      await saveStoredRequests(list)
      return NextResponse.json({ ok: true, data: list[index] })
    }
    return NextResponse.json({ ok: false, error: "Talep bulunamadı." }, { status: 404 })
  } catch {
    return NextResponse.json({ ok: false, error: "Güncelleme başarısız." }, { status: 500 })
  }
}
