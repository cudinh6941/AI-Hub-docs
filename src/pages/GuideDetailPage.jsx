import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Check, Copy, ArrowRight } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getGuideBySlug } from '../services/contentService'

export default function GuideDetailPage() {
  const { slug } = useParams()
  const { data: guide, loading } = useContent(() => getGuideBySlug(slug), [slug])
  const [copied, setCopied] = useState(false)

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-xs text-slate-400">Đang tải hướng dẫn...</div>
  }

  if (!guide) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy tiện ích</h1>
        <p className="text-sm text-slate-600 mb-6">Đường dẫn có thể đã thay đổi hoặc tiện ích chưa khả dụng.</p>
        <Link to="/" className="text-sm font-semibold text-slate-900 hover:underline">← Về trang chủ</Link>
      </div>
    )
  }

  const handleCopyBlueprint = () => {
    navigator.clipboard.writeText(guide.starterBlueprint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/assistants" className="hover:text-slate-900">Trợ lý AI</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium text-slate-900">{guide.featureName}</span>
      </nav>

      {/* Main Header */}
      <header className="mb-10 pb-8 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
          <span>{guide.tool} • {guide.featureName}</span>
          <span className="text-slate-300">•</span>
          <span>{guide.accountTier}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-6">
          {guide.summary}
        </p>

        <div className="flex items-center gap-3">
          <a
            href={guide.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors duration-200"
          >
            <span>Mở công cụ thực hành</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleCopyBlueprint}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              copied
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Đã sao chép cấu hình</> : <><Copy className="w-3.5 h-3.5" /> Sao chép cấu hình mẫu</>}
          </button>
        </div>
      </header>

      {/* 5-Section Layout */}
      <div className="space-y-12">
        {/* Section 1: Bản chất & Cơ chế */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Cơ chế hoạt động</h2>
          <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
            {guide.whatItIs}
          </p>

          {/* Visual Architecture Formula */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs font-mono text-slate-700 text-center">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs w-full sm:w-auto">
              <span className="font-bold text-slate-900 block text-sm">Cài Đặt 1 Lần</span>
              <span className="text-[11px] text-slate-500">Quy tắc + File mẫu nội bộ</span>
            </div>
            <span className="text-slate-400 font-bold text-lg">+</span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs w-full sm:w-auto">
              <span className="font-bold text-slate-900 block text-sm">Yêu Cầu Mỗi Ngày</span>
              <span className="text-[11px] text-slate-500">Câu lệnh ngắn 1 dòng</span>
            </div>
            <span className="text-slate-400 font-bold text-lg">=</span>
            <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-900 shadow-2xs w-full sm:w-auto">
              <span className="font-bold text-white block text-sm">Đầu Ra Chuẩn Hóa</span>
              <span className="text-[11px] text-slate-300">Đúng quy chế doanh nghiệp</span>
            </div>
          </div>
        </section>

        {/* Section 2: So sánh giải quyết nỗi đau */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Khác biệt trong công việc thực tế</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                Khi chỉ dùng ô chat thông thường
              </div>
              <p className="text-slate-700 leading-relaxed font-sans">{guide.problemSolved.manual}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-900 mb-2">
                Khi đã kích hoạt tính năng này
              </div>
              <p className="text-slate-800 font-medium leading-relaxed font-sans">{guide.problemSolved.withFeature}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Quy trình 3 bước kích hoạt */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Hướng dẫn thiết lập từng bước</h2>
          <div className="space-y-3">
            {guide.steps.map((st) => (
              <div key={st.stepNumber} className="p-4 rounded-xl border border-slate-200/80 bg-white flex items-start gap-4">
                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {st.stepNumber}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">
                    Vị trí: {st.uiLocationHint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Starter Blueprint */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Cấu hình mẫu doanh nghiệp (Starter Kit)</h2>
            <button
              type="button"
              onClick={handleCopyBlueprint}
              className="text-xs font-semibold text-slate-900 hover:underline inline-flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
            </button>
          </div>

          <div className="relative rounded-xl border border-slate-200 bg-slate-900 text-slate-200 p-4 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {guide.starterBlueprint}
          </div>
        </section>

        {/* Section 5: An toàn dữ liệu */}
        <section className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1 text-xs">
          <span className="font-bold text-slate-900 block">Lưu ý an toàn thông tin</span>
          <p className="text-slate-600 leading-relaxed">{guide.safetyNote}</p>
          <Link to="/governance" className="text-slate-900 font-semibold inline-flex items-center gap-1 pt-1 hover:underline">
            <span>Xem quy chuẩn phân loại dữ liệu</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </section>
      </div>
    </div>
  )
}
