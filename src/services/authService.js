const ADMIN_KEY_STORAGE = 'aihub_admin_passkey_v1'
const AUTH_EVENT = 'aihub:admin-auth-changed'

/**
 * Returns the currently stored admin passkey (if authenticated)
 */
export function getAdminPasskey() {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(ADMIN_KEY_STORAGE) || ''
}

/**
 * Checks whether the current browser session is in Admin Mode
 */
export function isAdminAuthenticated() {
  return Boolean(getAdminPasskey())
}

/**
 * Returns HTTP headers with the admin passkey for protected API calls
 */
export function getAdminHeaders() {
  const passkey = getAdminPasskey()
  return passkey ? { 'x-admin-passkey': passkey } : {}
}

/**
 * Verifies admin passkey against the Hono Backend API (/api/auth/verify)
 * @param {string} passkey
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function loginAdmin(passkey) {
  const trimmed = String(passkey || '').trim()
  if (!trimmed) {
    return { ok: false, error: 'Vui lòng nhập mã xác thực Admin.' }
  }

  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: trimmed })
    })

    if (res.ok) {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, trimmed)
      window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { isAdmin: true } }))
      return { ok: true }
    }

    const data = await res.json().catch(() => ({}))
    return { ok: false, error: data.error || 'Mã xác thực Admin không chính xác.' }
  } catch {
    // Fallback if offline/static preview: compare against default dev passkey
    if (trimmed === 'aihub-admin-2026') {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, trimmed)
      window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { isAdmin: true } }))
      return { ok: true }
    }
    return { ok: false, error: 'Không thể kết nối tới API xác thực.' }
  }
}

/**
 * Clears Admin session
 */
export function logoutAdmin() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(ADMIN_KEY_STORAGE)
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { isAdmin: false } }))
}

/**
 * Subscribe to admin authentication state changes
 * @param {(isAdmin: boolean) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeAdminAuth(callback) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => callback(isAdminAuthenticated())
  window.addEventListener(AUTH_EVENT, handler)
  return () => window.removeEventListener(AUTH_EVENT, handler)
}
