'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  AtSign,
  MapPin,
  Receipt,
  FileText,
  CheckSquare,
  Calendar,
  Pencil,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Layers,
} from 'lucide-react'
import type { BrandItem } from './CustomersClientView'

interface CustomerDetailDrawerProps {
  brand: BrandItem | null
  isOpen: boolean
  onClose: () => void
  onEdit: (brand: BrandItem) => void
  onDelete: (brand: BrandItem) => void
}

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  unassigned: {
    label: 'İş Havuzu',
    cls: 'bg-slate-100 text-slate-700 dark:bg-[#222632] dark:text-slate-300',
  },
  assigned: {
    label: 'Üretimde',
    cls: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  },
  pending_approval: {
    label: 'Onay Bekliyor',
    cls: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  },
  revision_requested: {
    label: 'Revizyonda',
    cls: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  },
  completed: {
    label: 'Tamamlandı',
    cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
}

function CopyInline({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
      className="ml-1.5 inline-flex items-center rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#222632] dark:hover:text-slate-200 transition-colors cursor-pointer"
      title="Kopyala"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export function CustomerDetailDrawer({
  brand,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !brand) return null

  const meta = brand.metadata
  const customerName =
    [brand.customer?.firstName, brand.customer?.lastName]
      .filter((p) => p && p !== '(Müşteri)')
      .join(' ') || 'Yetkili Belirtilmedi'

  const totalTasks = brand.activeTaskCount + brand.completedTaskCount
  const completionPct = totalTasks > 0 ? Math.round((brand.completedTaskCount / totalTasks) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-200 dark:border-[#272b37] dark:bg-[#16181f]">
        {/* Üst Başlık */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-[#272b37]">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-base font-black text-indigo-700 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900/50">
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 truncate">
                  {brand.name}
                </h2>
                {brand.customer && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      brand.customer.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50'
                        : 'bg-slate-100 text-slate-600 dark:bg-[#1a1d25] dark:text-slate-400'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${brand.customer.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {brand.customer.isActive ? 'Aktif Müşteri' : 'Askıda'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {meta.sector || 'Sektör Belirtilmemiş'} {meta.city ? `• ${meta.city}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#222632] dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Kaydırılabilir İçerik */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Üst Finansal & Üretim Özeti */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-[#272b37] dark:bg-[#1a1d25]">
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Aylık Hizmet Bedeli</p>
              <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100 tabular-nums">
                {brand.monthlyFee.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-[#272b37] dark:bg-[#1a1d25]">
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Aktif / Tamamlanan</p>
              <p className="mt-1 text-base font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                {brand.activeTaskCount} / {brand.completedTaskCount}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-[#272b37] dark:bg-[#1a1d25]">
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Haftalık Şablon</p>
              <p className="mt-1 text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {brand.weeklyTemplateQuota} İçerik
              </p>
            </div>
          </div>

          {/* 2. İletişim & Dijital Kanallar */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 dark:border-[#272b37] dark:bg-[#14161d]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              İletişim & Dijital Kanallar
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">Marka Yetkilisi</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">Telefon</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {meta.phone || 'Belirtilmedi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:col-span-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400">Portal Giriş E-postası</p>
                  <div className="flex items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {brand.customer?.email || 'Hesap atanmamış'}
                    </span>
                    {brand.customer?.email && <CopyInline value={brand.customer.email} />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <AtSign className="h-4 w-4 text-fuchsia-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">Instagram</p>
                  {meta.instagram ? (
                    <a
                      href={`https://instagram.com/${meta.instagram.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-fuchsia-600 hover:underline dark:text-fuchsia-400"
                    >
                      <span>@{meta.instagram.replace(/^@/, '')}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="font-medium text-slate-500">Belirtilmedi</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">Web Sitesi</p>
                  {meta.website ? (
                    <a
                      href={meta.website.startsWith('http') ? meta.website : `https://${meta.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400 truncate max-w-[180px]"
                    >
                      <span className="truncate">{meta.website}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <p className="font-medium text-slate-500">Belirtilmedi</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Fatura & Vergi Kayıtları */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 dark:border-[#272b37] dark:bg-[#14161d]">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Fatura & Vergi Bilgileri
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="sm:col-span-2">
                <p className="text-[11px] text-slate-400">Resmi Ticari Ünvan</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {meta.billingTitle || 'Belirtilmedi'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Vergi Dairesi</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {meta.taxOffice || 'Belirtilmedi'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Vergi No / TCKN</p>
                <div className="flex items-center mt-0.5">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {meta.taxId || 'Belirtilmedi'}
                  </span>
                  {meta.taxId && <CopyInline value={meta.taxId} />}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Özel Marka Notları / Brief */}
          {meta.notes && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Ajans İçi Marka Brief & Notları
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {meta.notes}
              </p>
            </div>
          )}

          {/* 5. Markanın Görev Akışı */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Markaya Ait Görevler ({totalTasks})
              </h3>
              <Link
                href={`/agency/tasks?brandId=${brand.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>Tüm Görevleri Yönet</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {totalTasks > 0 && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#222632]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            )}

            {brand.recentTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-[#272b37] dark:text-slate-500">
                Bu markaya ait aktif görev bulunmuyor.
              </div>
            ) : (
              <div className="space-y-2">
                {brand.recentTasks.map((task) => {
                  const st = STATUS_BADGES[task.status] ?? STATUS_BADGES.unassigned
                  return (
                    <Link
                      key={task.id}
                      href={`/agency/tasks?taskId=${task.id}`}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-xs hover:border-indigo-300 hover:bg-white transition-all dark:border-[#272b37] dark:bg-[#1a1d25] dark:hover:border-indigo-500/50"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase text-slate-900 dark:text-slate-100">
                            {task.platform} • {task.content}
                          </span>
                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>
                            {st.label}
                          </span>
                        </div>
                        {task.assignmentNote && (
                          <p className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {task.assignmentNote}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-slate-400 tabular-nums">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Alt Aksiyon Çubuğu */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-[#272b37] dark:bg-[#1a1d25]/60">
          <button
            type="button"
            onClick={() => {
              onClose()
              onDelete(brand)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-[#16181f] dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Markayı Sil</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/agency/content"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-[#272b37] dark:bg-[#16181f] dark:text-slate-200 dark:hover:bg-[#222632] transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Şablonlar</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose()
                onEdit(brand)
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Bilgileri Düzenle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
