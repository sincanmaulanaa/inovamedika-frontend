import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardPage } from '@/features/dashboard/dashboard.page'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

describe('DashboardPage', () => {
  it('renders the five backend-owned operational metrics as placeholders', () => {
    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>,
    )

    expect(
      screen.getByRole('heading', { name: 'Ringkasan operasional' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(5)
    expect(screen.getByText('Total pasien')).toBeInTheDocument()
    expect(
      screen.getByText('Total pasien selesai dilayani'),
    ).toBeInTheDocument()
  })
})
