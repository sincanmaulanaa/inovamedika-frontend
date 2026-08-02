import { act, fireEvent, render, screen } from '@testing-library/react'
import type { AxiosResponse } from 'axios'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from '@/app/providers'
import { createAppQueryClient } from '@/app/query-client'
import { SessionActivityMonitor } from '@/features/auth/session-activity-monitor'
import { apiClient } from '@/lib/http/http-client'
import { createIssuedAuthSessionFixture } from '@/test/auth-session.fixture'

const idleWarningMs = 13 * 60_000
const idleTimeoutMs = 15 * 60_000

function renderMonitor() {
  const router = createMemoryRouter(
    [
      { path: '/dashboard', element: <SessionActivityMonitor /> },
      { path: '/login', element: <h1>Masuk kembali</h1> },
    ],
    { initialEntries: ['/dashboard'] },
  )

  render(
    <AppProviders queryClient={createAppQueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  )

  return router
}

describe('session activity monitor', () => {
  afterEach(() => {
    document.cookie = 'inovamedika_csrf=; Max-Age=0; Path=/'
    vi.useRealTimers()
  })

  it('warns two minutes before the idle session ends', async () => {
    vi.useFakeTimers()
    renderMonitor()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(idleWarningMs)
    })

    expect(screen.getByRole('alertdialog')).toHaveTextContent(
      'sesi akan berakhir dalam dua menit',
    )
    expect(
      screen.getByRole('button', { name: 'Tetap masuk' }),
    ).toBeInTheDocument()
  })

  it('ends the local session after fifteen minutes without activity', async () => {
    vi.useFakeTimers()
    const router = renderMonitor()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(idleTimeoutMs)
    })

    expect(router.state.location.pathname).toBe('/login')
    expect(
      screen.getByRole('heading', { name: 'Masuk kembali' }),
    ).toBeInTheDocument()
  })

  it('keeps the session active when the user confirms the warning', async () => {
    vi.useFakeTimers()
    const issuedSession = createIssuedAuthSessionFixture()
    document.cookie = `inovamedika_csrf=${issuedSession.csrfToken}; Path=/`
    vi.spyOn(apiClient, 'request').mockResolvedValue({
      data: { data: issuedSession, message: 'Sesi tetap aktif', success: true },
      status: 200,
    } as AxiosResponse)
    renderMonitor()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(idleWarningMs)
    })
    const continueButton = screen.getByRole('button', { name: 'Tetap masuk' })

    await act(async () => {
      fireEvent.pointerDown(continueButton)
      fireEvent.click(continueButton)
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
