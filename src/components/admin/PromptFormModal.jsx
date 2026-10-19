import React, { useEffect, useMemo, useState } from 'react'
import { X, Check } from 'lucide-react'
import { createPrompt, updatePrompt } from '../../services/contentService'
import {
  scanPromptPayload,
  sanitizePromptPayload,
  extractVariablesFromTemplate,
  generateSlug
} from '../../services/sanitizationService'

const DEPARTMENT_OPTIONS = [
  'Ban Giám Đốc',
  'Tài chính - Kế toán',
  'Nhân sự',
  'Pháp chế',
  'Vận hành'
]

const TOOL_OPTIONS = [
  'M365 Copilot',
  'Excel Copilot',
  'Word Copilot',
  'Teams',
  'ChatGPT / Claude'
]

const DIFFICULTY_OPTIONS = ['Cơ bản', 'Trung cấp', 'Nâng cao']

export default function PromptFormModal({ isOpen, onClose, initialPrompt = null, onSaved }) {
  const isEdit = Boolean(initialPrompt?.id)

  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0])
  const [tool, setTool] = useState(TOOL_OPTIONS[0])
  const [difficulty, setDifficulty] = useState('Trung cấp')
  const [summary, setSummary] = useState('')
  const [promptTemplate, setPromptTemplate] = useState('')
  const [whyEffective, setWhyEffective] = useState('')
  const [inputSample, setInputSample] = useState('')
  const [outputSample, setOutputSample] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  // Smart R-C-T-C-F Builder helper state
  const [showRctcfBuilder, setShowRctcfBuilder] = useState(false)
  const [rctcf, setRctcf] = useState({
    role: '',
    context: '',
    task: '',
    constraints: '',
    format: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setError('')
    if (initialPrompt) {
      setTitle(initialPrompt.title || '')
      setDepartment(initialPrompt.department || DEPARTMENT_OPTIONS[0])
      setTool(initialPrompt.tool || TOOL_OPTIONS[0])
      setDifficulty(initialPrompt.difficulty || 'Trung cấp')
      setSummary(initialPrompt.summary || '')
      setPromptTemplate(initialPrompt.promptTemplate || '')
      setWhyEffective(initialPrompt.whyEffective || '')
      setInputSample(initialPrompt.inputSample || '')
      setOutputSample(initialPrompt.outputSample || '')
      setTagsInput(Array.isArray(initialPrompt.tags) ? initialPrompt.tags.join(', ') : '')
      setShowRctcfBuilder(false)
    } else {
      setTitle('')
      setDepartment(DEPARTMENT_OPTIONS[0])
      setTool(TOOL_OPTIONS[0])
      setDifficulty('Trung cấp')
      setSummary('')
      setPromptTemplate('')
      setWhyEffective('')
      setInputSample('')
      setOutputSample('')
      setTagsInput('')
      setRctcf({ role: '', context: '', task: '', constraints: '', format: '' })
      setShowRctcfBuilder(true)
    }
  }, [isOpen, initialPrompt])

  const detectedVariables = useMemo(
    () => extractVariablesFromTemplate(promptTemplate),
    [promptTemplate]
  )

  const currentPayload = useMemo(
    () => ({
      title,
      department,
      tool,
      difficulty,
      slug: initialPrompt?.slug || generateSlug(title),
      summary,
      promptTemplate,
      variables: detectedVariables,
      whyEffective,
      inputSample,
      outputSample,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }),
    [title, department, tool, difficulty, initialPrompt, summary, promptTemplate, detectedVariables, whyEffective, inputSample, outputSample, tagsInput]
  )

  const piiReport = useMemo(() => scanPromptPayload(currentPayload), [currentPayload])

  if (!isOpen) return null

  const applyRctcfToTemplate = () => {
    const blocks = []
    if (rctcf.role.trim()) blocks.push(`Đóng vai trò là ${rctcf.role.trim()}.`)
    if (rctcf.context.trim()) blocks.push(`Bối cảnh: ${rctcf.context.trim()}`)
    if (rctcf.task.trim()) blocks.push(`Nhiệm vụ:\n${rctcf.task.trim()}`)
    if (rctcf.constraints.trim()) blocks.push(`Ràng buộc bắt buộc:\n${rctcf.constraints.trim()}`)
    if (rctcf.format.trim()) blocks.push(`Định dạng đầu ra:\n${rctcf.format.trim()}`)

    if (blocks.length > 0) {
      setPromptTemplate(blocks.join('\n\n'))
      if (!whyEffective.trim()) {
        setWhyEffective(
          'Áp dụng cấu trúc 5 thành tố R-C-T-C-F giúp định hình rõ vai trò chuyên gia, cung cấp đủ ngữ cảnh đầu vào và khóa chặt định dạng đầu ra chuẩn doanh nghiệp.'
        )
      }
    }
  }

  const handleAutoSanitize = () => {
    const cleaned = sanitizePromptPayload(currentPayload)
    setTitle(cleaned.title)
    setSummary(cleaned.summary)
    setPromptTemplate(cleaned.promptTemplate)
    setWhyEffective(cleaned.whyEffective)
    setInputSample(cleaned.inputSample)
    setOutputSample(cleaned.outputSample)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !promptTemplate.trim()) {
      setError('Vui lòng nhập đầy đủ Tiêu đề và Nội dung câu lệnh (Prompt Template).')
      return
    }

    if (!piiReport.clean) {
      setError('Vui lòng bấm "Ẩn danh tự động" để loại bỏ dữ liệu nhạy cảm (PII) trước khi lưu.')
      return
    }

    setSubmitting(true)
    try {
      const saved = isEdit
        ? await updatePrompt(initialPrompt.id, currentPayload)
        : await createPrompt(currentPayload)
      onSaved?.(saved)
      onClose()
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu Prompt.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                Smart R-C-T-C-F Studio
              </span>
              {isEdit && (
                <span className="text-xs font-mono font-semibold text-slate-500">#{initialPrompt.id}</span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {isEdit ? 'Chỉnh sửa Công thức Prompt' : 'Tạo Công thức Prompt Mới'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Real-time Data Sanitization Guardrail Banner */}
          {!piiReport.clean ? (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-900">
                <p className="font-bold">Cảnh báo Data Sanitization: Phát hiện {piiReport.findings.length} thông tin nhạy cảm (PII)!</p>
                <ul className="mt-1 space-y-0.5 text-[11px] list-disc list-inside text-slate-700">
                  {piiReport.findings.slice(0, 4).map((f, idx) => (
                    <li key={idx}>
                      <strong>{f.field}</strong>: Phát hiện {f.label} (<code className="bg-slate-200 px-1 rounded">{f.match}</code>) → Gợi ý thay bằng <code className="bg-white px-1 rounded border border-slate-200">{f.suggestion}</code>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={handleAutoSanitize}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
              >
                Ẩn danh tự động
              </button>
            </div>
          ) : (
            <div className="px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-slate-700" />
                Kiểm duyệt Data Sanitization: An toàn (Không phát hiện Email thật, SĐT hay IP nội bộ).
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Slug: /{currentPayload.slug || '...'}
              </span>
            </div>
          )}

          {/* Basic Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-800 mb-1">Tiêu đề bài toán *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Phân tích Biến động Chi phí Vận hành Tháng..."
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Phòng ban *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-indigo-600 outline-none"
              >
                {DEPARTMENT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Công cụ AI khuyến nghị</label>
              <select
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-indigo-600 outline-none"
              >
                {TOOL_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Độ khó</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:border-indigo-600 outline-none"
              >
                {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Tóm tắt giá trị (Summary) *</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Mô tả ngắn gọn trong 1-2 câu công thức này giải quyết nỗi đau gì..."
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-600 outline-none"
            />
          </div>

          {/* R-C-T-C-F Guided Context Assistant */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Trợ lý Xây dựng Ngữ cảnh Chuẩn R-C-T-C-F (Giải quyết bài toán thiếu Context)
              </span>
              <button
                type="button"
                onClick={() => setShowRctcfBuilder(!showRctcfBuilder)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
              >
                {showRctcfBuilder ? 'Thu gọn bộ gợi ý' : 'Mở bộ gợi ý 5 thành tố'}
              </button>
            </div>

            {showRctcfBuilder && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      1. Role (Đóng vai chuyên gia nào?)
                    </label>
                    <input
                      value={rctcf.role}
                      onChange={(e) => setRctcf({ ...rctcf, role: e.target.value })}
                      placeholder="VD: Giám đốc Tài chính (CFO) 15 năm kinh nghiệm..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      2. Context (Bối cảnh & Dữ liệu đầu vào có biến [BIẾN])
                    </label>
                    <input
                      value={rctcf.context}
                      onChange={(e) => setRctcf({ ...rctcf, context: e.target.value })}
                      placeholder="VD: Dựa trên báo cáo [BÁO_CÁO_QUÝ] của bộ phận [PHÒNG_BAN]..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    3. Task (Các bước nhiệm vụ cụ thể cần AI thực hiện)
                  </label>
                  <textarea
                    rows={2}
                    value={rctcf.task}
                    onChange={(e) => setRctcf({ ...rctcf, task: e.target.value })}
                    placeholder="VD: Phân tích 3 nguyên nhân gây lệch ngân sách và đề xuất phương án cắt giảm..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      4. Constraints (Ràng buộc & Những điều cấm)
                    </label>
                    <input
                      value={rctcf.constraints}
                      onChange={(e) => setRctcf({ ...rctcf, constraints: e.target.value })}
                      placeholder="VD: Không suy diễn số liệu, tối đa 400 từ, văn phong súc tích..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      5. Format (Định dạng bảng biểu / đầu ra mong muốn)
                    </label>
                    <input
                      value={rctcf.format}
                      onChange={(e) => setRctcf({ ...rctcf, format: e.target.value })}
                      placeholder="VD: Xuất bảng Markdown gồm 4 cột: Hạng mục, Chênh lệch, Rủi ro, Hành động..."
                      className="w-full text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={applyRctcfToTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                  >
                    Ghép 5 thành tố vào Câu lệnh chính
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Prompt Template + Auto Variable Extractor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                Nội dung Câu lệnh (Prompt Template) * — Dùng <code className="text-slate-900 font-semibold">[TÊN_BIẾN]</code> để tạo ô điền tự động
              </label>
              <span className="text-[11px] text-slate-500">
                Tự động nhận diện <strong>{detectedVariables.length}</strong> biến số
              </span>
            </div>
            <textarea
              rows={6}
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              required
              placeholder="Đóng vai trò là... Hãy phân tích [DỮ_LIỆU_ĐẦU_VÀO] theo mục tiêu [MỤC_TIÊU]..."
              className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none leading-relaxed"
            />
            {detectedVariables.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-medium text-slate-500">Biến động tự tách:</span>
                {detectedVariables.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                    [{v}]
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Before / After & Why Effective */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Ví dụ Đầu vào (Input Sample)</label>
              <textarea
                rows={3}
                value={inputSample}
                onChange={(e) => setInputSample(e.target.value)}
                placeholder="Mô tả dữ liệu mẫu đầu vào (đã ẩn danh PII)..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Kết quả Mẫu (Output Sample)</label>
              <textarea
                rows={3}
                value={outputSample}
                onChange={(e) => setOutputSample(e.target.value)}
                placeholder="Mô tả kết quả chuẩn do AI sinh ra..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Vì sao công thức này hiệu quả?</label>
              <input
                value={whyEffective}
                onChange={(e) => setWhyEffective(e.target.value)}
                placeholder="Giải thích ngắn gọn kỹ thuật Prompt đã áp dụng..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Tags (cách nhau bằng dấu phẩy)</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="VD: bao cao, tai chinh, copilot, rctcf"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-xs text-slate-900 font-medium">
              {error}
            </div>
          )}

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              {submitting ? 'Đang lưu vào PostgreSQL…' : isEdit ? 'Lưu thay đổi' : 'Xuất bản Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
