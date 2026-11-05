import { useMemo, useState, useEffect } from 'react'
import React from 'react'
import { Search } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getVideos } from '../services/contentService'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import VideoCard from '../components/VideoCard'
import VideoFormModal from '../components/admin/VideoFormModal'

const LEVELS = ['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao']

export default function LearnPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: videos, loading } = useContent(getVideos, [refreshKey])
  const [level, setLevel] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    return subscribeAdminAuth(setIsAdmin)
  }, [])

  const list = useMemo(() => {
    return (videos || []).filter((v) => {
      const matchLevel = level === 'Tất cả' || v.level === level
      if (!matchLevel) return false
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.summary && v.summary.toLowerCase().includes(q)) ||
        (v.department && v.department.toLowerCase().includes(q)) ||
        (v.tool && v.tool.toLowerCase().includes(q))
      )
    })
  }, [videos, level, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header Row with Admin Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink font-medium tracking-tight">
            Video Học Tập & Hướng Dẫn
          </h1>
          <p className="text-sm text-body mt-1 max-w-2xl leading-relaxed">
            Video ngắn hướng dẫn ứng dụng AI vào nghiệp vụ, kèm công thức prompt để làm theo ngay.
          </p>
        </div>

        {/* Admin Create Video Button */}
        {isAdmin && (
          <div className="shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-ink hover:bg-accent text-white transition-colors cursor-pointer"
            >
              <span>Thêm Video Mới</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar: Open editorial line */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-line">
        <div className="flex items-center gap-3 text-xs overflow-x-auto">
          <span className="text-muted">Cấp độ:</span>
          {LEVELS.map((l, idx) => (
            <React.Fragment key={l}>
              {idx > 0 && <span className="text-muted">·</span>}
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  level === l
                    ? 'text-ink font-semibold underline decoration-accent underline-offset-4'
                    : 'text-body hover:text-ink'
                }`}
              >
                {l}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-muted absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, công cụ, phòng ban..."
            className="w-full pl-6 pr-2 py-1 text-xs bg-transparent border-b border-line placeholder-muted text-ink focus:border-ink outline-none"
          />
        </div>
      </div>

      {/* Video Content Grid */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-paper-sunken rounded-md" />
                <div className="h-4 bg-paper-sunken rounded w-1/3" />
                <div className="h-5 bg-paper-sunken rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center max-w-lg mx-auto space-y-2">
            <h3 className="font-display text-lg text-ink font-medium">Không tìm thấy video phù hợp</h3>
            <p className="text-xs text-muted leading-relaxed">
              Chưa có video nào ở cấp độ <span className="text-ink font-medium">"{level}"</span>
              {searchQuery ? ` với từ khóa "${searchQuery}"` : ''}.
            </p>
            {(level !== 'Tất cả' || searchQuery) && (
              <button
                onClick={() => {
                  setLevel('Tất cả')
                  setSearchQuery('')
                }}
                className="mt-3 text-xs text-body hover:text-accent underline underline-offset-4 decoration-line transition-colors cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      <VideoFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}
