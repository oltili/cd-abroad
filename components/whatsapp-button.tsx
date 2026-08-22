import { MessageCircle } from "lucide-react"

export function WhatsappButton({ whatsapp }: { whatsapp?: string }) {
  const cleanNumber = (whatsapp || "+49 170 123 45 67").replace(/[^0-9]/g, "")

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent("Merhaba, Almanya göç ve vize süreci hakkında bilgi almak istiyorum.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      className="animate-float fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-emerald px-4 py-3.5 font-semibold text-primary-foreground shadow-xl shadow-emerald/30 transition-all hover:-translate-y-0.5 hover:brightness-105 sm:bottom-8 sm:right-8"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
