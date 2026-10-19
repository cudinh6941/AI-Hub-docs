import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import AdminAuthModal from './admin/AdminAuthModal'

const NAV_ITEMS = [
  { to: '/prompts', label: 'Thư viện Prompt' },
  { to: '/assistants', label: 'Trợ lý AI' },
  { to: '/learn', label: 'Học tập' },
  { to: '/governance', label: 'Quy chuẩn & Bảo mật' },
]

export default function Navbar({ onOpenAskAi, onOpenSuggest }) {
  const [query, setQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(() => isAdminAuthenticated())
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    return subscribeAdminAuth((status) => setIsAdmin(status))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (isCmdK || (e.key === '/' && !typing)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/prompts?q=${encodeURIComponent(q)}` : '/prompts')
    inputRef.current?.blur()
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-mono text-[11px] font-bold tracking-tighter group-hover:bg-slate-800 transition-colors duration-200">
                AI
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-sm">AI Hub Docs</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'text-slate-900 bg-slate-100 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <form onSubmit={submit} className="flex-1 max-w-sm mx-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm công thức…"
                className="w-full h-9 pl-8 pr-16 rounded-lg bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-200"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSuggest}
              className="hidden lg:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
            >
              Đề xuất bài toán
            </button>
            <button
              onClick={onOpenAskAi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200"
            >
              <span>Gợi ý công thức</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              title={isAdmin ? 'Đang bật chế độ Quản trị viên (Admin Studio)' : 'Đăng nhập Quản trị viên'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                isAdmin
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{isAdmin ? 'Admin: Bật' : 'Quản trị'}</span>
            </button>
          </div>
        </div>
      </header>

      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onAuthChanged={(status) => setIsAdmin(status)}
      />
    </>
  )
}
