// hooks/useProgressRouter.js
'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useProgressRouter(onNavigationStart) {
  const router = useRouter()

  const push = useCallback((href, options) => {
    onNavigationStart?.()
    router.push(href, options)
  }, [router, onNavigationStart])

  const replace = useCallback((href, options) => {
    onNavigationStart?.()
    router.replace(href, options)
  }, [router, onNavigationStart])

  const prefetch = useCallback((href) => {
    router.prefetch(href)
  }, [router])

  const back = useCallback(() => {
    onNavigationStart?.()
    router.back()
  }, [router, onNavigationStart])

  const forward = useCallback(() => {
    onNavigationStart?.()
    router.forward()
  }, [router, onNavigationStart])

  const refresh = useCallback(() => {
    onNavigationStart?.()
    router.refresh()
  }, [router, onNavigationStart])

  return {
    push,
    replace,
    prefetch,
    back,
    forward,
    refresh,
  }
}
