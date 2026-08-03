import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppProviders } from '@/app/providers'
import { createAppQueryClient } from '@/app/query-client'
import { appRoutes } from '@/app/router'
import { authKeys } from '@/features/auth/auth.keys'
import type { AuthSession } from '@/features/auth/auth.types'
import { createAuthSessionFixture } from '@/test/auth-session.fixture'

function renderRoute(initialEntry: string, session: AuthSession | null) {
  const queryClient = createAppQueryClient()
  queryClient.setQueryData(authKeys.session(), session)
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  })

  render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  )

  return router
}

describe('app router', () => {
  it('redirects a visitor without a session to login', async () => {
    const router = renderRoute('/', null)

    expect(
      await screen.findByRole('heading', { name: 'Masuk ke Inova Medika' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('redirects an authenticated user to the lazy dashboard route', async () => {
    const router = renderRoute('/', createAuthSessionFixture())

    expect(
      await screen.findByRole('heading', { name: 'Ringkasan operasional' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/dashboard')
  })

  it('renders the not-found route for an unknown URL', () => {
    renderRoute('/unknown-page', createAuthSessionFixture())

    expect(
      screen.getByRole('heading', { name: 'Halaman tidak ditemukan' }),
    ).toBeInTheDocument()
  })

  it('only shows navigation assigned to the active role', async () => {
    renderRoute('/dashboard', createAuthSessionFixture('DOCTOR'))

    expect(await screen.findByText('dr. Budi Santoso')).toBeInTheDocument()
    const navigation = within(
      screen.getByRole('navigation', { name: 'Navigasi utama' }),
    )

    expect(navigation.getByText('Antrean')).toBeInTheDocument()
    expect(navigation.getByText('Pasien')).toBeInTheDocument()
    expect(navigation.queryByText('Pendaftaran')).not.toBeInTheDocument()
  })
})
