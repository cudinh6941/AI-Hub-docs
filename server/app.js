import { Hono } from 'hono'
import { getDb, mapRowToPrompt, mapRowToVideo, resolveDepartmentId, INITIAL_DEPARTMENTS } from './db/index.js'
import { scanPromptPayload, extractVariablesFromTemplate, generateSlug } from '../src/services/sanitizationService.js'

const app = new Hono()

const DEFAULT_ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'aihub-admin-2026'

function isAuthorizedAdmin(c) {
  const headerKey = c.req.header('x-admin-passkey') || ''
  return headerKey && headerKey === (process.env.ADMIN_PASSKEY || DEFAULT_ADMIN_PASSKEY)
}

/**
 * Health & Active Database Engine status
 */
app.get('/api/health', async (c) => {
  const { db, engine } = await getDb()
  const countRes = await db.query('SELECT COUNT(*)::int AS count FROM prompts')
  return c.json({
    ok: true,
    engine,
    promptCount: countRes.rows[0]?.count ?? 0
  })
})

/**
 * Verify Admin Passkey
 */
app.post('/api/auth/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const passkey = body.passkey || c.req.header('x-admin-passkey') || ''
  const expected = process.env.ADMIN_PASSKEY || DEFAULT_ADMIN_PASSKEY

  if (passkey === expected) {
    return c.json({ authenticated: true, role: 'admin' })
  }
  return c.json({ authenticated: false, error: 'Mã xác thực Admin không chính xác.' }, 401)
})

/**
 * GET /api/prompts — List all prompts (optional ?department= filter)
 */
app.get('/api/prompts', async (c) => {
  const { db, engine } = await getDb()
  const department = c.req.query('department')

  let res
  if (department && department !== 'Tất cả') {
    res = await db.query(
      'SELECT * FROM prompts WHERE LOWER(department) = LOWER($1) ORDER BY verified DESC, copy_count DESC, id ASC',
      [department]
    )
  } else {
    res = await db.query('SELECT * FROM prompts ORDER BY verified DESC, copy_count DESC, id ASC')
  }

  const prompts = res.rows.map(mapRowToPrompt)
  return c.json({ prompts, engine })
})

/**
 * GET /api/prompts/:idOrSlug — Get single prompt by ID or slug
 */
app.get('/api/prompts/:idOrSlug', async (c) => {
  const { db } = await getDb()
  const param = c.req.param('idOrSlug')

  const res = await db.query(
    'SELECT * FROM prompts WHERE id = $1 OR slug = $1 LIMIT 1',
    [param]
  )
  const prompt = mapRowToPrompt(res.rows[0])
  if (!prompt) {
    return c.json({ error: 'Không tìm thấy Prompt.' }, 404)
  }

  const videosRes = await db.query('SELECT * FROM videos')
  const videos = videosRes.rows.map(mapRowToVideo)
  const relatedVideos = videos.filter((v) => v.relatedPromptIds.includes(prompt.id))

  return c.json({ prompt: { ...prompt, relatedVideos } })
})

/**
 * GET /api/videos — List all videos
 */
app.get('/api/videos', async (c) => {
  const { db } = await getDb()
  const res = await db.query('SELECT * FROM videos ORDER BY id ASC')
  return c.json({ videos: res.rows.map(mapRowToVideo) })
})

/**
 * GET /api/videos/:idOrSlug — Get single video by ID or slug with related prompts
 */
app.get('/api/videos/:idOrSlug', async (c) => {
  const { db } = await getDb()
  const param = c.req.param('idOrSlug')

  const res = await db.query(
    'SELECT * FROM videos WHERE id = $1 OR slug = $1 LIMIT 1',
    [param]
  )
  const video = mapRowToVideo(res.rows[0])
  if (!video) {
    return c.json({ error: 'Không tìm thấy Video.' }, 404)
  }

  const promptsRes = await db.query('SELECT * FROM prompts')
  const allPrompts = promptsRes.rows.map(mapRowToPrompt)
  const relatedPrompts = allPrompts.filter((p) =>
    (video.relatedPromptIds || []).includes(p.id)
  )

  return c.json({ video: { ...video, relatedPrompts } })
})

/**
 * POST /api/videos — Create new video (Admin Only)
 */
