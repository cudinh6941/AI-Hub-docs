import React from 'react'

export default function EmptyState({ onReset }) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto my-8 space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">
          Không tìm thấy công thức phù hợp
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Thử tìm kiếm với từ khóa khác (ví dụ: "kế toán", "báo cáo", "hợp đồng", "tuyển dụng") hoặc bỏ bớt các bộ lọc đang chọn.
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
      >
        <span>Đặt lại toàn bộ bộ lọc</span>
      </button>
    </div>
  )
}
