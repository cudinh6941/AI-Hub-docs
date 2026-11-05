import React from 'react'

export default function GovernancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
        An toàn thông tin
      </div>
      <h1 className="font-display text-2xl sm:text-3xl text-ink font-medium tracking-tight">
        Quy chuẩn & Bảo mật
      </h1>
      <p className="text-sm text-muted mt-2 mb-10 max-w-xl">
        Đọc trước khi dùng bất kỳ công cụ AI nào với dữ liệu công ty.
      </p>

      {/* Phân loại dữ liệu */}
      <section className="mb-12">
        <h2 className="font-display text-lg text-ink font-medium tracking-tight mb-4 pb-2 border-b border-line">
          Phân loại dữ liệu xử lý
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Dữ liệu Công khai & Nội bộ</span>
              <span className="text-[11px] font-mono text-muted">Cấp 1 – 2</span>
            </div>
            <p className="text-xs text-body leading-relaxed">
              Được phép dùng với các công cụ AI đám mây đã được công ty phê duyệt theo danh mục tiêu chuẩn.
            </p>
          </div>

          <div className="space-y-2 md:border-l md:border-line md:pl-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-accent">Dữ liệu Mật & Hạn chế</span>
              <span className="text-[11px] font-mono text-accent">Cấp 3 (Tối mật)</span>
            </div>
            <p className="text-xs text-body leading-relaxed">
              Bí mật kinh doanh, thông tin cá nhân (PII). Chỉ xử lý qua nền tảng nội bộ hoặc tenant riêng cam kết không dùng dữ liệu để huấn luyện.
            </p>
          </div>
        </div>
      </section>

      {/* Nguyên tắc vận hành */}
      <section className="space-y-6">
        <h2 className="font-display text-lg text-ink font-medium tracking-tight mb-4 pb-2 border-b border-line">
          Nguyên tắc vận hành
        </h2>

        <div className="space-y-6">
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-ink mb-1">1. Con người luôn là người duyệt cuối</h3>
            <p className="text-xs text-body leading-relaxed max-w-2xl">
              Báo cáo tài chính, quyết định nhân sự và hợp đồng phải được người có thẩm quyền xác nhận trước khi phát hành.
            </p>
          </div>

          <div className="pt-4 border-t border-line">
            <h3 className="text-sm font-semibold text-ink mb-1">2. Truy cập và ghi nhật ký</h3>
            <p className="text-xs text-body leading-relaxed max-w-2xl">
              Quyền truy cập kế thừa từ tài khoản công ty. Yêu cầu quan trọng được ghi log để hậu kiểm khi có sự cố.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
