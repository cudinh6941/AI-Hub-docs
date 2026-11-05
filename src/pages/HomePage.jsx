import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getHomeData } from '../services/contentService'
import DocRecipeCard from '../components/DocRecipeCard'
import VideoCard from '../components/VideoCard'
import BentoSection from '../components/BentoSection'
import BeforeAfter from '../components/BeforeAfter'

const QUICK_TAGS = [
  { label: 'Phân tích P&L', q: 'P&L' },
  { label: 'Rà soát hợp đồng', q: 'hợp đồng' },
  { label: 'Tóm tắt giao ban', q: 'giao ban' },
  { label: 'Đối soát công nợ', q: 'công nợ' },
]

const HERO_EXAMPLE = {
  before: {
    label: 'Ghi chú gõ vội',
    text: 'Bên mình đang bận kiểm tra số liệu nên tuần sau mới gửi tài liệu được, đối tác thông cảm đợi thêm nhé.',
  },
  after: {
    label: 'Email gửi đối tác',
    text: 'Để đảm bảo độ chính xác của số liệu thẩm định, chúng tôi dự kiến gửi bộ hồ sơ chính thức trước ngày 25.',
  },
}

function Section({ title, to, linkLabel, children }) {
  return (
    <section className="border-t border-line py-16 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        <div className="lg:col-span-3">
          <h2 className="font-display text-2xl text-ink tracking-tight font-medium lg:sticky lg:top-24">{title}</h2>
          {to && (
            <Link to={to} className="mt-3 inline-block text-sm text-body hover:text-accent underline underline-offset-4 decoration-line">
              {linkLabel}
            </Link>
          )}
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
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
      {/* 1. Hero Section: Focused Typography, Direct Search & Visual Before/After */}
      <section className="bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.08] font-medium">
              Luôn có cách nhanh hơn để xử lý việc bạn đang làm.
            </h1>

            <p className="text-lg text-body leading-relaxed max-w-xl">
              Công thức thực chiến cho Microsoft 365 Copilot, Excel và hệ thống nội bộ.
            </p>

            {/* Instant Search Bar */}
            <form onSubmit={submit} className="max-w-xl space-y-2">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-muted absolute left-0 pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nhập nghiệp vụ cần xử lý (ví dụ: rà soát hợp đồng, phân tích P&L)..."
                  className="w-full h-12 pl-8 pr-4 bg-transparent text-lg text-ink placeholder-muted border-b border-ink outline-none transition-colors duration-200"
                />
              </div>
              <div className="text-xs text-muted">Nhấn Enter để tìm</div>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-x-5 text-xs flex-wrap pt-2">
              <span className="text-muted font-medium">Tìm nhanh:</span>
              {QUICK_TAGS.map((t) => (
                <Link
                  key={t.q}
                  to={`/prompts?q=${encodeURIComponent(t.q)}`}
                  className="text-body hover:text-accent underline underline-offset-4 decoration-line text-xs font-medium transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Visual Anchor: Editorial Before/After Demonstration */}
          <div className="mt-14 border-t border-line pt-8">
            <BeforeAfter size="lg" before={HERO_EXAMPLE.before} after={HERO_EXAMPLE.after} />
          </div>
        </div>
      </section>

      {/* 2. Bento Grid Section: Visual Tiles according to Workflows */}
      <BentoSection />

      {/* 3. Featured Prompts Section */}
      <Section
        title="Công thức tiêu biểu đã kiểm chứng"
        to="/prompts"
        linkLabel="Xem toàn bộ thư viện"
      >
        {loading ? (
          <div className="text-xs text-muted">Đang tải dữ liệu...</div>
        ) : (
          <div className="border-t border-line">
            {data?.featuredPrompts?.map((p) => (
              <DocRecipeCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </Section>

      {/* 4. Practical Learning Videos */}
      <Section
        title="Hướng dẫn thực hành trực tiếp"
        to="/learn"
        linkLabel="Tất cả bài giảng"
      >
        {loading ? (
          <div className="text-xs text-muted">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {data?.videos?.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </Section>

      {/* 5. PTSC Hybrid Data Platform Explorer */}
      <Section
        title="Nền tảng Dữ liệu PTSC"
        to="/data-platform"
        linkLabel="Mở sơ đồ kiến trúc tương tác"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-8 space-y-2">
              <div className="text-xs font-mono text-accent">
                PTSC Data Platform · PTSC Quảng Ngãi (Nhóm 4 · Dự kiến L3–L4, chốt sau khảo sát GĐ2A)
              </div>
              <h3 className="font-display text-2xl text-ink font-medium leading-snug">
                Từ 310 báo cáo rời rạc đến một nguồn dữ liệu chuẩn duy nhất.
              </h3>
              <p className="text-sm text-body leading-relaxed">
                Khám phá trực quan trục tích hợp Vùng 5, chốt chặn kiểm duyệt Approve/Reject tại Landing Zone đơn vị, cụm Hub On-Premise (Tầng 10 CQTCT) kết hợp Microsoft Cloud và bảng ánh xạ mã 3 tầng.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                to="/data-platform"
                className="inline-flex items-center px-4 py-2.5 rounded-md bg-ink hover:bg-accent text-white text-xs font-semibold transition-colors duration-200"
              >
                Khám phá Sơ đồ Luồng
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-line">
            <div>
              <div className="font-display text-2xl text-ink font-medium">310 Báo cáo</div>
              <div className="text-xs text-muted mt-0.5">Hiện trạng báo cáo toàn TCT (20 tự động GĐ1)</div>
            </div>
            <div>
              <div className="font-display text-2xl text-ink font-medium">10 Vùng An ninh</div>
              <div className="text-xs text-muted mt-0.5">Trục tích hợp bắt buộc tại Vùng 5</div>
            </div>
            <div>
              <div className="font-display text-2xl text-ink font-medium">9 Domain MDM</div>
              <div className="text-xs text-muted mt-0.5">Golden Record & Bảng ánh xạ 3 tầng</div>
            </div>
            <div>
              <div className="font-display text-2xl text-ink font-medium">Dự kiến L3–L4</div>
              <div className="text-xs text-muted mt-0.5">PTSC Quảng Ngãi (Chốt sau GĐ2A)</div>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Governance and Security */}
      <section className="border-t border-line py-16 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 items-start">
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl text-ink tracking-tight font-medium lg:sticky lg:top-24">
              An toàn thông tin
            </h2>
          </div>
          <div className="lg:col-span-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="font-display text-lg text-ink font-medium">
                Nguyên tắc bảo vệ dữ liệu nội bộ khi ứng dụng AI
              </h3>
            </div>
            <Link
              to="/governance"
              className="shrink-0 px-4 py-2.5 rounded-md bg-ink hover:bg-accent text-white text-xs font-semibold transition-colors duration-200"
            >
              Xem quy định bảo mật
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
