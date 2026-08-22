import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { WhyUs } from "@/components/why-us"
import { Faq } from "@/components/faq"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { WhatsappButton } from "@/components/whatsapp-button"
import { getPublicContent, serviceSectionContent } from "@/lib/content"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  const content = await getPublicContent()

  return (
    <div className="min-h-screen bg-background">
      <Navbar settings={content.settings} />
      <main>
        <Hero content={content.hero} />
        <Stats stats={content.stats} />
        <Services {...serviceSectionContent} services={content.services} />
        <Process steps={content.process} />
        <WhyUs items={content.why} />
        <Faq items={content.faqs} />
        <Contact content={content.contact} settings={content.settings} services={content.services} />
      </main>
      <Footer settings={content.settings} services={content.services} />
      <WhatsappButton whatsapp={content.settings.whatsapp || content.contact.whatsapp} />
    </div>
  )
}
