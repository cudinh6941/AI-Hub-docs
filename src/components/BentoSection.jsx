import React from 'react'
import { Link } from 'react-router-dom'
import BeforeAfter from './BeforeAfter'

export default function BentoSection() {
  return (
    <section className="border-t border-line py-16 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        <div className="lg:col-span-3">
          <h2 className="font-display text-2xl text-ink tracking-tight font-medium lg:sticky lg:top-24">
            Tác vụ tự động hóa theo nghiệp vụ
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              to="/prompts"
              className="text-sm text-body hover:text-accent underline underline-offset-4 decoration-line"
            >
              Tất cả công thức
            </Link>
            <Link
              to="/assistants"
              className="text-sm text-body hover:text-accent underline underline-offset-4 decoration-line"
            >
              Xem 4 trợ lý AI theo công việc
            </Link>
          </div>
        </div>

        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          {/* Mục 1: Excel P&L */}
          <Link
            to="/prompts?tool=Excel%20Copilot"
            className="group block border-t border-ink pt-4"
          >
            <div className="text-xs text-muted mb-1">
              Excel Copilot
            </div>
            <h3 className="font-display text-xl text-ink font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200 mb-4">
              Đối chiếu và phân tích biến động P&L
            </h3>
            <BeforeAfter
              stacked
              before={{
                label: 'Bảng chi phí quý 3',
                text: 'Hàng trăm dòng chi phí, phải tính thủ công.',
              }}
              after={{
                label: 'Sau khi xử lý',
                text: 'Cloud vượt 28.3%. Tiếp thị thấp hơn kế hoạch 5.0%.',
              }}
            />
          </Link>

          {/* Mục 2: Word Hợp đồng */}
          <Link
            to="/prompts?tool=Word%20Copilot"
            className="group block border-t border-ink pt-4"
          >
            <div className="text-xs text-muted mb-1">
              Word Copilot
            </div>
            <h3 className="font-display text-xl text-ink font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200 mb-4">
              Rà soát điều khoản phạt hợp đồng
            </h3>
            <BeforeAfter
              stacked
              before={{
                label: 'Điều khoản gốc',
                text: 'Phạt 0.5%/ngày, không giới hạn tổng mức phạt.',
              }}
              after={{
                label: 'Đề xuất sửa',
                text: 'Trần phạt tối đa 8% theo Luật Thương mại.',
              }}
            />
          </Link>

          {/* Mục 3: Ban Giám Đốc */}
          <Link
            to="/prompts?dept=Ban%20Gi%C3%A1m%20%C4%90%E1%BB%91c"
            className="group block border-t border-ink pt-4"
          >
            <div className="text-xs text-muted mb-1">
              Ban Giám Đốc
            </div>
            <h3 className="font-display text-xl text-ink font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200 mb-4">
              Trích xuất đầu việc giao ban tuần
            </h3>
            <BeforeAfter
              stacked
              before={{
                label: 'Biên bản giao ban',
                text: 'Đầu việc nằm rải rác trong biên bản dài.',
              }}
              after={{
                label: 'Danh sách đầu việc',
                text: '1. Hoàn tất bảo dưỡng trạm bơm, hạn 25/10\n2. Chốt số liệu kiểm toán quý III, hạn 28/10',
              }}
            />
          </Link>

          {/* Mục 4: An toàn thông tin */}
          <Link
            to="/governance"
            className="group block border-t border-ink pt-4"
          >
            <div className="text-xs text-muted mb-1">
              An toàn thông tin
            </div>
            <h3 className="font-display text-xl text-ink font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200 mb-4">
              Ma trận kiểm soát và phân loại dữ liệu AI
            </h3>
            <BeforeAfter
              stacked
              before={{
                label: 'Trước khi dùng AI',
                text: 'Chưa rõ dữ liệu nào được đưa vào AI.',
              }}
              after={{
                label: 'Sau khi phân loại',
                text: '3 cấp: công khai, nội bộ, tối mật có quy định riêng.',
              }}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
