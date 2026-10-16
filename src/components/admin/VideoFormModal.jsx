import { useEffect, useMemo, useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Search,
  AlertCircle,
  Video,
  ListPlus,
  FileText
} from 'lucide-react'
import { createVideo, updateVideo, getPrompts } from '../../services/contentService'
import { generateSlug } from '../../services/sanitizationService'
import { parseYouTubeId, YouTubeIcon } from '../../utils/videoUtils'

const DEPARTMENT_OPTIONS = [
  'Ban Giám Đốc',
  'Tài chính - Kế toán',
  'Nhân sự',
  'Pháp chế',
  'Vận hành',
  'Chung'
]

const TOOL_OPTIONS = [
  'M365 Copilot',
  'Excel Copilot',
  'Word Copilot',
  'Teams',
  'ChatGPT / Claude'
]

const LEVEL_OPTIONS = ['Cơ bản', 'Trung cấp', 'Nâng cao']

const ACCENT_OPTIONS = [
  { label: 'Indigo Purple', value: 'from-indigo-500 to-purple-500' },
  { label: 'Emerald Teal', value: 'from-emerald-500 to-teal-500' },
  { label: 'Sky Indigo', value: 'from-sky-500 to-indigo-500' },
  { label: 'Amber Orange', value: 'from-amber-500 to-orange-500' },
  { label: 'Rose Pink', value: 'from-rose-500 to-pink-500' }
]

