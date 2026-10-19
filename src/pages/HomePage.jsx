import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getHomeData } from '../services/contentService'
import DocRecipeCard from '../components/DocRecipeCard'
import VideoCard from '../components/VideoCard'
import HeroLiveShowcase from '../components/HeroLiveShowcase'
import BentoSection from '../components/BentoSection'
import FeatureSpotlightBanner from '../components/FeatureSpotlightBanner'

const QUICK_TAGS = [
  { label: 'Phân tích P&L', q: 'P&L' },
  { label: 'Rà soát hợp đồng', q: 'hợp đồng' },
  { label: 'Tóm tắt giao ban', q: 'giao ban' },
  { label: 'Đối soát công nợ', q: 'công nợ' },
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
          <span>{linkLabel}</span>
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
      {/* 1. Hero Section: Split 2-Column Command Hub */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 hero-gradient pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Command & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span>Cổng Kích Hoạt AI Doanh Nghiệp</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Chuẩn hóa tác vụ với AI.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Công thức thực chiến cho Microsoft 365 Copilot, Excel và hệ thống nội bộ.
              </p>

              {/* Instant Search Bar */}
              <form onSubmit={submit} className="max-w-xl">
                <div className="relative flex items-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-xl">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nhập nghiệp vụ cần xử lý (ví dụ: rà soát hợp đồng, phân tích P&L)..."
                    className="w-full h-12 pl-11 pr-24 rounded-xl bg-white text-sm border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors duration-200"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>

              {/* Quick Filter Tags (No emoji, restrained) */}
              <div className="flex items-center gap-2 text-xs flex-wrap pt-1">
                <span className="text-slate-400 font-medium">Tìm nhanh:</span>
                {QUICK_TAGS.map((t) => (
                  <Link
                    key={t.q}
                    to={`/prompts?q=${encodeURIComponent(t.q)}`}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>

              {/* Stats Strip */}
              {data && (
                <div className="pt-6 border-t border-slate-100 flex items-center gap-8 text-xs text-slate-500">
                  <div>
                    <strong className="block text-xl font-bold text-slate-900">{data.stats.total}</strong>
                    <span>Công thức khả dụng</span>
                  </div>
                  <div>
                    <strong className="block text-xl font-bold text-slate-900">{data.stats.verifiedCount}</strong>
                    <span>Đã thẩm định nghiệp vụ</span>
                  </div>
                  <div>
                    <strong className="block text-xl font-bold text-slate-900">{data.stats.videos}</strong>
                    <span>Video thực hành</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live CSS Interactive Workspace Mockup */}
            <div className="lg:col-span-5">
              <HeroLiveShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid Section: Visual Tiles according to Workflows */}
      <BentoSection />

      {/* 3. Feature Spotlight: Overview of AI Assistants */}
      <FeatureSpotlightBanner />

      {/* 3. Featured Prompts Section */}
      <section className="py-14 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Được sử dụng nhiều nhất"
            title="Công thức tiêu biểu đã kiểm chứng"
            to="/prompts"
            linkLabel="Xem toàn bộ thư viện"
          />
          {loading ? (
            <div className="text-xs text-slate-400">Đang tải dữ liệu...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data?.featuredPrompts?.map((p) => (
                <DocRecipeCard key={p.id} prompt={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Practical Learning Videos */}
      <section className="py-14 bg-[#FAFAFA] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tài liệu đào tạo"
            title="Hướng dẫn thực hành trực tiếp"
            to="/learn"
            linkLabel="Tất cả bài giảng"
          />
          {loading ? (
            <div className="text-xs text-slate-400">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {data?.videos?.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Governance and Security */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Chính sách an toàn thông tin
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Nguyên tắc bảo vệ dữ liệu nội bộ khi ứng dụng AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Tìm hiểu quy định phân loại 3 cấp độ dữ liệu và danh mục thông tin không được phép nhập vào các dịch vụ AI công cộng.
              </p>
            </div>
            <Link
              to="/governance"
              className="shrink-0 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors duration-200"
            >
              Xem quy định bảo mật
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
