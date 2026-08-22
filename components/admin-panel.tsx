"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
  X,
  RefreshCw,
  ExternalLink,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type {
  AllContent,
  HeroContent,
  StatContent,
  ServiceContent,
  ProcessContent,
  WhyContent,
  FaqContent,
  ContactContent,
  SettingsContent,
} from "@/lib/content"

type View = "dashboard" | "hero" | "statistics" | "services" | "process" | "why" | "faq" | "contact" | "footer" | "requests" | "settings" | "security"

export interface RequestItem {
  id: number | string
  name: string
  email: string
  phone: string
  service: string
  message: string
  date: string
  status: "Yeni" | "İletişime Geçildi" | "Tamamlandı" | "Arşiv" | string
  note?: string
}

const sectionNavItems: { key: View; title: string; desc: string; icon: any }[] = [
  { key: "hero", title: "Hero Alanı", desc: "Ana sayfa giriş alanı ve butonlar", icon: Home },
  { key: "statistics", title: "İstatistikler", desc: "Güven ve başarı rakamları", icon: BarChart3 },
  { key: "services", title: "Hizmetler", desc: "Danışmanlık hizmetleri listesi", icon: Activity },
  { key: "process", title: "Süreç", desc: "4 adımlı çalışma süreci", icon: ClipboardList },
  { key: "why", title: "Neden Biz", desc: "Farkımızı anlatan özellikler", icon: Sparkles },
  { key: "faq", title: "SSS", desc: "Sıkça sorulan sorular & cevaplar", icon: CircleHelp },
  { key: "contact", title: "İletişim", desc: "İletişim alanları ve metinleri", icon: Mail },
  { key: "footer", title: "Footer", desc: "Alt bilgi, site adı ve slogan", icon: FileText },
]

