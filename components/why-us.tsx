import { CheckCircle2, Languages, Clock, HeartHandshake, Sparkles, ShieldCheck, Star, Users } from "lucide-react"
import type { WhyContent } from "@/lib/content"

const iconMap: Record<string, typeof Languages> = {
  Languages,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
}

const defaultReasons: WhyContent[] = [
  {
    icon: "Languages",
    title: "Türkçe ve Almanca destek",
    description: "Sürecin tamamında ana dilinizde iletişim kurabileceğiniz uzmanlarla çalışırsınız.",
  },
  {
    icon: "CheckCircle2",
    title: "Şeffaf ve net fiyatlandırma",
    description: "Sürpriz maliyet yok. Baştan sona ne ödeyeceğinizi ve ne alacağınızı bilirsiniz.",
  },
  {
    icon: "Clock",
    title: "Hızlı ve doğru süreç",
    description: "Eksiksiz hazırlanan başvurularla gereksiz gecikmelerin ve retlerin önüne geçiyoruz.",
  },
  {
    icon: "HeartHandshake",
    title: "Taşınma sonrası destek",
    description: "Adres kaydı, sağlık sigortası ve entegrasyonda da yalnız kalmazsınız.",
  },
]

export function WhyUs({ items }: { items?: WhyContent[] }) {
  const visibleItems = items && items.length > 0 ? items : defaultReasons

  return (
    <section id="neden-biz" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-last lg:order-first">
            <div className="overflow-hidden rounded-3xl border border-border shadow-xl shadow-navy/10">
              <img
                src="/images/consultation.png"
                alt="Göç danışmanı ile mutlu müşteri ofiste el sıkışıyor"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="glass absolute -right-4 -top-6 hidden rounded-2xl border border-white/50 p-4 shadow-xl sm:block">
              <p className="text-3xl font-semibold text-royal">12+</p>
              <p className="text-xs text-muted-foreground">yıllık tecrübe</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald">
              Neden Biz
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Binlerce ailenin güvendiği bir danışmanlık deneyimi
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Almanya göç mevzuatındaki tecrübemizi, kişiye özel ve şeffaf bir
              hizmet anlayışıyla birleştiriyoruz.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {visibleItems.map((r, idx) => {
                const IconComponent = iconMap[r.icon] || CheckCircle2
                return (
                  <div key={r.title || idx} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald/12 text-emerald">
                      <IconComponent className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-navy">{r.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {r.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
