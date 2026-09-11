'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import Image, { type ImageLoaderProps } from 'next/image'
import {
  X,
  User,
  KeyRound,
  Mail,
  Phone,
  Pencil,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Camera,
} from 'lucide-react'
import {
  updateProfileDetailsAction,
  changePasswordAction,
  getProfileDetailsAction,
} from '@/app/actions/profile'
import { ImageCropperModal } from './ImageCropperModal'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'info' | 'password'
  initialData: {
    fullName: string
    email: string
    phone: string
    role: string
    avatarUrl?: string
  }
  onProfileUpdated?: (name: string, email: string, phone: string, avatarUrl?: string) => void
}

// İsimden baş harfleri oluşturur
function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return 'KL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Telefon numarasını standart biçime dönüştürür
function sanitizeTurkishPhone(raw: string): string {
  let val = raw.replace(/\D/g, '')
  if (val.startsWith('90') && val.length > 10) {
    val = val.slice(2)
  }

  while (val.startsWith('0')) {
    val = val.slice(1)
  }
  return val.slice(0, 10)
}

function avatarLoader({ src }: ImageLoaderProps): string {
  return src
}

export function UserProfileModal({
  isOpen,
  onClose,
  initialTab = 'info',
  initialData,
  onProfileUpdated,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'password'>(initialTab)

  const parts = (initialData.fullName || '').trim().split(' ')
  const initialFirstName = parts[0] || ''
  const initialLastName = parts.slice(1).join(' ') || ''

  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)

  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || '')
  const [previewAvatar, setPreviewAvatar] = useState(initialData.avatarUrl || '')
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState(initialData.email || '')
  const [isEditingEmail, setIsEditingEmail] = useState(false)

  const [phone, setPhone] = useState(sanitizeTurkishPhone(initialData.phone || ''))
  const [isEditingPhone, setIsEditingPhone] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(sanitizeTurkishPhone(e.target.value))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir görsel dosyası (PNG, JPG, WEBP) seçin.')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Fotoğraf boyutu en fazla 15MB olabilir.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCropperImageSrc(reader.result)
        setCropperOpen(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedBlob: Blob, previewUrl: string) => {
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
    setPreviewAvatar(previewUrl)
    setRemoveAvatar(false)
    setCropperOpen(false)

    if (fileInputRef.current) {
      try {
        const dt = new DataTransfer()
        dt.items.add(file)
        fileInputRef.current.files = dt.files
      } catch {
      }
    }
  }

  const handleRemoveAvatar = () => {
    setPreviewAvatar('')
    setCropperImageSrc('')
    setRemoveAvatar(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const profileAction = async (
    prevState: Parameters<typeof updateProfileDetailsAction>[0],
    formData: FormData
  ) => {
    const result = await updateProfileDetailsAction(prevState, formData)
    if (result.success && result.fullName) {
      const finalAvatar =
        result.avatarUrl !== undefined ? result.avatarUrl : removeAvatar ? '' : avatarUrl
      setAvatarUrl(finalAvatar)
      setPreviewAvatar(finalAvatar)
      setIsEditingEmail(false)
      setIsEditingPhone(false)
      onProfileUpdated?.(result.fullName, email, phone, finalAvatar)
    }
    return result
  }

  const [profileState, profileActionRun, isProfilePending] = useActionState(profileAction, null)
  const [passwordState, passwordActionRun, isPasswordPending] = useActionState(
    changePasswordAction,
    null
  )

  useEffect(() => {
    if (isOpen && (!initialData.email || !initialData.phone || !initialData.avatarUrl)) {
      getProfileDetailsAction().then((profile) => {
        if (profile?.email && !initialData.email) setEmail(profile.email)
        if (profile?.phone && !initialData.phone) setPhone(sanitizeTurkishPhone(profile.phone))
        if (profile?.firstName && !firstName) setFirstName(profile.firstName)
        if (profile?.lastName && !lastName) setLastName(profile.lastName)
        if (profile?.avatarUrl && !initialData.avatarUrl) {
          setAvatarUrl(profile.avatarUrl)
          setPreviewAvatar(profile.avatarUrl)
        }
      })
    }
  }, [isOpen, initialData.email, initialData.phone, initialData.avatarUrl, firstName, lastName])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isPasswordMatch = newPassword.length > 0 && newPassword === confirmPassword
  const isPasswordTooShort = newPassword.length > 0 && newPassword.length < 6

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hesap & Profil Yönetimi</h2>
            <p className="text-xs text-slate-400">Kişisel bilgilerinizi ve güvenlik tercihlerinizi güncelleyin</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Kişisel Bilgiler</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Şifre Değiştir</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <form action={profileActionRun} className="space-y-4.5">
              {profileState?.success && (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{profileState.message || 'Bilgileriniz başarıyla güncellendi.'}</span>
                </div>
              )}

              {profileState?.error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{profileState.error}</span>
                </div>
              )}

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="relative group flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-600 text-white shadow-sm ring-2 ring-slate-200/80">
                  {previewAvatar ? (
                    <Image
                      loader={avatarLoader}
                      src={previewAvatar}
                      alt="Profil"
                      width={64}
                      height={64}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-black tracking-wide">
                      {getInitials(`${firstName} ${lastName}`.trim() || initialData.fullName)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Fotoğrafı Değiştir"
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800">Profil Fotoğrafı</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    PNG, JPG veya WEBP (Maksimum 5MB)
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                    >
                      {previewAvatar ? 'Fotoğrafı Değiştir' : 'Fotoğraf Ekle'}
                    </button>

                    {cropperImageSrc && (
                      <button
                        type="button"
                        onClick={() => setCropperOpen(true)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        Konumlandır
                      </button>
                    )}

                    {previewAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Kaldır
                      </button>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="avatar"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <input
                  type="hidden"
                  name="removeAvatar"
                  value={removeAvatar ? 'true' : 'false'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Ad</label>
                  <input
                    type="text"
                    name="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Adınız"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Soyad</label>
                  <input
                    type="text"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Soyadınız"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">E-posta Adresi</label>
                  {!isEditingEmail && (
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>Değiştir</span>
                    </button>
                  )}
                </div>

                {isEditingEmail ? (
                  <div className="space-y-1">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yeni-eposta@ajans.com"
                        className="h-10 w-full rounded-xl border border-indigo-300 bg-white pl-9 pr-3.5 text-xs text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      E-posta adresinizi değiştirdiğinizde giriş bilgileriniz de güncellenir.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{email}</span>
                    </div>
                    <input type="hidden" name="email" value={email} />
                  </div>
                )}
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Telefon Numarası</label>
                  {!isEditingPhone && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                    >
                      {phone ? (
                        <>
                          <Pencil className="h-3 w-3" />
                          <span>Düzenle</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          <span>Numara Ekle</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {isEditingPhone ? (
                  <div className="space-y-1.5">
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="5XXXXXXXXX"
                        className="h-10 w-full rounded-xl border border-indigo-300 bg-white pl-9 pr-3.5 text-xs font-medium tracking-wide text-slate-800 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Başında 0 olmadan boşluksuz 10 hane girin</span>
                      <span
                        className={`font-semibold ${
                          phone.length === 10 ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {phone.length}/10
                      </span>
                    </div>
                    {phone.length > 0 && !phone.startsWith('5') && (
                      <p className="text-[11px] font-medium text-rose-600">
                        Telefon numarası 5 ile başlamalıdır.
                      </p>
                    )}
                    {phone.length > 0 && phone.length < 10 && phone.startsWith('5') && (
                      <p className="text-[11px] font-medium text-amber-600">
                        Tamamlamak için {10 - phone.length} hane daha girin.
                      </p>
                    )}
                    {phone.length === 10 && phone.startsWith('5') && (
                      <p className="text-[11px] font-medium text-emerald-600">
                        ✓ 10 haneli geçerli numara formatı.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span className={phone ? 'tracking-wide font-medium' : 'text-slate-400'}>
                        {phone || 'Henüz bir telefon numarası eklenmemiş.'}
                      </span>
                    </div>
                    <input type="hidden" name="phone" value={phone} />
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={
                    isProfilePending ||
                    (phone.length > 0 && (phone.length !== 10 || !phone.startsWith('5')))
                  }
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-indigo-700 hover:shadow-indigo-100 disabled:opacity-50 cursor-pointer"
                >
                  {isProfilePending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <span>Değişiklikleri Kaydet</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form action={passwordActionRun} className="space-y-4">
              {passwordState?.success && (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{passwordState.message || 'Şifreniz başarıyla güncellendi.'}</span>
                </div>
              )}

              {passwordState?.error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-semibold text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{passwordState.error}</span>
                </div>
              )}

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 text-xs text-indigo-900">
                <p className="font-bold">Güvenlik Önerisi</p>
                <p className="mt-0.5 text-[11px] text-indigo-700">
                  Hesabınızı korumak için en az 6 karakterden oluşan güçlü bir şifre belirleyin.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Yeni Şifre</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="En az 6 karakter"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 pr-10 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isPasswordTooShort && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    Şifre en az 6 karakter olmalıdır.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Yeni Şifre (Tekrar)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Şifrenizi tekrar girin"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                {confirmPassword && !isPasswordMatch && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    Şifreler eşleşmiyor.
                  </p>
                )}
                {confirmPassword && isPasswordMatch && (
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                    ✓ Şifreler eşleşiyor.
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isPasswordPending || !isPasswordMatch || isPasswordTooShort}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                >
                  {isPasswordPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Güncelleniyor...</span>
                    </>
                  ) : (
                    <span>Şifreyi Güncelle</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ImageCropperModal
        key={`${cropperOpen}-${cropperImageSrc}`}
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}
