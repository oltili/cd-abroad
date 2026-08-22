"use client"

import { useEffect, useState } from "react"
import { Menu, X, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SettingsContent } from "@/lib/content"

const links = [
  { label: "Ana Sayfa", href: "#" },
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Süreç", href: "#surec" },
  { label: "Neden Biz", href: "#neden-biz" },
  { label: "SSS", href: "#sss" },
  { label: "İletişim", href: "#iletisim" },
]

export function Navbar({ settings }: { settings?: SettingsContent }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const siteName = settings?.siteName || "danışmanlık"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6",
          scrolled &&
            "glass mx-3 rounded-2xl border border-white/40 px-4 py-3 shadow-lg shadow-navy/5 sm:mx-6",
        )}
      >
        <a href="#" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <img
            src="/images/logo.png"
            alt={siteName}
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-royal"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-navy">
            <Globe className="h-4 w-4" />
            TR
          </button>
          <a
            href="#iletisim"
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-navy-deep hover:shadow-lg"
          >
            Ücretsiz Ön Görüşme
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-navy md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="glass mx-3 mt-2 animate-fade-up rounded-2xl border border-white/40 p-4 shadow-lg md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-navy transition-colors hover:bg-secondary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#iletisim"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-navy px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Ücretsiz Ön Görüşme
          </a>
        </div>
      )}
    </header>
  )
}
