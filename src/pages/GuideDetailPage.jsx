import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Check, Copy, ArrowUpRight } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getGuideBySlug } from '../services/contentService'
import BeforeAfter from '../components/BeforeAfter'

export default function GuideDetailPage() {
  const { slug } = useParams()
  const { data: guide, loading } = useContent(() => getGuideBySlug(slug), [slug])
  const [copied, setCopied] = useState(false)

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-xs font-mono text-muted">Đang tải hướng dẫn...</div>
  }

  if (!guide) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-ink font-medium mb-2">Không tìm thấy tiện ích</h1>
        <p className="text-sm text-muted mb-6">Đường dẫn có thể đã thay đổi hoặc tiện ích chưa khả dụng.</p>
        <Link to="/" className="text-sm text-ink hover:text-accent underline transition-colors">← Về trang chủ</Link>
      </div>
    )
  }

  const handleCopyBlueprint = () => {
    navigator.clipboard.writeText(guide.starterBlueprint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-6">
        <Link to="/" className="hover:text-ink transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
        <Link to="/assistants" className="hover:text-ink transition-colors">Trợ lý AI</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
        <span className="text-ink font-medium">{guide.featureName}</span>
      </nav>

      {/* Main Header */}
      <header className="mb-10 pb-8 border-b border-line">
        <div className="text-xs font-mono text-muted mb-3 flex items-center gap-2">
          <span>{guide.tool}</span>
          <span>·</span>
          <span>{guide.featureName}</span>
          <span>·</span>
          <span>{guide.accountTier}</span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl text-ink font-medium tracking-tight leading-tight mb-3">
          {guide.title}
        </h1>

        <p className="text-sm sm:text-base text-body leading-relaxed max-w-2xl mb-6">
          {guide.summary}
        </p>

        <div className="flex items-center gap-4">
          <a
            href={guide.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <span>Mở công cụ thực hành</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleCopyBlueprint}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${
              copied
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper text-ink border-line hover:border-ink'
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
          <h2 className="font-display text-lg text-ink font-medium tracking-tight">1. Cơ chế hoạt động</h2>
          <p className="text-sm text-body leading-relaxed max-w-2xl">
            {guide.whatItIs}
          </p>

          {/* Editorial Formula - Flat text */}
          <div className="py-4 border-y border-line grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-mono text-muted text-[11px] block uppercase">Bước 1 · Cài đặt</span>
              <span className="font-semibold text-ink block mt-1">Quy tắc & File mẫu nội bộ</span>
            </div>
            <div>
              <span className="font-mono text-muted text-[11px] block uppercase">Bước 2 · Hàng ngày</span>
              <span className="font-semibold text-ink block mt-1">Câu lệnh 1 dòng theo tác vụ</span>
            </div>
            <div>
              <span className="font-mono text-muted text-[11px] block uppercase">Kết quả · Chuẩn hóa</span>
              <span className="font-semibold text-accent block mt-1">Đầu ra đúng quy chế công ty</span>
            </div>
          </div>
        </section>

        {/* Section 2: So sánh giải quyết nỗi đau */}
        <section className="space-y-4">
          <h2 className="font-display text-lg text-ink font-medium tracking-tight">2. Khác biệt trong công việc thực tế</h2>
          <BeforeAfter
            before={guide.problemSolved.manual}
            after={guide.problemSolved.withFeature}
            beforeLabel="Chat thông thường"
            afterLabel="Sau khi kích hoạt"
          />
        </section>

        {/* Section 3: Quy trình 3 bước kích hoạt */}
        <section className="space-y-4">
          <h2 className="font-display text-lg text-ink font-medium tracking-tight">3. Hướng dẫn thiết lập</h2>
          <div className="border-t border-line divide-y divide-line">
            {guide.steps.map((st) => (
              <div key={st.stepNumber} className="py-4 flex items-start gap-4">
                <span className="font-mono text-xs font-semibold text-muted w-6 pt-0.5 shrink-0">
                  0{st.stepNumber}
                </span>
                <div className="space-y-1 max-w-2xl">
                  <h3 className="font-medium text-ink text-sm">{st.title}</h3>
                  <p className="text-xs text-body leading-relaxed">{st.description}</p>
                  <div className="text-[11px] text-muted font-mono pt-0.5">
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
            <h2 className="font-display text-lg text-ink font-medium tracking-tight">4. Cấu hình mẫu doanh nghiệp</h2>
            <button
              type="button"
              onClick={handleCopyBlueprint}
              className="text-xs font-mono text-accent hover:text-accent-hover inline-flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>

          <pre className="p-4 bg-paper-sunken border border-line text-ink font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {guide.starterBlueprint}
          </pre>
        </section>

        {/* Section 5: An toàn dữ liệu */}
        <section className="pt-4 border-t border-line text-xs space-y-2">
          <span className="font-semibold text-ink block">Lưu ý an toàn thông tin</span>
          <p className="text-body leading-relaxed max-w-2xl">{guide.safetyNote}</p>
          <div>
            <Link to="/governance" className="text-accent hover:text-accent-hover font-medium inline-flex items-center gap-1 transition-colors">
              <span>Xem quy chuẩn phân loại dữ liệu</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
