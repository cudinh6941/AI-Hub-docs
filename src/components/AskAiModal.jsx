import React, { useState } from 'react'
import { X, ArrowRight, Search } from 'lucide-react'
import { searchAndRankPrompts } from '../services/searchEngine.js'

export default function AskAiModal({ isOpen, onClose, allPrompts, onSelectPrompt }) {
  const [problemDescription, setProblemDescription] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  if (!isOpen) return null

  const handleAsk = (e) => {
    e.preventDefault()
    if (!problemDescription.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      const results = searchAndRankPrompts(allPrompts, {
        query: problemDescription,
        department: 'Tất cả',
        tool: 'Tất cả',
        difficulty: 'Tất cả',
        quickFilter: 'all'
      })
      setRecommendations(results.slice(0, 3))
      setIsSearching(false)
    }, 300)
  }

  const sampleQuestions = [
    'Tôi muốn phân tích vượt ngân sách chi phí P&L',
    'Cần rà soát rủi ro pháp lý hợp đồng dịch vụ',
    'Soạn bài phát biểu Townhall truyền cảm hứng',
    'Xây dựng JD và câu hỏi phỏng vấn STAR'
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-paper border border-line shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-medium text-ink">
                Gợi ý công thức
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Mô tả bài toán của bạn, hệ thống sẽ gợi ý công thức phù hợp nhất
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
          <div className="p-6 space-y-4">
            <form onSubmit={handleAsk} className="space-y-3">
              <label className="text-xs font-medium text-ink block">
                Bạn đang cần giải quyết công việc gì?
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Ví dụ: Tôi cần kiểm tra xem hợp đồng của nhà cung cấp có điều khoản phạt vượt quá 8% không..."
                  className="w-full text-xs p-3 bg-paper-sunken border border-line focus:border-ink outline-none text-ink placeholder-muted transition-colors resize-none"
                />
              </div>

              {/* Sample Quick Prompts */}
              <div className="flex flex-wrap gap-2 items-center pt-1">
                <span className="text-[11px] font-mono text-muted mr-1">Gợi ý nhanh:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProblemDescription(q)
                    }}
                    className="text-[11px] text-body hover:text-ink underline decoration-line hover:decoration-ink transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!problemDescription.trim() || isSearching}
                  className="px-4 py-2 bg-ink hover:bg-black disabled:opacity-50 text-paper text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearching ? 'Đang tìm kiếm...' : 'Tìm Công Thức Tương Thích'}</span>
                </button>
              </div>
            </form>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="pt-4 border-t border-line space-y-3">
                <div className="flex items-center justify-between text-xs text-ink font-medium">
                  <span>Công thức đề xuất:</span>
                  <span className="text-[11px] font-mono text-muted">
                    {recommendations.length} kết quả
                  </span>
                </div>

                <div className="divide-y divide-line border-t border-line">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        onClose()
                        onSelectPrompt(rec)
                      }}
                      className="py-3 hover:text-accent transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-muted">
                            {rec.id}
                          </span>
                          <span className="text-xs font-medium text-ink group-hover:text-accent transition-colors">
                            {rec.title}
                          </span>
                          {rec.verified && (
                            <span className="text-[10px] font-mono text-muted">
                              · Kiểm chứng
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted line-clamp-1">
                          {rec.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-muted">
                          {rec.tool}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
