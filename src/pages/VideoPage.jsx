import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Play, Info } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getVideoBySlug } from '../services/contentService'
import DocRecipeCard from '../components/DocRecipeCard'

export default function VideoPage() {
  const { slug } = useParams()
  const { data: video, loading } = useContent(() => getVideoBySlug(slug), [slug])

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-xs text-slate-400">Đang tải…</div>

  if (!video) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy video</h1>
        <Link to="/learn" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">← Về trang học tập</Link>
      </div>
    )
  }

  const isEmbed = video.source.type === 'embed' && video.source.url

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Trang chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/learn" className="hover:text-slate-900">Học tập</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium truncate">{video.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8 min-w-0">
          {isEmbed ? (
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
              <iframe src={video.source.url} title={video.title} className="w-full h-full" allowFullScreen />
            </div>
          ) : (
            <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${video.accent} flex flex-col items-center justify-center text-white`}>
              <div className="absolute inset-0 dot-pattern opacity-20 rounded-xl" />
              <div className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
              </div>
              <p className="relative mt-4 text-xs bg-slate-900/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Video sẽ được nhúng từ {video.source.provider}
              </p>
            </div>
          )}

          <header>
            <div className="text-xs text-slate-500 mb-2">{video.tool} · {video.level} · {video.durationMinutes} phút</div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{video.title}</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{video.summary}</p>
          </header>

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Nội dung video</h2>
            <ul className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl">
              {video.chapters.map((c) => (
                <li key={c.time} className="flex items-center gap-4 px-4 py-2.5 text-xs">
                  <span className="font-mono text-slate-400 w-12 shrink-0">{c.time}</span>
                  <span className="text-slate-800">{c.title}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Bản ghi nội dung</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{video.transcript}</p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Công thức đi kèm</h2>
            {video.relatedPrompts.map((p) => <DocRecipeCard key={p.id} prompt={p} />)}
          </div>
        </aside>
      </div>
    </div>
  )
}
