export function getFormString(formData: FormData, field: string): string {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

export function validateEmail(value: string): string | null {
  if (!value) return 'E-posta adresi zorunludur.'
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Geçerli bir e-posta adresi girilmelidir.'
  }
  return null
}

export function validatePassword(value: string, label = 'Şifre'): string | null {
  if (!value) return `${label} zorunludur.`
  if (value.length < 6) return `${label} en az 6 karakter olmalıdır.`
  if (value.length > 128) return `${label} en fazla 128 karakter olabilir.`
  return null
}

export function parseNonNegativeNumber(value: string, label: string): number | string {
  if (!value) return 0
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return `${label} geçerli ve negatif olmayan bir sayı olmalıdır.`
  }
  return parsed
}

export function validateDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'Geçerli bir tarih seçilmelidir.'
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return 'Geçerli bir tarih seçilmelidir.'
  }

  return null
}

export function normalizeTurkishPhone(value: string): string {
  let phone = value.replace(/\D/g, '')
  if (phone.startsWith('90') && phone.length > 10) phone = phone.slice(2)
  while (phone.startsWith('0')) phone = phone.slice(1)
  return phone.slice(0, 10)
}

export function validateTurkishPhone(value: string): string | null {
  if (!value) return null
  if (value.length !== 10 || !value.startsWith('5')) {
    return 'Telefon numarası başında 0 olmadan 10 haneli olmalı ve 5 ile başlamalıdır.'
  }
  return null
}
