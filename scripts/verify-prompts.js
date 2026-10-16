/**
 * Standalone prompt data validator for 3-qa-verifier
 */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const REQUIRED_FIELDS = [
  'id', 'title', 'slug', 'department', 'tool', 'difficulty',
  'verified', 'rating', 'copyCount', 'updatedAt',
  'summary', 'promptTemplate', 'variables', 'whyEffective',
  'inputSample', 'outputSample', 'tags'
]

function validatePrompt(p) {
  for (const field of REQUIRED_FIELDS) {
    if (p[field] === undefined || p[field] === null) {
      console.warn(`[Prompt Schema Warning] Prompt ${p.id || 'UNKNOWN'} is missing required field: ${field}`)
      return false
    }
  }
  return true
}

const promptsDir = join(process.cwd(), 'src', 'data', 'prompts')
const jsonFiles = readdirSync(promptsDir).filter(f => f.endsWith('.json'))

let totalChecked = 0
let failedCount = 0

console.log(`[QA Validator] Starting audit on ${jsonFiles.length} prompt files in ${promptsDir}...`)

for (const file of jsonFiles) {
  const filePath = join(promptsDir, file)
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const list = JSON.parse(raw)
    if (!Array.isArray(list)) {
      console.error(`[FAIL] ${file}: Root content is not an array!`)
      failedCount++
      continue
    }
    for (const prompt of list) {
      totalChecked++
      const valid = validatePrompt(prompt)
      if (!valid) {
        console.error(`[FAIL] ${file} -> Prompt ID "${prompt.id || 'N/A'}" failed schema validation.`)
        failedCount++
      }
    }
    console.log(`[PASS] ${file} (${list.length} prompts OK)`)
  } catch (err) {
    console.error(`[ERROR] Failed to parse ${file}: ${err.message}`)
    failedCount++
  }
}

console.log(`[QA Validator Summary] Checked ${totalChecked} prompts. Errors: ${failedCount}.`)
if (failedCount > 0) {
  process.exit(1)
} else {
  console.log('[QA Validator PASS] All prompt recipes match Enterprise Schema.')
  process.exit(0)
}
