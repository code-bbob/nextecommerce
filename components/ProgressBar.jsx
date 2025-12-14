'use client'

import { useEffect, useState, Suspense, useRef, useCallback } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

// Internal component that uses hooks
function ProgressBarCore() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const lastPathRef = useRef(pathname)
  const routerRef = useRef(router)

  // Update router ref when router changes
  useEffect(() => {
    routerRef.current = router
  }, [router])

  // Expose global function to start progress
  useEffect(() => {
    window.__startProgress = () => {
      setProgress(10)
      setIsAnimating(true)
      setTimeout(() => setProgress(25), 30)
      setTimeout(() => setProgress(50), 80)
      setTimeout(() => setProgress(75), 150)
    }

    return () => {
      delete window.__startProgress
    }
  }, [])

  // Handle pathname and searchParams changes (when route actually completes)
  useEffect(() => {
    if (pathname !== lastPathRef.current) {
      lastPathRef.current = pathname
      
      // Complete the progress bar when page finishes loading
      setProgress(100)
      
      setTimeout(() => {
        setProgress(0)
        setIsAnimating(false)
      }, 300)
    }
  }, [pathname])

  // Handle searchParams changes (for same-page navigation like search filters)
  useEffect(() => {
    // Only complete progress if it was animating
    if (isAnimating) {
      setProgress(100)
      
      setTimeout(() => {
        setProgress(0)
        setIsAnimating(false)
      }, 300)
    }
  }, [searchParams, isAnimating])

  // Memoized click handler for better performance
  const handleClick = useCallback((e) => {
    // Early exit for non-link clicks (99% of cases)
    const link = e.target.closest('a')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href) return

    // Quick early exits - avoid expensive checks when not needed
    const firstChar = href[0]
    if (firstChar === '#' || firstChar === '?' || href.includes('://') || link.target) {
      return
    }

    // Check if it's a different page (only for internal navigation)
    const currentPath = window.location.pathname + window.location.search
    if (href === currentPath || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return
    }

    // Start progress animation
    if (!isAnimating) {
      window.__startProgress?.()
    }
  }, [isAnimating])

  // Global click listener with passive option for performance
  useEffect(() => {
    // Use passive listener for better scroll performance
    const options = { capture: true, passive: true }
    
    document.addEventListener('click', handleClick, options)

    return () => {
      document.removeEventListener('click', handleClick, options)
    }
  }, [handleClick])

  return (
    <>
      <style jsx>{`
        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            #ef4444,
            #f87171,
            #ef4444
          );
          box-shadow: 
            0 0 15px 0 rgba(239, 68, 68, 0.8),
            0 0 30px -5px rgba(239, 68, 68, 0.5);
          width: ${progress}%;
          z-index: 9999;
          opacity: ${progress === 0 ? 0 : 1};
          transition: ${
            progress === 100
              ? 'width 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease 0.4s'
              : 'width 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s ease'
          };
        }

        @keyframes glow-pulse {
          0% {
            box-shadow: 
              0 0 15px 0 rgba(239, 68, 68, 0.8),
              0 0 30px -5px rgba(239, 68, 68, 0.5);
          }
          50% {
            box-shadow: 
              0 0 20px 2px rgba(239, 68, 68, 1),
              0 0 40px -2px rgba(239, 68, 68, 0.7);
          }
          100% {
            box-shadow: 
              0 0 15px 0 rgba(239, 68, 68, 0.8),
              0 0 30px -5px rgba(239, 68, 68, 0.5);
          }
        }

        .progress-bar.active {
          animation: glow-pulse 1.5s ease-in-out infinite;
        }

        /* Shimmer effect */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .progress-bar.shimmer {
          background-image: linear-gradient(
            90deg,
            #ef4444,
            #f87171,
            #fca5a5,
            #f87171,
            #ef4444
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div
        className={`progress-bar ${isAnimating ? 'active shimmer' : ''}`}
        style={{
          width: `${progress}%`,
          opacity: progress === 0 ? 0 : 1,
        }}
      />
    </>
  )
}

// Main component with Suspense boundary
export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarCore />
    </Suspense>
  )
}