export default function VideoFormModal({ isOpen, onClose, initialVideo = null, onSaved }) {
  const isEdit = Boolean(initialVideo?.id)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0])
  const [tool, setTool] = useState(TOOL_OPTIONS[0])
  const [level, setLevel] = useState(LEVEL_OPTIONS[0])
  const [durationMinutes, setDurationMinutes] = useState(5)
  const [sourceUrl, setSourceUrl] = useState('')
  const [accent, setAccent] = useState(ACCENT_OPTIONS[0].value)
  const [chapters, setChapters] = useState([{ time: '00:00', title: 'Mở đầu' }])
  const [relatedPromptIds, setRelatedPromptIds] = useState([])
  const [transcript, setTranscript] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  // Prompts selector state
  const [availablePrompts, setAvailablePrompts] = useState([])
  const [promptSearchQuery, setPromptSearchQuery] = useState('')
  const [loadingPrompts, setLoadingPrompts] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Derive YouTube ID from current sourceUrl input
  const youtubeId = useMemo(() => parseYouTubeId(sourceUrl), [sourceUrl])

  // Initialize or reset form values
  useEffect(() => {
    if (!isOpen) return

    if (initialVideo) {
      setTitle(initialVideo.title || '')
      setSummary(initialVideo.summary || '')
      setDepartment(initialVideo.department || DEPARTMENT_OPTIONS[0])
      setTool(initialVideo.tool || TOOL_OPTIONS[0])
      setLevel(initialVideo.level || LEVEL_OPTIONS[0])
      setDurationMinutes(initialVideo.durationMinutes || 5)
      setSourceUrl(initialVideo.sourceUrl || initialVideo.source?.url || '')
      setAccent(initialVideo.accent || ACCENT_OPTIONS[0].value)
      setChapters(
        Array.isArray(initialVideo.chapters) && initialVideo.chapters.length > 0
          ? initialVideo.chapters.map((c) => ({ time: c.time || '00:00', title: c.title || '' }))
          : [{ time: '00:00', title: 'Mở đầu' }]
      )
      setRelatedPromptIds(
        Array.isArray(initialVideo.relatedPromptIds)
          ? initialVideo.relatedPromptIds
          : (Array.isArray(initialVideo.related_prompt_ids) ? initialVideo.related_prompt_ids : [])
      )
      setTranscript(initialVideo.transcript || '')
      setTagsInput(Array.isArray(initialVideo.tags) ? initialVideo.tags.join(', ') : '')
    } else {
      setTitle('')
      setSummary('')
      setDepartment(DEPARTMENT_OPTIONS[0])
      setTool(TOOL_OPTIONS[0])
      setLevel(LEVEL_OPTIONS[0])
      setDurationMinutes(5)
      setSourceUrl('')
      setAccent(ACCENT_OPTIONS[0].value)
      setChapters([{ time: '00:00', title: 'Mở đầu' }])
      setRelatedPromptIds([])
      setTranscript('')
      setTagsInput('')
    }
  }, [isOpen, initialVideo])

  // Fetch prompts list for related prompts selection
  useEffect(() => {
    if (!isOpen) return
    let active = true
    setLoadingPrompts(true)
    getPrompts()
      .then((prompts) => {
        if (active) {
          setAvailablePrompts(Array.isArray(prompts) ? prompts : [])
          setLoadingPrompts(false)
        }
      })
      .catch(() => {
        if (active) setLoadingPrompts(false)
      })
    return () => {
      active = false
    }
  }, [isOpen])

  if (!isOpen) return null

  // Chapter management handlers
  const handleAddChapter = () => {
    setChapters((prev) => [...prev, { time: '00:00', title: '' }])
  }

  const handleRemoveChapter = (index) => {
    setChapters((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleChapterChange = (index, field, value) => {
    setChapters((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // Related prompt selection toggle
  const handleTogglePrompt = (promptId) => {
    setRelatedPromptIds((prev) =>
      prev.includes(promptId) ? prev.filter((id) => id !== promptId) : [...prev, promptId]
    )
  }

  // Filter available prompts for picker
  const filteredPrompts = availablePrompts.filter((p) => {
    if (!promptSearchQuery) return true
    const q = promptSearchQuery.toLowerCase()
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.tool && p.tool.toLowerCase().includes(q))
    )
  })

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanTitle = title.trim()
    if (!cleanTitle) {
      setError('Vui lòng nhập tiêu đề video.')
      return
    }

    const cleanSummary = summary.trim()
    if (!cleanSummary) {
      setError('Vui lòng nhập tóm tắt ngắn cho video.')
      return
    }

    const validChapters = chapters
      .map((c) => ({
        time: (c.time || '00:00').trim(),
        title: (c.title || '').trim()
      }))
      .filter((c) => c.title)

    if (validChapters.length === 0) {
      setError('Vui lòng tạo ít nhất 1 Chapter với tiêu đề.')
      return
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: cleanTitle,
      slug: initialVideo?.slug || generateSlug(cleanTitle),
      summary: cleanSummary,
      department,
      tool,
      level,
      durationMinutes: Math.max(1, parseInt(durationMinutes, 10) || 5),
      sourceType: youtubeId ? 'youtube' : (sourceUrl ? 'embed' : 'placeholder'),
      sourceUrl: sourceUrl.trim(),
      accent,
      chapters: validChapters,
      relatedPromptIds,
      transcript: transcript.trim(),
      tags: parsedTags
    }

    setSubmitting(true)
    try {
      let savedVideo
      if (isEdit) {
        savedVideo = await updateVideo(initialVideo.id, payload)
      } else {
        savedVideo = await createVideo(payload)
      }
      onSaved?.(savedVideo)
      onClose()
    } catch (err) {
      setError(err.message || 'Không thể lưu video. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fade-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? `Chỉnh sửa Video: ${initialVideo.id || ''}` : 'Thêm Video Học Tập Mới'}
              </h2>
              <p className="text-xs text-slate-500">
                Hệ thống nhúng YouTube tự động trích xuất Video ID và hỗ trợ Interactive Chapters.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Thông tin chung
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiêu đề video <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Viết báo cáo tuần cho lãnh đạo với M365 Copilot trong 5 phút"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tóm tắt nội dung <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tóm tắt ngắn 1-2 câu về giá trị bài học và đối tượng cần xem..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng ban</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500 text-slate-800"
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Công cụ AI</label>
                <select
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500 text-slate-800"
                >
                  {TOOL_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cấp độ</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500 text-slate-800"
                >
                  {LEVEL_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thời lượng (phút)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-slate-800"
                  />
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: YouTube Link & Thumbnail Preview */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <YouTubeIcon className="w-3.5 h-3.5 text-rose-600" />
              Nguồn Video & Nhúng YouTube
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Đường dẫn YouTube (Watch URL / Share URL / Embed URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-slate-900"
                />
                <YouTubeIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tự động hỗ trợ các định dạng: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
              </p>
            </div>

            {/* Live YouTube Preview Card */}
            {youtubeId ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="relative aspect-video w-full sm:w-48 rounded-lg overflow-hidden bg-slate-900 shadow-sm shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                    alt="YouTube Thumbnail Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <YouTubeIcon className="w-8 h-8 text-rose-500 drop-shadow" />
                  </div>
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Đã nhận diện YouTube Video ID: <strong className="font-mono">{youtubeId}</strong>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Trình phát sẽ được nhúng qua tên miền bảo mật <span className="font-mono text-slate-700">youtube-nocookie.com</span> với API tua Interactive Chapters tức thì.
                  </p>
                </div>
              </div>
            ) : sourceUrl ? (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                Không nhận diện được ID YouTube từ link này. Video sẽ được coi là link nhúng Embed thông thường.
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-500 text-xs flex items-center justify-between">
                <span>Chưa nhập link video. Sẽ sử dụng giao diện Thumbnail màu chuẩn (Placeholder).</span>
                <select
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-slate-200 bg-white"
                >
                  {ACCENT_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      Màu: {a.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 3: Dynamic Chapters Manager */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ListPlus className="w-3.5 h-3.5 text-indigo-600" />
                  Interactive Chapters (Các mốc bài giảng)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bấm vào mốc thời gian để người xem tua video trực tiếp đến phân đoạn đó.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddChapter}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Chapter
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/80 group"
                >
                  <span className="text-[11px] font-mono font-bold text-slate-400 w-5 text-center">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={chapter.time}
                    onChange={(e) => handleChapterChange(index, 'time', e.target.value)}
                    placeholder="MM:SS (02:30)"
                    className="w-24 px-2.5 py-1.5 text-xs font-mono rounded border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                    placeholder="Tiêu đề phân đoạn..."
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-500 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(index)}
                    disabled={chapters.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    title="Xóa chapter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Related Prompts Selection */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Công thức Prompt đi kèm bài giảng
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn các Prompt hiển thị bên cạnh video để người học vừa xem vừa copy thực hành ngay.
              </p>
            </div>

            {/* Selected Prompts Badges */}
            {relatedPromptIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Đã chọn ({relatedPromptIds.length}):</span>
                {relatedPromptIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-mono font-semibold"
                  >
                    {id}
                    <button
                      type="button"
                      onClick={() => handleTogglePrompt(id)}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                value={promptSearchQuery}
                onChange={(e) => setPromptSearchQuery(e.target.value)}
                placeholder="Tìm prompt theo mã ID, tiêu đề, phòng ban..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Prompts Checkbox List */}
            <div className="max-h-40 overflow-y-auto border border-slate-200/80 rounded-lg divide-y divide-slate-100">
              {loadingPrompts ? (
                <div className="p-3 text-xs text-slate-400 text-center">Đang tải danh sách prompts...</div>
              ) : filteredPrompts.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">Không tìm thấy prompt phù hợp.</div>
              ) : (
                filteredPrompts.map((p) => {
                  const isChecked = relatedPromptIds.includes(p.id)
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center gap-2.5 px-3 py-2 text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePrompt(p.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-mono font-bold text-slate-500 text-[11px] w-16 shrink-0">
                        {p.id}
                      </span>
                      <span className="font-medium text-slate-900 truncate flex-1">{p.title}</span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {p.department} · {p.tool}
                      </span>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          {/* Section 5: Transcript & Tags */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bản ghi nội dung (Transcript / Ghi chú bài giảng)
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Nội dung lời thoại hoặc dàn ý tóm lược bài giảng để người học dễ đọc lại..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-slate-800 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Từ khóa tìm kiếm (Tags, cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="VD: excel, p&l, ngan sach, copilot"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật Video' : 'Xuất bản Video Mới'}
          </button>
        </div>
      </div>
    </div>
  )
}
