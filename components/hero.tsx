import { ArrowRight, BookMarked, FileCheck2, Plane, ShieldCheck, Stamp, Star } from "lucide-react"
import type { HeroContent, HeroIllustrationContent } from "@/lib/content"

function HeroCopy({ content }: { content: HeroContent }) {
  return (
    <div className="max-w-xl text-center lg:text-left">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-royal shadow-sm">
        <ShieldCheck className="h-4 w-4" />
        {content.eyebrow}
      </div>
      <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl xl:text-6xl">
        {content.title}{" "}
        {content.highlight && <span className="text-royal">{content.highlight}</span>}{" "}
        {content.titleSuffix !== undefined ? content.titleSuffix : "gerçeğe dönüştürün"}
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
        {content.description}
      </p>
      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
        <a
          href={content.primaryHref}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-navy/20 transition-all hover:-translate-y-0.5 hover:bg-navy-deep sm:w-auto"
        >
          {content.primaryCta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href={content.secondaryHref}
          className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-7 py-3.5 font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-royal/40 hover:text-royal sm:w-auto"
        >
          {content.secondaryCta}
        </a>
      </div>
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
        <div className="flex text-emerald">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <span>
          <strong className="font-semibold text-navy">{content.socialProof.split(" ")[0]}</strong> ailenin tercihi
        </span>
      </div>
    </div>
  )
}

function HeroIllustration({ cards }: { cards?: HeroIllustrationContent }) {
  const center = cards?.center || {
    badge: "Onaylandı",
    sublabel: "Pasaport",
    title: "T.C. — Schengen",
    footer: "Belgeler eksiksiz",
  }
  const card1 = cards?.card1 || {
    title: "Vize onayı",
    subtitle: "Çalışma izni",
  }
  const card2 = cards?.card2 || {
    title: "Almanya",
    subtitle: "Berlin · München",
  }
  const card3 = cards?.card3 || {
    title: "Oturum izni",
    subtitle: "Aufenthaltstitel",
  }

  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md sm:h-[500px]">
      {/* Background radial glow */}
      <div aria-hidden className="absolute inset-6 -z-10 rounded-[2.5rem] bg-royal/15 blur-3xl animate-pulse" />

      {/* Main Center Card */}
      <div className="glass animate-float absolute left-1/2 top-1/2 flex w-64 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-3xl border border-white/70 p-6 shadow-2xl shadow-navy/15 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-primary-foreground shadow-md">
            <BookMarked className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-emerald/15 px-2.5 py-1 text-xs font-semibold text-emerald">
            {center.badge}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{center.sublabel}</p>
          <p className="text-lg font-semibold tracking-tight text-navy">{center.title}</p>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck2 className="h-4 w-4 text-emerald shrink-0" />
          <span>{center.footer}</span>
        </div>
      </div>

      {/* Top Left Card (Card 1) */}
      <FloatingCard
        className="left-0 top-4 animate-float-slow"
        icon={<Stamp className="h-5 w-5" />}
        title={card1.title}
        detail={card1.subtitle}
      />

      {/* Top Right Card (Card 2) */}
      <FloatingCard
        className="right-0 top-12 animate-float-reverse"
        icon={<Plane className="h-5 w-5" />}
        title={card2.title}
        detail={card2.subtitle}
        dark
      />

      {/* Bottom Left Card (Card 3) */}
      <FloatingCard
        className="bottom-6 left-2 animate-float-delayed"
        icon={<FileCheck2 className="h-5 w-5" />}
        title={card3.title}
        detail={card3.subtitle}
        green
      />
    </div>
  )
}

function FloatingCard({
  className,
  icon,
  title,
  detail,
  green,
  dark,
}: {
  className: string
  icon: React.ReactNode
  title: string
  detail: string
  green?: boolean
  dark?: boolean
}) {
  return (
    <div
      className={`glass absolute flex items-center gap-3 rounded-2xl border border-white/70 p-4 shadow-xl shadow-navy/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${
          dark
            ? "bg-navy text-primary-foreground"
            : green
              ? "bg-emerald/15 text-emerald"
              : "bg-royal/15 text-royal"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="text-left text-sm font-semibold text-navy leading-tight">{title}</p>
        <p className="text-left text-xs text-muted-foreground mt-0.5">{detail}</p>
      </div>
    </div>
  )
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-royal/5" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <HeroCopy content={content} />
        <HeroIllustration cards={content.cards} />
      </div>
    </section>
  )
}
