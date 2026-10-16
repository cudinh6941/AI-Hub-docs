import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Copy, Star, CheckCircle2, ChevronRight, Lightbulb, AlertTriangle, Pencil, Trash2 } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getPromptBySlug, deletePrompt } from '../services/contentService'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import VideoCard from '../components/VideoCard'
import PromptFormModal from '../components/admin/PromptFormModal'

const VAR_SPLIT = /(\[[^[\]\n]+\])/g

export default function PromptDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [refreshTick, setRefreshTick] = useState(0)
  const { data: prompt, loading } = useContent(() => getPromptBySlug(slug), [slug, refreshTick])
  const [values, setValues] = useState({})
  const [copied, setCopied] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => isAdminAuthenticated())
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    return subscribeAdminAuth((status) => setIsAdmin(status))
  }, [])

  useEffect(() => {
    setValues({})
    setCopied(false)
  }, [slug])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-xs text-slate-400">Đang tải…</div>

  if (!prompt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy công thức</h1>
        <p className="text-sm text-slate-600 mb-6">Đường dẫn có thể đã thay đổi hoặc công thức đã bị gỡ.</p>
        <Link to="/prompts" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">← Về thư viện</Link>
      </div>
    )
  }

  const varList = (prompt.variables || []).map((v) => (typeof v === 'object' ? v.name : v))

  const resolved = prompt.promptTemplate.replace(VAR_SPLIT, (token) => {
    const name = token.slice(1, -1)
    return values[name]?.trim() ? values[name].trim() : token
  })

  const copy = () => {
    navigator.clipboard.writeText(resolved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa công thức "${prompt.title}" (${prompt.id}) khỏi PostgreSQL?`)) {
      return
    }
    setDeleting(true)
    try {
      await deletePrompt(prompt.id)
      navigate('/prompts')
    } catch (err) {
      alert(err.message || 'Không thể xóa Prompt.')
      setDeleting(false)
    }
  }

  const renderTemplate = () =>
    prompt.promptTemplate.split(VAR_SPLIT).map((part, i) => {
      if (!(part.startsWith('[') && part.endsWith(']'))) return part
      const name = part.slice(1, -1)
      const filled = values[name]?.trim()
      return (
        <span
          key={i}
          className={`px-1 rounded font-medium border ${
            filled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
          }`}
        >
          {filled || part}
        </span>
      )
    })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900">Trang chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/prompts" className="hover:text-slate-900">Thư viện Prompt</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">{prompt.id}</span>
        </nav>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa Prompt
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> {deleting ? 'Đang xóa…' : 'Xóa'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <article className="lg:col-span-2 space-y-8 min-w-0 animate-fade-up delay-100">
          <header>
            <div className="text-xs text-slate-500 mb-2">
              {prompt.department} · {prompt.tool} · {prompt.difficulty}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{prompt.title}</h1>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{prompt.summary}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-slate-500">
              {prompt.verified && (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã kiểm chứng{prompt.verifiedBy ? ` bởi ${prompt.verifiedBy}` : ''}
                </span>
              )}
              <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" />{Number(prompt.rating || 5).toFixed(1)}</span>
              <span>{prompt.copyCount} lượt sao chép</span>
              <span>Cập nhật {prompt.updatedAt}</span>
            </div>
          </header>

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Câu lệnh</h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">
              {renderTemplate()}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Ví dụ đầu vào và kết quả</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/80 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Đầu vào</div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{prompt.inputSample}</p>
              </div>
              <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/30 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 mb-2">Kết quả mẫu</div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{prompt.outputSample}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 p-4 flex gap-3">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">Vì sao công thức này hiệu quả</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{prompt.whyEffective}</p>
              </div>
            </div>
            {prompt.commonPitfalls && (
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Lỗi thường gặp</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{prompt.commonPitfalls}</p>
                </div>
              </div>
            )}
          </section>

          {prompt.relatedVideos?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-900 mb-3">Video hướng dẫn liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prompt.relatedVideos.map((v) => <VideoCard key={v.id} video={v} />)}
              </div>
            </section>
          )}
        </article>

        <aside className="lg:col-span-1 animate-fade-up delay-200">
          <div className="lg:sticky lg:top-24 space-y-4">
            {varList.length > 0 && (
              <div className="rounded-xl border border-slate-200/80 p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900">Điền biến số (tùy chọn)</h3>
                {varList.map((v) => (
                  <label key={v} className="block">
                    <span className="block text-[11px] font-mono text-slate-500 mb-1">[{v}]</span>
                    <input
                      value={values[v] || ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
                      className="w-full text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                    />
                  </label>
                ))}
              </div>
            )}
            <button
              onClick={copy}
              className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${
                copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? <><Check className="w-4 h-4" /> Đã sao chép</> : <><Copy className="w-4 h-4" /> Sao chép câu lệnh</>}
            </button>
            <div className="flex flex-wrap gap-1.5">
              {(prompt.tags || []).map((t) => (
                <Link key={t} to={`/prompts?q=${encodeURIComponent(t)}`} className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <PromptFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialPrompt={prompt}
        onSaved={(updated) => {
          setRefreshTick((t) => t + 1)
          if (updated?.slug && updated.slug !== slug) {
            navigate(`/prompts/${updated.slug}`, { replace: true })
          }
        }}
      />
    </div>
  )
}
