import React, { useState } from 'react'
import { Sparkles, X, ArrowRight, Bot, ShieldCheck, Star } from 'lucide-react'
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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stripe-blue flex items-center justify-center text-white shadow-sm shadow-stripe-blue/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gợi ý công thức
                </h3>
                <p className="text-xs text-slate-500">
                  Mô tả bài toán của bạn, hệ thống sẽ gợi ý công thức phù hợp nhất
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
          <div className="p-6 space-y-4">
            <form onSubmit={handleAsk} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Bạn đang cần giải quyết công việc gì?
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Ví dụ: Tôi cần kiểm tra xem hợp đồng của nhà cung cấp có bị bẫy phạt tiền quá 8% không..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-stripe-blue focus:ring-2 focus:ring-stripe-blue/20 outline-none text-slate-900 placeholder-slate-400 transition-all resize-none"
                />
              </div>

              {/* Sample Quick Prompts */}
              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProblemDescription(q)
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!problemDescription.trim() || isSearching}
                  className="px-5 py-2 rounded-lg bg-stripe-blue hover:bg-stripe-hover disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm shadow-stripe-blue/20 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSearching ? 'Đang tìm kiếm...' : 'Tìm Công Thức Tương Thích'}</span>
                </button>
              </div>
            </form>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Công thức đề xuất hàng đầu (Top Recommendations):</span>
                  <span className="text-[11px] text-stripe-blue font-normal">
                    {recommendations.length} kết quả phù hợp
                  </span>
                </div>

                <div className="space-y-2.5">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        onClose()
                        onSelectPrompt(rec)
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-stripe-blue hover:bg-slate-50/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                            {rec.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-stripe-blue transition-colors">
                            {rec.title}
                          </span>
                          {rec.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {rec.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400">
                          {rec.tool}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-stripe-blue group-hover:translate-x-0.5 transition-all" />
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
