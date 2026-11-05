import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BeforeAfter from '../components/BeforeAfter'

const SOLUTIONS = [
  {
    id: 'contract',
    category: 'Rà soát văn bản',
    title: 'Trợ lý Rà soát Hợp đồng & Văn bản Pháp lý',
    benefit: 'Chỉ ra ngay điều khoản vượt mức quy định và gợi ý câu chữ điều chỉnh hợp lệ.',
    guideSlug: 'gemini-gems-tro-ly-chuyen-sau',
    before: {
      label: 'Điều khoản gốc trong dự thảo',
      text: 'Điều 6.2: Bên B chịu phạt 1.0%/ngày trễ hạn và không bị giới hạn tổng mức phạt tối đa.',
    },
    after: {
      label: 'Phát hiện & Đề xuất sửa đổi',
      text: 'Mức phạt 1%/ngày vượt trần. Đề xuất: Mức phạt vi phạm nghĩa vụ hợp đồng không vượt quá 8% theo Điều 301 Luật Thương mại.',
    },
  },
  {
    id: 'summary',
    category: 'Tóm tắt tài liệu',
    title: 'Trợ lý Rút gọn Hồ sơ & Báo cáo Dày',
    benefit: 'Trích xuất đúng thông tin cần tìm kèm vị trí trang gốc để đối chiếu.',
    guideSlug: 'notebooklm-tra-cuu-tai-lieu-chuyen-sau',
    before: {
      label: 'Hồ sơ kỹ thuật 92 trang',
      text: 'Hàng chục trang quy chuẩn, phụ lục, điều kiện thương mại và thông số kỹ thuật rải rác.',
    },
    after: {
      label: 'Bản tóm tắt cô đọng',
      text: '1. Bảo lãnh hợp đồng: 5% [Trang 24]\n2. Thời gian thi công: 180 ngày [Trang 58]\n3. Phạt tiến độ: sau 7 ngày chậm trễ [Trang 63]',
    },
  },
  {
    id: 'rewrite',
    category: 'Chuẩn hóa văn bản',
    title: 'Trợ lý Chuẩn hóa Email & Công văn Doanh nghiệp',
    benefit: 'Viết lại theo đúng văn phong thương mại lịch thiệp mà không làm lệch ý chính.',
    guideSlug: 'canvas-artifacts-chinh-sua-truc-tiep',
    before: {
      label: 'Ghi chú ban đầu gõ vội',
      text: 'Bên mình đang bận kiểm tra số liệu nên tuần sau mới gửi tài liệu được, đối tác thông cảm đợi thêm nhé.',
    },
    after: {
      label: 'Văn bản sau khi viết lại',
      text: 'Để đảm bảo độ chính xác của số liệu thẩm định, chúng tôi dự kiến gửi bộ hồ sơ chính thức trước ngày 25. Rất mong nhận được sự phối hợp từ Quý đối tác.',
    },
  },
  {
    id: 'automation',
    category: 'Tự động hóa',
    title: 'Trợ lý Tự động hóa Đối soát & Báo cáo Định kỳ',
    benefit: 'Tự động phân nhóm công nợ và soạn sẵn dự thảo đôn đốc thanh toán.',
    guideSlug: 'chatgpt-projects-khong-gian-du-an',
    before: {
      label: 'Quy trình thủ công hàng tuần',
      text: 'Mở từng tệp kế toán, lọc thủ công số ngày quá hạn, tự đối chiếu hạn mức và gõ lại email nhắc nợ.',
    },
    after: {
      label: 'Kết quả tự động hóa',
      text: 'Tự động phân loại 4 nhóm tuổi nợ, đánh dấu các khoản quá hạn trên 60 ngày và tạo sẵn dự thảo công văn nhắc nợ.',
    },
  },
]

const CATEGORIES = [
  'Tất cả bài toán',
  'Rà soát văn bản',
  'Tóm tắt tài liệu',
  'Chuẩn hóa văn bản',
  'Tự động hóa',
]

export default function AssistantsPage() {
  const [selectedCat, setSelectedCat] = useState('Tất cả bài toán')

  const filteredSolutions = selectedCat === 'Tất cả bài toán'
    ? SOLUTIONS
    : SOLUTIONS.filter((s) => s.category === selectedCat)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-8">
        <Link to="/" className="hover:text-ink">Trang chủ</Link>
        <span>/</span>
        <span className="text-ink font-medium">Trợ lý AI theo công việc</span>
      </nav>

      {/* Page Header */}
      <header className="mb-10 pb-6 border-b border-line">
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink font-medium tracking-tight mb-2">
          Trợ lý AI theo công việc
        </h1>

        <p className="text-sm sm:text-base text-body leading-relaxed max-w-2xl">
          Chọn đầu việc bạn muốn giải quyết để đối chiếu kết quả trước và sau khi có trợ lý AI.
        </p>

        {/* Category Filter as Clean Text */}
        <div className="flex items-center gap-4 pt-6 overflow-x-auto text-xs flex-wrap">
          {CATEGORIES.map((cat, idx) => (
            <React.Fragment key={cat}>
              {idx > 0 && <span className="text-muted">·</span>}
              <button
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCat === cat
                    ? 'text-ink font-semibold underline decoration-accent underline-offset-4'
                    : 'text-body hover:text-ink'
                }`}
              >
                {cat}
              </button>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Solutions Showcase List */}
      <div className="space-y-12">
        {filteredSolutions.map((sol) => (
          <article
            key={sol.id}
            className="border-t border-line pt-8 space-y-4"
          >
            <div>
              <div className="text-xs text-muted mb-1">
                {sol.category}
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-medium tracking-tight">
                {sol.title}
              </h2>
              <p className="text-sm text-body mt-1 leading-relaxed">
                {sol.benefit}
              </p>
            </div>

            <div className="pt-2">
              <BeforeAfter before={sol.before} after={sol.after} />
            </div>

            <div className="pt-2">
              <Link
                to={`/guides/${sol.guideSlug}`}
                className="text-xs font-medium text-body hover:text-accent underline underline-offset-4 decoration-line transition-colors"
              >
                Xem cách thiết lập công cụ
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
