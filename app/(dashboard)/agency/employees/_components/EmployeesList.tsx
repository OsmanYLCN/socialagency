'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  ArrowUpDown,
  Mail,
  CheckSquare,
  Copy,
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
  KeyRound,
  Users,
} from 'lucide-react'
import type { EmployeeItem } from './EmployeesClientView'

type SortKey = 'newest' | 'oldest' | 'salary_high' | 'salary_low' | 'alpha' | 'tasks_high'

interface EmployeesListProps {
  employees: EmployeeItem[]
  onEdit: (employee: EmployeeItem) => void
  onDelete: (employee: EmployeeItem) => void
  onResetPassword: (employee: EmployeeItem) => void
  onAdd: () => void
}

// Personel adından monogram renk sınıfı üretir
function getEmployeeColor(name: string): string {
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

// Personel adından 2 harflik monogram üretir
function getMonogram(firstName: string | null, lastName: string | null): string {
  const first = firstName?.trim() ?? ''
  const last = lastName?.trim() ?? ''
  if (first && last) return (first[0] + last[0]).toUpperCase()
  if (first) return first.slice(0, 2).toUpperCase()
  if (last) return last.slice(0, 2).toUpperCase()
  return '??'
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

function EmployeeCard({
  employee,
  onEdit,
  onDelete,
  onResetPassword,
}: {
  employee: EmployeeItem
  onEdit: () => void
  onDelete: () => void
  onResetPassword: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ')
  const monogram = getMonogram(employee.firstName, employee.lastName)
  const colorClass = getEmployeeColor(fullName || employee.email)

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-200 hover:shadow-sm">
      {/* Ust: Monogram + Isim + Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${colorClass}`}>
            {monogram}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold text-slate-900">
              {fullName || '—'}
            </h4>
            <p className="mt-0.5 truncate text-xs text-slate-400">Çalışan</p>
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
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onEdit() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-slate-400" />
                  Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); onResetPassword() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 cursor-pointer"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Şifreyi Sıfırla
                </button>
                <div className="my-1 h-px bg-slate-100" />
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
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
        <Mail className="h-3 w-3 shrink-0" />
        <span className="truncate">{employee.email}</span>
        <CopyButton text={employee.email} />
      </div>

      {/* Alt: Metrikler & Maaş */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2.5 text-xs min-w-0">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <CheckSquare className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            <span className="font-semibold text-indigo-600">{employee.activeTaskCount}</span>
            <span className="text-slate-400">aktif</span>
          </div>
          <div className="h-3 w-px bg-slate-200 shrink-0" />
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span className="font-semibold text-emerald-600">{employee.completedTaskCount}</span>
            <span className="text-slate-400">tamamlandı</span>
          </div>
        </div>

        <span className="shrink-0 whitespace-nowrap rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
          {employee.salary > 0
            ? employee.salary.toLocaleString('tr-TR', { minimumFractionDigits: 0 }) + ' ₺'
            : 'Maaş yok'}
        </span>
      </div>

      {/* Aktiflik rozeti */}
      <span
        className={`absolute right-4 top-4 h-2 w-2 rounded-full ${employee.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`}
        title={employee.isActive ? 'Aktif' : 'Askıda'}
      />
    </div>
  )
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'oldest', label: 'En Eski' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'salary_high', label: 'Yüksek Maaş' },
  { value: 'salary_low', label: 'Düşük Maaş' },
  { value: 'tasks_high', label: 'En Çok İş' },
]

// Calisan kartlari listesi, arama ve siralama ile
export function EmployeesList({
  employees,
  onEdit,
  onDelete,
  onResetPassword,
  onAdd,
}: EmployeesListProps) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase('tr-TR').trim()
    const result = q
      ? employees.filter(
          (e) =>
            (e.firstName ?? '').toLocaleLowerCase('tr-TR').includes(q) ||
            (e.lastName ?? '').toLocaleLowerCase('tr-TR').includes(q) ||
            e.email.toLocaleLowerCase('tr-TR').includes(q) ||
            [e.firstName, e.lastName].filter(Boolean).join(' ').toLocaleLowerCase('tr-TR').includes(q)
        )
      : [...employees]

    return result.sort((a, b) => {
      if (sort === 'alpha') {
        const nameA = [a.firstName, a.lastName].filter(Boolean).join(' ')
        const nameB = [b.firstName, b.lastName].filter(Boolean).join(' ')
        return nameA.localeCompare(nameB, 'tr')
      }
      if (sort === 'salary_high') return b.salary - a.salary
      if (sort === 'salary_low') return a.salary - b.salary
      if (sort === 'tasks_high') return b.activeTaskCount - a.activeTaskCount
      if (sort === 'oldest')
        return (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0)
      // newest (default)
      return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
    })
  }, [employees, query, sort])

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
            placeholder="Ad, soyad veya e-posta ile ara..."
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
          <span className="font-semibold text-slate-700">{filtered.length}</span> sonuç bulundu
        </p>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Users className="h-7 w-7" />
          </div>
          {query ? (
            <>
              <p className="text-sm font-bold text-slate-800">Eşleşme bulunamadı</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                &quot;<span className="font-medium text-slate-600">{query}</span>&quot; için sonuç bulunamadı. Farklı bir arama deneyin.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-800">Henüz Çalışan Eklenmemiş</p>
              <p className="mt-1 max-w-xs text-xs text-slate-400">
                Yukarıdaki butonu kullanarak ilk ekip üyesini ekleyebilirsiniz.
              </p>
              <Link
                href="/agency/employees/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                İlk Çalışanı Ekle
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={() => onEdit(employee)}
              onDelete={() => onDelete(employee)}
              onResetPassword={() => onResetPassword(employee)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
