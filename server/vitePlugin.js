import { getRequestListener } from '@hono/node-server'
import apiApp from './app.js'

/**
 * Vite Plugin that mounts the Hono + PostgreSQL/PGlite API Server
 * directly on `/api/*` during `npm run dev` and `npm run preview`.
 */
export function aiHubApiPlugin() {
  const listener = getRequestListener(apiApp.fetch)

  const middleware = async (req, res, next) => {
    if (req.url && req.url.startsWith('/api')) {
      try {
        await listener(req, res)
      } catch (err) {
        console.error('[Hono API Error]:', err)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }))
      }
      return
    }
    next()
  }

  return {
    name: 'ai-hub-hono-postgres-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    }
  }
}
