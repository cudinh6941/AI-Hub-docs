/**
 * Content Service: the ONLY place the UI reads and mutates content from.
 *
 * Connected to Hono + PostgreSQL / PGlite Backend API (`/api/*`).
 * Includes automatic fallback to bundled JSON if running in pure static mode.
 */
import { ALL_PROMPTS } from '../data/prompts/index.js'
import videosData from '../data/videos.json'
import guidesData from '../data/guides.json'
import { getAdminHeaders } from './authService.js'

const VIDEOS = videosData
const GUIDES = guidesData
let activeDbEngine = 'initializing'

function computeStatsFromList(promptsList) {
  const total = promptsList.length
  const verifiedCount = promptsList.filter((p) => p.verified).length
  const totalCopies = promptsList.reduce((sum, p) => sum + (p.copyCount || 0), 0)
  const averageRating = (
    promptsList.reduce((sum, p) => sum + (Number(p.rating) || 0), 0) / (total || 1)
  ).toFixed(1)

  return {
    total,
    verifiedCount,
    totalCopies,
    averageRating
  }
}

/**
 * Returns the currently active database engine ('postgresql' | 'pglite' | 'static-fallback')
 */
export function getActiveDbEngine() {
  return activeDbEngine
}

/**
 * Returns all prompts in the system from PostgreSQL / PGlite API.
 * @returns {Promise<Array>}
 */
export async function getPrompts() {
  try {
    const res = await fetch('/api/prompts')
    if (res.ok) {
      const data = await res.json()
      if (data.engine) activeDbEngine = data.engine
      if (Array.isArray(data.prompts)) return data.prompts
    }
  } catch {
    activeDbEngine = 'static-fallback'
  }
  return ALL_PROMPTS
}

/**
 * Alias for getPrompts() for explicit API naming.
 * @returns {Promise<Array>}
 */
export async function getAllPrompts() {
  return getPrompts()
}

/**
 * Finds a prompt by its unique ID (e.g., 'FIN-001', 'HR-002').
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPromptById(id) {
  try {
    const res = await fetch(`/api/prompts/${encodeURIComponent(id)}`)
    if (res.ok) {
      const data = await res.json()
      return data.prompt || null
    }
    if (res.status === 404) return null
  } catch {
    // Fallback to static bundle if API unreachable
  }
  const prompt = ALL_PROMPTS.find((p) => p.id === id)
  if (!prompt) return null
  const relatedVideos = VIDEOS.filter((v) => v.relatedPromptIds.includes(prompt.id))
  return { ...prompt, relatedVideos }
}

/**
 * Finds a prompt by its URL slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getPromptBySlug(slug) {
  try {
    const res = await fetch(`/api/prompts/${encodeURIComponent(slug)}`)
    if (res.ok) {
      const data = await res.json()
      return data.prompt || null
    }
    if (res.status === 404) return null
  } catch {
    // Fallback to static bundle if API unreachable
  }
  const prompt = ALL_PROMPTS.find((p) => p.slug === slug)
  if (!prompt) return null
  const relatedVideos = VIDEOS.filter((v) => v.relatedPromptIds.includes(prompt.id))
  return { ...prompt, relatedVideos }
}

/**
 * Filters prompts by department name.
 * @param {string} department
 * @returns {Promise<Array>}
 */
export async function getPromptsByDepartment(department) {
  const all = await getPrompts()
  if (!department || department === 'Tất cả') return all
  return all.filter((p) => p.department.toLowerCase() === department.toLowerCase())
}

/**
 * Returns all educational videos.
 * @returns {Promise<Array>}
 */
export async function getVideos() {
  try {
    const res = await fetch('/api/videos')
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.videos)) return data.videos
    }
  } catch {
    // Fallback to static videos
  }
  return VIDEOS
}

/**
 * Finds a video by its unique ID or URL slug.
 * @param {string} idOrSlug
 * @returns {Promise<Object|null>}
 */
export async function getVideoByIdOrSlug(idOrSlug) {
  try {
    const res = await fetch(`/api/videos/${encodeURIComponent(idOrSlug)}`)
    if (res.ok) {
      const data = await res.json()
      return data.video || null
    }
    if (res.status === 404) return null
  } catch {
    // Fallback to static videos
  }
  const [videos, prompts] = await Promise.all([getVideos(), getPrompts()])
  const video = videos.find((v) => v.id === idOrSlug || v.slug === idOrSlug)
  if (!video) return null
  const relatedPrompts = prompts.filter((p) => (video.relatedPromptIds || []).includes(p.id))
  return { ...video, relatedPrompts }
}

/**
 * Finds a video by its URL slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getVideoBySlug(slug) {
  return getVideoByIdOrSlug(slug)
}

/**
 * Aggregates data for the home page.
 * @returns {Promise<Object>}
 */
export async function getHomeData() {
  const [prompts, videos] = await Promise.all([getPrompts(), getVideos()])
  const featuredPrompts = [...prompts]
    .filter((p) => p.verified)
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, 3)

  return {
    prompts,
    featuredPrompts,
    videos,
    stats: { ...computeStatsFromList(prompts), videos: videos.length }
  }
}

/**
 * Creates a new Prompt in PostgreSQL / PGlite (Admin Only).
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createPrompt(payload) {
  const res = await fetch('/api/prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders()
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Không thể tạo Prompt mới.')
    err.findings = data.findings
    err.status = res.status
    throw err
  }
  return data.prompt
}

/**
 * Updates an existing Prompt in PostgreSQL / PGlite (Admin Only).
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updatePrompt(id, payload) {
  const res = await fetch(`/api/prompts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders()
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Không thể cập nhật Prompt.')
    err.findings = data.findings
    err.status = res.status
    throw err
  }
  return data.prompt
}

/**
 * Deletes a Prompt by ID from PostgreSQL / PGlite (Admin Only).
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deletePrompt(id) {
  const res = await fetch(`/api/prompts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      ...getAdminHeaders()
    }
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Không thể xóa Prompt.')
  }
  return data
}

/**
 * Creates a new Video in PostgreSQL / PGlite (Admin Only).
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createVideo(payload) {
  const res = await fetch('/api/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders()
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Không thể tạo Video mới.')
    err.status = res.status
    throw err
  }
  return data.video
}

/**
 * Updates an existing Video in PostgreSQL / PGlite (Admin Only).
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateVideo(id, payload) {
  const res = await fetch(`/api/videos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminHeaders()
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Không thể cập nhật Video.')
    err.status = res.status
    throw err
  }
  return data.video
}

/**
 * Deletes a Video by ID from PostgreSQL / PGlite (Admin Only).
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteVideo(id) {
  const res = await fetch(`/api/videos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      ...getAdminHeaders()
    }
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Không thể xóa Video.')
  }
  return data
}

/**
 * Returns all feature guides.
 * @returns {Promise<Array>}
 */
export async function getGuides() {
  return GUIDES
}

/**
 * Returns a specific guide by slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getGuideBySlug(slug) {
  const g = GUIDES.find((item) => item.slug === slug)
  return g || null
}


