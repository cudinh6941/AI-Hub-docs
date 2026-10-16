import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Play,
  Info,
  Clock,
  Sparkles,
  Edit3,
  Trash2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getVideoBySlug, deleteVideo, getPrompts } from '../services/contentService'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import DocRecipeCard from '../components/DocRecipeCard'
import VideoFormModal from '../components/admin/VideoFormModal'
import { parseYouTubeId, parseTimeToSeconds, YouTubeIcon } from '../utils/videoUtils'

// Re-export helpers for backward compatibility & tests
export { parseYouTubeId, parseTimeToSeconds }

export default function VideoPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const iframeRef = useRef(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const { data: video, loading } = useContent(() => getVideoBySlug(slug), [slug, refreshKey])

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated())
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Interactive Chapters state
  const [activeChapterIndex, setActiveChapterIndex] = useState(null)

  // Fallback prompts if relatedPrompts not populated by API
  const [allPrompts, setAllPrompts] = useState([])

  // Transcript copied feedback
  const [transcriptCopied, setTranscriptCopied] = useState(false)

  useEffect(() => {
    return subscribeAdminAuth(setIsAdmin)
  }, [])

  // Lazy load prompts if needed for related prompts fallback
  useEffect(() => {
    if (video && (!video.relatedPrompts || video.relatedPrompts.length === 0) && (video.relatedPromptIds || []).length > 0) {
      getPrompts().then((prompts) => {
        if (Array.isArray(prompts)) setAllPrompts(prompts)
      }).catch(() => {})
    }
  }, [video])

  // Extract YouTube ID if valid link
  const rawUrl = video?.sourceUrl || video?.source?.url || ''
  const youtubeId = useMemo(() => parseYouTubeId(rawUrl), [rawUrl])
  const isEmbed = Boolean(!youtubeId && video?.source?.type === 'embed' && rawUrl)

  // Compute resolved related prompts
  const resolvedRelatedPrompts = useMemo(() => {
    if (!video) return []
    if (Array.isArray(video.relatedPrompts) && video.relatedPrompts.length > 0) {
      return video.relatedPrompts
    }
    const ids = video.relatedPromptIds || []
    if (ids.length === 0 || allPrompts.length === 0) return []
    return allPrompts.filter((p) => ids.includes(p.id))
  }, [video, allPrompts])

  // Interactive Chapter Click: convert time to seconds & postMessage to YouTube IFrame
  const handleChapterClick = (chapter, index) => {
    setActiveChapterIndex(index)
    const seconds = parseTimeToSeconds(chapter.time)

    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Standard YouTube IFrame API seek command
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [seconds, true]
        }),
        '*'
      )
    }
  }

  // Handle Video Deletion
  const handleDelete = async () => {
    if (!video) return
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa video "${video.title}" không?\nHành động này không thể hoàn tác.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteVideo(video.id)
      navigate('/learn')
    } catch (err) {
      alert(err.message || 'Không thể xóa video. Vui lòng kiểm tra quyền Admin.')
      setDeleting(false)
    }
  }

  // Handle Transcript Copy
  const handleCopyTranscript = () => {
    if (!video?.transcript) return
    navigator.clipboard.writeText(video.transcript)
    setTranscriptCopied(true)
    setTimeout(() => setTranscriptCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-medium">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          Đang tải nội dung video học tập…
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy video</h1>
        <p className="text-xs text-slate-500 mb-5">Video bạn đang tìm kiếm có thể đã bị xóa hoặc đổi đường dẫn.</p>
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          ← Về trang học tập
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation & Admin Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
          <Link to="/" className="hover:text-slate-900 shrink-0">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to="/learn" className="hover:text-slate-900 shrink-0">
            Học tập
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-slate-900 font-medium truncate">{video.title}</span>
        </nav>

        {/* Admin Action Buttons */}
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              Admin Mode
            </span>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Chỉnh sửa Video
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 shadow-2xs transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? 'Đang xóa...' : 'Xóa Video'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8 min-w-0 animate-fade-up delay-100">
          {/* Video Player Display: YouTube IFrame or Embed or Gradient Hero */}
          {youtubeId ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black shadow-sm group">
              <iframe
                ref={iframeRef}
                id="youtube-player"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&rel=0`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : isEmbed ? (
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black shadow-sm">
              <iframe
                src={video.source.url}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className={`relative aspect-video rounded-xl bg-gradient-to-br ${
                video.accent || 'from-indigo-500 to-purple-500'
              } flex flex-col items-center justify-center text-white shadow-sm`}
            >
              <div className="absolute inset-0 dot-pattern opacity-20 rounded-xl" />
              <div className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
              </div>
              <p className="relative mt-4 text-xs bg-slate-900/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-white/90">
                <Info className="w-3.5 h-3.5" /> Video sẽ được nhúng từ{' '}
                {video.source?.provider || 'YouTube'}
              </p>
            </div>
          )}

          {/* Video Header & Meta */}
          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {video.department}
              </span>
              <span>·</span>
              <span className="font-medium text-slate-700">{video.tool}</span>
              <span>·</span>
              <span>{video.level}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {video.durationMinutes} phút
              </span>
              {youtubeId && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                    <YouTubeIcon className="w-3.5 h-3.5" />
                    YouTube HD
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {video.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">{video.summary}</p>
          </header>

          {/* Interactive Chapters Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Nội dung & Mốc thời gian (Interactive Chapters)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bấm vào bất kỳ dòng nào bên dưới để tua video tới đúng đoạn cần xem.
                </p>
              </div>
            </div>

            {Array.isArray(video.chapters) && video.chapters.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
                {video.chapters.map((chapter, idx) => {
                  const isActive = activeChapterIndex === idx
                  return (
                    <div
                      key={`${chapter.time}-${idx}`}
                      onClick={() => handleChapterClick(chapter, idx)}
                      className={`flex items-center justify-between px-4 py-3 text-xs cursor-pointer transition-all duration-200 group ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-950 font-semibold border-l-4 border-indigo-600 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded transition-colors ${
                            isActive
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                          }`}
                        >
                          {chapter.time}
                        </span>
                        <span className="truncate group-hover:text-indigo-600 transition-colors">
                          {chapter.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-3">
                        <span className="text-[11px] text-slate-400 group-hover:text-indigo-600 transition-colors hidden sm:inline">
                          {isActive ? 'Đang xem' : 'Tua tới đây'}
                        </span>
                        <Play
                          className={`w-3.5 h-3.5 ${
                            isActive
                              ? 'text-indigo-600'
                              : 'text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all'
                          }`}
                          fill={isActive ? 'currentColor' : 'none'}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa có phân đoạn chapters cho video này.</p>
            )}
          </section>

          {/* Transcript Section */}
          {video.transcript && (
            <section className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Bản ghi tóm tắt (Transcript)</h2>
                <button
                  onClick={handleCopyTranscript}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    transcriptCopied
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/70'
                  }`}
                  title="Sao chép toàn bộ bản ghi"
                >
                  {transcriptCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao chép bản ghi</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {video.transcript}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Related Prompt Recipes */}
        <aside className="lg:col-span-1 animate-fade-up delay-200">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Công thức Prompt đi kèm
              </h2>
              {resolvedRelatedPrompts.length > 0 && (
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {resolvedRelatedPrompts.length}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Mỗi video đi kèm câu lệnh chuẩn hóa để bạn áp dụng trực tiếp vào công việc:
            </p>

            {resolvedRelatedPrompts.length > 0 ? (
              <div className="space-y-3.5">
                {resolvedRelatedPrompts.map((p) => (
                  <DocRecipeCard key={p.id} prompt={p} />
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50/50">
                <p className="text-xs text-slate-500">Chưa có công thức prompt nào liên kết trực tiếp với bài học này.</p>
                <Link
                  to="/prompts"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-2"
                >
                  Khám phá kho Prompt Hub <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Admin Edit Video Modal */}
      {isAdmin && isEditModalOpen && (
        <VideoFormModal
          isOpen={isEditModalOpen}
          initialVideo={video}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={(savedVideo) => {
            setIsEditModalOpen(false)
            if (savedVideo?.slug && savedVideo.slug !== slug) {
              navigate(`/learn/${savedVideo.slug}`)
            } else {
              setRefreshKey((k) => k + 1)
            }
          }}
        />
      )}
    </div>
  )
}
