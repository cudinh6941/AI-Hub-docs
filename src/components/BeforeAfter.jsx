import React from 'react'

export default function BeforeAfter({ before, after, size = 'md', stacked = false }) {
  const afterSize = size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
  if (stacked) {
    return (
      <div className="space-y-4">
        <div>
          <div className="text-xs text-muted mb-1">{before.label}</div>
          <p className="font-mono text-sm text-muted leading-relaxed whitespace-pre-line">{before.text}</p>
        </div>
        <div className="border-l-2 border-accent pl-4">
          <div className="text-xs text-accent mb-1">{after.label}</div>
          <p className={`font-display ${afterSize} text-ink leading-snug whitespace-pre-line`}>{after.text}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-5">
      <div className="md:col-span-5">
        <div className="text-xs text-muted mb-2">{before.label}</div>
        <p className="font-mono text-sm text-muted leading-relaxed whitespace-pre-line">{before.text}</p>
      </div>
      <div className="md:col-span-7 md:border-l-2 md:border-accent md:pl-8">
        <div className="text-xs text-accent mb-2">{after.label}</div>
        <p className={`font-display ${afterSize} text-ink leading-snug whitespace-pre-line`}>{after.text}</p>
      </div>
    </div>
  )
}
