import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy, ArrowRight, CheckCircle2 } from 'lucide-react'

function getToolAccentBorder() {
  return 'border-t-slate-800'
}

export default function DocRecipeCard({ prompt }) {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt.promptTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get first 1-2 variables to preview as neat chips
  const previewVars = Array.isArray(prompt.variables)
    ? prompt.variables.slice(0, 2).map((v) => (typeof v === 'object' ? v.name : v))
    : []

  // Clean output preview line
  const outputPreview = prompt.outputSample
    ? prompt.outputSample.split('\n').filter(Boolean).slice(0, 2).join(' ')
    : prompt.summary

  return (
    <article
      onClick={() => navigate(`/prompts/${prompt.slug}`)}
      className="group relative bg-white border border-slate-200/90 border-t-2 border-t-slate-800 hover:border-slate-300 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Row: Clean text tool label + ID + Verified state */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-800">{prompt.tool}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-400 font-mono">{prompt.id}</span>
          </div>

          {prompt.verified && (
            <div
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium"
              title={`Đã kiểm chứng bởi: ${prompt.verifiedBy || 'Chuyên viên nghiệp vụ'}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Đã kiểm chứng</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3 className="font-semibold text-slate-900 text-[15px] group-hover:text-indigo-600 transition-colors leading-snug mb-1.5">
          {prompt.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {prompt.summary}
        </p>

        {/* Output Structure Preview (Shows what the user actually gets) */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 mb-3">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1 tracking-wider">
            Định dạng kết quả
          </div>
          <p className="text-[11px] text-slate-700 line-clamp-2 font-mono leading-relaxed">
            {outputPreview}
          </p>
        </div>

        {/* Variables pill previews if present */}
        {previewVars.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span className="text-[10px] text-slate-400">Tham số:</span>
            {previewVars.map((v) => (
              <span
                key={v}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200"
              >
                [{v}]
              </span>
            ))}
            {prompt.variables.length > 2 && (
              <span className="text-[10px] text-slate-400">+{prompt.variables.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Metrics and Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span className="font-medium text-slate-700">{Number(prompt.rating || 5).toFixed(1)} / 5.0</span>
          <span className="text-slate-300">•</span>
          <span>{prompt.copyCount} lượt dùng</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
            <span>Chi tiết</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
              copied
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 border border-slate-200/80'
            }`}
            title={copied ? 'Đã sao chép' : 'Sao chép câu lệnh'}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </article>
  )
}
