// hooks/useNavigationProgress.js
'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useNavigationProgress() {
  const router = useRouter()

  const push = useCallback((href, options) => {
    // Start progress bar
    if (typeof window !== 'undefined' && window.__startProgress) {
      window.__startProgress()
    }
    router.push(href, options)
  }, [router])

  const replace = useCallback((href, options) => {
    if (typeof window !== 'undefined' && window.__startProgress) {
      window.__startProgress()
    }
    router.replace(href, options)
  }, [router])

  const back = useCallback(() => {
    if (typeof window !== 'undefined' && window.__startProgress) {
      window.__startProgress()
    }
    router.back()
  }, [router])

  const forward = useCallback(() => {
    if (typeof window !== 'undefined' && window.__startProgress) {
      window.__startProgress()
    }
    router.forward()
  }, [router])

  const refresh = useCallback(() => {
    if (typeof window !== 'undefined' && window.__startProgress) {
      window.__startProgress()
    }
    router.refresh()
  }, [router])

  const prefetch = useCallback((href) => {
    return router.prefetch(href)
  }, [router])

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch,
  }
}
