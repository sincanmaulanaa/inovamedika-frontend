import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { clearAuthCredentials } from '@/lib/http/auth-token'
import { useUiStore } from '@/shared/stores/ui.store'

afterEach(() => {
  cleanup()
  clearAuthCredentials()
  useUiStore.getState().resetUi()
})
