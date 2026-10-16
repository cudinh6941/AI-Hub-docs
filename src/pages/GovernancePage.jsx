import { ShieldCheck, ShieldAlert, UserCheck, ScrollText } from 'lucide-react'

export default function GovernancePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quy chuẩn & Bảo mật</h1>
      <p className="text-sm text-slate-600 mt-1 mb-8">Đọc trước khi dùng bất kỳ công cụ AI nào với dữ liệu công ty.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 animate-fade-up delay-100">
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 mb-2">
            <ShieldCheck className="w-4 h-4" /> Dữ liệu Công khai / Nội bộ
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">Được phép dùng với các công cụ AI cloud đã được công ty phê duyệt.</p>
        </div>
        <div className="rounded-xl border border-rose-200/70 bg-rose-50/40 p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-800 mb-2">
            <ShieldAlert className="w-4 h-4" /> Dữ liệu Mật / Hạn chế
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">Bí mật kinh doanh, thông tin cá nhân (PII). Chỉ xử lý qua nền tảng nội bộ hoặc tenant riêng cam kết không dùng dữ liệu để huấn luyện.</p>
        </div>
      </div>

      <div className="space-y-4 animate-fade-up delay-200">
        <div className="rounded-xl border border-slate-200/80 p-5 flex gap-3">
          <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Con người luôn là người duyệt cuối</h2>
            <p className="text-xs text-slate-600 leading-relaxed">Báo cáo tài chính, quyết định nhân sự và hợp đồng phải được người có thẩm quyền xác nhận trước khi phát hành.</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/80 p-5 flex gap-3">
          <ScrollText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Truy cập và ghi nhật ký</h2>
            <p className="text-xs text-slate-600 leading-relaxed">Quyền truy cập kế thừa từ tài khoản công ty. Yêu cầu quan trọng được ghi log để hậu kiểm khi có sự cố.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
