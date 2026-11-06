import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

async function run() {
  const databaseUrl = process.argv[2] || process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ Lỗi: Thiếu DATABASE_URL!')
    console.log('Cách dùng:')
    console.log('  node scripts/seed-neon.js "postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"')
    console.log('hoặc đặt DATABASE_URL trong file .env rồi chạy lại.')
    process.exit(1)
  }

  console.log('⏳ Đang kết nối tới database...')
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Kết nối thành công!')

    const sqlPath = path.join(ROOT_DIR, 'database/neon_init.sql')
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Không tìm thấy file SQL tại ${sqlPath}`)
    }

    const sql = fs.readFileSync(sqlPath, 'utf-8')
    console.log('⏳ Đang khởi tạo bảng và nạp dữ liệu mẫu vào Neon...')
    await client.query(sql)

    const videosCount = await client.query('SELECT COUNT(*)::int AS count FROM videos')
    const promptsCount = await client.query('SELECT COUNT(*)::int AS count FROM prompts')
    const deptsCount = await client.query('SELECT COUNT(*)::int AS count FROM departments')

    console.log('🎉 KHỞI TẠO NEON THÀNH CÔNG!')
    console.log(`- Phòng ban (departments): ${deptsCount.rows[0].count}`)
    console.log(`- Prompts: ${promptsCount.rows[0].count}`)
    console.log(`- Videos: ${videosCount.rows[0].count}`)
  } catch (err) {
    console.error('❌ Lỗi khi khởi tạo database:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
