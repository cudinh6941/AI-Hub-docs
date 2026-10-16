import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import { parseYouTubeId, YouTubeIcon } from '../utils/videoUtils'

export default function VideoCard({ video }) {
  const rawUrl = video.sourceUrl || video.source?.url || ''
  const youtubeId = parseYouTubeId(rawUrl)

  return (
    <Link
      to={`/learn/${video.slug}`}
      className="group block bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out flex flex-col justify-between"
    >
      <div>
        <div
          className={`relative aspect-video bg-gradient-to-br ${
            video.accent || 'from-indigo-500 to-purple-500'
          } flex items-center justify-center overflow-hidden`}
        >
          {youtubeId ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 dot-pattern opacity-20" />
          )}

          <div className="relative w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Play className="w-5 h-5 text-slate-900 ml-0.5" fill="currentColor" />
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-medium">
            {youtubeId ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs">
                <YouTubeIcon className="w-3 h-3 text-rose-500" /> YouTube
              </span>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs">
              <Clock className="w-3 h-3" />
              {video.durationMinutes} phút
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
            <span className="text-indigo-600 font-semibold">{video.department}</span>
            <span>·</span>
            <span>{video.tool}</span>
            <span>·</span>
            <span className="text-slate-400">{video.level}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {video.summary}
          </p>
        </div>
      </div>

      <div className="px-4 pb-3 pt-1 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>{Array.isArray(video.chapters) ? `${video.chapters.length} phân đoạn` : 'Chi tiết bài giảng'}</span>
        <span className="group-hover:text-indigo-600 font-medium transition-colors">Xem bài học →</span>
      </div>
    </Link>
  )
}
