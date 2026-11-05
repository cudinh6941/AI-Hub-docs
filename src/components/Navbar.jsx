import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import AdminAuthModal from './admin/AdminAuthModal'

const NAV_ITEMS = [
  { to: '/prompts', label: 'Thư viện Prompt' },
  { to: '/assistants', label: 'Trợ lý AI' },
  { to: '/learn', label: 'Học tập' },
  { to: '/data-platform', label: 'Nền tảng Dữ liệu' },
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
      <header className="sticky top-0 z-40 w-full h-16 bg-paper/90 backdrop-blur-md border-b border-line">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="font-display font-semibold text-ink tracking-tight text-lg">AI Hub Docs</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 transition-colors duration-200 ${
                      isActive
                        ? 'text-ink font-semibold underline decoration-accent decoration-2 underline-offset-8'
                        : 'text-body hover:text-ink'
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
              <Search className="w-3.5 h-3.5 text-muted absolute left-2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm công thức…"
                className="w-full h-9 pl-7 pr-14 bg-transparent text-xs text-ink placeholder-muted border-b border-line focus:border-ink outline-none transition-colors duration-200"
              />
              <div className="absolute right-1 flex items-center gap-1">
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="p-1 text-muted hover:text-body">
                    <X className="w-3 h-3" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block text-[10px] font-mono text-muted select-none">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onOpenSuggest}
              className="hidden lg:inline-flex text-xs font-medium text-body hover:text-ink transition-colors duration-200"
            >
              Đề xuất bài toán
            </button>
            <button
              onClick={onOpenAskAi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-ink hover:bg-accent text-white transition-colors duration-200"
            >
              <span>Gợi ý công thức</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              title={isAdmin ? 'Đang bật chế độ Quản trị viên (Admin Studio)' : 'Đăng nhập Quản trị viên'}
              className={`text-xs font-medium transition-colors duration-200 ${
                isAdmin ? 'text-accent font-semibold' : 'text-muted hover:text-ink'
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
