import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import AskAiModal from './AskAiModal'
import SuggestUseCaseModal from './SuggestUseCaseModal'
import { useContent } from '../hooks/useContent'
import { getPrompts } from '../services/contentService'

export default function AppLayout() {
  const [isAskOpen, setIsAskOpen] = useState(false)
  const [isSuggestOpen, setIsSuggestOpen] = useState(false)
  const { data: allPrompts } = useContent(getPrompts, [])
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 selection:bg-indigo-50 selection:text-indigo-700">
      <Navbar onOpenAskAi={() => setIsAskOpen(true)} onOpenSuggest={() => setIsSuggestOpen(true)} />

      <main className="flex-1">
        <div key={pathname} className="animate-fade-up">
          <Outlet context={{ openSuggest: () => setIsSuggestOpen(true) }} />
        </div>
      </main>

      <AskAiModal
        isOpen={isAskOpen}
        onClose={() => setIsAskOpen(false)}
        allPrompts={allPrompts || []}
        onSelectPrompt={(p) => navigate(`/prompts/${p.slug}`)}
      />
      <SuggestUseCaseModal isOpen={isSuggestOpen} onClose={() => setIsSuggestOpen(false)} />

      <footer className="border-t border-slate-200 bg-[#FAFAFA] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>AI Hub Docs · Nền tảng đào tạo và cẩm nang AI nội bộ</p>
          <div className="flex items-center gap-5">
            <Link to="/prompts" className="hover:text-indigo-600 transition-colors">Thư viện Prompt</Link>
            <Link to="/learn" className="hover:text-indigo-600 transition-colors">Học tập</Link>
            <Link to="/governance" className="hover:text-indigo-600 transition-colors">Quy chuẩn & Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
