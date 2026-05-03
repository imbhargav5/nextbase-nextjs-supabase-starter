import { createStore } from 'zustand/vanilla'

export type UIState = {
  isSidebarOpen: boolean
  activeModal: string | null
}

export type UIActions = {
  toggleSidebar: () => void
  openModal: (name: string) => void
  closeModal: () => void
}

export type UIStore = UIState & UIActions

export const defaultInitState: UIState = {
  isSidebarOpen: true,
  activeModal: null,
}

export const createUIStore = (initState: UIState = defaultInitState) =>
  createStore<UIStore>()((set) => ({
    ...initState,
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openModal: (name) => set({ activeModal: name }),
    closeModal: () => set({ activeModal: null }),
  }))