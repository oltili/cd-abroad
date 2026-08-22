"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FaqContent } from "@/lib/content"

const defaultFaqs: FaqContent[] = [
  {
    question: "Sürece nasıl başlıyoruz?",
    answer: "İlk adım ücretsiz ön değerlendirme görüşmesidir. Durumunuzu dinliyor, hangi göç yolunun size uygun olduğunu belirliyor ve net bir yol haritası sunuyoruz.",
  },
  {
    question: "Vize başvurusu ne kadar sürer?",
    answer: "Süre; başvuru türüne, konsolosluk yoğunluğuna ve evrak durumuna göre değişir. Genel olarak iş ve öğrenci vizeleri 4-12 hafta arasında sonuçlanır. Size özel tahmini süreyi görüşmede paylaşıyoruz.",
  },
  {
    question: "Almanca bilmem şart mı?",
    answer: "Başvuru türüne göre değişir. Bazı vizeler için temel Almanca (A1-B1) gerekebilir. Gereken dil seviyesini ve nasıl ulaşacağınızı planınıza dahil ediyoruz.",
  },
  {
    question: "Başvurum reddedilirse ne oluyor?",
    answer: "Eksiksiz hazırlık ile ret riskini en aza indiriyoruz. Yine de olumsuz bir sonuçta itiraz veya yeniden başvuru sürecinde size rehberlik ediyoruz.",
  },
  {
    question: "Hizmet ücretleriniz nedir?",
    answer: "Ücretlerimiz seçtiğiniz hizmet paketine göre belirlenir ve baştan şeffaf şekilde paylaşılır. Gizli maliyet uygulamıyoruz.",
  },
  {
    question: "Ailemi de Almanya'ya getirebilir miyim?",
    answer: "Evet. Aile birleşimi başvurularında eş ve çocuklarınızın Almanya'ya gelmesi için gereken tüm süreçleri yönetiyoruz.",
  },
]

export function Faq({ items }: { items?: FaqContent[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const visibleFaqs = items && items.length > 0 ? items : defaultFaqs

  return (
    <section id="sss" className="scroll-mt-24 bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald">
            Sıkça Sorulan Sorular
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
            Aklınızdaki soruların yanıtları
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {visibleFaqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.question || i}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-navy">{f.question}</span>
                  <Plus
                    className={cn(
                      "h-5 w-5 shrink-0 text-royal transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 leading-relaxed text-muted-foreground">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
