import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  fullCenter?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-3',
  xl: 'h-12 w-12 border-4',
}

// Zarif, döner yükleniyor göstergesi ve mikro-etiket bileşeni
export function LoadingSpinner({
  size = 'md',
  label,
  fullCenter = false,
  className = '',
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${SIZE_MAP[size]} shrink-0 rounded-full border-indigo-600/20 border-t-indigo-600 animate-spin`}
        role="status"
        aria-label="Yükleniyor"
      />
      {label && (
        <span className="text-xs font-medium text-slate-500 tracking-wide select-none">
          {label}
        </span>
      )}
    </div>
  )

  if (fullCenter) {
    return (
      <div className="flex h-full w-full min-h-[160px] flex-1 items-center justify-center p-6">
        {spinner}
      </div>
    )
  }

  return spinner
}
