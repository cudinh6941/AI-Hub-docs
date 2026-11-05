import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getPrompts } from '../services/contentService'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import { searchAndRankPrompts } from '../services/searchEngine.js'
import { DEPARTMENTS, TOOLS, DIFFICULTIES } from '../data/prompts/index.js'
import DocRecipeCard from '../components/DocRecipeCard'
import EmptyState from '../components/EmptyState'
import PromptFormModal from '../components/admin/PromptFormModal'

const SORTS = [
  { id: 'all', label: 'Phù hợp nhất' },
  { id: 'verified', label: 'Đã kiểm chứng' },
  { id: 'most-copied', label: 'Phổ biến nhất' },
  { id: 'top-rated', label: 'Đánh giá cao nhất' },
]

function Select({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="shrink-0">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs bg-transparent border-b border-line py-1 text-ink font-medium focus:border-ink outline-none cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

/** Library page. All filter state lives in the URL so views are shareable and Back works. */
export default function PromptsPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [refreshTick, setRefreshTick] = useState(0)
  const [isAdmin, setIsAdmin] = useState(() => isAdminAuthenticated())
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data: all, loading } = useContent(getPrompts, [refreshTick])

  useEffect(() => {
    return subscribeAdminAuth((status) => setIsAdmin(status))
  }, [])

  const q = params.get('q') || ''
  const dept = params.get('dept') || 'Tất cả'
  const tool = params.get('tool') || 'Tất cả'
  const level = params.get('level') || 'Tất cả'
  const sort = params.get('sort') || 'all'

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    if (!all) return []
    return searchAndRankPrompts(all, {
      query: q,
      department: dept,
      tool,
      difficulty: level,
      quickFilter: sort,
    })
  }, [all, q, dept, tool, level, sort])

  const isFiltered = q || dept !== 'Tất cả' || tool !== 'Tất cả' || level !== 'Tất cả' || sort !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink tracking-tight font-medium">Thư viện Prompt</h1>
          <p className="text-sm text-body mt-1">Công thức thực chiến được phòng ban kiểm chứng.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-ink hover:bg-accent text-white transition-colors shrink-0"
          >
            Tạo Prompt Mới
          </button>
        )}
      </div>

      {/* Filter Strip: Open editorial layout without box */}
      <div className="border-t border-b border-line py-4 mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="text-muted">Sắp xếp:</span>
            {SORTS.map((s, idx) => (
              <React.Fragment key={s.id}>
                {idx > 0 && <span className="text-muted">·</span>}
                <button
                  type="button"
                  onClick={() => setParam('sort', s.id, 'all')}
                  className={`text-xs transition-colors ${
                    sort === s.id
                      ? 'text-ink font-semibold underline decoration-accent underline-offset-4'
                      : 'text-body hover:text-ink'
                  }`}
                >
                  {s.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setParam('q', e.target.value, '')}
              placeholder="Lọc theo từ khóa…"
              className="w-full text-xs pl-6 pr-2 py-1 bg-transparent border-b border-line placeholder-muted text-ink focus:border-ink outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 border-t border-line/60">
          <Select label="Phòng ban" value={dept} options={DEPARTMENTS} onChange={(v) => setParam('dept', v, 'Tất cả')} />
          <Select label="Công cụ" value={tool} options={TOOLS} onChange={(v) => setParam('tool', v, 'Tất cả')} />
          <Select label="Cấp độ" value={level} options={DIFFICULTIES} onChange={(v) => setParam('level', v, 'Tất cả')} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 text-xs text-muted">
          <span>
            <strong className="text-ink font-semibold">{results.length}</strong> công thức
          </span>
          {isFiltered && (
            <button
              onClick={() => setParams({}, { replace: true })}
              className="text-xs text-body hover:text-accent underline underline-offset-4 decoration-line transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-xs text-muted">Đang tải…</div>
        ) : results.length ? (
          <div className="border-t border-line max-w-4xl">
            {results.map((p) => <DocRecipeCard key={p.id} prompt={p} />)}
          </div>
        ) : (
          <EmptyState onReset={() => setParams({}, { replace: true })} />
        )}
      </div>

      <PromptFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSaved={(created) => {
          setRefreshTick((t) => t + 1)
          if (created?.slug) navigate(`/prompts/${created.slug}`)
        }}
      />
    </div>
  )
}