app.post('/api/videos', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Unauthorized: Chỉ Quản trị viên mới có quyền tạo Video.' }, 401)
  }

  const body = await c.req.json().catch(() => null)
  if (!body || !body.title) {
    return c.json({ error: 'Thiếu trường bắt buộc (Tiêu đề video).' }, 400)
  }

  const { db } = await getDb()

  // Auto-generate next VID-XXX if not provided
  let videoId = (body.id || '').trim().toUpperCase()
  if (!videoId) {
    const existingRes = await db.query('SELECT id FROM videos WHERE id LIKE $1', ['VID-%'])
    const maxNum = existingRes.rows.reduce((max, r) => {
      const m = String(r.id).match(/(\d+)$/)
      return m ? Math.max(max, parseInt(m[1], 10)) : max
    }, 0)
    videoId = `VID-${String(maxNum + 1).padStart(3, '0')}`
  }

  const slug = (body.slug || generateSlug(body.title)).trim() || videoId.toLowerCase()
  const chapters = Array.isArray(body.chapters) ? body.chapters : []
  const relatedPromptIds = Array.isArray(body.relatedPromptIds)
    ? body.relatedPromptIds
    : (Array.isArray(body.related_prompt_ids) ? body.related_prompt_ids : [])
  const tags = Array.isArray(body.tags)
    ? body.tags
    : (typeof body.tags === 'string'
        ? body.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [])

  const sourceType = body.sourceType || body.source_type || body.source?.type || (body.sourceUrl?.includes('youtu') ? 'youtube' : 'placeholder')
  const sourceUrl = body.sourceUrl || body.source_url || body.source?.url || ''
  const updatedAt = new Date().toISOString().slice(0, 10)

  await db.query(
    `INSERT INTO videos (
      id, title, slug, summary, duration_minutes, level, department, tool,
      updated_at, accent, source_type, source_url, chapters, transcript,
      related_prompt_ids, tags
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13::jsonb, $14,
      $15::jsonb, $16::jsonb
    )`,
    [
      videoId,
      body.title.trim(),
      slug,
      (body.summary || body.title).trim(),
      Number(body.durationMinutes ?? body.duration_minutes ?? 5),
      body.level || 'Cơ bản',
      body.department || 'Chung',
      body.tool || 'M365 Copilot',
      updatedAt,
      body.accent || 'from-indigo-500 to-purple-500',
      sourceType,
      sourceUrl,
      JSON.stringify(chapters),
      body.transcript || '',
      JSON.stringify(relatedPromptIds),
      JSON.stringify(tags)
    ]
  )

  const inserted = await db.query('SELECT * FROM videos WHERE id = $1', [videoId])
  return c.json({ video: mapRowToVideo(inserted.rows[0]) }, 201)
})

/**
 * PUT /api/videos/:id — Update existing video (Admin Only)
 */
app.put('/api/videos/:id', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Unauthorized: Chỉ Quản trị viên mới có quyền chỉnh sửa Video.' }, 401)
  }

  const targetId = c.req.param('id')
  const body = await c.req.json().catch(() => null)
  if (!body || !body.title) {
    return c.json({ error: 'Thiếu trường bắt buộc (Tiêu đề video).' }, 400)
  }

  const { db } = await getDb()
  const existingRes = await db.query('SELECT * FROM videos WHERE id = $1', [targetId])
  if (existingRes.rows.length === 0) {
    return c.json({ error: `Không tìm thấy Video có mã ${targetId}` }, 404)
  }

  const current = mapRowToVideo(existingRes.rows[0])
  const slug = (body.slug || generateSlug(body.title)).trim() || current.slug
  const chapters = Array.isArray(body.chapters) ? body.chapters : current.chapters
  const relatedPromptIds = Array.isArray(body.relatedPromptIds)
    ? body.relatedPromptIds
    : (Array.isArray(body.related_prompt_ids) ? body.related_prompt_ids : current.relatedPromptIds)
  const tags = Array.isArray(body.tags)
    ? body.tags
    : (typeof body.tags === 'string'
        ? body.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : current.tags)

  const sourceType = body.sourceType || body.source_type || body.source?.type || current.sourceType
  const sourceUrl = body.sourceUrl ?? body.source_url ?? body.source?.url ?? current.sourceUrl
  const updatedAt = new Date().toISOString().slice(0, 10)

  await db.query(
    `UPDATE videos SET
      title = $1,
      slug = $2,
      summary = $3,
      duration_minutes = $4,
      level = $5,
      department = $6,
      tool = $7,
      updated_at = $8,
      accent = $9,
      source_type = $10,
      source_url = $11,
      chapters = $12::jsonb,
      transcript = $13,
      related_prompt_ids = $14::jsonb,
      tags = $15::jsonb
    WHERE id = $16`,
    [
      body.title.trim(),
      slug,
      (body.summary || current.summary).trim(),
      Number(body.durationMinutes ?? body.duration_minutes ?? current.durationMinutes),
      body.level || current.level,
      body.department || current.department,
      body.tool || current.tool,
      updatedAt,
      body.accent || current.accent,
      sourceType,
      sourceUrl,
      JSON.stringify(chapters),
      body.transcript !== undefined ? body.transcript : current.transcript,
      JSON.stringify(relatedPromptIds),
      JSON.stringify(tags),
      targetId
    ]
  )

  const updatedRes = await db.query('SELECT * FROM videos WHERE id = $1', [targetId])
  return c.json({ video: mapRowToVideo(updatedRes.rows[0]) })
})

