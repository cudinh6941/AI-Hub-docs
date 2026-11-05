import React from 'react'

export default function EmptyState({ onReset }) {
  return (
    <div className="text-center py-16 px-4 max-w-lg mx-auto my-8 space-y-4">
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-medium text-ink">
          Không tìm thấy công thức phù hợp
        </h3>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
          Thử tìm kiếm với từ khóa khác (ví dụ: "kế toán", "báo cáo", "hợp đồng", "tuyển dụng") hoặc bỏ bớt các bộ lọc đang chọn.
        </p>
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-ink text-white hover:bg-accent transition-colors duration-200 cursor-pointer"
      >
        <span>Đặt lại toàn bộ bộ lọc</span>
      </button>
    </div>
  )
}
