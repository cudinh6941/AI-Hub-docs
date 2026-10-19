import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function BentoSection() {
  return (
    <section className="py-14 border-b border-slate-200/80 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Quy trình mẫu
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tác vụ tự động hóa theo nghiệp vụ
            </h2>
          </div>
          <Link
            to="/prompts"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <span>Tất cả công thức</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* Bento Grid layout with minimal text and rich motion mockups */}
        <div className="grid grid-cols-12 gap-5">
          {/* Tile 1: Excel P&L / Bảng tính (Col 7) */}
          <Link
            to="/prompts?tool=Excel%20Copilot"
            className="group col-span-12 lg:col-span-7 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Excel Copilot
                </span>
                <span className="text-[11px] text-slate-400 font-mono">FIN-001</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">
                Đối chiếu và phân tích biến động P&L
              </h3>

              {/* Looping Motion Canvas (Excel Ledger with Shimmer Scan) */}
              <div className="relative rounded-xl border border-slate-200/90 bg-slate-50 overflow-hidden p-3.5">
                {/* Horizontal Shimmer Beam */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/20 to-transparent animate-shimmer-h pointer-events-none" />

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-200/60">
                  <span>Sheet: Chi_Phi_P&L_Q3</span>
                  <span className="text-slate-600 font-medium">Tự động tính Variance</span>
                </div>

                <div className="divide-y divide-slate-200/60 text-[11px] font-mono mt-1">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Hạ tầng Cloud</span>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-600 font-semibold">+28.3%</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                        Vượt định mức
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Chi phí tiếp thị</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-semibold">-5.0%</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Trong kế hoạch
                      </span>
                    </div>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">Thuê văn phòng</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">0.0%</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Cố định
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-900 group-hover:text-indigo-600 font-semibold">
              <span>Xem công thức Excel</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 2: Word Hợp đồng (Col 5) */}
          <Link
            to="/prompts?tool=Word%20Copilot"
            className="group col-span-12 lg:col-span-5 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Word Copilot
                </span>
                <span className="text-[11px] text-slate-400 font-mono">LEG-001</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">
                Rà soát điều khoản phạt hợp đồng
              </h3>

              {/* Looping Motion Canvas (Contract Scan Beam) */}
              <div className="relative rounded-xl border border-slate-200/90 bg-slate-50 overflow-hidden p-3.5 min-h-[145px] flex flex-col justify-between">
                {/* Vertical Scanning Beam */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-scan-beam pointer-events-none" />

                <div className="text-[10px] text-slate-400 font-mono pb-1 border-b border-slate-200/60 flex justify-between">
                  <span>Hop_Dong_Thuong_Mai.docx</span>
                  <span className="text-rose-600 font-semibold">Rủi ro pháp lý</span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="p-2 rounded bg-rose-50/70 border border-rose-200/70 text-[11px] text-slate-700 leading-snug">
                    <span className="line-through text-slate-400">"Phạt 0.5% mỗi ngày trễ hạn không giới hạn tổng mức phạt."</span>
                  </div>
                  <div className="p-2 rounded bg-slate-100 border border-slate-300 text-[11px] text-slate-800 leading-snug">
                    <span className="font-semibold text-slate-900">Đề xuất sửa:</span> Giới hạn mức phạt tối đa 8% theo Điều 301 Luật Thương mại.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-900 group-hover:text-indigo-600 font-semibold">
              <span>Xem công thức văn bản</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 3: Ban Giám Đốc / Họp (Col 5) */}
          <Link
            to="/prompts?dept=Ban%20Gi%C3%A1m%20%C4%90%E1%BB%91c"
            className="group col-span-12 lg:col-span-5 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Ban Giám Đốc
                </span>
                <span className="text-[11px] text-slate-400 font-mono">BOD-001</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">
                Trích xuất đầu việc giao ban tuần
              </h3>

              {/* Looping Motion Canvas (Cascading Action Items) */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50 p-3.5 space-y-2 text-xs min-h-[145px]">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1 border-b border-slate-200/60">
                  <span>Bien_Ban_Giao_Ban.txt</span>
                  <span className="text-slate-600 font-medium">3 đầu việc</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="bg-white p-2 rounded border border-slate-200/70 flex items-center justify-between gap-2 animate-cascade-1">
                    <span className="font-medium text-slate-800 truncate">Hoàn tất bảo dưỡng trạm bơm</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">Hạn 25/10</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200/70 flex items-center justify-between gap-2 animate-cascade-2">
                    <span className="font-medium text-slate-800 truncate">Chốt số liệu kiểm toán quý III</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">Hạn 28/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-900 group-hover:text-indigo-600 font-semibold">
              <span>Xem công thức điều hành</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 4: An toàn Dữ liệu / Governance (Col 7) */}
          <Link
            to="/governance"
            className="group col-span-12 lg:col-span-7 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  An toàn thông tin
                </span>
                <span className="text-[11px] text-slate-400 font-mono">SEC-001</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4">
                Ma trận kiểm soát và phân loại dữ liệu AI
              </h3>

              {/* Looping Motion Canvas (3-Tier Security Matrix) */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50 p-3.5 min-h-[145px] flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 space-y-1 shadow-2xs">
                    <span className="inline-block text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      CÔNG KHAI
                    </span>
                    <div className="text-[11px] text-slate-600">Thông cáo báo chí, tuyển dụng, quy chế chung.</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 space-y-1 shadow-2xs">
                    <span className="inline-block text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      NỘI BỘ
                    </span>
                    <div className="text-[11px] text-slate-600">Email công việc, báo cáo phòng ban chưa công bố.</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 space-y-1 shadow-2xs">
                    <span className="inline-block text-[10px] font-bold text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300">
                      TỐI MẬT
                    </span>
                    <div className="text-[11px] text-slate-600">Số tài khoản ngân hàng, PII, mã nguồn hệ thống.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-900 group-hover:text-indigo-600 font-semibold">
              <span>Đọc quy chuẩn an toàn</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
