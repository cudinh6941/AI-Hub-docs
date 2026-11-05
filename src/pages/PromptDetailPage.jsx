import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Copy, ChevronRight } from 'lucide-react'
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

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-xs text-muted">Đang tải…</div>

  if (!prompt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-medium text-ink mb-2">Không tìm thấy công thức</h1>
        <p className="text-sm text-body mb-6">Đường dẫn có thể đã thay đổi hoặc công thức đã bị gỡ.</p>
        <Link to="/prompts" className="text-sm font-semibold text-ink hover:text-accent underline underline-offset-4 decoration-line transition-colors">← Về thư viện</Link>
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
          className={`px-1.5 py-0.5 rounded font-mono text-xs font-semibold border ${
            filled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
              : 'bg-accent-soft text-accent border border-accent/30'
          }`}
        >
          {filled || part}
        </span>
      )
    })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-ink">Trang chủ</Link>
          <span>/</span>
          <Link to="/prompts" className="hover:text-ink">Thư viện Prompt</Link>
          <span>/</span>
          <span className="text-ink font-medium">{prompt.id}</span>
        </nav>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-line text-body hover:border-ink hover:text-ink transition-colors"
            >
              Chỉnh sửa Prompt
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-paper-sunken border border-line text-body hover:bg-ink hover:text-white transition-colors disabled:opacity-50"
            >
              {deleting ? 'Đang xóa…' : 'Xóa'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 space-y-10 min-w-0">
          <header className="space-y-3">
            <div className="text-xs text-muted font-medium">
              {prompt.department} · {prompt.tool} · {prompt.difficulty}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-ink tracking-tight leading-tight">
              {prompt.title}
            </h1>
            <p className="text-base text-body leading-relaxed">{prompt.summary}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-muted border-t border-line/60">
              {prompt.verified && (
                <span className="inline-flex items-center gap-1 font-medium text-ink">
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span>Đã kiểm chứng{prompt.verifiedBy ? ` bởi ${prompt.verifiedBy}` : ''}</span>
                </span>
              )}
              <span>{Number(prompt.rating || 5).toFixed(1)} / 5.0</span>
              <span>·</span>
              <span>{prompt.copyCount} lượt dùng</span>
              <span>·</span>
              <span>Cập nhật {prompt.updatedAt}</span>
            </div>
          </header>

          <section className="border-t border-line pt-8 space-y-3">
            <h2 className="font-display text-xl text-ink font-medium">Câu lệnh chuẩn hóa</h2>
            <div className="p-5 rounded-md bg-paper-sunken border border-line font-mono text-[13px] text-ink leading-relaxed whitespace-pre-wrap">
              {renderTemplate()}
            </div>
          </section>

          <section className="border-t border-line pt-8 space-y-4">
            <h2 className="font-display text-xl text-ink font-medium">So sánh đối chiếu dữ liệu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-xs text-muted">Dữ liệu đầu vào (thô)</div>
                <div className="p-4 rounded-md bg-paper-sunken text-xs text-body font-mono leading-relaxed whitespace-pre-wrap">
                  {prompt.inputSample}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-accent">Kết quả đầu ra (đã cấu trúc)</div>
                <div className="p-4 rounded-md bg-paper-sunken border-l-2 border-accent text-xs text-ink font-mono leading-relaxed whitespace-pre-wrap">
                  {prompt.outputSample}
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-line pt-8 space-y-6">
            <div className="space-y-2">
              <h3 className="font-display text-lg text-ink font-medium">Vì sao công thức này hiệu quả</h3>
              <p className="text-sm text-body leading-relaxed">{prompt.whyEffective}</p>
            </div>
            {prompt.commonPitfalls && (
              <div className="space-y-2 pt-4 border-t border-line/60">
                <h3 className="font-display text-lg text-ink font-medium">Lưu ý và lỗi thường gặp</h3>
                <p className="text-sm text-body leading-relaxed">{prompt.commonPitfalls}</p>
              </div>
            )}
          </section>

          {prompt.relatedVideos?.length > 0 && (
            <section className="border-t border-line pt-8 space-y-4">
              <h2 className="font-display text-xl text-ink font-medium">Video hướng dẫn liên quan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {prompt.relatedVideos.map((v) => <VideoCard key={v.id} video={v} />)}
              </div>
            </section>
          )}
        </article>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-6 border-t lg:border-t-0 lg:border-l border-line lg:pl-8 pt-8 lg:pt-0">
            {varList.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Điền biến số</h3>
                {varList.map((v) => (
                  <label key={v} className="block">
                    <span className="block text-[11px] font-mono text-muted mb-1">[{v}]</span>
                    <input
                      value={values[v] || ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
                      className="w-full text-xs px-3 py-1.5 rounded-md bg-paper border border-line focus:border-ink outline-none text-ink"
                    />
                  </label>
                ))}
              </div>
            )}
            <button
              onClick={copy}
              className={`w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-ink hover:bg-accent text-white'
              }`}
            >
              {copied ? <><Check className="w-4 h-4" /> Đã sao chép</> : <><Copy className="w-4 h-4" /> Sao chép câu lệnh</>}
            </button>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {(prompt.tags || []).map((t) => (
                <Link
                  key={t}
                  to={`/prompts?q=${encodeURIComponent(t)}`}
                  className="text-body hover:text-accent underline underline-offset-4 decoration-line transition-colors"
                >
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
