import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AxiosResponse } from 'axios'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AppProviders } from '@/app/providers'
import { createAppQueryClient } from '@/app/query-client'
import { appRoutes } from '@/app/router'
import { authKeys } from '@/features/auth/auth.keys'
import { ApiError } from '@/lib/http/api-error'
import { apiClient } from '@/lib/http/http-client'
import {
  createAuthSessionFixture,
  createIssuedAuthSessionFixture,
} from '@/test/auth-session.fixture'

function renderLoginPage() {
  const queryClient = createAppQueryClient()
  queryClient.setQueryData(authKeys.session(), null)
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/login'],
  })

  render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  )

  return { queryClient, router }
}

describe('login page', () => {
  it('shows corrective guidance next to empty fields', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(await screen.findByRole('button', { name: 'Masuk' }))

    expect(screen.getByText('Nama pengguna wajib diisi.')).toBeInTheDocument()
    expect(screen.getByText('Kata sandi wajib diisi.')).toBeInTheDocument()
  })

  it('maps invalid credentials to safe Indonesian copy', async () => {
    const user = userEvent.setup()
    vi.spyOn(apiClient, 'request').mockRejectedValue(
      new ApiError({
        code: 'INVALID_CREDENTIALS',
        message: 'backend fallback',
        status: 401,
      }),
    )
    renderLoginPage()

    await user.type(
      await screen.findByLabelText('Nama pengguna'),
      'registration.test',
    )
    await user.type(screen.getByLabelText('Kata sandi'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Nama pengguna atau kata sandi belum tepat. Periksa kembali lalu coba lagi.',
    )
    expect(screen.queryByText('backend fallback')).not.toBeInTheDocument()
  })

  it('stores the session in memory and redirects after login', async () => {
    const user = userEvent.setup()
    const session = createAuthSessionFixture()
    const issuedSession = createIssuedAuthSessionFixture(
      'REGISTRATION_OFFICER',
      session,
    )
    vi.spyOn(apiClient, 'request').mockResolvedValue({
      data: { data: issuedSession, message: 'Anda telah masuk', success: true },
      status: 200,
    } as AxiosResponse)
    const { queryClient, router } = renderLoginPage()

    await user.type(
      await screen.findByLabelText('Nama pengguna'),
      'registration.test',
    )
    await user.type(screen.getByLabelText('Kata sandi'), 'valid-password')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(
      await screen.findByRole('heading', { name: 'Ringkasan operasional' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/dashboard')
    expect(queryClient.getQueryData(authKeys.session())).toEqual(session)
    expect(window.localStorage.length).toBe(0)
    expect(window.sessionStorage.length).toBe(0)
  })
})
