'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react'

interface ImageCropperModalProps {
  isOpen: boolean
  imageSrc: string
  onClose: () => void
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void
}

const VIEWPORT_SIZE = 320
const CROP_DIAMETER = 240
const OUTPUT_SIZE = 400

export function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const imgRef = useRef<HTMLImageElement>(null)

  // Görsel boyutlarını okuyup konumu sıfırlar
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    setZoom(1)
    setRotation(0)
    setOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const isRotatedSideways = rotation % 180 !== 0
  const rawW = imageDimensions ? (isRotatedSideways ? imageDimensions.height : imageDimensions.width) : 1
  const rawH = imageDimensions ? (isRotatedSideways ? imageDimensions.width : imageDimensions.height) : 1

  const minScale = Math.max(CROP_DIAMETER / rawW, CROP_DIAMETER / rawH)
  const currentScale = minScale * zoom

  const renderW = rawW * currentScale
  const renderH = rawH * currentScale

  const maxOffsetX = Math.max(0, (renderW - CROP_DIAMETER) / 2)
  const maxOffsetY = Math.max(0, (renderH - CROP_DIAMETER) / 2)

  const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x))
  const clampedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y))

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    setOffset({
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
    })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false)
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch {
      }
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY * 0.0015
    setZoom((prev) => Math.max(1, Math.min(3, prev + delta)))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
    setOffset({ x: 0, y: 0 })
  }

  // Görseli kırpıp çıktı dosyasını üretir
  const handleApplyCrop = useCallback(() => {
    if (!imageDimensions || !imgRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const center = OUTPUT_SIZE / 2
    ctx.translate(center, center)

    const ratio = OUTPUT_SIZE / CROP_DIAMETER

    ctx.translate(clampedX * ratio, clampedY * ratio)

    ctx.rotate((rotation * Math.PI) / 180)

    const origW = imageDimensions.width
    const origH = imageDimensions.height

    const drawW = origW * minScale * zoom * ratio
    const drawH = origH * minScale * zoom * ratio

    ctx.drawImage(imgRef.current, -drawW / 2, -drawH / 2, drawW, drawH)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob)
          onCropComplete(blob, previewUrl)
        }
      },
      'image/jpeg',
      0.92
    )
  }, [imageDimensions, clampedX, clampedY, rotation, minScale, zoom, onCropComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Fotoğrafı Konumlandır</h3>
            <p className="text-[11px] text-slate-500">
              Fotoğrafı sürükleyerek daireye ortalayın
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-900 p-6 select-none">
          <div
            className="relative overflow-hidden rounded-xl bg-slate-950 shadow-inner flex items-center justify-center"
            style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
            onWheel={handleWheel}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Kırpılacak görsel"
              onLoad={handleImageLoad}
              draggable={false}
              className="absolute pointer-events-none transition-transform duration-75 select-none"
              style={{
                width: imageDimensions ? imageDimensions.width * minScale * zoom : 'auto',
                height: imageDimensions ? imageDimensions.height * minScale * zoom : 'auto',
                maxWidth: 'none',
                maxHeight: 'none',
                transform: `translate(${clampedX}px, ${clampedY}px) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            />

            <div
              className={`absolute inset-0 pointer-events-auto flex items-center justify-center ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className="pointer-events-none rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.7)]"
                style={{
                  width: CROP_DIAMETER,
                  height: CROP_DIAMETER,
                }}
              />
            </div>
          </div>

          <p className="mt-2.5 text-[11px] text-slate-400 font-medium">
            Görseli sürükleyerek daire içerisine istediğiniz gibi hizalayın
          </p>
        </div>

        <div className="border-t border-slate-100 bg-white px-6 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Uzaklaştır"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              aria-label="Yakınlaştırma"
              className="h-1.5 w-full appearance-none rounded-lg bg-slate-200 accent-slate-800 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Yakınlaştır"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="90 Derece Döndür"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Döndür</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Kırp ve Uygula</span>
          </button>
        </div>
      </div>
    </div>
  )
}
