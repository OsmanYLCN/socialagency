'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Sayfa geçişlerinde ekranın en üstünde anlık akan ince indigo ilerleme çubuğu
export function RouteProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)

  // Dahili link tıklamalarını yakala
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target || !target.href) return

      if (
        target.target === '_blank' ||
        target.download ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      try {
        const url = new URL(target.href, window.location.href)
        const currentUrl = new URL(window.location.href)

        if (
          url.origin === currentUrl.origin &&
          (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
        ) {
          setIsNavigating(true)
          setProgress(25)
        }
      } catch {
        // Geçersiz URL durumunu yoksay
      }
    }

    document.addEventListener('click', handleAnchorClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true })
    }
  }, [])

  // Rota veya parametre değiştiğinde (yükleme bittiğinde) çubuğu tamamla ve gizle
  useEffect(() => {
    if (isNavigating) {
      setProgress(100)
      const timer = setTimeout(() => {
        setIsNavigating(false)
        setProgress(0)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  // Yükleme sürerken ilerlemeyi kademeli artır
  useEffect(() => {
    if (!isNavigating) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 75) return prev + 15
        if (prev < 92) return prev + 4
        return prev
      })
    }, 150)

    return () => clearInterval(interval)
  }, [isNavigating])

  if (!isNavigating && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-500 shadow-xs shadow-indigo-500/40"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'all 250ms ease-out' : 'width 150ms ease-out',
        }}
      />
    </div>
  )
}