/**
 * DELETE /api/videos/:id — Delete video (Admin Only)
 */
app.delete('/api/videos/:id', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Unauthorized: Chỉ Quản trị viên mới có quyền xóa Video.' }, 401)
  }

  const targetId = c.req.param('id')
  const { db } = await getDb()

  const existingRes = await db.query('SELECT id, title FROM videos WHERE id = $1', [targetId])
  if (existingRes.rows.length === 0) {
    return c.json({ error: `Không tìm thấy Video ${targetId}` }, 404)
  }

  await db.query('DELETE FROM videos WHERE id = $1', [targetId])
  return c.json({ deleted: true, id: targetId })
})


/**
 * POST /api/prompts — Create new prompt (Admin Only + PII Guardrail)
 */
app.post('/api/prompts', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Unauthorized: Chỉ Quản trị viên mới có quyền tạo Prompt.' }, 401)
  }

  const body = await c.req.json().catch(() => null)
  if (!body || !body.title || !body.promptTemplate || !body.department) {
    return c.json({ error: 'Thiếu trường bắt buộc (Tiêu đề, Phòng ban, hoặc Prompt Template).' }, 400)
  }

  // Enforce Data Sanitization Guardrail
  const piiScan = scanPromptPayload(body)
  if (!piiScan.clean) {
    return c.json(
      {
        error: 'Phát hiện dữ liệu nhạy cảm (PII) chưa được ẩn danh!',
        findings: piiScan.findings
      },
      422
    )
  }

  const { db } = await getDb()
  const deptObj = INITIAL_DEPARTMENTS.find(
    (d) => d.name.toLowerCase() === String(body.department).toLowerCase()
  ) || INITIAL_DEPARTMENTS[4]

  // Auto-generate next ID if not provided
  let promptId = (body.id || '').trim().toUpperCase()
  if (!promptId) {
    const existingRes = await db.query(
      'SELECT id FROM prompts WHERE id LIKE $1',
      [`${deptObj.prefix}-%`]
    )
    const maxNum = existingRes.rows.reduce((max, r) => {
      const m = String(r.id).match(/(\d+)$/)
      return m ? Math.max(max, parseInt(m[1], 10)) : max
    }, 0)
    promptId = `${deptObj.prefix}-${String(maxNum + 1).padStart(3, '0')}`
  }

  const slug = (body.slug || generateSlug(body.title)).trim() || promptId.toLowerCase()
  const variables = Array.isArray(body.variables) && body.variables.length > 0
    ? body.variables
    : extractVariablesFromTemplate(body.promptTemplate, [])
  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

  const updatedAt = new Date().toISOString().slice(0, 10)

  await db.query(
    `INSERT INTO prompts (
      id, department_id, department, title, slug, tool, difficulty,
      verified, rating, copy_count, updated_at, summary, prompt_template,
      variables, why_effective, input_sample, output_sample, tags
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14::jsonb, $15, $16, $17, $18::jsonb
    )`,
    [
      promptId,
      resolveDepartmentId(body.department),
      body.department,
      body.title.trim(),
      slug,
      body.tool || 'M365 Copilot',
      body.difficulty || 'Trung cấp',
      body.verified !== undefined ? Boolean(body.verified) : true,
      Number(body.rating ?? 5.0),
      Number(body.copyCount ?? 0),
      updatedAt,
      (body.summary || body.title).trim(),
      body.promptTemplate.trim(),
      JSON.stringify(variables),
      (body.whyEffective || 'Áp dụng chuẩn cấu trúc 5 thành tố R-C-T-C-F giúp AI nắm bắt ngữ cảnh chính xác và định dạng đầu ra chuẩn doanh nghiệp.').trim(),
      (body.inputSample || 'Dữ liệu đầu vào mẫu đã được ẩn danh theo tiêu chuẩn Data Sanitization.').trim(),
      (body.outputSample || 'Kết quả đầu ra chuẩn hóa theo định dạng yêu cầu trong Prompt.').trim(),
      JSON.stringify(tags.length > 0 ? tags : [deptObj.id, 'rctcf'])
    ]
  )

  const inserted = await db.query('SELECT * FROM prompts WHERE id = $1', [promptId])
  return c.json({ prompt: mapRowToPrompt(inserted.rows[0]) }, 201)
})

