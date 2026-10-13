import bodPrompts from './bod.json'
import financePrompts from './finance.json'
import hrPrompts from './hr.json'
import legalPrompts from './legal.json'
import operationsPrompts from './operations.json'

/**
 * Validate prompt recipe against the standard Enterprise Schema
 * @param {object} p - Prompt object
 * @returns {boolean}
 */
export function validatePrompt(p) {
  const requiredFields = [
    'id', 'title', 'slug', 'department', 'tool', 'difficulty',
    'verified', 'rating', 'copyCount', 'updatedAt',
    'summary', 'promptTemplate', 'variables', 'whyEffective',
    'inputSample', 'outputSample', 'tags'
  ]
  
  for (const field of requiredFields) {
    if (p[field] === undefined || p[field] === null) {
      console.warn(`[Prompt Schema Warning] Prompt ${p.id || 'UNKNOWN'} is missing required field: ${field}`)
      return false
    }
  }
  return true
}

// Aggregated raw list
const rawPrompts = [
  ...bodPrompts,
  ...financePrompts,
  ...hrPrompts,
  ...legalPrompts,
  ...operationsPrompts,
]

// Filter valid prompts and sort by verified status & rating
export const ALL_PROMPTS = rawPrompts.filter(validatePrompt)

// Unique lists for filters
export const DEPARTMENTS = [
  'Tất cả',
  'Ban Giám Đốc',
  'Tài chính - Kế toán',
  'Nhân sự',
  'Pháp chế',
  'Vận hành'
]

export const TOOLS = [
  'Tất cả',
  'M365 Copilot',
  'Excel Copilot',
  'Word Copilot',
  'Teams',
  'ChatGPT / Claude'
]

export const DIFFICULTIES = ['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao']

/**
 * Get prompt by ID
 */
export function getPromptById(id) {
  return ALL_PROMPTS.find(p => p.id === id) || null
}

/**
 * Get prompt by Slug
 */
export function getPromptBySlug(slug) {
  return ALL_PROMPTS.find(p => p.slug === slug) || null
}

/**
 * Get overall repository statistics
 */
export function getPromptStats() {
  const total = ALL_PROMPTS.length
  const verifiedCount = ALL_PROMPTS.filter(p => p.verified).length
  const totalCopies = ALL_PROMPTS.reduce((sum, p) => sum + (p.copyCount || 0), 0)
  const averageRating = (
    ALL_PROMPTS.reduce((sum, p) => sum + (p.rating || 0), 0) / (total || 1)
  ).toFixed(1)

  return {
    total,
    verifiedCount,
    totalCopies,
    averageRating
  }
}

export default ALL_PROMPTS
