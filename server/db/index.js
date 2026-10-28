import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import pg from 'pg'
import { PGlite } from '@electric-sql/pglite'
import { SCHEMA_SQL } from './schema.js'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '../..')

let dbInstance = null
let activeEngine = null // 'postgresql' | 'pglite'
let initPromise = null

const INITIAL_DEPARTMENTS = [
  { id: 'bod', name: 'Ban Giám Đốc', prefix: 'BOD', description: 'Chiến lược, điều hành và phân tích quyết định quản trị' },
  { id: 'finance', name: 'Tài chính - Kế toán', prefix: 'FIN', description: 'Phân tích báo cáo tài chính, dòng tiền, đối soát công nợ và ngân sách' },
  { id: 'hr', name: 'Nhân sự', prefix: 'HR', description: 'Tuyển dụng, đánh giá năng lực, đào tạo và truyền thông nội bộ' },
  { id: 'legal', name: 'Pháp chế', prefix: 'LEG', description: 'Rà soát hợp đồng, kiểm soát rủi ro pháp lý và tuân thủ' },
  { id: 'operations', name: 'Vận hành', prefix: 'OPS', description: 'Tối ưu quy trình, quản lý dự án, chuỗi cung ứng và dịch vụ khách hàng' }
]

function resolveDepartmentId(deptName) {
  const found = INITIAL_DEPARTMENTS.find(
    (d) => d.name.toLowerCase() === String(deptName || '').toLowerCase()
  )
  return found ? found.id : 'operations'
}

/**
 * Load JSON seed files from src/data/prompts/*.json and src/data/videos.json
 */
function loadInitialJsonData() {
  try {
    const bod = require('../../src/data/prompts/bod.json')
    const fin = require('../../src/data/prompts/finance.json')
    const hr = require('../../src/data/prompts/hr.json')
    const leg = require('../../src/data/prompts/legal.json')
    const ops = require('../../src/data/prompts/operations.json')
    const videos = require('../../src/data/videos.json')
    return {
      prompts: [...bod, ...fin, ...hr, ...leg, ...ops],
      videos: Array.isArray(videos) ? videos : []
    }
  } catch {
    const promptsDir = path.join(ROOT_DIR, 'src/data/prompts')
    const jsonFiles = ['bod.json', 'finance.json', 'hr.json', 'legal.json', 'operations.json']
    const prompts = []

    for (const file of jsonFiles) {
      const fullPath = path.join(promptsDir, file)
      if (fs.existsSync(fullPath)) {
        const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
        if (Array.isArray(parsed)) {
          prompts.push(...parsed)
        }
      }
    }

    const videosPath = path.join(ROOT_DIR, 'src/data/videos.json')
    const videos = fs.existsSync(videosPath)
      ? JSON.parse(fs.readFileSync(videosPath, 'utf-8'))
      : []

    return { prompts, videos }
  }
}

/**
 * Normalize database row (snake_case) to Frontend Enterprise Prompt Schema (camelCase)
 */
export function mapRowToPrompt(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    department: row.department,
    tool: row.tool,
    difficulty: row.difficulty,
    verified: Boolean(row.verified),
    rating: Number(row.rating ?? 5.0),
    copyCount: Number(row.copy_count ?? 0),
    updatedAt: row.updated_at,
    summary: row.summary,
    promptTemplate: row.prompt_template,
    variables: typeof row.variables === 'string' ? JSON.parse(row.variables) : (row.variables || []),
    whyEffective: row.why_effective,
    inputSample: row.input_sample,
    outputSample: row.output_sample,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
  }
}

/**
 * Normalize database row to Video schema
 */
export function mapRowToVideo(row) {
  if (!row) return null
  const chapters = typeof row.chapters === 'string' ? JSON.parse(row.chapters) : (row.chapters || [])
  const relatedPromptIds =
    typeof row.related_prompt_ids === 'string'
      ? JSON.parse(row.related_prompt_ids)
      : (row.related_prompt_ids || [])
  const tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])

  const sourceType = row.source_type || 'youtube'
  const sourceUrl = row.source_url || ''
  const provider = (sourceType === 'youtube' || sourceUrl.includes('youtu'))
    ? 'YouTube'
    : 'SharePoint / Stream'

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    durationMinutes: Number(row.duration_minutes ?? 5),
    level: row.level,
    department: row.department,
    tool: row.tool,
    updatedAt: row.updated_at,
    accent: row.accent || 'from-indigo-500 to-purple-500',
    sourceType,
    sourceUrl,
    source: {
      type: sourceType,
      url: sourceUrl,
      provider
    },
    chapters,
    transcript: row.transcript || '',
    relatedPromptIds,
    tags
  }
}

/**
 * Initialize Database Connection:
 * - Priority 1: Connect to PostgreSQL via process.env.DATABASE_URL
 * - Priority 2: Fallback automatically to embedded PGlite
 */
