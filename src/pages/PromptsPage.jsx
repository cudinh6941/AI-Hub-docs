import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, Search } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getPrompts } from '../services/contentService'
import { searchAndRankPrompts } from '../services/searchEngine.js'
import { DEPARTMENTS, TOOLS, DIFFICULTIES } from '../data/prompts/index.js'
import DocRecipeCard from '../components/DocRecipeCard'
import EmptyState from '../components/EmptyState'

const SORTS = [
  { id: 'all', label: 'Phù hợp nhất' },
  { id: 'verified', label: 'Đã kiểm chứng' },
  { id: 'most-copied', label: 'Phổ biến nhất' },
  { id: 'top-rated', label: 'Đánh giá cao nhất' },
]

function Select({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
      <span className="shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full normal-case tracking-normal text-xs bg-white border border-slate-200 rounded-md py-1.5 px-2.5 text-slate-800 font-medium focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

/** Library page. All filter state lives in the URL so views are shareable and Back works. */
export default function PromptsPage() {
  const [params, setParams] = useSearchParams()
  const { data: all, loading } = useContent(getPrompts, [])

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thư viện Prompt</h1>
        <p className="text-sm text-slate-600 mt-1">Công thức đã được phòng ban kiểm chứng. Tìm theo bài toán, phòng ban hoặc công cụ.</p>
      </div>

      <div className="bg-[#FAFAFA] border border-slate-200/80 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg overflow-x-auto max-w-full">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setParam('sort', s.id, 'all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  sort === s.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setParam('q', e.target.value, '')}
              placeholder="Lọc theo từ khóa…"
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/60">
          <Select label="Phòng ban" value={dept} options={DEPARTMENTS} onChange={(v) => setParam('dept', v, 'Tất cả')} />
          <Select label="Công cụ" value={tool} options={TOOLS} onChange={(v) => setParam('tool', v, 'Tất cả')} />
          <Select label="Cấp độ" value={level} options={DIFFICULTIES} onChange={(v) => setParam('level', v, 'Tất cả')} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
        <span>
          <strong className="text-slate-900">{results.length}</strong> công thức
        </span>
        {isFiltered && (
          <button onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1 hover:text-rose-600 font-medium transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-xs text-slate-400">Đang tải…</div>
      ) : results.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((p) => <DocRecipeCard key={p.id} prompt={p} />)}
        </div>
      ) : (
        <EmptyState onReset={() => setParams({}, { replace: true })} />
      )}
    </div>
  )
}
