"use client"

import { useState, type FormEvent } from "react"
import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react"
import type { ContactContent, SettingsContent, ServiceContent } from "@/lib/content"

const defaultServices = [
  "İş ve Çalışma Vizesi",
  "Öğrenci Vizesi",
  "Aile Birleşimi",
  "Oturum İzni",
  "Vatandaşlık",
  "Denklik ve Evrak",
  "Diğer",
]

export function Contact({
  content,
  settings,
  services,
}: {
  content?: ContactContent
  settings?: SettingsContent
  services?: ServiceContent[]
}) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const availableServices = services && services.length > 0
    ? services.map((s) => s.title)
    : defaultServices

  const phone = content?.phone || settings?.phone || "+49 30 123 45 67"
  const email = content?.email || settings?.email || "info@danismanlik.de"
  const address = content?.address || settings?.address || "Berlin, Almanya & İstanbul, Türkiye"
  const title = content?.title || "Ücretsiz ön değerlendirme alın"
  const description =
    content?.description ||
    "Formu doldurun, uzman danışmanlarımız 24 saat içinde size geri dönsün. Sürecinizi birlikte planlayalım."

  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")
    const form = e.currentTarget
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const data = await response.json()
      if (response.ok && data.ok) {
        setSubmitted(true)
        form.reset()
      } else {
        setErrorMessage(data.error || "Talebiniz şu an iletilemedi. Lütfen tekrar deneyin.")
      }
    } catch {
      setErrorMessage("Sunucu ile iletişim kurulurken bir sorun oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="iletisim" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-xl shadow-navy/5">
          <div className="grid lg:grid-cols-5">
            {/* info side */}
            <div className="relative bg-navy p-8 sm:p-10 lg:col-span-2">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(50% 40% at 20% 10%, color-mix(in oklch, var(--royal) 60%, transparent), transparent), radial-gradient(40% 30% at 90% 90%, color-mix(in oklch, var(--emerald) 45%, transparent), transparent)",
                }}
              />
              <div className="relative">
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-primary-foreground sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-3 leading-relaxed text-white/70">
                  {description}
                </p>

                <div className="mt-10 space-y-5">
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 text-white/90 transition-colors hover:text-emerald"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Phone className="h-5 w-5" />
                    </span>
                    {phone}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-white/90 transition-colors hover:text-emerald"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Mail className="h-5 w-5" />
                    </span>
                    {email}
                  </a>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <MapPin className="h-5 w-5" />
                    </span>
                    {address}
                  </div>
                </div>
              </div>
            </div>

            {/* form side */}
            <div className="p-8 sm:p-10 lg:col-span-3">
              {submitted ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                    <Check className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-navy">
                    Talebiniz alındı!
                  </h3>
                  <p className="mt-2 max-w-sm text-muted-foreground">
                    En kısa sürede uzman danışmanlarımız sizinle iletişime
                    geçecek. İlginiz için teşekkür ederiz.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-semibold text-royal hover:underline"
                  >
                    Yeni bir talep gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                  {/* Bot Honeypot - Gerçek kullanıcılar görmez */}
                  <input
                    type="text"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {errorMessage && (
                    <div className="sm:col-span-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-medium animate-fade-in">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-navy">
                      Ad Soyad
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      placeholder="Adınız Soyadınız"
                      className="rounded-xl border border-input bg-background px-4 py-3 text-navy outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-royal focus:ring-2 focus:ring-royal/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-navy">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+90 5xx xxx xx xx"
                      className="rounded-xl border border-input bg-background px-4 py-3 text-navy outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-royal focus:ring-2 focus:ring-royal/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="email" className="text-sm font-medium text-navy">
                      E-posta
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="ornek@eposta.com"
                      className="rounded-xl border border-input bg-background px-4 py-3 text-navy outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-royal focus:ring-2 focus:ring-royal/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="service" className="text-sm font-medium text-navy">
                      İlgilendiğiniz hizmet
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="rounded-xl border border-input bg-background px-4 py-3 text-navy outline-none transition-colors focus:border-royal focus:ring-2 focus:ring-royal/20"
                    >
                      {availableServices.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="message" className="text-sm font-medium text-navy">
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Durumunuzu kısaca anlatın..."
                      className="resize-none rounded-xl border border-input bg-background px-4 py-3 text-navy outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-royal focus:ring-2 focus:ring-royal/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-navy/20 transition-all hover:-translate-y-0.5 hover:bg-navy-deep disabled:opacity-60 sm:col-span-2 cursor-pointer"
                  >
                    {loading ? "Gönderiliyor..." : "Ücretsiz değerlendirme talep et"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
