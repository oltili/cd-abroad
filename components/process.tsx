const steps = [
  {
    step: "01",
    title: "Ücretsiz Ön Değerlendirme",
    desc: "Durumunuzu dinliyor, hedeflerinize en uygun göç yolunu birlikte belirliyoruz.",
  },
  {
    step: "02",
    title: "Strateji ve Yol Haritası",
    desc: "Size özel bir başvuru planı, evrak listesi ve zaman çizelgesi hazırlıyoruz.",
  },
  {
    step: "03",
    title: "Evrak ve Başvuru Yönetimi",
    desc: "Tüm belgeleri hazırlıyor, çeviri ve resmi başvuruları sizin adınıza yürütüyoruz.",
  },
  {
    step: "04",
    title: "Onay ve Almanya'ya Geçiş",
    desc: "Vize onayının ardından yerleşim, adres kaydı ve entegrasyonda da yanınızdayız.",
  },
]

import type { ProcessContent } from "@/lib/content"

export function Process({ steps: databaseSteps = [] }: { steps?: ProcessContent[] }) {
  const visibleSteps = databaseSteps.length ? databaseSteps : steps

  return (
    <section id="surec" className="scroll-mt-24 bg-navy py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald">
            Nasıl Çalışıyoruz
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            4 adımda net ve öngörülebilir bir süreç
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-white/70">
            Karmaşık bürokrasiyi sizin için sadeleştiriyoruz. Her aşamada ne
            olduğunu tam olarak bilirsiniz.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visibleSteps.map((s, i) => (
            <div
              key={s.step}
              className="glass-dark relative rounded-3xl border border-white/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40"
            >
              <span className="text-4xl font-semibold text-emerald">{s.step}</span>
              <h3 className="mt-4 text-lg font-semibold text-primary-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {"description" in s ? s.description : s.desc}
              </p>
              {i < steps.length - 1 && (
                <span className="absolute right-6 top-8 hidden text-white/20 lg:block">
                  {"→"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
