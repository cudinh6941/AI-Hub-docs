import React, { useState } from 'react'
import { X, Send, Sparkles, Check, HelpCircle } from 'lucide-react'
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
    // TODO: send to backend / SharePoint List when available. Currently not persisted.
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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Đề Xuất Bài Toán Nghiệp Vụ Mới
                </h3>
                <p className="text-xs text-slate-500">
                  Tầng 1: Use Case Discovery Hub • Chuyển đổi thủ công sang AI
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Department & Tool */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phòng ban của bạn:
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-indigo-600 outline-none"
                >
                  {DEPARTMENTS.filter(d => d !== 'Tất cả').map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Công cụ mong muốn:
                </label>
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:bg-white focus:border-indigo-600 outline-none"
                >
                  {TOOLS.filter(t => t !== 'Tất cả').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tên tác vụ đang làm thủ công tốn thời gian:
              </label>
              <input
                type="text"
                required
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Ví dụ: Lập bảng đối chiếu thuế GTGT hàng tháng..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            {/* Pain Point Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Điểm nghẽn hoặc kết quả bạn mong muốn AI tạo ra:
              </label>
              <textarea
                rows={3}
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                placeholder="Mô tả cụ thể: Dữ liệu đầu vào là gì? Bạn muốn bảng tổng hợp hay văn bản tóm tắt? Hiện tại mất bao nhiêu giờ để làm..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={submitted}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/20"
              >
                {submitted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Đề Xuất</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}
