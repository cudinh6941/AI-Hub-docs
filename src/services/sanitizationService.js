/**
 * Data Sanitization & Anonymization Guardrail Service
 * Implements `.agents/skills/data-sanitization/SKILL.md`:
 * - Pattern Scanning (Phones, Real Emails, Internal IPs, API Keys)
 * - Auto-Sanitization helper for Admin Prompt Studio & Server Middleware
 * - Dynamic [Variable] extraction for R-C-T-C-F Prompt Templates
 */

const SAFE_EMAIL_DOMAINS = ['example.com', 'company.vn', 'congty.vn', 'domain.com']

const PII_PATTERNS = [
  {
    type: 'phone',
    label: 'Số điện thoại cá nhân',
    regex: /\b(?:\+?84|0)(?:3|5|7|8|9)\d{8}\b/g,
    replacement: '[Số_Điện_Thoại]'
  },
  {
    type: 'email',
    label: 'Địa chỉ Email thực tế',
    regex: /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g,
    replacement: 'contact@company.vn',
    validator: (match, domain) => !SAFE_EMAIL_DOMAINS.includes(String(domain || '').toLowerCase())
  },
  {
    type: 'internal_ip',
    label: 'Địa chỉ IP nội bộ',
    regex: /\b(?:192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b/g,
    replacement: '10.0.0.x'
  },
  {
    type: 'api_key',
    label: 'API Key / Secret Token',
    regex: /\b(?:sk-[a-zA-Z0-9_-]{16,}|ghp_[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{25,})\b/g,
    replacement: 'your-api-key'
  },
  {
    type: 'cccd',
    label: 'Số CCCD / CMND (12 số)',
    regex: /\b0\d{11}\b/g,
    replacement: '[Số_CCCD_Mẫu]'
  }
]

/**
 * Scan a text string for sensitive PII patterns.
 * @param {string} text
 * @param {string} fieldName
 * @returns {Array<{type: string, label: string, match: string, field: string, suggestion: string}>}
 */
export function scanTextForPII(text, fieldName = 'content') {
  if (!text || typeof text !== 'string') return []
  const findings = []

  for (const rule of PII_PATTERNS) {
    const regex = new RegExp(rule.regex.source, 'g')
    let match
    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0]
      const group1 = match[1]
      if (rule.validator && !rule.validator(fullMatch, group1)) {
        continue
      }
      findings.push({
        type: rule.type,
        label: rule.label,
        match: fullMatch,
        field: fieldName,
        suggestion: rule.replacement
      })
    }
  }

  return findings
}

/**
 * Scan an entire prompt payload across all text fields.
 * @param {object} payload
 * @returns {{ clean: boolean, findings: Array }}
 */
export function scanPromptPayload(payload = {}) {
  const fieldsToScan = [
    { key: 'title', label: 'Tiêu đề' },
    { key: 'summary', label: 'Tóm tắt' },
    { key: 'promptTemplate', label: 'Prompt Template' },
    { key: 'whyEffective', label: 'Lý do hiệu quả' },
    { key: 'inputSample', label: 'Dữ liệu mẫu (Before)' },
    { key: 'outputSample', label: 'Kết quả mẫu (After)' }
  ]

  const allFindings = []
  for (const f of fieldsToScan) {
    const val = payload[f.key]
    if (val) {
      allFindings.push(...scanTextForPII(val, f.label))
    }
  }

  return {
    clean: allFindings.length === 0,
    findings: allFindings
  }
}

/**
 * Automatically sanitize a text string by replacing detected PII with safe placeholders.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return text
  let result = text

  for (const rule of PII_PATTERNS) {
    const regex = new RegExp(rule.regex.source, 'g')
    result = result.replace(regex, (fullMatch, group1) => {
      if (rule.validator && !rule.validator(fullMatch, group1)) {
        return fullMatch
      }
      return rule.replacement
    })
  }

  return result
}

/**
 * Auto-sanitize all relevant fields in a prompt object.
 * @param {object} payload
 * @returns {object}
 */
export function sanitizePromptPayload(payload = {}) {
  return {
    ...payload,
    title: sanitizeText(payload.title || ''),
    summary: sanitizeText(payload.summary || ''),
    promptTemplate: sanitizeText(payload.promptTemplate || ''),
    whyEffective: sanitizeText(payload.whyEffective || ''),
    inputSample: sanitizeText(payload.inputSample || ''),
    outputSample: sanitizeText(payload.outputSample || '')
  }
}

/**
 * Extract bracketed variables `[Tên_Biến]` from promptTemplate as an array of strings.
 * @param {string} promptTemplate
 * @returns {string[]}
 */
export function extractVariablesFromTemplate(promptTemplate = '') {
  if (!promptTemplate || typeof promptTemplate !== 'string') return []
  const regex = /\[([^\][\n]{1,60})\]/g
  const seen = new Set()
  const extracted = []

  let match
  while ((match = regex.exec(promptTemplate)) !== null) {
    const rawName = match[1].trim()
    // Ignore markdown checkboxes like [x] or [ ]
    if (!rawName || rawName === 'x' || rawName === 'X') continue
    if (seen.has(rawName)) continue
    seen.add(rawName)
    extracted.push(rawName)
  }

  return extracted
}

/**
 * Convert Vietnamese string to URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
export function generateSlug(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
