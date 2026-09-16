'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, Building, Mail, CheckSquare, Copy, Check, MoreHorizontal, Pencil, Trash2, Building2 } from 'lucide-react'
import type { BrandItem } from './CustomersClientView'

type SortKey = 'newest' | 'oldest' | 'fee_high' | 'fee_low' | 'alpha'

interface CustomersListProps {
  brands: BrandItem[]
  onEdit: (brand: BrandItem) => void
  onDelete: (brand: BrandItem) => void
  onAdd: () => void
}

// Markadan monogram renk sinifi uretir
function getBrandColor(name: string): string {
  const colors = [
    'bg-indigo-50 text-indigo-700',
    'bg-emerald-50 text-emerald-700',
    'bg-sky-50 text-sky-700',
    'bg-violet-50 text-violet-700',
    'bg-rose-50 text-rose-700',
    'bg-amber-50 text-amber-700',
    'bg-teal-50 text-teal-700',
    'bg-fuchsia-50 text-fuchsia-700',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

// Markadan 2 harflik monogram uretir
function getMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '??'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Kopyala"
      className="ml-1 inline-flex items-center rounded p-0.5 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

function BrandCard({ brand, onEdit, onDelete }: { brand: BrandItem; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const monogram = getMonogram(brand.name)
  const colorClass = getBrandColor(brand.name)
  const customerName = [brand.customer?.firstName, brand.customer?.lastName].filter(Boolean).join(' ') || 'Yetkili Atanmadi'

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-200 hover:shadow-sm">
      {/* Ust: Monogram + Isim + Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${colorClass}`}>
            {monogram}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-slate-900">{brand.name}</h4>
            <p className="mt-0.5 truncate text-xs text-slate-400">{customerName}</p>
          </div>
        </div>

        {/* Dropdown menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onEdit() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                  Duzenle
                </button>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onDelete() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orta: Email */}
      {brand.customer?.email && (
        <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
          <Mail className="h-3 w-3 shrink-0" />
          <span className="truncate">{brand.customer.email}</span>
          <CopyButton text={brand.customer.email} />
        </div>
      )}

      {/* Alt: Metrikler */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold text-indigo-600">{brand.activeTaskCount}</span>
            <span className="text-slate-400">aktif</span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div className="flex items-center gap-1 text-xs">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-600">{brand.completedTaskCount}</span>
            <span className="text-slate-400">tamamlandi</span>
          </div>
        </div>

        <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
          {brand.monthlyFee > 0
            ? brand.monthlyFee.toLocaleString('tr-TR', { minimumFractionDigits: 0 }) + ' ₺'
            : 'Ücret yok'}
        </span>
      </div>

      {/* Aktiflik rozeti */}
      {brand.customer && (
        <span
          className={`absolute right-4 top-4 h-2 w-2 rounded-full ${brand.customer.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`}
          title={brand.customer.isActive ? 'Aktif' : 'Pasif'}
        />
      )}
    </div>
  )
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'fee_high', label: 'Yuksek Butce' },
  { value: 'fee_low', label: 'Dusuk Butce' },
  { value: 'alpha', label: 'A-Z' },
]

// Marka kartlari listesi, arama ve siralama ile
export function CustomersList({ brands, onEdit, onDelete, onAdd }: CustomersListProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const result = q
      ? brands.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.customer?.email?.toLowerCase().includes(q) ||
            [b.customer?.firstName, b.customer?.lastName]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()
              .includes(q)
        )
      : [...brands]

    return result.sort((a, b) => {
      if (sort === 'alpha') return a.name.localeCompare(b.name, 'tr')
      if (sort === 'fee_high') return b.monthlyFee - a.monthlyFee
      if (sort === 'fee_low') return a.monthlyFee - b.monthlyFee
      if (sort === 'oldest')
        return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0)
      // newest (default)
      return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
    })
  }, [brands, query, sort])

  return (
    <div className="space-y-4">
      {/* Arama + Siralama */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Marka adi, yetkili veya e-posta ile ara..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sonuc sayisi */}
      {query && (
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-700">{filtered.length}</span> sonuc bulundu
        </p>
      )}

      {/* Listesi */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Building2 className="h-7 w-7" />
          </div>
          {query ? (
            <>
              <p className="text-sm font-bold text-slate-800">Eslesme bulunamadi</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                "<span className="font-medium text-slate-600">{query}</span>" icin sonuc yok. Farklı bir arama deneyin.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-800">Henuz Musteri Eklenmemis</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                Yukarıdaki butonu kullanarak ilk musteri ve markayı ekleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={onAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Ilk Musteriyi Ekle
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={() => onEdit(brand)}
              onDelete={() => onDelete(brand)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
