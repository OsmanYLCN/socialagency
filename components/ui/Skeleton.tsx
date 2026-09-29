import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

// Shimmer (ışık dalgası) efektli ortak iskelet bileşeni
export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-xl bg-slate-200/80 ${className}`.trim()}
      {...props}
    />
  )
}
