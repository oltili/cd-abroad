import type { SettingsContent, ServiceContent } from "@/lib/content"

export function Footer({
  settings,
  services,
}: {
  settings?: SettingsContent
  services?: ServiceContent[]
}) {
  const siteName = settings?.siteName || "danışmanlık"
  const tagline =
    settings?.tagline ||
    "Türkiye'den Almanya'ya taşınmak isteyen aileler için güvenilir göç, vize ve oturum danışmanlığı."

  const serviceLinks = services && services.length > 0
    ? services.slice(0, 6).map((s) => s.title)
    : ["İş ve Çalışma Vizesi", "Öğrenci Vizesi", "Aile Birleşimi", "Oturum İzni", "Vatandaşlık"]

  const columns = [
    {
      title: "Hizmetler",
      links: serviceLinks,
    },
    {
      title: "Kurumsal",
      links: ["Hakkımızda", "Ekibimiz", "Referanslar", "Kariyer", "İletişim"],
    },
    {
      title: "Kaynaklar",
      links: ["Blog", "SSS", "Vize Rehberi", "Gizlilik Politikası", "KVKK"],
    },
  ]

  return (
    <footer className="border-t border-border bg-navy text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#" className="inline-flex items-center rounded-xl bg-white/95 px-3 py-2 shadow-md transition-opacity hover:opacity-90">
              <img
                src="/images/logo.png"
                alt={siteName}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              {tagline}
            </p>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h3 className="text-sm font-semibold text-primary-foreground">
                {c.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#iletisim" className="transition-colors hover:text-emerald">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.</p>
          <p className="text-white/50">
            Bu içerik hukuki tavsiye niteliği taşımaz.
          </p>
        </div>
      </div>
    </footer>
  )
}
