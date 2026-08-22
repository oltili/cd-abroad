import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'CD ABROAD | Almanya Göç ve Vize Danışmanlığı',
  description:
    "Almanya'ya taşınmak isteyen aileler ve profesyoneller için yetkili ve güvenilir göç, vize, iş ve oturum danışmanlığı. CD ABROAD uzman ekibiyle sürecinizi baştan sona yönetin.",
  keywords: [
    'CD ABROAD',
    'Almanya göç danışmanlığı',
    'Almanya vize',
    'Almanya oturum izni',
    'Almanya iş vizesi',
    'Almanya danışmanlık',
  ],
  openGraph: {
    title: 'CD ABROAD | Almanya Göç ve Vize Danışmanlığı',
    description:
      "Almanya'ya taşınma sürecinizi CD ABROAD uzman ekibiyle güvenle yönetin. Ücretsiz ön değerlendirme.",
    type: 'website',
    locale: 'tr_TR',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
