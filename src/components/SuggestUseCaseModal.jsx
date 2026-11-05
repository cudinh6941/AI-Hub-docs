import React, { useState } from 'react'
import { X, Check } from 'lucide-react'
import { DEPARTMENTS, TOOLS } from '../data/prompts/index.js'

export default function SuggestUseCaseModal({ isOpen, onClose }) {
  const [department, setDepartment] = useState('Tài chính - Kế toán')
  const [tool, setTool] = useState('Excel Copilot')
  const [taskName, setTaskName] = useState('')
  const [painPoint, setPainPoint] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskName.trim()) return

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setTaskName('')
      setPainPoint('')
      onClose()
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-paper border border-line shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-medium text-ink">
                Đề Xuất Bài Toán Nghiệp Vụ
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Tiếp nhận nhu cầu chuyển đổi quy trình thủ công sang công thức AI
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Department & Tool */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Phòng ban:
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs p-2 bg-paper-sunken border border-line text-ink outline-none focus:border-ink transition-colors"
                >
                  {DEPARTMENTS.filter(d => d !== 'Tất cả').map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Công cụ mong muốn:
                </label>
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full text-xs p-2 bg-paper-sunken border border-line text-ink outline-none focus:border-ink transition-colors"
                >
                  {TOOLS.filter(t => t !== 'Tất cả').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task Name */}
            <div>
              <label className="text-xs font-medium text-ink block mb-1">
                Tên tác vụ đang làm thủ công tốn thời gian:
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Ví dụ: Lập bảng đối chiếu thuế GTGT hàng tháng..."
                className="w-full text-xs p-2.5 bg-paper-sunken border border-line text-ink placeholder-muted outline-none focus:border-ink transition-colors"
              />
            </div>

            {/* Pain Point Description */}
            <div>
              <label className="text-xs font-medium text-ink block mb-1">
                Điểm nghẽn hoặc kết quả bạn mong muốn AI tạo ra:
              </label>
              <textarea
                rows={3}
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                placeholder="Mô tả cụ thể: Dữ liệu đầu vào là gì? Bạn muốn bảng tổng hợp hay văn bản tóm tắt?"
                className="w-full text-xs p-2.5 bg-paper-sunken border border-line text-ink placeholder-muted outline-none focus:border-ink transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-muted hover:text-ink transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={submitted}
                className="px-4 py-2 bg-ink hover:bg-black text-paper text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                {submitted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <span>Gửi Đề Xuất</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
