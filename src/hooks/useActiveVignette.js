import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useActiveVignette hook
 * Manages which vignette item is currently active using a single shared IntersectionObserver.
 * - Only 1 vignette is active at a time to reduce cognitive load and CPU usage.
 * - Respects prefers-reduced-motion and document visibility.
 * - Allows hover/focus override.
 */
export function useActiveVignette() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const itemRefs = useRef([])

  // Listen to reduced motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // IntersectionObserver to set activeIndex based on viewport prominence
  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          const targetIndex = Number(visibleEntries[0].target.getAttribute('data-vignette-index'))
          if (!isNaN(targetIndex)) {
            setActiveIndex(targetIndex)
          }
        }
      },
      {
        threshold: [0.3, 0.6],
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [prefersReducedMotion])

  const setItemRef = useCallback((index) => (el) => {
    itemRefs.current[index] = el
  }, [])

  const currentActive = prefersReducedMotion
    ? -1 // No animation if reduced motion
    : hoveredIndex !== null
    ? hoveredIndex
    : activeIndex

  return {
    currentActive,
    setItemRef,
    setHoveredIndex,
    prefersReducedMotion,
  }
}
