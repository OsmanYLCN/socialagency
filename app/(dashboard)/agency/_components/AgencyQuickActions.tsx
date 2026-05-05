'use client'

import { useState, useActionState } from 'react'
import { createEmployeeAction, createCustomerAction } from '@/app/actions/auth'
import {
  X,
  UserPlus,
  Building2,
  Loader2,
  DollarSign,
  Mail,
  Lock,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-extrabold text-gray-900">
            {title}
          </h2>
          <button
            aria-label="Kapat"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Input Field Helper ───────────────────────────────────────────────────────
function Field({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  required = true,
  min,
}: {
  id: string
  name: string
  label: string
  type?: string
  placeholder: string
  icon: React.ElementType
  required?: boolean
  min?: string
}) {
  return (
    <div className="group flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          min={min}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    </div>
  )
}

// ─── Feedback Banner ──────────────────────────────────────────────────────────
function Feedback({ state }: { state: { error?: string; success?: string } | null }) {
  if (!state?.error && !state?.success) return null
  const isError = !!state.error
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? 'border-red-100 bg-red-50 text-red-600'
          : 'border-green-100 bg-green-50 text-green-700'
      }`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      {state.error ?? state.success}
    </div>
  )
}

// ─── Employee Modal ───────────────────────────────────────────────────────────
function EmployeeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [state, formAction, pending] = useActionState(createEmployeeAction, null)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Çalışan Ekle">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field
            id="emp-first-name"
            name="first_name"
            label="Ad"
            placeholder="Ahmet"
            icon={User}
          />
          <Field
            id="emp-last-name"
            name="last_name"
            label="Soyad"
            placeholder="Yılmaz"
            icon={User}
          />
        </div>
        <Field
          id="emp-email"
          name="email"
          label="E-posta"
          type="email"
          placeholder="ahmet@sirket.com"
          icon={Mail}
        />
        <Field
          id="emp-password"
          name="password"
          label="Şifre"
          type="password"
          placeholder="En az 6 karakter"
          icon={Lock}
        />
        <Field
          id="emp-salary"
          name="salary"
          label="Aylık Maaş (₺)"
          type="number"
          placeholder="15000"
          icon={DollarSign}
          min="0"
        />

        <Feedback state={state} />

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            id="employee-modal-submit"
            type="submit"
            disabled={pending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {pending ? 'Ekleniyor...' : 'Çalışanı Ekle'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Customer Modal ───────────────────────────────────────────────────────────
function CustomerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [state, formAction, pending] = useActionState(createCustomerAction, null)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Müşteri Ekle">
      <form action={formAction} className="flex flex-col gap-4">
        <Field
          id="cust-brand-name"
          name="brand_name"
          label="Marka Adı"
          placeholder="Marka A.Ş."
          icon={Briefcase}
        />
        <Field
          id="cust-email"
          name="email"
          label="E-posta"
          type="email"
          placeholder="marka@ornek.com"
          icon={Mail}
        />
        <Field
          id="cust-password"
          name="password"
          label="Şifre"
          type="password"
          placeholder="En az 6 karakter"
          icon={Lock}
        />
        <Field
          id="cust-monthly-fee"
          name="monthly_fee"
          label="Aylık Sözleşme Ücreti (₺)"
          type="number"
          placeholder="5000"
          icon={DollarSign}
          min="0"
        />

        <Feedback state={state} />

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            id="customer-modal-submit"
            type="submit"
            disabled={pending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            {pending ? 'Ekleniyor...' : 'Müşteriyi Ekle'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Quick Actions (Butonlar + Modaller) ─────────────────────────────────────
export function AgencyQuickActions() {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)

  return (
    <>
      <div>
        <h2 className="mb-4 text-base font-bold text-gray-800">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Müşteri Ekle */}
          <button
            id="open-add-customer-modal"
            type="button"
            onClick={() => setShowCustomerModal(true)}
            className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/60 p-8 text-left transition-all duration-300 hover:border-blue-400 hover:from-blue-100 hover:shadow-lg hover:shadow-blue-100"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-200/40 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40" />
            <div className="relative z-10">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-600/50">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">+ Yeni Müşteri Ekle</h3>
              <p className="mt-1 text-sm text-gray-600">
                Marka bilgilerini ve aylık sözleşme ücretini kaydet.
              </p>
            </div>
          </button>

          {/* Çalışan Ekle */}
          <button
            id="open-add-employee-modal"
            type="button"
            onClick={() => setShowEmployeeModal(true)}
            className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/60 p-8 text-left transition-all duration-300 hover:border-purple-400 hover:from-purple-100 hover:shadow-lg hover:shadow-purple-100"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-purple-200/40 blur-2xl transition-all duration-300 group-hover:bg-purple-300/40" />
            <div className="relative z-10">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-600/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-600/50">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">+ Yeni Çalışan Ekle</h3>
              <p className="mt-1 text-sm text-gray-600">
                Çalışan profilini oluştur ve maaş bilgisini tanımla.
              </p>
            </div>
          </button>
        </div>
      </div>

      <EmployeeModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
      />
      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
    </>
  )
}
