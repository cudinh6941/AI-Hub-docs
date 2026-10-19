import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Pause, ArrowRight, CornerDownLeft, Paperclip, CheckCircle2, FileText, ArrowUp } from 'lucide-react'

const TABS = [
  { id: 'gemini', name: 'Google Gemini (Gems)', slug: 'gemini-gems-tro-ly-chuyen-sau' },
  { id: 'notebooklm', name: 'Google NotebookLM', slug: 'notebooklm-tra-cuu-tai-lieu-chuyen-sau' },
  { id: 'chatgpt', name: 'ChatGPT Projects', slug: 'chatgpt-projects-khong-gian-du-an' },
  { id: 'canvas', name: 'ChatGPT Canvas', slug: 'canvas-artifacts-chinh-sua-truc-tiep' },
]

export default function FeatureSpotlightStage() {
  const [activeTab, setActiveTab] = useState(0)
  const [phase, setPhase] = useState(0) // 0: Start, 1: Action, 2: Process, 3: Result
  const [isPlaying, setIsPlaying] = useState(true)

  // Sequencer loop: 7.5s per tab
  useEffect(() => {
    if (!isPlaying) return

    setPhase(0)
    const p1 = setTimeout(() => setPhase(1), 1200)
    const p2 = setTimeout(() => setPhase(2), 2600)
    const p3 = setTimeout(() => setPhase(3), 4200)
    const nextTab = setTimeout(() => {
      setActiveTab((prev) => (prev + 1) % TABS.length)
    }, 7800)

    return () => {
      clearTimeout(p1)
      clearTimeout(p2)
      clearTimeout(p3)
      clearTimeout(nextTab)
    }
  }, [activeTab, isPlaying])

  const handleSelectTab = (idx) => {
    setActiveTab(idx)
    setPhase(0)
  }

  const currentTab = TABS[activeTab]

  return (
    <section className="py-16 sm:py-20 border-b border-slate-200/80 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Top Header: 1 Title đanh thép */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Tính năng nền tảng nâng cao
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tiện ích tích hợp sẵn
            </h2>
          </div>

          {/* Interactive Top Tab Strip with Animated Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(idx)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors overflow-hidden ${
                    activeTab === idx
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="relative z-10">{tab.name}</span>
                  {activeTab === idx && isPlaying && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 animate-tab-progress" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title={isPlaying ? 'Tạm dừng animation' : 'Tiếp tục animation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. AUTHENTIC NATIVE UI STAGE */}
        <div className="relative rounded-2xl border border-slate-300 shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden">
          
          {/* ========================================================
              UI 1: REAL GOOGLE GEMINI (GEMS) UI CLONE
             ======================================================== */}
          {activeTab === 0 && (
            <div className="bg-[#131314] text-slate-200 min-h-[420px] flex flex-col font-sans">
              {/* Gemini Top App Header */}
              <div className="h-11 px-4 border-b border-[#282a2c] flex items-center justify-between text-xs bg-[#131314]">
                <div className="flex items-center gap-2">
                  {/* Gemini 4-Point Sparkle Icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-indigo-400">
                    <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z" />
                  </svg>
                  <span className="font-semibold text-slate-200 text-[13px]">Gemini Advanced</span>
                  <span className="text-[10px] text-slate-500 font-mono">2.0 Flash</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded-full bg-[#1e1f20] border border-[#333537] text-indigo-300">
                    Gem: Trợ lý Pháp chế
                  </span>
                  <span className="w-6 h-6 rounded-full bg-indigo-700 text-white text-[10px] font-bold flex items-center justify-center">
                    DN
                  </span>
                </div>
              </div>

              {/* Gemini Two-Column Workspace */}
              <div className="flex-1 grid grid-cols-12 divide-x divide-[#282a2c]">
                {/* Left Drawer: Gem Knowledge & System Instructions */}
                <div className="col-span-12 sm:col-span-4 bg-[#1e1f20]/60 p-3.5 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Bộ nhớ Gem (Knowledge)</span>
                    <span className="text-indigo-400 text-[10px]">Cố định</span>
                  </div>

                  {/* Knowledge files attached to Gem */}
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded bg-[#131314] border border-[#333537] flex items-center gap-2 text-slate-300">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Quy_Che_Phap_Che_2026.pdf</span>
                    </div>
                    <div className="p-2 rounded bg-[#131314] border border-[#333537] flex items-center gap-2 text-slate-300">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">Bieu_Mau_Hop_Dong.docx</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#131314]/70 border border-[#282a2c] text-[10px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Chỉ dẫn Gem (Instructions):</span>
                    <p className="line-clamp-2">"Luôn áp dụng mức phạt vi phạm không quá 8% theo Điều 301 Luật Thương mại..."</p>
                  </div>
                </div>

                {/* Right Area: Chat Interaction Stream */}
                <div className="col-span-12 sm:col-span-8 p-4 flex flex-col justify-between bg-[#131314]">
                  <div className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-[#282a2c] text-slate-100 text-xs px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] leading-relaxed">
                        Kiểm tra mức phạt chậm giao hàng trong hợp đồng đối tác gửi.
                      </div>
                    </div>

                    {/* Gemini Response with Sparkle */}
                    {phase >= 2 ? (
                      <div className="flex items-start gap-2.5 max-w-[95%] animate-cascade-1">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-indigo-400 shrink-0 mt-0.5">
                          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z" />
                        </svg>
                        <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                          <p>
                            Theo <span className="text-indigo-400 font-semibold">Điều 8.1 Quy chế Pháp chế nội bộ</span> đã nạp trong Gem:
                          </p>
                          <p className="bg-[#1e1f20] p-2.5 rounded-xl border border-[#333537] text-slate-200 text-[12px]">
                            Mức phạt 1%/ngày của đối tác vượt quá trần quy định. Cần đàm phán giảm xuống tối đa <strong>8% tổng giá trị nghĩa vụ hợp đồng</strong> theo Điều 301 Luật Thương mại.
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono block">Đã tham chiếu tệp Quy_Che_Phap_Che_2026.pdf</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs italic pl-6 font-mono animate-pulse">
                        Gemini đang đối chiếu với tệp quy chế trong Gem...
                      </div>
                    )}
                  </div>

                  {/* Gemini Iconic Pill Input Bar */}
                  <div className="mt-4 pt-2">
                    <div className="bg-[#1e1f20] border border-[#333537] rounded-full px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Nhập câu hỏi cho Gem Pháp chế...</span>
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                        <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">
                          ↑
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              UI 2: REAL GOOGLE NOTEBOOKLM UI CLONE (3 COLUMNS)
             ======================================================== */}
          {activeTab === 1 && (
            <div className="bg-[#1b1c1d] text-slate-200 min-h-[420px] flex flex-col font-sans">
              {/* NotebookLM Header */}
              <div className="h-11 px-4 border-b border-[#2e3032] flex items-center justify-between text-xs bg-[#1b1c1d]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400" />
                  <span className="font-semibold text-slate-200 text-[13px]">Sổ tay: Hồ Sơ Mời Thầu & Dự Án 2026</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#282a2c] text-emerald-400 border border-[#3c4043]">
                    3 Nguồn tài liệu
                  </span>
                </div>
              </div>

              {/* NotebookLM 3-Column Layout */}
              <div className="flex-1 grid grid-cols-12 divide-x divide-[#2e3032]">
                {/* Column 1: Sources (25%) */}
                <div className="col-span-12 sm:col-span-3 bg-[#1e1f20]/60 p-3 space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pb-1 border-b border-[#2e3032]">
                    Nguồn (Sources)
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="p-1.5 rounded bg-[#282a2c] text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">☑</span>
                      <span className="truncate">Ho_So_Moi_Thau.pdf</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#282a2c] text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">☑</span>
                      <span className="truncate">Tieu_Chuan_Ky_Thuat.pdf</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#282a2c] text-slate-300 flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">☑</span>
                      <span className="truncate">Bien_Ban_Hop_Thau.docx</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Chat & Exact Citations (55%) */}
                <div className="col-span-12 sm:col-span-6 p-4 flex flex-col justify-between bg-[#1b1c1d]">
                  <div className="space-y-3">
                    <div className="bg-[#282a2c] text-slate-100 text-xs px-3.5 py-2 rounded-xl inline-block max-w-[90%]">
                      Hạn mức bảo lãnh thực hiện hợp đồng và thời gian bàn giao dự án?
                    </div>

                    {phase >= 2 ? (
                      <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#232426] p-3.5 rounded-xl border border-[#333537] animate-cascade-1">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                          NotebookLM • Trích xuất có căn cứ
                        </div>
                        <p className="text-[12px] leading-relaxed">
                          Bảo lãnh thực hiện hợp đồng là <strong className="text-white">5%</strong> giá trị hợp đồng{' '}
                          <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 inline-flex items-center justify-center font-mono text-[10px] font-bold">
                            1
                          </span>
                          . Thời gian hoàn thành bàn giao dự án là <strong className="text-white">180 ngày</strong> kể từ ngày khởi công{' '}
                          <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 inline-flex items-center justify-center font-mono text-[10px] font-bold">
                            2
                          </span>
                          .
                        </p>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs font-mono italic animate-pulse">
                        Đang quét 137 trang tài liệu đã chọn...
                      </div>
                    )}
                  </div>

                  {/* NotebookLM Input */}
                  <div className="mt-3">
                    <div className="bg-[#282a2c] border border-[#3c4043] rounded-xl px-3 py-2 text-xs text-slate-400 flex items-center justify-between">
                      <span>Đặt câu hỏi dựa trên các nguồn tài liệu...</span>
                      <span className="text-[10px] font-mono text-emerald-400">ENTER</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Source Citation Proof / Studio (20%) */}
                <div className="col-span-12 sm:col-span-3 bg-[#1e1f20]/60 p-3 space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 pb-1 border-b border-[#2e3032]">
                    Chứng dẫn trang gốc
                  </div>
                  {phase >= 2 ? (
                    <div className="space-y-2 font-mono text-[10px] text-slate-300 animate-cascade-2">
                      <div className="p-2 rounded bg-[#282a2c] border-l-2 border-emerald-400">
                        <div className="font-bold text-emerald-400">[1] Trang 24</div>
                        <div className="text-slate-400 text-[9px] mt-0.5 truncate">Mục 4.2 Bảo lãnh hợp đồng 5%</div>
                      </div>
                      <div className="p-2 rounded bg-[#282a2c] border-l-2 border-emerald-400">
                        <div className="font-bold text-emerald-400">[2] Trang 58</div>
                        <div className="text-slate-400 text-[9px] mt-0.5 truncate">Tiến độ thi công 180 ngày</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[10px] italic">Chờ trích xuất nguồn...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              UI 3: REAL CHATGPT PROJECTS UI CLONE
             ======================================================== */}
          {activeTab === 2 && (
            <div className="bg-[#212121] text-slate-200 min-h-[420px] flex flex-col font-sans">
              {/* ChatGPT Header */}
              <div className="h-11 px-4 border-b border-[#303030] flex items-center justify-between text-xs bg-[#212121]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 text-[13px]">Dự án: Quyết toán thuế 2026</span>
                  <span className="text-[10px] text-slate-400 font-mono">• Shared Workspace</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-[#2f2f2f] text-purple-300 border border-[#424242]">
                    2 tệp đính kèm
                  </span>
                  <div className="flex -space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[9px] flex items-center justify-center font-bold">K</span>
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[9px] flex items-center justify-center font-bold">H</span>
                  </div>
                </div>
              </div>

              {/* Pinned Files Bar */}
              <div className="bg-[#171717] px-4 py-2 border-b border-[#303030] flex items-center gap-3 text-xs overflow-x-auto">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Tệp dự án:</span>
                <span className="px-2.5 py-1 rounded bg-[#2a2a2a] border border-[#383838] text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-emerald-400" /> Bao_Cao_Tai_Chinh_Q3.xlsx
                </span>
                <span className="px-2.5 py-1 rounded bg-[#2a2a2a] border border-[#383838] text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-rose-400" /> Bien_Ban_Kiem_Toan.pdf
                </span>
              </div>

              {/* Chat Stream Area */}
              <div className="flex-1 p-4 flex flex-col justify-between bg-[#212121]">
                <div className="space-y-3 max-w-2xl mx-auto w-full">
                  <div className="flex justify-end">
                    <div className="bg-[#2f2f2f] text-slate-100 text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-xs leading-relaxed">
                      Tổng hợp các khuyến nghị của kiểm toán độc lập về chi phí dự phòng.
                    </div>
                  </div>

                  {phase >= 2 ? (
                    <div className="flex items-start gap-3 animate-cascade-1">
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947z" />
                        </svg>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed">
                        <p className="text-[11px] text-slate-400 font-mono">Tham chiếu 2 tệp dự án:</p>
                        <p className="bg-[#2a2a2a] p-3 rounded-xl border border-[#383838]">
                          Kiểm toán độc lập yêu cầu tăng tỷ lệ trích lập dự phòng nợ khó đòi thêm <strong className="text-emerald-400">120 triệu đồng</strong> cho danh mục khách hàng quá hạn trên 90 ngày trước kỳ quyết toán thuế.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs italic pl-9 font-mono animate-pulse">
                      Đang đọc dữ liệu từ thư mục dự án...
                    </div>
                  )}
                </div>

                {/* ChatGPT Capsule Input */}
                <div className="max-w-2xl mx-auto w-full mt-4">
                  <div className="bg-[#2f2f2f] rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border border-[#383838]">
                    <span>Nhắn tin trong dự án Quyết toán thuế 2026...</span>
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              UI 4: REAL CHATGPT CANVAS UI CLONE (SPLIT VIEW)
             ======================================================== */}
          {activeTab === 3 && (
            <div className="bg-[#212121] text-slate-200 min-h-[420px] flex flex-col font-sans">
              {/* Canvas Header */}
              <div className="h-11 px-4 border-b border-[#303030] flex items-center justify-between text-xs bg-[#171717]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 text-[13px]">ChatGPT Canvas</span>
                  <span className="text-[10px] text-blue-400 font-mono">Bản thảo hợp tác.docx</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>240 từ</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Chỉnh sửa tại chỗ
                  </span>
                </div>
              </div>

              {/* Split View: Left Chat (38%), Right Canvas Document (62%) */}
              <div className="flex-1 grid grid-cols-12 divide-x divide-[#303030]">
                {/* Left: Chat side */}
                <div className="col-span-12 sm:col-span-5 p-3.5 flex flex-col justify-between bg-[#212121]">
                  <div className="space-y-2 text-xs">
                    <div className="bg-[#2f2f2f] p-2.5 rounded-xl text-slate-200">
                      Bôi đen Đoạn 2: Viết lại trang trọng hơn và cam kết tiến độ thử nghiệm 30 ngày.
                    </div>
                    {phase >= 2 && (
                      <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-[#303030]">
                        ✓ Đã áp dụng trực tiếp lên văn bản Canvas bên phải. Các đoạn khác giữ nguyên.
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono pt-2">
                    Canvas Split Mode
                  </div>
                </div>

                {/* Right: True Paper Document Surface with Inline Selection */}
                <div className="col-span-12 sm:col-span-7 bg-[#ffffff] text-slate-900 p-5 sm:p-6 space-y-3 font-sans text-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">
                      THƯ NGỎ HỢP TÁC DOANH NGHIỆP
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                      Kính gửi Quý đối tác, Chúng tôi xin gửi lời chào trân trọng nhất.
                    </p>

                    {/* Transforming Paragraph with Floating Capsule */}
                    <div className="relative p-2 rounded border border-indigo-200 bg-indigo-50/30">
                      {/* Floating Capsule Toolbar */}
                      {phase >= 1 && (
                        <div className="absolute -top-3 left-2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full shadow-md font-mono flex items-center gap-1.5 animate-cascade-1">
                          <span>✨ Viết lại trang trọng hơn</span>
                        </div>
                      )}

                      {phase < 3 ? (
                        <p className={`leading-relaxed ${phase >= 1 ? 'bg-indigo-200 text-slate-900 px-1 rounded' : 'text-slate-700'}`}>
                          Chúng tôi sẽ cố gắng làm xong sớm nhất có thể.
                        </p>
                      ) : (
                        <div className="space-y-1 animate-cascade-1">
                          <p className="line-through text-slate-400 text-[10px]">
                            Chúng tôi sẽ cố gắng làm xong sớm nhất có thể.
                          </p>
                          <p className="text-emerald-800 font-semibold text-[12px] leading-relaxed">
                            "Chúng tôi cam kết hoàn thành giai đoạn thử nghiệm trong 30 ngày làm việc kể từ ngày tiếp nhận bàn giao."
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                      Rất mong nhận được phản hồi sớm từ Quý công ty.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Đoạn 1, 3 giữ nguyên 100%</span>
                    <span className="text-emerald-700 font-bold">✓ Đã cập nhật inline</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar: Direct Action Link */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-white">
            <span className="text-slate-400 text-[11px] truncate pr-2 font-mono">
              Trực quan native: {currentTab.name}
            </span>

            <Link
              to={`/guides/${currentTab.slug}`}
              className="group inline-flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
            >
              <span>Xem hướng dẫn & cấu hình mẫu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