export async function getDb() {
  if (dbInstance) return { db: dbInstance, engine: activeEngine }
  if (initPromise) return initPromise

  initPromise = (async () => {
    const databaseUrl = process.env.DATABASE_URL?.trim()

    if (databaseUrl) {
      try {
        const pool = new pg.Pool({
          connectionString: databaseUrl,
          connectionTimeoutMillis: 5000,
          ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
        })
        await pool.query('SELECT 1')
        dbInstance = {
          query: (text, params) => pool.query(text, params),
          exec: (sql) => pool.query(sql)
        }
        activeEngine = 'postgresql'
        console.log('[DB Adapter] Connected to external PostgreSQL via DATABASE_URL')
      } catch (err) {
        console.warn(
          `[DB Adapter] Failed to connect via DATABASE_URL (${err.message}). Falling back to embedded PGlite...`
        )
      }
    }

    if (!dbInstance) {
      const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
      const baseDir = isServerless ? '/tmp' : ROOT_DIR
      const pgDataDir = path.join(baseDir, 'database/pgdata')
      fs.mkdirSync(path.dirname(pgDataDir), { recursive: true })
      const pglite = new PGlite(pgDataDir)
      await pglite.waitReady
      dbInstance = {
        query: (text, params) => pglite.query(text, params),
        exec: (sql) => pglite.exec(sql)
      }
      activeEngine = 'pglite'
      console.log(`[DB Adapter] Running embedded PostgreSQL (PGlite) at ${pgDataDir}`)
    }

    // Check if videos table needs migration or recreation (e.g. missing chapters or duration_minutes)
    try {
      const colCheck = await dbInstance.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'videos' AND column_name = 'chapters'
      `)
      const tableCheck = await dbInstance.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'videos'
      `)
      if (tableCheck.rows.length > 0 && colCheck.rows.length === 0) {
        console.log('[DB Adapter] Legacy videos table schema detected. Dropping old table to upgrade schema...')
        await dbInstance.exec('DROP TABLE IF EXISTS videos CASCADE;')
      }
    } catch (err) {
      console.warn('[DB Adapter] Migration check warning:', err.message)
    }

    // Apply schema DDL (uses inline SCHEMA_SQL with fallback to file)
    let schemaSql = SCHEMA_SQL
    try {
      const schemaPath = path.join(__dirname, 'schema.sql')
      if (fs.existsSync(schemaPath)) {
        schemaSql = fs.readFileSync(schemaPath, 'utf-8')
      }
    } catch {
      schemaSql = SCHEMA_SQL
    }
    await dbInstance.exec(schemaSql)

    // Seed initial departments & prompts if empty
    const countRes = await dbInstance.query('SELECT COUNT(*)::int AS count FROM prompts')
    const currentCount = countRes.rows[0]?.count ?? 0

    if (currentCount === 0) {
      console.log('[DB Adapter] Empty database detected. Seeding initial departments & prompts...')
      for (const dept of INITIAL_DEPARTMENTS) {
        await dbInstance.query(
          `INSERT INTO departments (id, name, prefix, description)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO NOTHING`,
          [dept.id, dept.name, dept.prefix, dept.description]
        )
      }

      const { prompts } = loadInitialJsonData()
      for (const p of prompts) {
        await dbInstance.query(
          `INSERT INTO prompts (
            id, department_id, department, title, slug, tool, difficulty,
            verified, rating, copy_count, updated_at, summary, prompt_template,
            variables, why_effective, input_sample, output_sample, tags
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13,
            $14::jsonb, $15, $16, $17, $18::jsonb
          ) ON CONFLICT (id) DO NOTHING`,
          [
            p.id,
            resolveDepartmentId(p.department),
            p.department,
            p.title,
            p.slug,
            p.tool,
            p.difficulty,
            Boolean(p.verified),
            Number(p.rating ?? 5.0),
            Number(p.copyCount ?? 0),
            p.updatedAt || new Date().toISOString().slice(0, 10),
            p.summary,
            p.promptTemplate,
            JSON.stringify(p.variables || []),
            p.whyEffective,
            p.inputSample,
            p.outputSample,
            JSON.stringify(p.tags || [])
          ]
        )
      }
      console.log(`[DB Adapter] Seeded ${prompts.length} prompts successfully.`)
    }

    // Seed videos if empty
    const videoCountRes = await dbInstance.query('SELECT COUNT(*)::int AS count FROM videos')
    const currentVideoCount = videoCountRes.rows[0]?.count ?? 0

    if (currentVideoCount === 0) {
      console.log('[DB Adapter] Seeding videos from src/data/videos.json...')
      const { videos } = loadInitialJsonData()
      for (const v of videos) {
        await dbInstance.query(
          `INSERT INTO videos (
            id, title, slug, summary, duration_minutes, level, department, tool,
            updated_at, accent, source_type, source_url, chapters, transcript,
            related_prompt_ids, tags
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13::jsonb, $14,
            $15::jsonb, $16::jsonb
          ) ON CONFLICT (id) DO NOTHING`,
          [
            v.id,
            v.title,
            v.slug,
            v.summary,
            Number(v.durationMinutes ?? 5),
            v.level || 'Cơ bản',
            v.department || 'Chung',
            v.tool || 'M365 Copilot',
            v.updatedAt || new Date().toISOString().slice(0, 10),
            v.accent || 'from-indigo-500 to-purple-500',
            v.source?.type || v.sourceType || 'placeholder',
            v.source?.url || v.sourceUrl || '',
            JSON.stringify(v.chapters || []),
            v.transcript || '',
            JSON.stringify(v.relatedPromptIds || []),
            JSON.stringify(v.tags || [])
          ]
        )
      }
      console.log(`[DB Adapter] Seeded ${videos.length} videos successfully.`)
    }

    return { db: dbInstance, engine: activeEngine }
  })()

  return initPromise
}

export { resolveDepartmentId, INITIAL_DEPARTMENTS }
