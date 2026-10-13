import React from 'react'
import { SearchX, RotateCcw } from 'lucide-react'

export default function EmptyState({ onReset }) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto my-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-800">
          Không tìm thấy công thức phù hợp
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Thử tìm kiếm với từ khóa khác (ví dụ: "kế toán", "báo cáo", "hợp đồng", "tuyển dụng") hoặc bỏ bớt các bộ lọc đang chọn.
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-stripe-bg text-stripe-blue border border-stripe-blue/30 hover:bg-stripe-blue hover:text-white transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Xóa toàn bộ bộ lọc & Tìm lại</span>
      </button>
    </div>
  )
}
