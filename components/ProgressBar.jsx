'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Internal component that uses hooks
function ProgressBarCore() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Start progress bar when navigation begins
    setProgress(10)
    setIsAnimating(true)

    // Quick progress increments
    const timer1 = setTimeout(() => {
      setProgress(25)
    }, 30)

    const timer2 = setTimeout(() => {
      setProgress(50)
    }, 80)

    const timer3 = setTimeout(() => {
      setProgress(75)
    }, 150)

    // Detect when page is done loading
    const handleLoad = () => {
      setProgress(100)
      setTimeout(() => {
        setProgress(0)
        setIsAnimating(false)
      }, 200)
    }

    // Listen for page load and route completion
    window.addEventListener('load', handleLoad)
    
    // Also complete on rapid completion (page already loaded)
    const maxTimer = setTimeout(() => {
      if (progress < 100) {
        setProgress(100)
        setTimeout(() => {
          setProgress(0)
          setIsAnimating(false)
        }, 200)
      }
    }, 250)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(maxTimer)
      window.removeEventListener('load', handleLoad)
    }
  }, [pathname, searchParams])

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
