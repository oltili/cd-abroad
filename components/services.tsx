import { ArrowUpRight, Briefcase, FileText, GraduationCap, Home, Landmark, Users } from "lucide-react"
import type { ServiceContent } from "@/lib/content"

const icons = { briefcase: Briefcase, graduation: GraduationCap, users: Users, home: Home, landmark: Landmark, "file-text": FileText }

interface ServicesProps {
  eyebrow: string
  title: string
  description: string
  services: ServiceContent[]
}

export function Services({ eyebrow, title, description, services }: ServicesProps) {
  return (
    <section id="hizmetler" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald">{eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy sm:text-4xl">{title}</h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon]
            return (
              <a key={service.title} href={service.href} className="group rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-royal/30 hover:shadow-xl hover:shadow-navy/5">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-royal/10 text-royal transition-all duration-300 group-hover:bg-royal group-hover:text-primary-foreground group-hover:rotate-3">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-royal" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-navy">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{service.description}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-royal">Detayları inceleyin</span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