/**
 * PUT /api/prompts/:id — Update existing prompt (Admin Only + PII Guardrail)
 */
app.put('/api/prompts/:id', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Unauthorized: Chỉ Quản trị viên mới có quyền chỉnh sửa Prompt.' }, 401)
  }

  const targetId = c.req.param('id')
  const body = await c.req.json().catch(() => null)
  if (!body || !body.title || !body.promptTemplate) {
    return c.json({ error: 'Thiếu trường bắt buộc (Tiêu đề hoặc Prompt Template).' }, 400)
  }

  const piiScan = scanPromptPayload(body)
  if (!piiScan.clean) {
    return c.json(
      {
        error: 'Phát hiện dữ liệu nhạy cảm (PII) chưa được ẩn danh!',
        findings: piiScan.findings
      },
      422
    )
  }

  const { db } = await getDb()
  const existingRes = await db.query('SELECT * FROM prompts WHERE id = $1', [targetId])
  if (existingRes.rows.length === 0) {
    return c.json({ error: `Không tìm thấy Prompt có mã ${targetId}` }, 404)
  }

  const current = mapRowToPrompt(existingRes.rows[0])
  const slug = (body.slug || generateSlug(body.title)).trim() || current.slug
  const extractedVars = extractVariablesFromTemplate(body.promptTemplate)
  const variables = extractedVars.length > 0
    ? extractedVars
    : (Array.isArray(body.variables) ? body.variables : current.variables)
  const tags = Array.isArray(body.tags)
    ? body.tags
    : String(body.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

  const updatedAt = new Date().toISOString().slice(0, 10)
  const department = body.department || current.department

  await db.query(
    `UPDATE prompts SET
      department_id = $1,
      department = $2,
      title = $3,
      slug = $4,
      tool = $5,
      difficulty = $6,
      verified = $7,
      rating = $8,
      updated_at = $9,
      summary = $10,
      prompt_template = $11,
      variables = $12::jsonb,
      why_effective = $13,
      input_sample = $14,
      output_sample = $15,
      tags = $16::jsonb
    WHERE id = $17`,
    [
      resolveDepartmentId(department),
      department,
      body.title.trim(),
      slug,
      body.tool || current.tool,
      body.difficulty || current.difficulty,
      body.verified !== undefined ? Boolean(body.verified) : current.verified,
      Number(body.rating ?? current.rating),
      updatedAt,
      (body.summary || current.summary).trim(),
      body.promptTemplate.trim(),
      JSON.stringify(variables),
      (body.whyEffective || current.whyEffective).trim(),
      (body.inputSample || current.inputSample).trim(),
      (body.outputSample || current.outputSample).trim(),
      JSON.stringify(tags),
      targetId
    ]
  )

  const updatedRes = await db.query('SELECT * FROM prompts WHERE id = $1', [targetId])
  return c.json({ prompt: mapRowToPrompt(updatedRes.rows[0]) })
})

/**
 * DELETE /api/prompts/:id — Delete prompt (Admin Only)
 */
app.delete('/api/prompts/:id', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Unauthorized: Chỉ Quản trị viên mới có quyền xóa Prompt.' }, 401)
  }

  const targetId = c.req.param('id')
  const { db } = await getDb()

  const existingRes = await db.query('SELECT id, title FROM prompts WHERE id = $1', [targetId])
  if (existingRes.rows.length === 0) {
    return c.json({ error: `Không tìm thấy Prompt ${targetId}` }, 404)
  }

  await db.query('DELETE FROM prompts WHERE id = $1', [targetId])
  return c.json({ deleted: true, id: targetId })
})

export default app
