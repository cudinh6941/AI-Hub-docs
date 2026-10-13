import React, { useMemo, useState } from 'react'
import { useContent } from '../hooks/useContent'
import { getVideos } from '../services/contentService'
import VideoCard from '../components/VideoCard'

const LEVELS = ['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao']

export default function LearnPage() {
  const { data: videos, loading } = useContent(getVideos, [])
  const [level, setLevel] = useState('Tất cả')

  const list = useMemo(
    () => (videos || []).filter((v) => level === 'Tất cả' || v.level === level),
    [videos, level]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Học tập</h1>
        <p className="text-sm text-slate-600 mt-1">Video ngắn từ 5 đến 10 phút. Mỗi video đi kèm công thức prompt để bạn làm theo ngay.</p>
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-6">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
              level === l ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-xs text-slate-400">Đang tải…</div>
      ) : list.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Chưa có video ở cấp độ này.</p>
      )}
    </div>
  )
}
