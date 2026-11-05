import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Play,
  Copy,
  Check
} from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getVideoBySlug, deleteVideo, getPrompts } from '../services/contentService'
import { isAdminAuthenticated, subscribeAdminAuth } from '../services/authService'
import DocRecipeCard from '../components/DocRecipeCard'
import VideoFormModal from '../components/admin/VideoFormModal'
import { parseYouTubeId, parseTimeToSeconds } from '../utils/videoUtils'

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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-muted">
        Đang tải nội dung video học tập…
      </div>
    )
  }

  if (!video) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-medium text-ink mb-2">Không tìm thấy video</h1>
        <p className="text-sm text-body mb-6">Video bạn đang tìm kiếm có thể đã bị xóa hoặc đổi đường dẫn.</p>
        <Link
          to="/learn"
          className="text-sm font-semibold text-ink hover:text-accent underline underline-offset-4 decoration-line transition-colors"
        >
          ← Về trang học tập
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation & Admin Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <nav className="flex items-center gap-2 text-xs text-muted min-w-0">
          <Link to="/" className="hover:text-ink shrink-0">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/learn" className="hover:text-ink shrink-0">
            Học tập
          </Link>
          <span>/</span>
          <span className="text-ink font-medium truncate">{video.title}</span>
        </nav>

        {/* Admin Action Buttons */}
        {isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-line text-body hover:border-ink hover:text-ink transition-colors"
            >
              Chỉnh sửa Video
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-paper-sunken border border-line text-body hover:bg-ink hover:text-white transition-colors disabled:opacity-50"
            >
              {deleting ? 'Đang xóa...' : 'Xóa Video'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10 min-w-0">
          {/* Video Player Display */}
          {youtubeId ? (
            <div className="relative aspect-video rounded-md overflow-hidden border border-line bg-black">
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
            <div className="aspect-video rounded-md overflow-hidden border border-line bg-black">
              <iframe
                src={video.source.url}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-md bg-ink flex flex-col items-center justify-center text-white">
              <div className="w-14 h-14 rounded-full bg-paper flex items-center justify-center text-ink">
                <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
              </div>
              <p className="mt-4 text-xs font-mono text-muted">
                Nguồn phát: {video.source?.provider || 'SharePoint / Stream'}
              </p>
            </div>
          )}

          {/* Video Header & Meta */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-medium text-ink">
                {video.department}
              </span>
              <span>·</span>
              <span>{video.tool}</span>
              <span>·</span>
              <span>{video.level}</span>
              <span>·</span>
              <span>{video.durationMinutes} phút</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink tracking-tight leading-snug">
              {video.title}
            </h1>
            <p className="text-sm text-body leading-relaxed">{video.summary}</p>
          </header>

          {/* Interactive Chapters Section */}
          <section className="border-t border-line pt-8 space-y-4">
            <div>
              <h2 className="font-display text-xl text-ink font-medium">
                Nội dung và mốc thời gian
              </h2>
              <p className="text-xs text-muted mt-1">
                Bấm vào dòng bất kỳ để tua video tới đoạn tương ứng.
              </p>
            </div>

            {Array.isArray(video.chapters) && video.chapters.length > 0 ? (
              <div className="border-t border-line divide-y divide-line">
                {video.chapters.map((chapter, idx) => {
                  const isActive = activeChapterIndex === idx
                  return (
                    <div
                      key={`${chapter.time}-${idx}`}
                      onClick={() => handleChapterClick(chapter, idx)}
                      className={`flex items-center justify-between py-3 text-xs cursor-pointer transition-colors ${
                        isActive
                          ? 'border-l-2 border-accent pl-3 text-ink font-semibold'
                          : 'border-l-2 border-transparent pl-3 text-body hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-muted">
                          {chapter.time}
                        </span>
                        <span className="truncate">
                          {chapter.title}
                        </span>
                      </div>

                      <div className="text-[11px] text-muted shrink-0 ml-3">
                        {isActive ? 'Đang xem' : 'Tua tới đây'}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-muted italic">Chưa có phân đoạn cho video này.</p>
            )}
          </section>

          {/* Transcript Section */}
          {video.transcript && (
            <section className="border-t border-line pt-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-ink font-medium">Bản ghi tóm tắt</h2>
                <button
                  onClick={handleCopyTranscript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-line text-body hover:border-ink hover:text-ink transition-colors cursor-pointer"
                  title="Sao chép toàn bộ bản ghi"
                >
                  {transcriptCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép bản ghi</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 rounded-md bg-paper-sunken border border-line text-sm text-body leading-relaxed font-sans whitespace-pre-line">
                {video.transcript}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Related Prompt Recipes */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-6 border-t lg:border-t-0 lg:border-l border-line lg:pl-8 pt-8 lg:pt-0">
            <div>
              <h2 className="font-display text-xl text-ink font-medium">
                Công thức đi kèm
              </h2>
              <p className="text-xs text-muted mt-1">
                Áp dụng trực tiếp vào công việc hàng ngày.
              </p>
            </div>

            {resolvedRelatedPrompts.length > 0 ? (
              <div className="border-t border-line">
                {resolvedRelatedPrompts.map((p) => (
                  <DocRecipeCard key={p.id} prompt={p} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted">
                <p>Chưa có công thức prompt liên kết với bài học này.</p>
                <Link
                  to="/prompts"
                  className="inline-block text-xs font-medium text-body hover:text-accent underline underline-offset-4 decoration-line mt-2"
                >
                  Xem toàn bộ thư viện
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
