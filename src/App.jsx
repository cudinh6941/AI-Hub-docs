import React from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import PromptsPage from './pages/PromptsPage'
import PromptDetailPage from './pages/PromptDetailPage'
import LearnPage from './pages/LearnPage'
import VideoPage from './pages/VideoPage'
import GovernancePage from './pages/GovernancePage'
import GuideDetailPage from './pages/GuideDetailPage'
import AssistantsPage from './pages/AssistantsPage'

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy trang</h1>
      <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">← Về trang chủ</Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="prompts" element={<PromptsPage />} />
          <Route path="prompts/:slug" element={<PromptDetailPage />} />
          <Route path="assistants" element={<AssistantsPage />} />
          <Route path="guides/:slug" element={<GuideDetailPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:slug" element={<VideoPage />} />
          <Route path="governance" element={<GovernancePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
