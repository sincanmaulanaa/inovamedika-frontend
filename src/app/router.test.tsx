import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppProviders } from '@/app/providers'
import { appRoutes } from '@/app/router'

describe('app router', () => {
  it('redirects the root route to the lazy dashboard route', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] })

    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(
      await screen.findByRole('heading', { name: 'Ringkasan operasional' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/dashboard')
  })

  it('renders the not-found route for an unknown URL', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/unknown-page'],
    })

    render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    )

    expect(
      screen.getByRole('heading', { name: 'Halaman tidak ditemukan' }),
    ).toBeInTheDocument()
  })
})
