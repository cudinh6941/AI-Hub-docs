import { useMemo, useState, useEffect } from 'react'
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            <span>Tài liệu đào tạo nội bộ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Video Học Tập & Hướng Dẫn
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Video ngắn từ 5 đến 10 phút hướng dẫn sử dụng AI trong thực tế doanh nghiệp. Mỗi bài học đều có công thức prompt đi kèm để bạn sao chép và làm theo ngay.
          </p>
        </div>

        {/* Admin Create Video Button */}
        {isAdmin && (
          <div className="shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>Thêm Video Mới</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 animate-fade-up delay-100">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit overflow-x-auto">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                level === l ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, công cụ, phòng ban..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white text-slate-800"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Video Content Grid */}
      <div className="animate-fade-up delay-200">
        {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden p-4 space-y-3"
            >
              <div className="aspect-video bg-slate-100 rounded-lg" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-5 bg-slate-100 rounded w-4/5" />
              <div className="h-3 bg-slate-50 rounded w-full" />
            </div>
          ))}
        </div>
      ) : list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-12 text-center max-w-lg mx-auto">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Không tìm thấy video phù hợp</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Chưa có video nào ở cấp độ <span className="font-semibold text-slate-700">"{level}"</span>
            {searchQuery ? ` với từ khóa "${searchQuery}"` : ''}.
          </p>
          {(level !== 'Tất cả' || searchQuery) && (
            <button
              onClick={() => {
                setLevel('Tất cả')
                setSearchQuery('')
              }}
              className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
      </div>

      {/* Admin Video Form Modal (Create) */}
      {isAdmin && isCreateModalOpen && (
        <VideoFormModal
          isOpen={isCreateModalOpen}
          initialVideo={null}
          onClose={() => setIsCreateModalOpen(false)}
          onSaved={() => {
            setIsCreateModalOpen(false)
            setRefreshKey((k) => k + 1)
          }}
        />
      )}
    </div>
  )
}
