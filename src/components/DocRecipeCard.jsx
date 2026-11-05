import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'

export default function DocRecipeCard({ prompt }) {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt.promptTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article
      onClick={() => navigate(`/prompts/${prompt.slug}`)}
      className="group cursor-pointer border-b border-line py-5 flex items-start justify-between gap-6"
    >
      <div className="min-w-0">
        <div className="text-xs text-muted mb-1">{prompt.tool}</div>
        <h3 className="font-display text-lg text-ink leading-snug font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200">
          {prompt.title}
        </h3>
        <p className="text-sm text-body line-clamp-2 mt-1.5 leading-relaxed">
          {prompt.summary}
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className={`w-8 h-8 rounded-md shrink-0 flex items-center justify-center border transition-colors ${
          copied
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
            : 'border-line text-body hover:border-ink hover:text-ink'
        }`}
        title={copied ? 'Đã sao chép' : 'Sao chép câu lệnh'}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </article>
  )
}
