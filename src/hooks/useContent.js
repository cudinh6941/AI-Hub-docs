import { useEffect, useState } from 'react'

/**
 * Runs an async loader and exposes { data, loading, error }.
 * @param {() => Promise<any>} loader
 * @param {any[]} deps
 */
export function useContent(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    loader()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, loading: false, error })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