export default function AdminPanel() {
  const [view, setView] = useState<View>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [content, setContent] = useState<AllContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  
  // Requests state
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)

  // Fetch content on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [contentRes, requestsRes] = await Promise.all([
          fetch("/api/admin/content"),
          fetch("/api/admin/requests"),
        ])
        const contentData = await contentRes.json()
        const requestsData = await requestsRes.json()
        if (contentData.ok) setContent(contentData.data)
        if (requestsData.ok) setRequests(requestsData.data)
      } catch (err) {
        console.error("Admin data load error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSaveContent = async (updatedData?: Partial<AllContent>) => {
    if (!content) return
    setSaving(true)
    const payload = updatedData ? { ...content, ...updatedData } : content
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (result.ok) {
        setContent(result.data)
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      } else {
        alert("Kaydetme hatası: " + (result.error || "Bilinmeyen hata"))
      }
    } catch {
      alert("Sunucuya bağlanırken bir hata oluştu.")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateRequest = async (id: number | string, status: string, note?: string) => {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, note }),
      })
      const result = await res.json()
      if (result.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, note } : r)))
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, status, note })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.assign("/auth/login")
  }

  if (loading || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-[#2f6bff]" />
          <p className="text-sm font-medium text-[#71809b]">Yönetim paneli yükleniyor...</p>
        </div>
      </div>
    )
  }

  const currentSectionMeta = sectionNavItems.find((s) => s.key === view)
  const currentTitle =
    view === "dashboard"
      ? "Dashboard"
      : view === "requests"
        ? "İletişim Talepleri"
        : view === "settings"
          ? "Site Ayarları"
          : view === "security"
            ? "Güvenlik & Şifre Değiştir"
            : currentSectionMeta?.title ?? "Dashboard"

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] text-[#0f2747]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-[#e6ebf2] bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-[#edf0f5] px-6">
          <img
            src="/images/logo.png"
            alt="CD ABROAD"
            className="h-8 w-auto object-contain"
          />
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a2adc0]">Genel</div>
          <button
            onClick={() => { setView("dashboard"); setSidebarOpen(false) }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              view === "dashboard" ? "bg-[#eaf0ff] font-semibold text-[#2f6bff]" : "text-[#60708d] hover:bg-[#f1f4f8]"
            }`}
          >
            <LayoutDashboard className="size-[18px] shrink-0" />
            Dashboard
          </button>

          <div className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a2adc0]">
            Sayfa Bölümleri
          </div>
          {sectionNavItems.map((s) => (
            <button
              key={s.key}
              onClick={() => { setView(s.key); setSidebarOpen(false) }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                view === s.key ? "bg-[#eaf0ff] font-semibold text-[#2f6bff]" : "text-[#60708d] hover:bg-[#f1f4f8]"
              }`}
            >
              <s.icon className="size-4 shrink-0" />
              {s.title}
            </button>
          ))}

          <div className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a2adc0]">
            Yönetim
          </div>
          <button
            onClick={() => { setView("requests"); setSidebarOpen(false) }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
              view === "requests" ? "bg-[#eaf0ff] font-semibold text-[#2f6bff]" : "text-[#60708d] hover:bg-[#f1f4f8]"
            }`}
          >
            <span className="flex items-center gap-3">
              <Mail className="size-[18px] shrink-0" />
              İletişim Talepleri
            </span>
            {requests.filter((r) => r.status === "Yeni").length > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#2f6bff] text-[10px] font-bold text-white">
                {requests.filter((r) => r.status === "Yeni").length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setView("settings"); setSidebarOpen(false) }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              view === "settings" ? "bg-[#eaf0ff] font-semibold text-[#2f6bff]" : "text-[#60708d] hover:bg-[#f1f4f8]"
            }`}
          >
            <Settings className="size-[18px] shrink-0" />
            Site Ayarları
          </button>
          <button
            onClick={() => { setView("security"); setSidebarOpen(false) }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              view === "security" ? "bg-[#eaf0ff] font-semibold text-[#2f6bff]" : "text-[#60708d] hover:bg-[#f1f4f8]"
            }`}
          >
            <Lock className="size-[18px] shrink-0" />
            Güvenlik & Şifre
          </button>
        </nav>

        <div className="m-4 rounded-2xl bg-[#f4f7fc] p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#e1e7f0] py-2.5 text-xs font-semibold text-[#2f6bff] shadow-sm hover:bg-[#f8faff]"
          >
            <ExternalLink className="size-3.5" />
            Siteyi Canlı Gör
          </a>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Menüyü kapat"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-[#0f2747]/20 lg:hidden"
        />
      )}

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-[76px] items-center justify-between border-b border-[#e6ebf2] bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 lg:hidden">
              <Menu className="size-5" />
            </button>
            <div>
              <div className="text-[11px] text-[#95a1b6]">Yönetim Paneli / {currentTitle}</div>
              <h1 className="text-lg font-bold text-[#0f2747]">{currentTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <div className="hidden items-center gap-1.5 rounded-xl bg-[#e7f7ef] px-3 py-1.5 text-xs font-semibold text-[#18a058] sm:flex animate-fade-in">
                <Check className="size-4" />
                Kaydedildi ve yayınlandı!
              </div>
            )}
            <div className="hidden h-7 w-px bg-[#e6ebf2] sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#dce7ff] text-xs font-bold text-[#2f6bff]">
                AK
              </div>
              <span className="hidden text-sm font-semibold sm:block">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              title="Çıkış Yap"
              className="flex items-center gap-1.5 rounded-xl border border-[#e6ebf2] px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-5 sm:p-8">
          {savedSuccess && (
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#e7f7ef] border border-[#a3e5c0] p-4 text-sm font-medium text-[#0f6b3b] sm:hidden">
              <span className="flex items-center gap-2">
                <Check className="size-4" /> Değişiklikler kaydedildi ve web sitenizde yayınlandı!
              </span>
            </div>
          )}

          {view === "dashboard" && (
            <DashboardView
              content={content}
              requests={requests}
              setView={setView}
            />
          )}

          {view === "hero" && (
            <HeroEditor
              hero={content.hero}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newHero) => handleSaveContent({ hero: newHero })}
            />
          )}

          {view === "statistics" && (
            <StatsEditor
              stats={content.statistics}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newStats) => handleSaveContent({ statistics: newStats })}
            />
          )}

          {view === "services" && (
            <ServicesEditor
              services={content.services}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newServices) => handleSaveContent({ services: newServices })}
            />
          )}

          {view === "process" && (
            <ProcessEditor
              process={content.process}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newProcess) => handleSaveContent({ process: newProcess })}
            />
          )}

          {view === "why" && (
            <WhyUsEditor
              why={content.why}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newWhy) => handleSaveContent({ why: newWhy })}
            />
          )}

          {view === "faq" && (
            <FaqEditor
              faq={content.faq}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newFaq) => handleSaveContent({ faq: newFaq })}
            />
          )}

          {view === "contact" && (
            <ContactEditor
              contact={content.contact}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newContact) => handleSaveContent({ contact: newContact })}
            />
          )}

          {view === "footer" && (
            <FooterEditor
              settings={content.settings}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newSettings) => handleSaveContent({ settings: newSettings })}
            />
          )}

          {view === "requests" && (
            <RequestsView
              requests={requests}
              onSelect={setSelectedRequest}
            />
          )}

          {view === "settings" && (
            <SettingsEditor
              settings={content.settings}
              saving={saving}
              savedSuccess={savedSuccess}
              onSave={(newSettings) => handleSaveContent({ settings: newSettings })}
            />
          )}

          {view === "security" && (
            <SecurityEditor />
          )}
        </main>

        <footer className="border-t border-[#e6ebf2] bg-white px-5 py-4 text-[11px] text-[#9aa6b9] sm:px-8">
          © {new Date().getFullYear()} CD ABROAD. Yönetim Paneli.
        </footer>
      </div>

      {/* Request Drawer Modal */}
      {selectedRequest && (
        <RequestDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdateRequest}
        />
      )}
    </div>
  )
}

// -------------------------------------------------------------
// DASHBOARD
// -------------------------------------------------------------
function DashboardView({
  content,
  requests,
  setView,
}: {
  content: AllContent
  requests: RequestItem[]
  setView: (v: View) => void
}) {
  const [search, setSearch] = useState("")
  const cards = sectionNavItems.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))

  const metrics = [
    { label: "Aktif Hizmetler", value: content.services.filter((s) => s.active !== false).length.toString(), icon: Activity, tag: "Yayında" },
    { label: "Toplam İletişim Talebi", value: requests.length.toString(), icon: Mail, tag: "Gelen" },
    { label: "Yeni Başvurular", value: requests.filter((r) => r.status === "Yeni").length.toString(), icon: Bell, tag: "Bekleyen", highlight: true },
    { label: "Aktif SSS Soruları", value: content.faq.filter((f) => f.active !== false).length.toString(), icon: CircleHelp, tag: "Yayında" },
  ]

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-[#0f2747]">Web Sitesi İçerik Yönetimi</h2>
        <p className="mt-1 text-sm text-[#71809b]">
          Web sitenizin tüm bölümlerini buradan düzenleyebilir, değişiklikleri anında yayına alabilirsiniz.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-[#e6ebf2] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="text-xs font-semibold text-[#71809b]">{m.label}</div>
              <div className={`rounded-lg p-2 ${m.highlight ? "bg-amber-50 text-amber-600" : "bg-[#eaf0ff] text-[#2f6bff]"}`}>
                <m.icon className="size-4" />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div className="text-3xl font-bold">{m.value}</div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${m.highlight ? "bg-amber-100 text-amber-700" : "bg-[#e7f7ef] text-[#18a058]"}`}>
                {m.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">Sayfa Bölümleri</h3>
          <p className="mt-0.5 text-xs text-[#8c99ae]">Düzenlemek istediğiniz bölümü seçin.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-[#9aa6b9]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bölüm ara..."
            className="h-9 w-full rounded-xl border border-[#e1e7f0] bg-white pl-9 pr-3 text-xs outline-none focus:border-[#2f6bff] sm:w-48"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((s) => (
          <div
            key={s.key}
            className="group rounded-2xl border border-[#e6ebf2] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cbd9fa] hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#2f6bff]">
                <s.icon className="size-5" />
              </div>
              <span className="rounded-full bg-[#e7f7ef] px-2 py-1 text-[10px] font-semibold text-[#18a058]">
                Yayında
              </span>
            </div>
            <h4 className="mt-4 font-semibold text-[#0f2747]">{s.title}</h4>
            <p className="mt-1 text-xs text-[#7d8ba3]">{s.desc}</p>
            <div className="mt-5 flex items-center justify-between border-t border-[#f0f2f6] pt-3">
              <span className="text-[10px] text-[#a2adc0]">Düzenlenebilir</span>
              <button
                onClick={() => setView(s.key)}
                className="text-xs font-semibold text-[#2f6bff] hover:underline"
              >
                Düzenle ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// -------------------------------------------------------------
// HERO EDITOR
// -------------------------------------------------------------
function HeroEditor({
  hero,
  saving,
  savedSuccess,
  onSave,
}: {
  hero: HeroContent
  saving: boolean
  savedSuccess: boolean
  onSave: (h: HeroContent) => void
}) {
  const [form, setForm] = useState<HeroContent>({
    ...hero,
    cards: hero.cards || {
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
  })

  const handleChange = (field: keyof HeroContent, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  const handleCardChange = (
    section: "center" | "card1" | "card2" | "card3",
    field: string,
    val: string
  ) => {
    setForm((prev) => ({
      ...prev,
      cards: {
        ...prev.cards!,
        [section]: {
          ...(prev.cards as any)[section],
          [field]: val,
        },
      },
    }))
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Hero Alanı Düzenleme</h2>
        <p className="mt-1 text-sm text-[#71809b]">
          Web sitesinin en üst karşılama alanındaki başlık, butonlar ve sağ taraftaki hareketli kartları düzenleyin.
        </p>
      </div>

      {/* Sol Taraf Metinler */}
      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0f2747] mb-4 pb-2 border-b border-[#f1f4f8]">
          1. Karşılama Metinleri ve Butonlar
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#50617d]">Rozet / Üst Başlık (Eyebrow)</label>
            <input
              value={form.eyebrow}
              onChange={(e) => handleChange("eyebrow", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Ana Başlık</label>
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Vurgulanacak Kelime (Renkli)</label>
            <input
              value={form.highlight}
              onChange={(e) => handleChange("highlight", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#50617d]">Açıklama Paragrafı</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#e1e7f0] p-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">1. Buton Metni</label>
            <input
              value={form.primaryCta}
              onChange={(e) => handleChange("primaryCta", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">1. Buton Linki</label>
            <input
              value={form.primaryHref}
              onChange={(e) => handleChange("primaryHref", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">2. Buton Metni</label>
            <input
              value={form.secondaryCta}
              onChange={(e) => handleChange("secondaryCta", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">2. Buton Linki</label>
            <input
              value={form.secondaryHref}
              onChange={(e) => handleChange("secondaryHref", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#50617d]">Sosyal Kanıt Metni (Yıldızların yanı)</label>
            <input
              value={form.socialProof}
              onChange={(e) => handleChange("socialProof", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>
        </div>
      </div>

      {/* Sağ Taraf Animasyonlu Kartlar */}
      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0f2747] mb-2">
          2. Sağ Taraf Animasyonlu Kartlar
        </h3>
        <p className="text-xs text-[#71809b] mb-5">
          Hero alanının sağında havada süzülen (uçan) kartların ve ortadaki ana pasaport kartının metinlerini düzenleyin.
        </p>

        {/* Merkez Kart */}
        <div className="mb-6 rounded-xl border border-[#e8edf5] bg-[#fafbfd] p-4">
          <div className="text-xs font-bold text-[#2f6bff] uppercase tracking-wider mb-3">
            Merkez Ana Kart (Pasaport Kartı)
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-[#50617d]">Yeşil Rozet Metni</label>
              <input
                value={form.cards?.center.badge || "Onaylandı"}
                onChange={(e) => handleCardChange("center", "badge", e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#e1e7f0] bg-white px-3 text-sm outline-none focus:border-[#2f6bff]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#50617d]">Alt Etiket</label>
              <input
                value={form.cards?.center.sublabel || "Pasaport"}
                onChange={(e) => handleCardChange("center", "sublabel", e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#e1e7f0] bg-white px-3 text-sm outline-none focus:border-[#2f6bff]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#50617d]">Ana Başlık</label>
              <input
                value={form.cards?.center.title || "T.C. — Schengen"}
                onChange={(e) => handleCardChange("center", "title", e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#e1e7f0] bg-white px-3 text-sm font-semibold outline-none focus:border-[#2f6bff]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#50617d]">Alt Bilgi / Durum</label>
              <input
                value={form.cards?.center.footer || "Belgeler eksiksiz"}
                onChange={(e) => handleCardChange("center", "footer", e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-[#e1e7f0] bg-white px-3 text-sm outline-none focus:border-[#2f6bff]"
              />
            </div>
          </div>
        </div>

        {/* 3 Uçan Kart */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-xl border border-[#e8edf5] bg-[#fafbfd] p-4">
            <div className="text-xs font-bold text-[#2f6bff] mb-3">1. Kart (Sol Üst)</div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#50617d]">Başlık</label>
                <input
                  value={form.cards?.card1.title || "Vize onayı"}
                  onChange={(e) => handleCardChange("card1", "title", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#e1e7f0] bg-white px-2.5 text-xs font-semibold outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#50617d]">Alt Başlık</label>
                <input
                  value={form.cards?.card1.subtitle || "Çalışma izni"}
                  onChange={(e) => handleCardChange("card1", "subtitle", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#e1e7f0] bg-white px-2.5 text-xs outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-[#e8edf5] bg-[#fafbfd] p-4">
            <div className="text-xs font-bold text-[#0f2747] mb-3">2. Kart (Sağ Üst - Uçak)</div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#50617d]">Başlık</label>
                <input
                  value={form.cards?.card2.title || "Almanya"}
                  onChange={(e) => handleCardChange("card2", "title", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#e1e7f0] bg-white px-2.5 text-xs font-semibold outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#50617d]">Alt Başlık</label>
                <input
                  value={form.cards?.card2.subtitle || "Berlin · München"}
                  onChange={(e) => handleCardChange("card2", "subtitle", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#e1e7f0] bg-white px-2.5 text-xs outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-[#e8edf5] bg-[#fafbfd] p-4">
            <div className="text-xs font-bold text-[#18a058] mb-3">3. Kart (Sol Alt - Oturum)</div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#50617d]">Başlık</label>
                <input
                  value={form.cards?.card3.title || "Oturum izni"}
                  onChange={(e) => handleCardChange("card3", "title", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#e1e7f0] bg-white px-2.5 text-xs font-semibold outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#50617d]">Alt Başlık</label>
                <input
                  value={form.cards?.card3.subtitle || "Aufenthaltstitel"}
                  onChange={(e) => handleCardChange("card3", "subtitle", e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#e1e7f0] bg-white px-2.5 text-xs outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end border-t border-[#edf0f5] pt-5">
          <Button
            onClick={() => onSave(form)}
            disabled={saving}
            className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
          >
            {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// STATS EDITOR
// -------------------------------------------------------------
function StatsEditor({
  stats,
  saving,
  savedSuccess,
  onSave,
}: {
  stats: StatContent[]
  saving: boolean
  savedSuccess: boolean
  onSave: (s: StatContent[]) => void
}) {
  const [list, setList] = useState(stats)

  const handleUpdate = (index: number, field: keyof StatContent, val: any) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: val }
    setList(next)
  }

  const handleAdd = () => {
    setList([...list, { id: Date.now().toString(), value: "100+", label: "Yeni İstatistik", active: true }])
  }

  const handleDelete = (index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">İstatistikler</h2>
          <p className="mt-1 text-sm text-[#71809b]">Hero alanının altındaki başarı ve güven rakamlarını yönetin.</p>
        </div>
        <Button onClick={handleAdd} className="rounded-xl bg-[#2f6bff] text-white">
          <Plus className="size-4 mr-1.5" /> Yeni İstatistik Ekle
        </Button>
      </div>

      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {list.map((item, idx) => (
            <div key={item.id || idx} className="flex flex-col gap-3 rounded-xl border border-[#eef2f8] bg-[#fafbfd] p-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-1/3">
                <label className="text-[11px] font-semibold text-[#71809b]">Değer (Örn: 2.000+, %98)</label>
                <input
                  value={item.value}
                  onChange={(e) => handleUpdate(idx, "value", e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-[#e1e7f0] bg-white px-3 text-sm font-bold text-navy outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-[#71809b]">Açıklama Etiketi</label>
                <input
                  value={item.label}
                  onChange={(e) => handleUpdate(idx, "label", e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-[#e1e7f0] bg-white px-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div className="flex items-center gap-2 pt-4 sm:pt-0">
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="rounded-lg p-2 text-[#71809b] hover:bg-red-50 hover:text-red-600 transition"
                  title="Sil"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-end border-t border-[#edf0f5] pt-5">
          <Button
            onClick={() => onSave(list)}
            disabled={saving}
            className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
          >
            {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// SERVICES EDITOR
// -------------------------------------------------------------
function ServicesEditor({
  services,
  saving,
  savedSuccess,
  onSave,
}: {
  services: ServiceContent[]
  saving: boolean
  savedSuccess: boolean
  onSave: (s: ServiceContent[]) => void
}) {
  const [list, setList] = useState(services)

  const handleUpdate = (index: number, field: keyof ServiceContent, val: any) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: val }
    setList(next)
  }

  const handleAdd = () => {
    setList([
      ...list,
      {
        id: Date.now().toString(),
        icon: "briefcase",
        title: "Yeni Hizmet Başlığı",
        description: "Hizmetin kapsamı ve detayları hakkında açıklama.",
        href: "#iletisim",
        active: true,
      },
    ])
  }

  const handleDelete = (index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hizmetlerimiz</h2>
          <p className="mt-1 text-sm text-[#71809b]">Sunduğunuz danışmanlık hizmetlerini ekleyin, düzenleyin veya kaldırın.</p>
        </div>
        <Button onClick={handleAdd} className="rounded-xl bg-[#2f6bff] text-white">
          <Plus className="size-4 mr-1.5" /> Yeni Hizmet Ekle
        </Button>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="rounded-2xl border border-[#e6ebf2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1f4f8] pb-3 mb-4">
              <span className="text-xs font-bold text-[#2f6bff]">Hizmet #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="flex items-center gap-1 text-xs text-red-600 hover:underline"
              >
                <Trash2 className="size-3.5" /> Hizmeti Sil
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-[#50617d]">Hizmet Başlığı</label>
                <input
                  value={item.title}
                  onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#e1e7f0] px-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#50617d]">Yönlendirme Linki</label>
                <input
                  value={item.href || "#iletisim"}
                  onChange={(e) => handleUpdate(idx, "href", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#e1e7f0] px-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#50617d]">Açıklama</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleUpdate(idx, "description", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e1e7f0] p-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          onClick={() => onSave(list)}
          disabled={saving}
          className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
        >
          {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// PROCESS EDITOR
// -------------------------------------------------------------
function ProcessEditor({
  process,
  saving,
  savedSuccess,
  onSave,
}: {
  process: ProcessContent[]
  saving: boolean
  savedSuccess: boolean
  onSave: (p: ProcessContent[]) => void
}) {
  const [list, setList] = useState(process)

  const handleUpdate = (index: number, field: keyof ProcessContent, val: any) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: val }
    setList(next)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">4 Adımlı Süreç</h2>
        <p className="mt-1 text-sm text-[#71809b]">Danışmanlık sürecinizin aşamalarını düzenleyin.</p>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="rounded-2xl border border-[#e6ebf2] bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-[#50617d]">Adım Numarası</label>
                <input
                  value={item.step}
                  onChange={(e) => handleUpdate(idx, "step", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#e1e7f0] px-3 text-sm font-bold text-[#2f6bff] outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#50617d]">Adım Başlığı</label>
                <input
                  value={item.title}
                  onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#e1e7f0] px-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-[#50617d]">Açıklama</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleUpdate(idx, "description", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e1e7f0] p-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          onClick={() => onSave(list)}
          disabled={saving}
          className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
        >
          {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// WHY US EDITOR
// -------------------------------------------------------------
function WhyUsEditor({
  why,
  saving,
  savedSuccess,
  onSave,
}: {
  why: WhyContent[]
  saving: boolean
  savedSuccess: boolean
  onSave: (w: WhyContent[]) => void
}) {
  const [list, setList] = useState(why)

  const handleUpdate = (index: number, field: keyof WhyContent, val: any) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: val }
    setList(next)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Neden Biz?</h2>
        <p className="mt-1 text-sm text-[#71809b]">Sizi öne çıkaran 4 temel nedeni yönetin.</p>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="rounded-2xl border border-[#e6ebf2] bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#50617d]">Özellik Başlığı</label>
                <input
                  value={item.title}
                  onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#e1e7f0] px-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#50617d]">Açıklama</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleUpdate(idx, "description", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e1e7f0] p-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          onClick={() => onSave(list)}
          disabled={saving}
          className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
        >
          {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// FAQ EDITOR
// -------------------------------------------------------------
function FaqEditor({
  faq,
  saving,
  savedSuccess,
  onSave,
}: {
  faq: FaqContent[]
  saving: boolean
  savedSuccess: boolean
  onSave: (f: FaqContent[]) => void
}) {
  const [list, setList] = useState(faq)

  const handleUpdate = (index: number, field: keyof FaqContent, val: any) => {
    const next = [...list]
    next[index] = { ...next[index], [field]: val }
    setList(next)
  }

  const handleAdd = () => {
    setList([
      ...list,
      {
        id: Date.now().toString(),
        question: "Yeni Soru?",
        answer: "Bu sorunun detaylı yanıtı buraya yazılır.",
        active: true,
      },
    ])
  }

  const handleDelete = (index: number) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sıkça Sorulan Sorular (SSS)</h2>
          <p className="mt-1 text-sm text-[#71809b]">Ziyaretçilerinizin aklındaki soruları ve cevapları düzenleyin.</p>
        </div>
        <Button onClick={handleAdd} className="rounded-xl bg-[#2f6bff] text-white">
          <Plus className="size-4 mr-1.5" /> Yeni Soru Ekle
        </Button>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={item.id || idx} className="rounded-2xl border border-[#e6ebf2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#f1f4f8] pb-3 mb-4">
              <span className="text-xs font-bold text-[#2f6bff]">Soru #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="flex items-center gap-1 text-xs text-red-600 hover:underline"
              >
                <Trash2 className="size-3.5" /> Soruyu Sil
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#50617d]">Soru Metni</label>
                <input
                  value={item.question}
                  onChange={(e) => handleUpdate(idx, "question", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#e1e7f0] px-3 text-sm font-semibold outline-none focus:border-[#2f6bff]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#50617d]">Cevap Metni</label>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e1e7f0] p-3 text-sm outline-none focus:border-[#2f6bff]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          onClick={() => onSave(list)}
          disabled={saving}
          className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
        >
          {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// CONTACT EDITOR
// -------------------------------------------------------------
function ContactEditor({
  contact,
  saving,
  savedSuccess,
  onSave,
}: {
  contact: ContactContent
  saving: boolean
  savedSuccess: boolean
  onSave: (c: ContactContent) => void
}) {
  const [form, setForm] = useState(contact)

  const handleChange = (field: keyof ContactContent, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">İletişim Alanı</h2>
        <p className="mt-1 text-sm text-[#71809b]">İletişim formu başlığı, adres, telefon ve e-posta bilgilerini düzenleyin.</p>
      </div>

      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#50617d]">Form Başlığı</label>
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#50617d]">Açıklama Metni</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#e1e7f0] p-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Telefon Numarası</label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">E-posta Adresi</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Adres</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">WhatsApp Numarası</label>
            <input
              value={form.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>
        </div>

        <div className="mt-7 flex justify-end border-t border-[#edf0f5] pt-5">
          <Button
            onClick={() => onSave(form)}
            disabled={saving}
            className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
          >
            {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// FOOTER & SETTINGS EDITOR
// -------------------------------------------------------------
function FooterEditor({
  settings,
  saving,
  savedSuccess,
  onSave,
}: {
  settings: SettingsContent
  saving: boolean
  savedSuccess: boolean
  onSave: (s: SettingsContent) => void
}) {
  return <SettingsEditor settings={settings} saving={saving} savedSuccess={savedSuccess} onSave={onSave} />
}

function SettingsEditor({
  settings,
  saving,
  savedSuccess,
  onSave,
}: {
  settings: SettingsContent
  saving: boolean
  savedSuccess: boolean
  onSave: (s: SettingsContent) => void
}) {
  const [form, setForm] = useState(settings)

  const handleChange = (field: keyof SettingsContent, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Site ve Footer Ayarları</h2>
        <p className="mt-1 text-sm text-[#71809b]">Web sitesinin adı, sloganı, WhatsApp ve iletişim kanallarını yönetin.</p>
      </div>

      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-[#50617d]">Site / Marka Adı</label>
            <input
              value={form.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">WhatsApp Buton Numarası</label>
            <input
              value={form.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#50617d]">Footer Slogan / Kısa Tanıtım</label>
            <textarea
              rows={2}
              value={form.tagline || ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#e1e7f0] p-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Telefon</label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">E-posta</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Adres</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Instagram Hesabı</label>
            <input
              value={form.instagram || ""}
              onChange={(e) => handleChange("instagram", e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>
        </div>

        <div className="mt-7 flex justify-end border-t border-[#edf0f5] pt-5">
          <Button
            onClick={() => onSave(form)}
            disabled={saving}
            className="rounded-xl bg-[#2f6bff] px-6 text-white hover:bg-[#2055d9]"
          >
            {saving ? "Kaydediliyor..." : savedSuccess ? "✓ Kaydedildi!" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// REQUESTS VIEW
// -------------------------------------------------------------
function RequestsView({
  requests,
  onSelect,
}: {
  requests: RequestItem[]
  onSelect: (r: RequestItem) => void
}) {
  const [filter, setFilter] = useState("Tümü")
  const filtered = requests.filter((r) => filter === "Tümü" || r.status === filter)

  return (
    <>
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-[#0f2747]">İletişim Talepleri</h2>
        <p className="mt-1.5 text-sm text-[#71809b]">Web sitenizden form dolduran ziyaretçilerin başvuruları.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-[#f1f4f8] p-1">
          {["Tümü", "Yeni", "İletişime Geçildi", "Tamamlandı"].map((x) => (
            <button
              key={x}
              onClick={() => setFilter(x)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                filter === x ? "bg-white text-[#2f6bff] shadow-sm" : "text-[#71809b] hover:text-[#0f2747]"
              }`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#e6ebf2] bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-[#edf0f5] bg-[#fafbfd]">
            <tr>
              {["Ad Soyad", "İletişim", "Hizmet", "Tarih", "Durum", ""].map((x) => (
                <th key={x} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#9aa6b9]">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-[#9aa6b9]">
                  Kayıtlı başvuru bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className="cursor-pointer border-b border-[#edf0f5] transition hover:bg-[#fbfcff]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-[#dce7ff] text-[11px] font-bold text-[#2f6bff]">
                        {r.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-medium">{r.email}</div>
                    <div className="mt-0.5 text-[10px] text-[#9aa6b9]">{r.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#60708d]">{r.service}</td>
                  <td className="px-5 py-4 text-xs text-[#60708d]">{r.date}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        r.status === "Yeni"
                          ? "bg-amber-50 text-amber-600"
                          : r.status === "Tamamlandı"
                            ? "bg-[#e7f7ef] text-[#18a058]"
                            : "bg-[#eaf0ff] text-[#2f6bff]"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight className="ml-auto size-4 text-[#b1bbca]" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

// -------------------------------------------------------------
// REQUEST DRAWER MODAL
// -------------------------------------------------------------
function RequestDrawer({
  request,
  onClose,
  onUpdate,
}: {
  request: RequestItem
  onClose: () => void
  onUpdate: (id: string | number, status: string, note?: string) => Promise<void>
}) {
  const [status, setStatus] = useState(request.status)
  const [note, setNote] = useState(request.note || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(request.id, status, note)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={onClose} className="fixed inset-0 bg-[#0f2747]/30 backdrop-blur-xs" />
      <div className="relative z-10 flex h-full w-full max-w-[440px] flex-col bg-white p-6 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#edf0f5] pb-5">
          <div>
            <div className="text-xs text-[#8c99ae]">Talep Detayı</div>
            <h2 className="mt-1 text-xl font-bold">{request.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-[#71809b] hover:bg-[#f1f4f8]">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 py-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#f7f9fc] p-3">
              <div className="text-[10px] font-semibold uppercase text-[#9aa6b9]">E-posta</div>
              <div className="mt-1 text-xs font-medium break-all">{request.email}</div>
            </div>
            <div className="rounded-xl bg-[#f7f9fc] p-3">
              <div className="text-[10px] font-semibold uppercase text-[#9aa6b9]">Telefon</div>
              <div className="mt-1 text-xs font-medium">{request.phone}</div>
            </div>
            <div className="rounded-xl bg-[#f7f9fc] p-3">
              <div className="text-[10px] font-semibold uppercase text-[#9aa6b9]">İlgilenilen Hizmet</div>
              <div className="mt-1 text-xs font-medium">{request.service}</div>
            </div>
            <div className="rounded-xl bg-[#f7f9fc] p-3">
              <div className="text-[10px] font-semibold uppercase text-[#9aa6b9]">Tarih</div>
              <div className="mt-1 text-xs font-medium">{request.date}</div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Durum Değiştir</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-[#e1e7f0] bg-white px-3 text-sm font-semibold outline-none focus:border-[#2f6bff]"
            >
              <option value="Yeni">Yeni</option>
              <option value="İletişime Geçildi">İletişime Geçildi</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="Arşiv">Arşiv</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#50617d]">Mesaj</div>
            <p className="mt-1.5 rounded-xl bg-[#f7f9fc] border border-[#edf0f5] p-4 text-sm leading-relaxed text-[#50617d]">
              {request.message}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#50617d]">Yönetici İç Notu</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bu başvuru ile ilgili not ekleyin..."
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-[#e1e7f0] p-3 text-sm outline-none focus:border-[#2f6bff]"
            />
          </div>
        </div>

        <div className="border-t border-[#edf0f5] pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-xl bg-[#2f6bff] py-3 text-white hover:bg-[#2055d9]"
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// SECURITY & PASSWORD EDITOR
// -------------------------------------------------------------
function SecurityEditor() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newEmail, setNewEmail] = useState("")
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg("")
    setErrorMsg("")

    if (!currentPassword) {
      setErrorMsg("Lütfen mevcut şifrenizi girin.")
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg("Yeni şifre en az 6 karakter olmalıdır.")
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Yeni şifreler birbiriyle uyuşmuyor.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newEmail: newEmail.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok && data.ok) {
        setSuccessMsg("Giriş şifreniz başarıyla güncellendi! Bir sonraki girişinizde yeni şifrenizi kullanabilirsiniz.")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setErrorMsg(data.error || "Şifre güncellenemedi.")
      }
    } catch {
      setErrorMsg("Sunucu ile iletişim kurulurken bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Güvenlik ve Şifre Yönetimi</h2>
        <p className="mt-1 text-sm text-[#71809b]">
          Admin paneli giriş şifrenizi buradan güvenli şekilde güncelleyebilirsiniz.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#a3e5c0] bg-[#e7f7ef] p-4 text-sm font-medium text-[#0f6b3b] animate-fade-in">
          <Check className="size-5 shrink-0 text-[#18a058]" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 animate-fade-in">
          <ShieldAlert className="size-5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Şifre Değiştirme Kartı */}
      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#f1f4f8] pb-4 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#2f6bff]">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0f2747]">Giriş Şifresini Değiştir</h3>
            <p className="text-xs text-[#71809b]">Hesap güvenliğiniz için güçlü ve tahmin edilmesi zor bir şifre seçin.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Mevcut Şifre */}
          <div>
            <label className="text-xs font-semibold text-[#50617d]">Mevcut Şifre</label>
            <div className="relative mt-1.5">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Şu anki giriş şifreniz"
                className="h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 pr-10 text-sm outline-none focus:border-[#2f6bff]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-[#9aa6b9] hover:text-[#50617d]"
              >
                {showCurrent ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {/* Yeni Şifre */}
          <div>
            <label className="text-xs font-semibold text-[#50617d]">Yeni Şifre (En az 6 karakter)</label>
            <div className="relative mt-1.5">
              <input
                type={showNew ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni güvenli şifreniz"
                className="h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 pr-10 text-sm outline-none focus:border-[#2f6bff]"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-[#9aa6b9] hover:text-[#50617d]"
              >
                {showNew ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {/* Yeni Şifre Tekrar */}
          <div>
            <label className="text-xs font-semibold text-[#50617d]">Yeni Şifre (Tekrar)</label>
            <div className="relative mt-1.5">
              <input
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Yeni şifrenizi tekrar yazın"
                className="h-11 w-full rounded-xl border border-[#e1e7f0] px-3.5 pr-10 text-sm outline-none focus:border-[#2f6bff]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-[#9aa6b9] hover:text-[#50617d]"
              >
                {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#2f6bff] px-6 py-2.5 text-white hover:bg-[#2055d9]"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </Button>
          </div>
        </form>
      </div>

      {/* Güvenlik Durumu Bilgilendirmesi */}
      <div className="rounded-2xl border border-[#e6ebf2] bg-white p-6 shadow-sm">
        <h4 className="text-sm font-bold text-[#0f2747] mb-3">Aktif Güvenlik Katmanları</h4>
        <div className="space-y-3 text-xs text-[#60708d]">
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#e7f7ef] text-[#18a058]">✓</span>
            <span><strong>PBKDF2 SHA-512 Hashleme:</strong> Şifreleriniz düz metin olarak değil, 100.000 iterasyonlu PBKDF2 tuzlama (salt) ile güvenle saklanır.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#e7f7ef] text-[#18a058]">✓</span>
            <span><strong>HMAC İmzalı Oturumlar:</strong> Admin oturum çerezleri sahteciliğe karşı kriptografik imzalıdır.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#e7f7ef] text-[#18a058]">✓</span>
            <span><strong>Kaba Kuvvet (Brute-Force) Koruması:</strong> 15 dakikada 5 hatalı şifre denemesinde IP geçici olarak kilitlenir.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
