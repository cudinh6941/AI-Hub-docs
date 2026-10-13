/**
 * Content Service: the ONLY place the UI reads content from.
 *
 * Today: static JSON bundled with the app (mock).
 * Later: replace the bodies below with fetch() calls to a backend that reads
 * SharePoint/OneDrive via Microsoft Graph. Function signatures must not change.
 */
import { ALL_PROMPTS, getPromptStats } from '../data/prompts/index.js'
import videosData from '../data/videos.json'

const VIDEOS = videosData

export async function getPrompts() {
  return ALL_PROMPTS
}

export async function getPromptBySlug(slug) {
  const prompt = ALL_PROMPTS.find((p) => p.slug === slug)
  if (!prompt) return null
  const relatedVideos = VIDEOS.filter((v) => v.relatedPromptIds.includes(prompt.id))
  return { ...prompt, relatedVideos }
}

export async function getVideos() {
  return VIDEOS
}

export async function getVideoBySlug(slug) {
  const video = VIDEOS.find((v) => v.slug === slug)
  if (!video) return null
  const relatedPrompts = ALL_PROMPTS.filter((p) => video.relatedPromptIds.includes(p.id))
  return { ...video, relatedPrompts }
}

export async function getHomeData() {
  const featuredPrompts = [...ALL_PROMPTS]
    .filter((p) => p.verified)
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, 3)
  return {
    prompts: ALL_PROMPTS,
    featuredPrompts,
    videos: VIDEOS,
    stats: { ...getPromptStats(), videos: VIDEOS.length },
  }
}
