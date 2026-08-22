import fs from "fs/promises"
import path from "path"

export type IconName = "briefcase" | "graduation" | "users" | "file-text" | "home" | "landmark"

export interface HeroIllustrationContent {
  center: {
    badge: string
    sublabel: string
    title: string
    footer: string
  }
  card1: {
    title: string
    subtitle: string
  }
  card2: {
    title: string
    subtitle: string
  }
  card3: {
    title: string
    subtitle: string
  }
}

export interface HeroContent {
  eyebrow: string
  title: string
  highlight: string
  description: string
  primaryCta: string
  primaryHref: string
  secondaryCta: string
  secondaryHref: string
  socialProof: string
  cards?: HeroIllustrationContent
}

export interface StatContent {
  id?: string | number
  value: string
  label: string
  active?: boolean
}

export interface ServiceContent {
  id?: string | number
  icon: string
  title: string
  description: string
  href: string
  active?: boolean
}

export interface ProcessContent {
  id?: string | number
  step: string
  title: string
  description: string
  active?: boolean
}

export interface WhyContent {
  id?: string | number
  icon: string
  title: string
  description: string
  active?: boolean
}

export interface FaqContent {
  id?: string | number
  question: string
  answer: string
  active?: boolean
}

export interface ContactContent {
  title: string
  description: string
  phone: string
  email: string
  address: string
  whatsapp: string
  workingHours?: string
}

export interface SettingsContent {
  siteName: string
  tagline?: string
  phone: string
  email: string
  address: string
  whatsapp: string
  instagram?: string
  facebook?: string
  linkedin?: string
}

export interface AllContent {
  hero: HeroContent
  statistics: StatContent[]
  services: ServiceContent[]
  process: ProcessContent[]
  why: WhyContent[]
  faq: FaqContent[]
  contact: ContactContent
  settings: SettingsContent
}

export const defaultContent: AllContent = {
  hero: {
    eyebrow: "Yetkili ve güvenilir göç danışmanlığı",
    title: "Almanya hayalinizi",
    highlight: "güvenle",
    description: "Vize, oturum, iş ve aile birleşimi süreçlerinizi baştan sona uzman ekibimizle yönetiyoruz. Hayatınızın en önemli kararlarından birinde yanınızdayız.",
    primaryCta: "Ücretsiz ön görüşme",
    primaryHref: "#iletisim",
    secondaryCta: "Hizmetleri keşfedin",
    secondaryHref: "#hizmetler",
    socialProof: "2.000+ ailenin tercihi",
    cards: {
      center: {
        badge: "Onaylandı",
        sublabel: "Pasaport",
        title: "T.C. — Schengen",
        footer: "Belgeler eksiksiz",
      },
      card1: {
        title: "Vize onayı",
        subtitle: "Çalışma izni",
      },
      card2: {
        title: "Almanya",
        subtitle: "Berlin · München",
      },
      card3: {
        title: "Oturum izni",
        subtitle: "Aufenthaltstitel",
      },
    },
  },
  statistics: [
    { id: "1", value: "2.000+", label: "Başarılı başvuru", active: true },
    { id: "2", value: "%98", label: "Memnuniyet oranı", active: true },
    { id: "3", military_time: undefined, value: "12+", label: "Yıllık deneyim", active: true },
    { id: "4", value: "24/7", label: "Kesintisiz destek", active: true },
  ],
  services: [
    { id: "1", icon: "briefcase", title: "İş ve Çalışma Vizesi", description: "Nitelikli işçi vizesi, mavi kart ve iş arama vizesi başvurularınızı eksiksiz hazırlıyoruz.", href: "#iletisim", active: true },
    { id: "2", icon: "graduation", title: "Öğrenci Vizesi", description: "Üniversite kabulünden vize randevusuna kadar tüm eğitim göçü sürecinde yanınızdayız.", href: "#iletisim", active: true },
    { id: "3", icon: "users", title: "Aile Birleşimi", description: "Eş ve çocuklarınızı Almanya'ya getirmek için gerekli tüm evrak ve süreç yönetimi.", href: "#iletisim", active: true },
    { id: "4", icon: "home", title: "Oturum İzni", description: "Süreli ve süresiz oturum izni ile daimi yerleşim başvurularınızı güvenle tamamlayın.", href: "#iletisim", active: true },
    { id: "5", icon: "landmark", title: "Vatandaşlık", description: "Alman vatandaşlığı başvuru şartları, dil ve entegrasyon süreçlerinde rehberlik.", href: "#iletisim", active: true },
    { id: "6", icon: "file-text", title: "Denklik ve Evrak", description: "Diploma denkliği, tercüme ve apostil dahil resmi evrak işlemlerinizi yönetiyoruz.", href: "#iletisim", active: true },
  ],
  process: [
    { id: "1", step: "01", title: "Ücretsiz Ön Değerlendirme", description: "Durumunuzu dinliyor, hedeflerinize en uygun göç yolunu birlikte belirliyoruz.", active: true },
    { id: "2", step: "02", title: "Strateji ve Yol Haritası", description: "Size özel bir başvuru planı, evrak listesi ve zaman çizelgesi hazırlıyoruz.", active: true },
    { id: "3", step: "03", title: "Evrak ve Başvuru Yönetimi", description: "Tüm belgeleri hazırlıyor, çeviri ve resmi başvuruları sizin adınıza yürütüyoruz.", active: true },
    { id: "4", step: "04", title: "Onay ve Almanya'ya Geçiş", description: "Vize onayının ardından yerleşim, adres kaydı ve entegrasyonda da yanınızdayız.", active: true },
  ],
  why: [
    { id: "1", icon: "Languages", title: "Türkçe ve Almanca destek", description: "Sürecin tamamında ana dilinizde iletişim kurabileceğiniz uzmanlarla çalışırsınız.", active: true },
    { id: "2", icon: "CheckCircle2", title: "Şeffaf ve net fiyatlandırma", description: "Sürpriz maliyet yok. Baştan sona ne ödeyeceğinizi ve ne alacağınızı bilirsiniz.", active: true },
    { id: "3", icon: "Clock", title: "Hızlı ve doğru süreç", description: "Eksiksiz hazırlanan başvurularla gereksiz gecikmelerin ve retlerin önüne geçiyoruz.", active: true },
    { id: "4", icon: "HeartHandshake", title: "Taşınma sonrası destek", description: "Adres kaydı, sağlık sigortası ve entegrasyonda da yalnız kalmazsınız.", active: true },
  ],
  faq: [
    { id: "1", question: "Sürece nasıl başlıyoruz?", answer: "İlk adım ücretsiz ön değerlendirme görüşmesidir. Durumunuzu dinliyor, hangi göç yolunun size uygun olduğunu belirliyor ve net bir yol haritası sunuyoruz.", active: true },
    { id: "2", question: "Vize başvurusu ne kadar sürer?", answer: "Süre; başvuru türüne, konsolosluk yoğunluğuna ve evrak durumuna göre değişir. Genel olarak iş ve öğrenci vizeleri 4-12 hafta arasında sonuçlanır. Size özel tahmini süreyi görüşmede paylaşıyoruz.", active: true },
    { id: "3", question: "Almanca bilmem şart mı?", answer: "Başvuru türüne göre değişir. Bazı vizeler için temel Almanca (A1-B1) gerekebilir. Gereken dil seviyesini ve nasıl ulaşacağınızı planınıza dahil ediyoruz.", active: true },
    { id: "4", question: "Başvurum reddedilirse ne oluyor?", answer: "Eksiksiz hazırlık ile ret riskini en aza indiriyoruz. Yine de olumsuz bir sonuçta itiraz veya yeniden başvuru sürecinde size rehberlik ediyoruz.", active: true },
    { id: "5", question: "Hizmet ücretleriniz nedir?", answer: "Ücretlerimiz seçtiğiniz hizmet paketine göre belirlenir ve baştan şeffaf şekilde paylaşılır. Gizli maliyet uygulamıyoruz.", active: true },
    { id: "6", question: "Ailemi de Almanya'ya getirebilir miyim?", answer: "Evet. Aile birleşimi başvurularında eş ve çocuklarınızın Almanya'ya gelmesi için gereken tüm süreçleri yönetiyoruz.", active: true },
  ],
  contact: {
    title: "Ücretsiz ön değerlendirme alın",
    description: "Formu doldurun, uzman danışmanlarımız 24 saat içinde size geri dönsün. Sürecinizi birlikte planlayalım.",
    phone: "+49 30 123 45 67",
    email: "info@danismanlik.de",
    address: "Berlin, Almanya & İstanbul, Türkiye",
    whatsapp: "+49 170 123 45 67",
    workingHours: "Pzt - Cum, 09:00 - 18:00",
  },
  settings: {
    siteName: "CD ABROAD",
    tagline: "Türkiye'den Almanya'ya taşınmak isteyen aileler ve profesyoneller için güvenilir göç, vize ve oturum danışmanlığı.",
    phone: "+49 30 123 45 67",
    email: "info@cdabroad.de",
    address: "Berlin, Almanya & İstanbul, Türkiye",
    whatsapp: "+49 170 123 45 67",
    instagram: "@cdabroad.de",
    facebook: "cdabroad.de",
    linkedin: "cdabroad",
  },
}

