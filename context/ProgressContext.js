// context/ProgressContext.js
'use client'

import { createContext, useContext } from 'react'

const ProgressContext = createContext()

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return context
}

export function ProgressProvider({ children, value }) {
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}
