import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {}
  return NextResponse.json({ ok: true })
}
