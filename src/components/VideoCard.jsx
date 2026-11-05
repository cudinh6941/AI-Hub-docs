import React from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { parseYouTubeId } from '../utils/videoUtils'

export default function VideoCard({ video }) {
  const rawUrl = video.sourceUrl || video.source?.url || ''
  const youtubeId = parseYouTubeId(rawUrl)

  return (
    <Link
      to={`/learn/${video.slug}`}
      className="group block flex flex-col justify-between space-y-3"
    >
      <div>
        <div className="relative aspect-video bg-ink rounded-md overflow-hidden flex items-center justify-center">
          {youtubeId ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
            </>
          ) : (
            <div className="text-muted text-xs font-mono">{video.id}</div>
          )}

          <div className="relative w-10 h-10 rounded-md bg-paper/90 backdrop-blur-sm flex items-center justify-center text-ink group-hover:text-accent transition-colors duration-200">
            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-mono">
            <span>{youtubeId ? 'YouTube' : video.id}</span>
            <span>{video.durationMinutes} phút</span>
          </div>
        </div>

        <div className="pt-3 space-y-1">
          <div className="text-xs text-muted">
            {video.department} · {video.tool} · {video.level}
          </div>
          <h3 className="font-display text-base text-ink font-medium leading-snug line-clamp-2 underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200">
            {video.title}
          </h3>
          <p className="text-xs text-body line-clamp-2 leading-relaxed">
            {video.summary}
          </p>
        </div>
      </div>

      <div className="text-xs text-muted pt-2 border-t border-line/60">
        {Array.isArray(video.chapters) ? `${video.chapters.length} phân đoạn` : 'Chi tiết bài giảng'}
      </div>
    </Link>
  )
}
