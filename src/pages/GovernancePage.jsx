import React from 'react'

export default function GovernancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <span>An toàn thông tin</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Quy chuẩn & Bảo mật</h1>
      <p className="text-sm text-slate-600 mt-1 mb-8">Đọc trước khi dùng bất kỳ công cụ AI nào với dữ liệu công ty.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 animate-fade-up delay-100">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Dữ liệu Công khai / Nội bộ</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              CẤP ĐỘ 1 - 2
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Được phép dùng với các công cụ AI đám mây đã được công ty phê duyệt theo danh mục tiêu chuẩn.
          </p>
        </div>

        <div className="rounded-xl border border-slate-300 bg-slate-50 p-5 space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Dữ liệu Mật / Hạn chế</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-900">
              CẤP ĐỘ 3 (TỐI MẬT)
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Bí mật kinh doanh, thông tin cá nhân (PII). Chỉ xử lý qua nền tảng nội bộ hoặc tenant riêng cam kết không dùng dữ liệu để huấn luyện.
          </p>
        </div>
      </div>

      <div className="space-y-4 animate-fade-up delay-200">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">1. Con người luôn là người duyệt cuối</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Báo cáo tài chính, quyết định nhân sự và hợp đồng phải được người có thẩm quyền xác nhận trước khi phát hành.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">2. Truy cập và ghi nhật ký</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Quyền truy cập kế thừa từ tài khoản công ty. Yêu cầu quan trọng được ghi log để hậu kiểm khi có sự cố.
          </p>
        </div>
      </div>
    </div>
  )
}
