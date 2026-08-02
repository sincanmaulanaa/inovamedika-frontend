import { create } from 'zustand'

interface UiState {
  readonly isIdleWarningVisible: boolean
  readonly isMobileSidebarOpen: boolean
  readonly isSidebarCollapsed: boolean
  readonly resetUi: () => void
  readonly setIdleWarningVisible: (isVisible: boolean) => void
  readonly setMobileSidebarOpen: (isOpen: boolean) => void
  readonly toggleSidebar: () => void
}

const initialUiState = {
  isIdleWarningVisible: false,
  isMobileSidebarOpen: false,
  isSidebarCollapsed: false,
} as const

export const useUiStore = create<UiState>((set) => ({
  ...initialUiState,
  resetUi: () => set(initialUiState),
  setIdleWarningVisible: (isVisible) =>
    set({ isIdleWarningVisible: isVisible }),
  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
