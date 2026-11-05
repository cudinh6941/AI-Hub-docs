import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ASSISTANT_PREVIEWS = [
  {
    id: 'personal-assistant',
    tabLabel: 'Trợ lý riêng',
    pillar: 'Tạo trợ lý AI riêng cho công việc',
    name: 'Trợ lý Rà soát Hợp đồng & Quy chế',
    actionText: 'Kiểm tra dự thảo hợp đồng mua sắm thiết bị theo chuẩn công ty...',
    resultLabel: 'Phát hiện điều khoản vượt mức quy định',
    resultDetail: 'Mức phạt 1%/ngày vượt trần. Đề xuất điều chỉnh: tối đa 8% giá trị phần nghĩa vụ bị vi phạm theo Điều 301 Luật Thương mại.',
  },
  {
    id: 'doc-summary',
    tabLabel: 'Tóm tắt tài liệu',
    pillar: 'Biến tài liệu dài thành bản tóm tắt',
    name: 'Trợ lý Tóm tắt Hồ sơ & Báo cáo Dày',
    actionText: 'Đọc và rút gọn các điều kiện cốt lõi trong hồ sơ thầu 92 trang...',
    resultLabel: '3 điểm trọng tâm kèm vị trí trang',
    resultDetail: '1. Bảo lãnh hợp đồng: 5% [Trang 24] · 2. Tiến độ: 180 ngày [Trang 58] · 3. Phạt trễ hạn: sau 7 ngày [Trang 63]',
  },
  {
    id: 'fast-rewrite',
    tabLabel: 'Viết lại văn bản',
    pillar: 'Viết lại văn bản chỉ trong vài giây',
    name: 'Trợ lý Chuẩn hóa Email & Công văn',
    actionText: 'Viết lại đoạn ghi chú gõ vội thành email gửi Ban Giám đốc và đối tác...',
    resultLabel: 'Văn phong doanh nghiệp chuẩn mực',
    resultDetail: '"Để đảm bảo chất lượng thẩm định số liệu, chúng tôi dự kiến hoàn tất và gửi hồ sơ chính thức trước ngày 25."',
  },
  {
    id: 'workflow-auto',
    tabLabel: 'Tự động hóa',
    pillar: 'Tự động hóa một việc đang làm thủ công',
    name: 'Trợ lý Đối soát & Tổng hợp Định kỳ',
    actionText: 'Đối chiếu bảng theo dõi công nợ và lọc các khoản quá hạn...',
    resultLabel: 'Báo cáo phân loại và dự thảo nhắc nợ',
    resultDetail: 'Đã phân nhóm tuổi nợ, đánh dấu các khoản quá hạn trên 60 ngày và soạn sẵn văn bản đôn đốc thanh toán.',
  },
]

export default function FeatureSpotlightBanner() {
  const [activeIdx, setActiveIdx] = useState(0)
  const current = ASSISTANT_PREVIEWS[activeIdx]

  return (
    <section className="border-t border-line py-16 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        <div className="lg:col-span-3">
          <h2 className="font-display text-2xl text-ink tracking-tight font-medium lg:sticky lg:top-24">
            Nhìn thấy kết quả công việc trước khi tìm hiểu công nghệ.
          </h2>
          <Link
            to="/assistants"
            className="mt-3 inline-block text-sm text-body hover:text-accent underline underline-offset-4 decoration-line"
          >
            Xem chi tiết 4 giải pháp công việc
          </Link>
        </div>

        <div className="lg:col-span-9">
          <p className="text-sm sm:text-base text-body leading-relaxed max-w-2xl mb-6">
            Bạn không cần học thuật ngữ kỹ thuật hay cách viết câu lệnh dài dòng. Chọn ngay kết quả bạn muốn đạt được để xem trợ lý AI xử lý thực tế:
          </p>

          {/* 4 Pillars List without boxes */}
          <div className="space-y-1 border-b border-line pb-1">
            {ASSISTANT_PREVIEWS.map((item, idx) => {
              const isActive = activeIdx === idx
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full text-left py-3 transition-colors border-t border-line ${
                    isActive
                      ? 'border-l-2 border-accent pl-3 text-ink font-semibold'
                      : 'border-l-2 border-transparent pl-3 text-body hover:text-ink'
                  }`}
                >
                  <div className="text-sm">{item.pillar}</div>
                </button>
              )
            })}
          </div>

          {/* Single Output Box */}
          <div className="bg-paper-sunken p-6 mt-6 space-y-3">
            <div className="font-mono text-xs text-muted">
              &gt; {current.actionText}
            </div>

            <div className="text-sm font-semibold text-ink">
              {current.resultLabel}
            </div>

            <p className="text-sm text-body leading-relaxed">
              {current.resultDetail}
            </p>

            <div className="pt-3 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted">
              <span>Ví dụ thực tế: {current.name}</span>
              <Link
                to="/assistants"
                className="hover:text-accent underline underline-offset-4 decoration-line transition-colors"
              >
                Xem đối chiếu trước và sau
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
