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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-md bg-paper border border-line shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <h3 className="font-display text-sm font-medium text-ink">
              {isAdmin ? 'Chế độ Quản trị viên' : 'Đăng nhập Quản trị Prompt'}
            </h3>
            <p className="text-[11px] font-mono text-muted mt-0.5">
              Engine: <span className="text-ink">{engine}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-ink transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isAdmin ? (
          <div className="p-5 space-y-4">
            <div className="p-3 bg-paper-sunken border border-line text-xs text-body leading-relaxed">
              Bạn đang ở chế độ <strong className="text-ink">Quản trị viên</strong>. Bạn có thể tạo mới, chỉnh sửa hoặc xóa các công thức Prompt trực tiếp trên thư viện.
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-muted hover:text-ink transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-ink hover:bg-black text-paper transition-colors"
              >
                Thoát quyền Admin
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="p-5 space-y-4">
            <p className="text-xs text-body leading-relaxed">
              Nhập mã khóa Quản trị viên (<code className="px-1 py-0.5 font-mono text-[11px] bg-paper-sunken border border-line text-ink">ADMIN_PASSKEY</code>) để mở khóa tính năng Thêm, Sửa, Xóa Prompt và công cụ Smart R-C-T-C-F Studio.
            </p>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-muted mb-1.5">
                Admin Passkey
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Mặc định dev: aihub-admin-2026"
                autoFocus
                className="w-full text-xs px-3 py-2 bg-paper-sunken border border-line text-ink focus:border-ink outline-none transition-colors"
              />
              {error && <p className="mt-1.5 text-xs text-accent font-medium">{error}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPasskey('aihub-admin-2026')}
                className="text-[11px] text-body hover:text-ink underline transition-colors"
              >
                Điền nhanh mã mặc định
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-muted hover:text-ink transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium bg-ink hover:bg-black disabled:opacity-50 text-paper transition-colors"
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
