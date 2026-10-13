import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Copy,
  Star,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Bot,
  Sparkles
} from 'lucide-react'

// Discreet tool icon helper
function getToolIcon(tool) {
  switch (tool) {
    case 'Excel Copilot':
      return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
    case 'Word Copilot':
      return <FileText className="w-3.5 h-3.5 text-blue-600" />
    case 'Teams':
      return <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
    case 'ChatGPT / Claude':
      return <Bot className="w-3.5 h-3.5 text-purple-600" />
    default:
      return <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
  }
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

  // Parse prompt template to highlight variables with subtle pastel pill
  const renderSnippet = (text) => {
    // Take the first 2-3 lines of prompt
    const lines = text.split('\n').filter(Boolean).slice(0, 2).join(' ')
    const parts = lines.split(/(\[[A-Z0-9_À-Ỹ]+\])/g)

    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={index}
            className="inline-block px-1 py-0.2 mx-0.5 rounded text-[11px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60"
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <article
      onClick={() => navigate(`/prompts/${prompt.slug}`)}
      className="group relative bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* 1. Top Row: Discreet tool label + Verified reviewer check */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            {getToolIcon(prompt.tool)}
            <span>{prompt.tool}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-400 font-mono">{prompt.id}</span>
          </div>

          {prompt.verified && (
            <div
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-normal"
              title={`Đã kiểm chứng bởi: ${prompt.verifiedBy || 'AI Champion'}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium text-[11px]">
                {prompt.verifiedBy ? prompt.verifiedBy.split('(')[0].trim() : 'Đã duyệt'}
              </span>
            </div>
          )}
        </div>

        {/* 2. Task Title */}
        <h3 className="font-semibold text-slate-900 text-[15px] group-hover:text-indigo-600 transition-colors leading-snug mb-1.5">
          {prompt.title}
        </h3>

        {/* 3. Problem Statement / Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 font-normal">
          {prompt.summary}
        </p>

        {/* 4. Interactive Snippet Preview (Clean, 2 lines max with subtle highlight) */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 font-mono text-[11px] text-slate-700 leading-relaxed overflow-hidden relative mb-4">
          <div className="line-clamp-2">
            {renderSnippet(prompt.promptTemplate)}
          </div>
        </div>
      </div>

      {/* 5. Footer Row: Social Proof & Micro Copy Action */}
      <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between gap-2 text-xs">
        {/* Rating and Copy Count */}
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-slate-700">{prompt.rating.toFixed(1)}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>{prompt.copyCount} lượt</span>
        </div>

        {/* Action Link & 1-Click Copy square icon */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
            <span>Chi tiết</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>

          <button
            onClick={handleCopy}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 border border-slate-200/80'
            }`}
            title={copied ? 'Đã sao chép!' : '1-Click Copy'}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
