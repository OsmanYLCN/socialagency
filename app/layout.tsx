import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ajans Sistemi – B2B Sosyal Medya Yönetim Platformu',
  description:
    'Ajanslar ve müşteriler için geliştirilmiş, modern B2B sosyal medya yönetim ve görev takip platformu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">{children}</body>
    </html>
  )
}
