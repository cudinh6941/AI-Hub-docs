import React, { useState } from 'react'
import { X } from 'lucide-react'
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
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isAdmin ? 'Chế độ Quản trị viên (Active)' : 'Đăng nhập Quản trị Prompt'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Engine: <span className="font-mono font-semibold text-slate-700">{engine}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Thoát quyền Admin
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
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Mặc định dev: aihub-admin-2026"
                autoFocus
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
              />
              {error && <p className="mt-1.5 text-xs text-slate-900 font-semibold">{error}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPasskey('aihub-admin-2026')}
                className="text-[11px] text-slate-700 hover:text-slate-900 font-semibold underline"
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
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition-colors"
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
