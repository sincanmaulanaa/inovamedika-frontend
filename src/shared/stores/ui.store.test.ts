import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '@/shared/stores/ui.store'

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.getState().resetUi()
  })

  it('only manages sidebar and idle-warning state without persistence', () => {
    const state = useUiStore.getState()

    state.toggleSidebar()
    state.setMobileSidebarOpen(true)
    state.setIdleWarningVisible(true)

    expect(useUiStore.getState()).toMatchObject({
      isIdleWarningVisible: true,
      isMobileSidebarOpen: true,
      isSidebarCollapsed: true,
    })
  })

  it('resets all UI state after logout', () => {
    useUiStore.getState().setIdleWarningVisible(true)
    useUiStore.getState().resetUi()

    expect(useUiStore.getState()).toMatchObject({
      isIdleWarningVisible: false,
      isMobileSidebarOpen: false,
      isSidebarCollapsed: false,
    })
  })
})
