import React, { useEffect, useState, useRef } from 'react'
import { Play, Pause, RotateCcw, Check, Copy, ArrowRight, CornerDownLeft } from 'lucide-react'

// Full prompt string to simulate typing
const TYPING_TEXT = 'Tính cột chênh lệch Variance và tô đỏ khoản chi phí vượt định mức'

// Virtual mouse coordinates for each timeline step (in percentages or pixels)
const CURSOR_POSITIONS = {
  0: { top: '80%', left: '45%', opacity: 0.9 }, // Resting near bottom
  1: { top: '78%', left: '82%', opacity: 1 },   // Inside Copilot input
  2: { top: '82%', left: '92%', opacity: 1 },   // Clicking send button
  3: { top: '45%', left: '30%', opacity: 0.6 }, // Hovering over spreadsheet table
  4: { top: '88%', left: '75%', opacity: 0.8 }, // Near copy button
}

export default function HeroLiveShowcase() {
  const [step, setStep] = useState(0) // 0: Raw, 1: Typing, 2: Scanning, 3: Transformed, 4: Finished
  const [typedChars, setTypedChars] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [copied, setCopied] = useState(false)
  const typingTimerRef = useRef(null)

  // Step Timeline Sequencer
  useEffect(() => {
    if (!isPlaying) return

    let timeoutId

    if (step === 0) {
      // Step 0: Raw spreadsheet view (Wait 1.5s, then start typing)
      setTypedChars(0)
      timeoutId = setTimeout(() => {
        setStep(1)
      }, 1500)
    } else if (step === 1) {
      // Step 1: Type out text letter by letter
      if (typedChars < TYPING_TEXT.length) {
        typingTimerRef.current = setTimeout(() => {
          setTypedChars((prev) => prev + 1)
        }, 32)
      } else {
        // Finished typing, wait 500ms then move to send step
        timeoutId = setTimeout(() => {
          setStep(2)
        }, 600)
      }
    } else if (step === 2) {
      // Step 2: Click send and scan for 1.2s
      timeoutId = setTimeout(() => {
        setStep(3)
      }, 1200)
    } else if (step === 3) {
      // Step 3: Column added, numbers appear & highlight (showcase for 3.5s)
      timeoutId = setTimeout(() => {
        setStep(4)
      }, 3500)
    } else if (step === 4) {
      // Step 4: Finished message, wait 2s then loop back to 0
      timeoutId = setTimeout(() => {
        setStep(0)
      }, 2500)
    }

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(typingTimerRef.current)
    }
  }, [step, typedChars, isPlaying])

  const handleManualStep = (targetStep) => {
    setIsPlaying(false)
    setStep(targetStep)
    if (targetStep >= 1) setTypedChars(TYPING_TEXT.length)
    else setTypedChars(0)
  }

  const handleRestart = () => {
    setStep(0)
    setTypedChars(0)
    setIsPlaying(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(TYPING_TEXT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentCursor = CURSOR_POSITIONS[step] || CURSOR_POSITIONS[0]

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Ambient subtle glow */}
      <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-slate-200/50 via-slate-100/40 to-slate-200/50 blur-xl pointer-events-none" />

      {/* Main Window Container */}
      <div className="relative bg-white border border-slate-300 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Virtual Mouse Cursor (Animated CSS positioning) */}
        <div
          className="absolute z-50 pointer-events-none transition-all duration-700 ease-out"
          style={{
            top: currentCursor.top,
            left: currentCursor.left,
            opacity: currentCursor.opacity,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] fill-slate-900 stroke-white stroke-2 transition-transform duration-150 ${
              step === 2 ? 'scale-90 translate-y-0.5' : ''
            }`}
          >
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
          </svg>
          {step === 2 && (
            <span className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-slate-400/30 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Microsoft 365 Title Bar */}
        <div className="bg-slate-900 text-white px-3.5 py-2 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2 truncate">
            {/* 9-dot Waffle */}
            <div className="grid grid-cols-3 gap-0.5 w-3 h-3 opacity-80 shrink-0">
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
              <span className="w-0.5 h-0.5 rounded-2xs bg-white" />
            </div>

            <span className="font-semibold text-[11px] truncate">Bao_Cao_P&L_2026.xlsx • Excel Copilot</span>
          </div>

          {/* Action Simulation Indicator (Monochrome neutral) */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>MÔ PHỎNG TRỰC TIẾP</span>
            </span>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Chạy lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Office Ribbon Menu */}
        <div className="bg-slate-100 border-b border-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-600 select-none">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-900 border-b-2 border-slate-900 pb-0.5">Trang chủ</span>
            <span>Chèn</span>
            <span>Công thức</span>
            <span>Dữ liệu</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-900 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            <span>M365 Copilot</span>
          </div>
        </div>

        {/* Main Work Canvas */}
        <div className="p-3 sm:p-4 bg-slate-50 min-h-[300px] flex flex-col justify-between relative">
          <div className="grid grid-cols-12 gap-3">
            {/* LEFT: SPREADSHEET (Dynamic columns) */}
            <div className="col-span-12 sm:col-span-7 bg-white rounded-lg border border-slate-300 overflow-hidden text-[10px] font-mono shadow-2xs relative">
              {/* Scan Beam Effect when Step == 2 */}
              {step === 2 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent animate-shimmer-h pointer-events-none z-10" />
              )}

              {/* Excel Header */}
              <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-300 text-slate-500 font-semibold text-center divide-x divide-slate-200 select-none">
                <span className="col-span-1 py-1">#</span>
                <span className="col-span-5 py-1 text-left px-1.5">A: Hạng mục</span>
                <span className="col-span-3 py-1">B: Dự toán</span>
                {step >= 3 ? (
                  <span className="col-span-3 py-1 bg-slate-200 text-slate-900 font-bold animate-cascade-1">
                    C: Variance
                  </span>
                ) : (
                  <span className="col-span-3 py-1 text-slate-300 italic">Trống</span>
                )}
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                {/* Row 1 */}
                <div
                  className={`grid grid-cols-12 items-center divide-x divide-slate-100 py-1.5 transition-colors duration-500 ${
                    step >= 3 ? 'bg-rose-50/70' : 'bg-white'
                  }`}
                >
                  <span className="col-span-1 text-center text-slate-400">1</span>
                  <span className="col-span-5 px-1.5 truncate text-slate-800 font-medium font-sans">Hạ tầng Cloud</span>
                  <span className="col-span-3 text-center text-slate-600">120 tr</span>
                  {step >= 3 ? (
                    <span className="col-span-3 text-center text-rose-600 font-bold bg-rose-100/70 animate-cascade-1">
                      +28.3%
                    </span>
                  ) : (
                    <span className="col-span-3 text-center text-slate-200">-</span>
                  )}
                </div>

                {/* Row 2 */}
                <div
                  className={`grid grid-cols-12 items-center divide-x divide-slate-100 py-1.5 transition-colors duration-500 ${
                    step >= 3 ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <span className="col-span-1 text-center text-slate-400">2</span>
                  <span className="col-span-5 px-1.5 truncate text-slate-800 font-medium font-sans">Tiếp thị số</span>
                  <span className="col-span-3 text-center text-slate-600">80 tr</span>
                  {step >= 3 ? (
                    <span className="col-span-3 text-center text-slate-700 font-medium bg-slate-100 animate-cascade-2">
                      -5.0%
                    </span>
                  ) : (
                    <span className="col-span-3 text-center text-slate-200">-</span>
                  )}
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-12 items-center divide-x divide-slate-100 py-1.5 bg-white">
                  <span className="col-span-1 text-center text-slate-400">3</span>
                  <span className="col-span-5 px-1.5 truncate text-slate-800 font-medium font-sans">Thuê văn phòng</span>
                  <span className="col-span-3 text-center text-slate-600">45 tr</span>
                  {step >= 3 ? (
                    <span className="col-span-3 text-center text-slate-400 font-mono animate-cascade-3">
                      0.0%
                    </span>
                  ) : (
                    <span className="col-span-3 text-center text-slate-200">-</span>
                  )}
                </div>
              </div>

              {/* Status banner on bottom of spreadsheet */}
              {step >= 3 && (
                <div className="bg-rose-50 border-t border-rose-200 px-2.5 py-1 text-[10px] text-rose-800 font-sans flex items-center justify-between animate-cascade-1">
                  <span className="font-semibold">Cảnh báo: Chi phí Cloud vượt hạn mức ngân sách quý.</span>
                  <span className="font-mono text-rose-600 font-bold">+34 tr</span>
                </div>
              )}
            </div>

            {/* RIGHT: COPILOT FOR M365 CHAT PANE */}
            <div className="col-span-12 sm:col-span-5 bg-white rounded-lg border border-slate-300 p-2.5 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 text-[10px]">
                  <span className="font-bold text-slate-900">Copilot for Excel</span>
                  <span className="text-slate-400 font-mono">FIN-001</span>
                </div>

                {/* Live Message History */}
                <div className="space-y-2">
                  {step >= 2 ? (
                    <div className="bg-slate-100 border border-slate-200 p-2 rounded-lg text-[11px] text-slate-900 font-sans leading-tight">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Lệnh đã gửi:</span>
                      "{TYPING_TEXT}"
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic py-1">
                      Chờ nhập yêu cầu xử lý bảng tính...
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                      <span>Copilot đang phân tích bảng dữ liệu...</span>
                    </div>
                  )}

                  {step >= 3 && (
                    <div className="bg-slate-100 border border-slate-300 p-2 rounded-lg text-[10px] text-slate-800 leading-snug animate-cascade-1">
                      <span className="font-bold block text-slate-900 mb-0.5">Kết quả phân tích:</span>
                      Đã tự động tính toán cột C (Variance) và phát hiện 1 khoản chi phí vượt định mức.
                    </div>
                  )}
                </div>
              </div>

              {/* Typing Input Box (Shows typing action) */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="relative flex items-center">
                  <input
                    readOnly
                    value={step === 1 ? TYPING_TEXT.slice(0, typedChars) : step >= 2 ? '' : ''}
                    placeholder={step === 0 ? 'Nhập yêu cầu cho Copilot...' : ''}
                    className={`w-full text-[11px] pl-2 pr-7 py-1.5 rounded border outline-none font-sans ${
                      step === 1
                        ? 'border-indigo-500 bg-white ring-1 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  />

                  {/* Send Button */}
                  <button
                    type="button"
                    className={`absolute right-1 w-5 h-5 rounded flex items-center justify-center transition-all ${
                      step === 2
                        ? 'bg-indigo-600 text-white scale-90'
                        : step === 1 && typedChars >= TYPING_TEXT.length
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <CornerDownLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP PROGRESS TIMELINE (Interactive step indicator) */}
          <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-slate-400 font-medium">Tiến trình:</span>
              {[
                { s: 0, label: '1. Bảng thô' },
                { s: 1, label: '2. Gõ lệnh' },
                { s: 2, label: '3. AI Quét' },
                { s: 3, label: '4. Nảy số' },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => handleManualStep(item.s)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    step === item.s
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 1-Click Copy */}
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                copied ? 'bg-slate-800 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {copied ? <><Check className="w-3 h-3" /> Đã sao chép</> : <><Copy className="w-3 h-3" /> Sao chép công thức</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
