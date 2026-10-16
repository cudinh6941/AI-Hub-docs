import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, FileText, FileSpreadsheet, Zap, ShieldCheck, PlayCircle, Sparkles } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getHomeData } from '../services/contentService'
import DocRecipeCard from '../components/DocRecipeCard'
import VideoCard from '../components/VideoCard'

const PATHS = [
  {
    title: 'Soạn thảo & Văn bản',
    desc: 'Hợp đồng, tờ trình, JD, email điều hành.',
    tool: 'Word Copilot',
    to: '/prompts?tool=' + encodeURIComponent('Word Copilot'),
    icon: FileText,
    color: 'text-blue-600 bg-blue-50 border-blue-200/60',
  },
  {
    title: 'Dữ liệu & Tài chính',
    desc: 'Báo cáo P&L, công nợ, tồn kho, đối chiếu số liệu.',
    tool: 'Excel Copilot',
    to: '/prompts?tool=' + encodeURIComponent('Excel Copilot'),
    icon: FileSpreadsheet,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
  },
  {
    title: 'Điều hành & Quản lý',
    desc: 'Báo cáo tuần, kịch bản chiến lược, quy trình vận hành.',
    tool: 'Ban Giám Đốc',
    to: '/prompts?dept=' + encodeURIComponent('Ban Giám Đốc'),
    icon: Zap,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200/60',
  },
]

function SectionHeader({ eyebrow, title, to, linkLabel }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">{eyebrow}</div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const { data, loading } = useContent(getHomeData, [])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/prompts?q=${encodeURIComponent(q)}` : '/prompts')
  }

  return (
    <>
      {/* Welcome hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        {/* Gemini Aurora ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] sm:w-[680px] h-[280px] sm:h-[340px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-sky-400/15 blur-3xl rounded-full pointer-events-none animate-float-glow" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="animate-fade-up inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/80 text-indigo-700 border border-indigo-200/60 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Chào mừng đến AI Hub Docs</span>
          </div>

          <h1 className="animate-fade-up delay-100 text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5">
            Luôn có cách <span className="animate-gemini-gradient">nhanh hơn</span> để xử lý việc bạn đang làm.
          </h1>
          <form onSubmit={submit} className="animate-fade-up delay-300 max-w-xl mx-auto mb-6">
            <div className="relative flex items-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-xl transition-transform duration-200 hover:scale-[1.01]">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn đang cần làm gì? Ví dụ: rà soát hợp đồng"
                className="w-full h-12 pl-11 pr-24 rounded-xl bg-white text-sm border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 outline-none transition-all duration-200"
              />
              <button type="submit" className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors duration-200">
                Tìm
              </button>
            </div>
          </form>

          <div className="animate-fade-up delay-400 flex items-center justify-center gap-3">
            <Link to="/learn" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/20">
              <PlayCircle className="w-4 h-4" /> Bắt đầu học
            </Link>
            <Link to="/prompts" className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors duration-200">
              Duyệt thư viện prompt
            </Link>
          </div>

          {data && (
            <div className="animate-fade-up delay-500 mt-10 flex items-center justify-center gap-8 text-xs text-slate-500">
              <div><strong className="block text-lg text-slate-900">{data.stats.total}</strong>công thức prompt</div>
              <div><strong className="block text-lg text-slate-900">{data.stats.verifiedCount}</strong>đã kiểm chứng</div>
              <div><strong className="block text-lg text-slate-900">{data.stats.videos}</strong>video hướng dẫn</div>
            </div>
          )}
        </div>
      </section>

      {/* Guided paths */}
      <section className="py-14 border-b border-slate-200/80 animate-fade-up delay-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Bắt đầu từ nhu cầu" title="Bạn đang muốn làm việc gì?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PATHS.map((p) => {
              const Icon = p.icon
              return (
                <Link
                  key={p.title}
                  to={p.to}
                  className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out"
                >
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${p.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{p.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    Xem công thức <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-14 bg-[#FAFAFA] border-b border-slate-200/80 animate-fade-up delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Học qua video" title="Hướng dẫn ngắn, xem là làm được" to="/learn" linkLabel="Tất cả video" />
          {loading ? (
            <div className="text-xs text-slate-400">Đang tải…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {data.videos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
        </div>
      </section>

      {/* Featured prompts: a single row only */}
      <section className="py-14 border-b border-slate-200/80 animate-fade-up delay-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Được dùng nhiều nhất" title="Công thức nổi bật" to="/prompts" linkLabel="Xem toàn bộ thư viện" />
          {loading ? (
            <div className="text-xs text-slate-400">Đang tải…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.featuredPrompts.map((p) => <DocRecipeCard key={p.id} prompt={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Governance strip */}
      <section className="py-12 animate-fade-up delay-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dùng AI an toàn với dữ liệu công ty</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Không phải dữ liệu nào cũng được đưa vào công cụ AI. Đọc nhanh quy tắc phân loại dữ liệu trước khi bắt đầu.
                </p>
              </div>
            </div>
            <Link to="/governance" className="shrink-0 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors duration-200">
              Xem quy chuẩn
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
