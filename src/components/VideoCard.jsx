import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'

export default function VideoCard({ video }) {
  return (
    <Link
      to={`/learn/${video.slug}`}
      className="group block bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out"
    >
      <div className={`relative aspect-video bg-gradient-to-br ${video.accent} flex items-center justify-center`}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <Play className="w-5 h-5 text-slate-900 ml-0.5" fill="currentColor" />
        </div>
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/70 text-white text-[10px] font-medium">
          <Clock className="w-3 h-3" />
          {video.durationMinutes} phút
        </span>
      </div>
      <div className="p-4">
        <div className="text-[11px] text-slate-500 mb-1">
          {video.tool} · {video.level}
        </div>
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{video.summary}</p>
      </div>
    </Link>
  )
}
