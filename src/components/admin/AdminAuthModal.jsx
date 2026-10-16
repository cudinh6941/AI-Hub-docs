import React, { useState } from 'react'
import { Lock, ShieldCheck, X, KeyRound, LogOut, Database } from 'lucide-react'
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../../services/authService'
import { getActiveDbEngine } from '../../services/contentService'

export default function AdminAuthModal({ isOpen, onClose, onAuthChanged }) {
  const [passkey, setPasskey] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const isAdmin = isAdminAuthenticated()
  const engine = getActiveDbEngine()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const res = await loginAdmin(passkey)
    setSubmitting(false)

    if (res.ok) {
      setPasskey('')
      onAuthChanged?.(true)
      onClose()
    } else {
      setError(res.error || 'Mã xác thực không hợp lệ.')
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    onAuthChanged?.(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isAdmin ? 'Chế độ Quản trị viên (Active)' : 'Đăng nhập Quản trị Prompt'}
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Database className="w-3 h-3" /> Engine: <span className="font-mono font-semibold text-slate-700">{engine}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800 leading-relaxed">
              Bạn đang ở chế độ <strong>Quản trị viên (Admin Studio)</strong>. Bạn có thể tạo mới, chỉnh sửa hoặc xóa các công thức Prompt trực tiếp trên thư viện.
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Thoát quyền Admin
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="p-5 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhập mã khóa Quản trị viên (<code className="px-1 py-0.5 rounded bg-slate-100 text-slate-800">ADMIN_PASSKEY</code>) để mở khóa tính năng Thêm, Sửa, Xóa Prompt và công cụ <strong>Smart R-C-T-C-F Studio</strong>.
            </p>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Admin Passkey
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Mặc định dev: aihub-admin-2026"
                  autoFocus
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                />
              </div>
              {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPasskey('aihub-admin-2026')}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Điền nhanh mã mặc định
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
                >
                  {submitting ? 'Đang xác thực…' : 'Mở khóa Studio'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
