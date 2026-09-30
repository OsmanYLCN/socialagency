import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

import { ThemeListener } from '@/components/dashboard/ThemeListener'

export const metadata: Metadata = {
  title: 'Ajans Sistemi – B2B Sosyal Medya Yönetim Platformu',
  description:
    'Ajanslar ve müşteriler için geliştirilmiş, modern B2B sosyal medya yönetim ve görev takip platformu.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('smaup_user_settings');if(s){var c=JSON.parse(s);var d=c.theme==='dark'||(c.theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}if(c.density==='compact'){document.documentElement.classList.add('compact-mode')}if(c.animations===false){document.documentElement.classList.add('reduce-motion')}}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-[#0e1015] dark:text-[#f8fafc] font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-150">
        <ThemeListener />
        {children}
      </body>
    </html>
  )
}