export const heroContent = defaultContent.hero
export const statsContent = defaultContent.statistics
export const servicesContent = defaultContent.services
export const serviceSectionContent = {
  eyebrow: "Hizmetlerimiz",
  title: "Almanya yolculuğunuzun her adımında yanınızdayız",
  description: "İhtiyacınıza özel danışmanlık çözümleriyle süreçlerinizi kolay ve öngörülebilir hale getiriyoruz.",
}

const dataFilePath = path.join(process.cwd(), "data", "content.json")

export async function getAllContent(): Promise<AllContent> {
  try {
    const raw = await fs.readFile(dataFilePath, "utf-8")
    const parsed = JSON.parse(raw)
    return {
      hero: { ...defaultContent.hero, ...parsed.hero },
      statistics: parsed.statistics || defaultContent.statistics,
      services: parsed.services || defaultContent.services,
      process: parsed.process || defaultContent.process,
      why: parsed.why || defaultContent.why,
      faq: parsed.faq || defaultContent.faq,
      contact: { ...defaultContent.contact, ...parsed.contact },
      settings: { ...defaultContent.settings, ...parsed.settings },
    }
  } catch {
    return defaultContent
  }
}

export async function saveAllContent(content: Partial<AllContent>): Promise<AllContent> {
  const current = await getAllContent()
  const updated: AllContent = {
    ...current,
    ...content,
  }
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
  await fs.writeFile(dataFilePath, JSON.stringify(updated, null, 2), "utf-8")
  return updated
}

export async function getPublicContent() {
  const content = await getAllContent()
  return {
    hero: content.hero,
    stats: content.statistics.filter((s) => s.active !== false),
    services: content.services.filter((s) => s.active !== false),
    process: content.process.filter((p) => p.active !== false),
    why: content.why.filter((w) => w.active !== false),
    faqs: content.faq.filter((f) => f.active !== false),
    contact: content.contact,
    settings: content.settings,
  }
}
