'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createUIStore, type UIStore } from '@/stores/ui-store'

type UIStoreApi = ReturnType<typeof createUIStore>

const UIStoreContext = createContext<UIStoreApi | undefined>(undefined)

export function UIStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<UIStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createUIStore()
  }
  return (
    <UIStoreContext.Provider value={storeRef.current}>
      {children}
    </UIStoreContext.Provider>
  )
}

export function useUIStore<T>(selector: (store: UIStore) => T): T {
  const context = useContext(UIStoreContext)
  if (!context) throw new Error('useUIStore must be used within UIStoreProvider')
  return useStore(context, selector)
}