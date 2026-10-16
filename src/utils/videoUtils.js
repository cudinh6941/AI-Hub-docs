import { createElement } from 'react'

/**
 * Video Utilities for YouTube ID extraction, time parsing, formatting and icons.
 */

/**
 * Trích xuất YouTube Video ID từ các định dạng link:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 * - https://www.youtube-nocookie.com/embed/ID
 * - https://m.youtube.com/watch?v=ID
 * - https://youtube.com/shorts/ID
 * - Direct 11-char ID
 * @param {string} url
 * @returns {string|null}
 */
export function parseYouTubeId(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = trimmed.match(regExp)
  return match ? match[1] : null
}

/**
 * Chuyển đổi định dạng thời gian "MM:SS" hoặc "HH:MM:SS" thành số giây.
 * VD: "02:30" -> 150 giây
 * @param {string} timeStr
 * @returns {number}
 */
export function parseTimeToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0
  const parts = timeStr.trim().split(':').map((p) => parseInt(p, 10))
  if (parts.some((p) => isNaN(p))) return 0
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 1) {
    return parts[0]
  }
  return 0
}

/**
 * Format số giây thành chuỗi "MM:SS" hoặc "HH:MM:SS"
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatSecondsToTime(totalSeconds) {
  const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const hours = Math.floor(sec / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60

  const pad = (n) => String(n).padStart(2, '0')
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

/**
 * SVG YouTube Icon component for enterprise branding (uses createElement for .js compatibility)
 */
export function YouTubeIcon({ className = 'w-4 h-4' }) {
  return createElement(
    'svg',
    { className, viewBox: '0 0 24 24', fill: 'currentColor' },
    createElement('path', {
      d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    })
  )
}
