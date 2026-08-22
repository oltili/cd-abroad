"use client"

import { FormEvent, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        window.location.assign("/admin")
      } else {
        setError(data.error || "E-posta veya şifre geçersiz.")
      }
    } catch {
      setError("Giriş yapılırken bir sorun oluştu.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] p-4">
      <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-border bg-white p-8 shadow-xl">
        <div className="flex flex-col items-start">
          <img
            src="/images/logo.png"
            alt="CD ABROAD"
            className="h-10 w-auto object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-navy">Yönetim Paneline Giriş</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Devam etmek için CD ABROAD yönetici hesabınızla giriş yapın.</p>
        </div>
        
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 border border-red-200">
            {error}
          </p>
        )}
        
        <label className="flex flex-col gap-2 text-sm font-medium text-navy">
          E-posta
          <input
            required
            type="email"
            value={email}
            placeholder="admin@cdabroad.com"
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border border-input px-3.5 outline-none transition focus:border-royal focus:ring-2 focus:ring-royal/20"
          />
        </label>
        
        <label className="flex flex-col gap-2 text-sm font-medium text-navy">
          Şifre
          <input
            required
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border border-input px-3.5 outline-none transition focus:border-royal focus:ring-2 focus:ring-royal/20"
          />
        </label>
        
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-royal font-semibold text-white transition hover:bg-royal/90 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </main>
  )
}
