/**
 * Search & Ranking Engine for Enterprise Prompt Library
 * Supports Vietnamese accent-insensitive fuzzy & multi-field matching
 * and implements the weighted quality score formula:
 * Score = (Keyword Match Weight) * 2 + (rating * 10) + (log10(copyCount + 1) * 5)
 */

/**
 * Normalizes Vietnamese string: removes diacritics / tones, converts to lowercase
 * @param {string} str
 * @returns {string}
 */
export function normalizeVietnamese(str = '') {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim()
}

/**
 * Calculates keyword match weight across prioritized fields
 * @param {object} prompt - PromptRecipe object
 * @param {string[]} queryTokens - Array of search keywords normalized
 * @param {string} rawNormalizedQuery - Complete normalized query string
 * @returns {number}
 */
export function calculateKeywordWeight(prompt, queryTokens, rawNormalizedQuery) {
  if (!queryTokens.length) return 0

  let weight = 0

  const normTitle = normalizeVietnamese(prompt.title)
  const normSummary = normalizeVietnamese(prompt.summary)
  const normTags = (prompt.tags || []).map(t => normalizeVietnamese(t))
  const normDept = normalizeVietnamese(prompt.department)
  const normTool = normalizeVietnamese(prompt.tool)
  const normTemplate = normalizeVietnamese(prompt.promptTemplate)
  const normId = normalizeVietnamese(prompt.id)

  // Direct exact match boosts
  if (normTitle.includes(rawNormalizedQuery)) {
    weight += 50
  }
  if (normId === rawNormalizedQuery) {
    weight += 80
  }

  // Token-level matching
  for (const token of queryTokens) {
    if (!token) continue

    // Title match (Weight: 35)
    if (normTitle.includes(token)) {
      weight += 35
    }

    // Tag match (Weight: 25)
    if (normTags.some(tag => tag.includes(token))) {
      weight += 25
    }

    // Department & Tool match (Weight: 20)
    if (normDept.includes(token) || normTool.includes(token)) {
      weight += 20
    }

    // Summary match (Weight: 15)
    if (normSummary.includes(token)) {
      weight += 15
    }

    // Prompt Template match (Weight: 10)
    if (normTemplate.includes(token)) {
      weight += 10
    }
  }

  return weight
}

/**
 * Calculate the overall Quality & Relevance Score according to specification:
 * Score = (Keyword Match Weight) * 2 + (rating * 10) + (log10(copyCount + 1) * 5)
 * @param {object} prompt
 * @param {number} keywordWeight
 * @returns {number}
 */
export function computePromptScore(prompt, keywordWeight) {
  const ratingScore = (prompt.rating || 0) * 10
  const copyCountScore = Math.log10((prompt.copyCount || 0) + 1) * 5
  const keywordScore = keywordWeight * 2

  // Additional boost for verified prompts
  const verifiedBonus = prompt.verified ? 15 : 0

  return keywordScore + ratingScore + copyCountScore + verifiedBonus
}

/**
 * Main search, filter, and ranking function
 * @param {Array} prompts - List of all prompt recipes
 * @param {object} options - Filter & search parameters
 * @param {string} options.query - Free text search query
 * @param {string} options.department - Department filter
 * @param {string} options.tool - Tool filter
 * @param {string} options.difficulty - Difficulty filter
 * @param {string} options.quickFilter - 'all' | 'verified' | 'most-copied' | 'top-rated'
 * @returns {Array} - Ranked and filtered prompts with match metadata
 */
export function searchAndRankPrompts(prompts, {
  query = '',
  department = 'Tất cả',
  tool = 'Tất cả',
  difficulty = 'Tất cả',
  quickFilter = 'all'
} = {}) {
  const trimmedQuery = query.trim()
  const rawNormalizedQuery = normalizeVietnamese(trimmedQuery)
  const queryTokens = rawNormalizedQuery
    .split(/\s+/)
    .filter(token => token.length > 0)

  // 1. Filter phase
  const filtered = prompts.filter(prompt => {
    // Quick filter check
    if (quickFilter === 'verified' && !prompt.verified) {
      return false
    }

    // Department filter
    if (department !== 'Tất cả' && prompt.department !== department) {
      return false
    }

    // Tool filter
    if (tool !== 'Tất cả' && prompt.tool !== tool) {
      return false
    }

    // Difficulty filter
    if (difficulty !== 'Tất cả' && prompt.difficulty !== difficulty) {
      return false
    }

    // Search query match check: if query given, must match at least one field
    if (queryTokens.length > 0) {
      const keywordWeight = calculateKeywordWeight(prompt, queryTokens, rawNormalizedQuery)
      if (keywordWeight <= 0) {
        return false
      }
    }

    return true
  })

  // 2. Score calculation phase
  const scored = filtered.map(prompt => {
    const keywordWeight = queryTokens.length > 0
      ? calculateKeywordWeight(prompt, queryTokens, rawNormalizedQuery)
      : 0
    const score = computePromptScore(prompt, keywordWeight)

    return {
      ...prompt,
      _searchScore: score,
      _keywordWeight: keywordWeight
    }
  })

  // 3. Sorting & Ranking phase
  scored.sort((a, b) => {
    // Mode: Most Copied
    if (quickFilter === 'most-copied') {
      return (b.copyCount || 0) - (a.copyCount || 0)
    }

    // Mode: Top Rated
    if (quickFilter === 'top-rated') {
      if ((b.rating || 0) !== (a.rating || 0)) {
        return (b.rating || 0) - (a.rating || 0)
      }
      return (b.copyCount || 0) - (a.copyCount || 0)
    }

    // Mode: Verified first rule
    if (a.verified !== b.verified) {
      return a.verified ? -1 : 1
    }

    // Then by computed weighted score
    return b._searchScore - a._searchScore
  })

  return scored
}
