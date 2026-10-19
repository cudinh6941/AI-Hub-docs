import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'

const ASSISTANT_PREVIEWS = [
  {
    id: 'personal-assistant',
    tabLabel: 'Trợ lý riêng',
    pillar: 'Tạo trợ lý AI riêng cho công việc',
    hookQuestion: 'Mình cũng có một trợ lý riêng cho đầu việc của mình à?',
    name: 'Trợ lý Rà soát Hợp đồng & Quy chế',
    badge: 'Nạp sẵn quy định nội bộ',
    actionText: 'Kiểm tra dự thảo hợp đồng mua sắm thiết bị theo chuẩn công ty...',
    resultLabel: 'Phát hiện điều khoản vượt mức quy định',
    resultDetail: 'Mức phạt 1%/ngày vượt trần. Đề xuất điều chỉnh: tối đa 8% giá trị phần nghĩa vụ bị vi phạm theo Điều 301 Luật Thương mại.',
  },
  {
    id: 'doc-summary',
    tabLabel: 'Tóm tắt tài liệu',
    pillar: 'Biến tài liệu dài thành bản tóm tắt',
    hookQuestion: 'Cái này tiết kiệm được bao nhiêu thời gian đọc tài liệu nhỉ?',
    name: 'Trợ lý Tóm tắt Hồ sơ & Báo cáo Dày',
    badge: 'Đính kèm số trang gốc',
    actionText: 'Đọc và rút gọn các điều kiện cốt lõi trong hồ sơ thầu 92 trang...',
    resultLabel: '3 điểm trọng tâm kèm vị trí trang',
    resultDetail: '1. Bảo lãnh hợp đồng: 5% [Trang 24] • 2. Tiến độ: 180 ngày [Trang 58] • 3. Phạt trễ hạn: sau 7 ngày [Trang 63]',
  },
  {
    id: 'fast-rewrite',
    tabLabel: 'Viết lại văn bản',
    pillar: 'Viết lại văn bản chỉ trong vài giây',
    hookQuestion: 'Hóa ra mình không cần biết viết câu lệnh phức tạp à?',
    name: 'Trợ lý Chuẩn hóa Email & Công văn',
    badge: 'Bôi đen để sửa từng đoạn',
    actionText: 'Viết lại đoạn ghi chú gõ vội thành email gửi Ban Giám đốc và đối tác...',
    resultLabel: 'Văn phong doanh nghiệp chuẩn mực',
    resultDetail: '"Để đảm bảo chất lượng thẩm định số liệu, chúng tôi dự kiến hoàn tất và gửi hồ sơ chính thức trước ngày 25."',
  },
  {
    id: 'workflow-auto',
    tabLabel: 'Tự động hóa',
    pillar: 'Tự động hóa một việc đang làm thủ công',
    hookQuestion: 'Việc lặp đi lặp lại này có thể khỏi làm tay thật à?',
    name: 'Trợ lý Đối soát & Tổng hợp Định kỳ',
    badge: 'Lưu sẵn quy trình xử lý',
    actionText: 'Đối chiếu bảng theo dõi công nợ và lọc các khoản quá hạn...',
    resultLabel: 'Báo cáo phân loại và dự thảo nhắc nợ',
    resultDetail: 'Đã phân nhóm tuổi nợ, đánh dấu các khoản quá hạn trên 60 ngày và soạn sẵn văn bản đôn đốc thanh toán.',
  },
]

export default function FeatureSpotlightBanner() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ASSISTANT_PREVIEWS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const current = ASSISTANT_PREVIEWS[activeIdx]

  return (
    <section className="py-14 border-b border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner Container with Neutral Minimalist Styling */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 sm:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Benefit-First Overview Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span>Bắt đầu từ lợi ích thực tế</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">
                Nhìn thấy kết quả công việc trước khi tìm hiểu công nghệ.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Bạn không cần học thuật ngữ kỹ thuật hay cách viết câu lệnh dài dòng. Chọn ngay kết quả bạn muốn đạt được để xem trợ lý AI xử lý thực tế như thế nào:
              </p>

              {/* 4 Core Pillars with Natural Hooks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {ASSISTANT_PREVIEWS.map((item, idx) => {
                  const isActive = activeIdx === idx
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-white border-slate-900 shadow-2xs'
                          : 'bg-white/70 border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-slate-900 leading-snug">
                            {item.pillar}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-normal">
                            "{item.hookQuestion}"
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  to="/assistants"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all duration-200"
                >
                  <span>Xem chi tiết 4 giải pháp công việc</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Right Column: Monochrome Assistant Simulator */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                {/* Simulator App Topbar */}
                <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="font-medium text-[11px] tracking-tight text-slate-300">Minh họa kết quả thực tế</span>
                  </div>

                  {/* Active Assistant Quick Selectors */}
                  <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md">
                    {ASSISTANT_PREVIEWS.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIdx(i)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                          activeIdx === i
                            ? 'bg-white text-slate-900 font-semibold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.tabLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assistant Workspace Body */}
                <div
                  key={current.id}
                  className="p-5 bg-white min-h-[260px] flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Top: Current Benefit & Hook Header */}
                  <div className="space-y-2 border-b border-slate-100 pb-3 animate-cascade-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">{current.pillar}</div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {current.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 italic">
                      Câu hỏi thường gặp: "{current.hookQuestion}"
                    </div>
                  </div>

                  {/* Middle: Live Action in progress */}
                  <div className="space-y-2.5">
                    {/* Simulated Input Task */}
                    <div className="relative overflow-hidden bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between animate-cascade-1">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/25 to-transparent animate-shimmer-h pointer-events-none" />
                      <div className="flex items-center gap-2 truncate pr-2 font-mono text-[11px]">
                        <span className="text-slate-400">&gt;</span>
                        <span className="truncate text-slate-700">{current.actionText}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">Đầu vào</span>
                    </div>

                    {/* Result Output Preview */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-300 shadow-2xs space-y-1.5 animate-cascade-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-900">
                        <span>{current.resultLabel}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[9px] font-medium">Kết quả đầu ra</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                        {current.resultDetail}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs animate-cascade-3">
                    <span className="text-[11px] text-slate-500">
                      Ví dụ: {current.name}
                    </span>
                    <Link
                      to="/assistants"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      <span>Xem đối chiếu Trước / Sau</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
