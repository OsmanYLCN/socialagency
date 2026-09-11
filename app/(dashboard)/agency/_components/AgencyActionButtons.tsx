'use client'

import { useState, useActionState } from 'react'
import { CheckSquare, Megaphone, X, Loader2, Check } from 'lucide-react'
import { createTaskAction } from '@/app/actions/agency'

interface BrandOption {
  id: string
  name: string
}

interface EmployeeOption {
  id: string
  name: string
}

interface ActionButtonsProps {
  brands?: BrandOption[]
  employees?: EmployeeOption[]
}

// Ajans hızlı işlem butonlarını gösterir
export function AgencyActionButtons({ brands = [], employees = [] }: ActionButtonsProps) {
  const [activeModal, setActiveModal] = useState<'task' | 'announcement' | null>(null)

  const [taskState, taskActionRun, isTaskPending] = useActionState(
    async (prevState: { success?: boolean; error?: string } | null, formData: FormData) => {
      const result = await createTaskAction(prevState, formData)
      if (result.success) {
        setActiveModal(null)
      }
      return result
    },
    null
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveModal('task')}
          className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-indigo-200/90 bg-white px-6 py-4 text-sm font-bold text-indigo-700 shadow-xs transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-200 group-hover:scale-110">
            <CheckSquare className="h-4.5 w-4.5" />
          </div>
          <span>Yeni Görev Ata</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('announcement')}
          className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200/90 bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-xs transition-all duration-200 hover:border-slate-400 hover:bg-slate-50/60 hover:shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-transform duration-200 group-hover:scale-110">
            <Megaphone className="h-4.5 w-4.5" />
          </div>
          <span>Yeni İlan Oluştur</span>
        </button>
      </div>

      {activeModal === 'task' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Yeni Görev Ata</h3>
                  <p className="text-xs text-slate-500">Marka ve platform belirleyerek görevi planlayın</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {taskState?.error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {taskState.error}
              </div>
            )}

            <form action={taskActionRun} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Marka Seçin</label>
                <select
                  name="brand_id"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Bir marka seçin...</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                  {brands.length === 0 && (
                    <option value="" disabled>
                      (Henüz kayıtlı marka yok, önce Müşteriler sayfasından marka ekleyin)
                    </option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Platform</label>
                  <select
                    name="platform"
                    required
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="x">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">İçerik Türü</label>
                  <select
                    name="content"
                    required
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="reels">Reels</option>
                    <option value="post">Post</option>
                    <option value="story">Story</option>
                    <option value="carousel">Carousel</option>
                    <option value="shorts">Shorts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Teslim Tarihi</label>
                  <input
                    type="date"
                    name="due_date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Atanan Çalışan</label>
                  <select
                    name="assignee_id"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Atama Yapma (Boşta)</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Açıklama / Not</label>
                <textarea
                  name="note"
                  rows={2}
                  placeholder="İçerik hakkında detaylar..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isTaskPending}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                >
                  {isTaskPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  <span>{isTaskPending ? 'Kaydediliyor...' : 'Görevi Ata'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'announcement' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Yeni İlan Oluştur</h3>
                  <p className="text-xs text-slate-500">Ajans içi duyuru veya açık iş pozisyonu yayınlayın</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">İlan Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: Senior Sosyal Medya Uzmanı Aranıyor"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">İlan Türü</label>
                <select className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option>Ekip İçi Duyuru</option>
                  <option>İş İlanı (Kariyer)</option>
                  <option>Müşteri Bilgilendirmesi</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">İçerik / Detaylar</label>
                <textarea
                  rows={3}
                  placeholder="İlan metnini buraya yazın..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Yayınla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
