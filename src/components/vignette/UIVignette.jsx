/**
 * Modern SVG Cursor pointer targeting the Enter/Send button
 */
function Cursor({ className = '' }) {
  return (
    <div
      className={`vig-cursor pointer-events-none absolute z-40 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-4 h-4 text-ink drop-shadow-md"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="white"
        strokeWidth="1.5"
      >
        <path d="M4.5 2.5l6.5 17 2.8-6.2 6.2-2.8-15.5-8z" />
      </svg>
    </div>
  )
}

/**
 * 4-Point AI Sparkle Icon (Copilot / Gemini style)
 */
function SparkleIcon({ className = 'w-3.5 h-3.5 text-accent' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
    </svg>
  )
}

/**
 * Animated Prompt Input Bar:
 * 1) Types the prompt with a live caret
 * 2) Cursor moves to Enter/Send button & presses it
 * 3) Clears to placeholder while the message moves up into chat
 */
function PromptComposer({ promptText, placeholder, accentColor = 'bg-slate-800', isActive }) {
  return (
    <div className="relative flex items-center justify-between bg-slate-100/95 border border-slate-200/80 rounded-full pl-2.5 pr-1 py-1 text-[9px] gap-1.5 overflow-hidden">
      <div className="relative flex-1 min-w-0 h-3.5 flex items-center">
        {/* Resting placeholder */}
        <span className="text-slate-400 truncate block w-full">{placeholder}</span>

        {/* Active typing overlay */}
        {isActive && (
          <div className="vig-typing-wrap absolute inset-0 bg-slate-100 flex items-center">
            <span className="vig-typing-text text-slate-900 font-medium truncate inline-flex items-center">
              {promptText}
              <span className="inline-block w-[1.5px] h-3 bg-accent ml-0.5 shrink-0 animate-pulse" />
            </span>
          </div>
        )}
      </div>

      {/* Enter / Send Button */}
      <div
        className={`vig-send-btn w-4 h-4 rounded-full ${accentColor} text-white flex items-center justify-center shrink-0 shadow-2xs`}
        title="Enter"
      >
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

/**
 * 1. Excel Copilot Vignette
 * Real Excel spreadsheet background + floating Copilot panel analyzing Cloud cost
 */
function ExcelVignette({ isActive }) {
  return (
    <div className="relative w-full h-full bg-[#F4F6F4] p-2.5 sm:p-3 overflow-hidden select-none font-sans">
      {/* Background Excel Window (Left side) */}
      <div className="w-[66%] h-full bg-white rounded-lg border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
        {/* Excel App Header */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#107C41] text-white">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] tracking-tight bg-white text-[#107C41] w-3.5 h-3.5 rounded flex items-center justify-center font-mono">
              X
            </span>
            <span className="text-[10px] font-medium truncate">P&L_Q3_ChiPhi.xlsx</span>
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Formula Bar */}
        <div className="flex items-center px-2 py-0.5 bg-slate-50 border-b border-slate-200 text-[9px] text-slate-500 font-mono gap-1.5">
          <span className="text-slate-400 font-bold">fx</span>
          <span className="text-slate-700">=SUM(D4:D12)</span>
        </div>

        {/* Spreadsheet Grid */}
        <div className="flex-1 p-1.5 space-y-1 text-[9px] font-mono">
          <div className="grid grid-cols-12 gap-1 text-[8px] text-slate-400 font-medium pb-0.5 border-b border-slate-100">
            <span className="col-span-2">Mã</span>
            <span className="col-span-6">Khoản mục</span>
            <span className="col-span-4 text-right">Chi phí</span>
          </div>

          <div className="grid grid-cols-12 gap-1 py-0.5 text-slate-600 items-center">
            <span className="col-span-2 text-slate-400">641</span>
            <span className="col-span-6 truncate">Tiếp thị & TT</span>
            <span className="col-span-4 text-right">85 tr</span>
          </div>

          {/* Target Cloud Row (Highlighted when AI replies) */}
          <div className="vig-doc-hl grid grid-cols-12 gap-1 py-0.5 px-1 rounded bg-emerald-50 text-emerald-950 font-semibold border border-emerald-400/80 shadow-2xs items-center">
            <span className="col-span-2 text-emerald-700">642</span>
            <span className="col-span-6 truncate font-medium">Hạ tầng Cloud</span>
            <span className="col-span-4 text-right text-accent font-bold">154 tr</span>
          </div>

          <div className="grid grid-cols-12 gap-1 py-0.5 text-slate-600 items-center">
            <span className="col-span-2 text-slate-400">643</span>
            <span className="col-span-6 truncate">Văn phòng phẩm</span>
            <span className="col-span-4 text-right">32 tr</span>
          </div>
        </div>
      </div>

      {/* Floating Copilot Panel (Right Overlap) */}
      <div className="absolute right-2 top-2 bottom-2 w-[55%] bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex flex-col justify-between p-2.5 sm:p-3">
        {/* Copilot Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-semibold text-slate-800 tracking-tight">Copilot</span>
          </div>
          <span className="text-[8px] font-mono px-1 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
            Excel AI
          </span>
        </div>

        {/* Conversation Stream (Sent Prompt -> AI Output) */}
        <div className="space-y-1.5 py-0.5">
          <div className="vig-user-msg flex items-start gap-1.5">
            <div className="w-4 h-4 rounded-full bg-emerald-700 text-[8px] font-bold text-white flex items-center justify-center shrink-0">
              P
            </div>
            <p className="text-[9.5px] text-slate-700 leading-snug font-medium">
              Tìm khoản chi vượt ngân sách Q3?
            </p>
          </div>

          <div className="vig-ai-reply flex items-start gap-1.5 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-200/70">
            <SparkleIcon className="w-3 h-3 text-accent shrink-0 mt-0.5" />
            <div className="text-[9.5px] text-slate-800 leading-tight">
              <span className="font-semibold text-accent">Hạ tầng Cloud vượt 28.3%</span> (+34 tr) so với kế hoạch.
            </div>
          </div>
        </div>

        {/* Prompt Input Composer */}
        <PromptComposer
          promptText="Tìm khoản chi vượt ngân sách Q3?"
          placeholder="Nhập prompt rồi nhấn Enter..."
          accentColor="bg-[#107C41]"
          isActive={isActive}
        />
      </div>

      {/* Cursor moves to Enter button and clicks */}
      {isActive && <Cursor className="bottom-3.5 right-3.5" />}
    </div>
  )
}

/**
 * 2. Word Copilot Vignette
 * Real Word document with legal contract + Copilot suggestion popover
 */
function WordVignette({ isActive }) {
  return (
    <div className="relative w-full h-full bg-[#F3F5F9] p-2.5 sm:p-3 overflow-hidden select-none font-sans">
      {/* Background Word Document Window (Left side) */}
      <div className="w-[66%] h-full bg-white rounded-lg border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
        {/* Word App Header */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#185ABD] text-white">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[10px] tracking-tight bg-white text-[#185ABD] w-3.5 h-3.5 rounded flex items-center justify-center font-mono">
              W
            </span>
            <span className="text-[10px] font-medium truncate">HopDong_DichVu_2026.docx</span>
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Word Toolbar */}
        <div className="flex items-center px-2 py-0.5 bg-slate-50 border-b border-slate-200 text-[8px] text-slate-500 gap-2">
          <span className="font-bold">B</span>
          <span className="italic">I</span>
          <span className="underline">U</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">Điều 8.2: Phạt vi phạm</span>
        </div>

        {/* Document Body */}
        <div className="flex-1 p-2 space-y-1.5 text-[9px]">
          <div className="h-1.5 w-4/5 bg-slate-200/80 rounded" />

          {/* Highlighted Penalty Clause */}
          <div className="vig-doc-hl p-1 rounded bg-amber-100/90 text-amber-950 border-l-2 border-amber-600 shadow-2xs text-[9px] font-mono leading-tight">
            "Phạt 0.5%/ngày chậm tiến độ, không giới hạn tổng mức phạt."
          </div>

          <div className="h-1.5 w-3/5 bg-slate-200/70 rounded" />
          <div className="h-1.5 w-2/3 bg-slate-200/50 rounded" />
        </div>
      </div>

      {/* Floating Copilot Panel (Right Overlap) */}
      <div className="absolute right-2 top-2 bottom-2 w-[55%] bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex flex-col justify-between p-2.5 sm:p-3">
        {/* Copilot Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-semibold text-slate-800 tracking-tight">Copilot</span>
          </div>
          <span className="text-[8px] font-mono px-1 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200">
            Word AI
          </span>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-1.5 py-0.5">
          <div className="vig-user-msg flex items-start gap-1.5">
            <div className="w-4 h-4 rounded-full bg-blue-700 text-[8px] font-bold text-white flex items-center justify-center shrink-0">
              P
            </div>
            <p className="text-[9.5px] text-slate-700 leading-snug font-medium">
              Rà soát rủi ro điều khoản phạt này
            </p>
          </div>

          <div className="vig-ai-reply flex items-start gap-1.5 bg-blue-50/70 p-1.5 rounded-lg border border-blue-200/70">
            <SparkleIcon className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[9.5px] text-slate-800 leading-tight">
              <span className="font-semibold text-blue-800">Đề xuất: Áp trần phạt 8%</span> theo Điều 301 Luật Thương mại.
            </div>
          </div>
        </div>

        {/* Prompt Input Composer */}
        <PromptComposer
          promptText="Rà soát rủi ro điều khoản phạt này"
          placeholder="Nhập yêu cầu kiểm tra..."
          accentColor="bg-[#185ABD]"
          isActive={isActive}
        />
      </div>

      {/* Cursor moves to Enter button and clicks */}
      {isActive && <Cursor className="bottom-3.5 right-3.5" />}
    </div>
  )
}

/**
 * 3. NotebookLM / Executive Meeting Vignette
 * Real NotebookLM source document on the left + AI Studio summary card on the right
 */
function SummaryVignette({ isActive }) {
  return (
    <div className="relative w-full h-full bg-[#F5F3FF] p-2.5 sm:p-3 overflow-hidden select-none font-sans">
      {/* Background NotebookLM Window (Left side) */}
      <div className="w-[66%] h-full bg-white rounded-lg border border-purple-200/80 shadow-xs flex flex-col overflow-hidden">
        {/* NotebookLM Header */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#4C1D95] text-white">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse" />
            <span className="text-[10px] font-medium truncate">NotebookLM · Họp Giao Ban</span>
          </div>
          <span className="text-[8px] font-mono text-purple-200">2 nguồn</span>
        </div>

        {/* Sources List & Content */}
        <div className="flex-1 p-2 space-y-1.5 text-[9px]">
          <div className="vig-doc-hl flex items-center gap-1 px-1.5 py-0.5 bg-purple-50 rounded border border-purple-200 text-[8px] text-purple-900 font-mono">
            <span>📄</span>
            <span className="truncate">BienBan_GiaoBan_21_10.pdf</span>
          </div>

          <div className="space-y-1 pt-0.5 text-slate-600 text-[8.5px] leading-tight">
            <div className="h-1.5 w-full bg-slate-200/80 rounded" />
            <div className="h-1.5 w-4/5 bg-slate-200/70 rounded" />
            <div className="h-1.5 w-3/4 bg-slate-200/60 rounded" />
          </div>
        </div>
      </div>

      {/* Floating Studio Action Card (Right Overlap) */}
      <div className="absolute right-2 top-2 bottom-2 w-[55%] bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex flex-col justify-between p-2.5 sm:p-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] font-semibold text-slate-800 tracking-tight">NotebookLM</span>
          </div>
          <span className="text-[8px] font-mono px-1 py-0.2 bg-purple-50 text-purple-700 rounded border border-purple-200">
            Studio
          </span>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-1 py-0.5">
          <div className="vig-user-msg flex items-start gap-1.5">
            <div className="w-4 h-4 rounded-full bg-purple-700 text-[8px] font-bold text-white flex items-center justify-center shrink-0">
              P
            </div>
            <p className="text-[9.5px] text-slate-700 leading-snug font-medium">
              Liệt kê các đầu việc kèm hạn chót
            </p>
          </div>

          <div className="vig-ai-reply space-y-1 pt-0.5">
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-purple-50/80 border border-purple-200/80 text-[8.5px]">
              <span className="font-medium text-purple-950 truncate">1. Bảo dưỡng trạm bơm</span>
              <span className="font-mono text-[8px] px-1 bg-white text-purple-700 rounded border border-purple-200 font-bold shrink-0">
                25/10
              </span>
            </div>
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-purple-50/80 border border-purple-200/80 text-[8.5px]">
              <span className="font-medium text-purple-950 truncate">2. Chốt số kiểm toán Q3</span>
              <span className="font-mono text-[8px] px-1 bg-white text-purple-700 rounded border border-purple-200 font-bold shrink-0">
                28/10
              </span>
            </div>
          </div>
        </div>

        {/* Prompt Input Composer */}
        <PromptComposer
          promptText="Liệt kê các đầu việc kèm hạn chót"
          placeholder="Đặt câu hỏi về nguồn tài liệu..."
          accentColor="bg-[#4C1D95]"
          isActive={isActive}
        />
      </div>

      {/* Cursor moves to Enter button and clicks */}
      {isActive && <Cursor className="bottom-3.5 right-3.5" />}
    </div>
  )
}

/**
 * 4. Governance & Data Security Vignette
 * Enterprise Copilot security scanner with classification tags
 */
function GovernanceVignette({ isActive }) {
  return (
    <div className="relative w-full h-full bg-[#FFF7ED] p-2.5 sm:p-3 overflow-hidden select-none font-sans">
      {/* Background Prompt Terminal Window (Left side) */}
      <div className="w-[66%] h-full bg-white rounded-lg border border-orange-200/80 shadow-xs flex flex-col overflow-hidden">
        {/* Enterprise Shield Header */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#9A3412] text-white">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">🛡️</span>
            <span className="text-[10px] font-medium truncate">M365 Purview DLP</span>
          </div>
          <span className="text-[8px] font-mono text-orange-200 font-medium">Active</span>
        </div>

        {/* Document Scanner Area */}
        <div className="flex-1 p-2 space-y-1.5 text-[9px]">
          <div className="text-[8.5px] text-slate-500 font-mono">Trạng thái bảo mật phiên chat:</div>
          <div className="vig-doc-hl p-1.5 rounded bg-emerald-50/80 border border-emerald-300 font-mono text-[8.5px] text-emerald-950 leading-tight">
            ✓ Đã ẩn danh PII & Mã hóa Enterprise
          </div>
          <div className="h-1.5 w-3/4 bg-slate-200/70 rounded" />
        </div>
      </div>

      {/* Floating Classification Card (Right Overlap) */}
      <div className="absolute right-2 top-2 bottom-2 w-[55%] bg-white rounded-xl border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] flex flex-col justify-between p-2.5 sm:p-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <SparkleIcon className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-semibold text-slate-800 tracking-tight">Kiểm Soát AI</span>
          </div>
          <span className="text-[8px] font-mono px-1 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-semibold">
            An toàn
          </span>
        </div>

        {/* Conversation Stream */}
        <div className="space-y-1.5 py-0.5">
          <div className="vig-user-msg flex items-start gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#9A3412] text-[8px] font-bold text-white flex items-center justify-center shrink-0">
              P
            </div>
            <p className="text-[9.5px] text-slate-700 leading-snug font-medium">
              Tóm tắt báo cáo tài chính nội bộ Q3
            </p>
          </div>

          <div className="vig-ai-reply flex items-center justify-between px-2 py-1 rounded-lg bg-blue-50/80 border border-blue-200 text-[9px]">
            <span className="font-semibold text-blue-950">Dữ liệu Cấp 2: Nội bộ</span>
            <span className="font-mono text-[8px] px-1 py-0.2 bg-white text-blue-700 rounded border border-blue-200 font-bold">
              Cho phép ✓
            </span>
          </div>
        </div>

        {/* Prompt Input Composer */}
        <PromptComposer
          promptText="Tóm tắt báo cáo tài chính nội bộ Q3"
          placeholder="Nhập prompt kiểm duyệt..."
          accentColor="bg-[#9A3412]"
          isActive={isActive}
        />
      </div>

      {/* Cursor moves to Enter button and clicks */}
      {isActive && <Cursor className="bottom-3.5 right-3.5" />}
    </div>
  )
}

/**
 * Main UIVignette Component
 * Container maintaining 16:9 aspect ratio and selecting the vignette type
 */
export default function UIVignette({ type, isActive = false }) {
  return (
    <div
      className={`relative w-full aspect-[16/9] rounded-xl border border-line overflow-hidden bg-paper shadow-sm transition-all duration-300 group-hover:border-ink/40 group-hover:shadow-md ${
        isActive ? 'vig-active' : ''
      }`}
      aria-hidden="true"
    >
      {type === 'excel' && <ExcelVignette isActive={isActive} />}
      {type === 'word' && <WordVignette isActive={isActive} />}
      {type === 'summary' && <SummaryVignette isActive={isActive} />}
      {type === 'governance' && <GovernanceVignette isActive={isActive} />}
    </div>
  )
}
