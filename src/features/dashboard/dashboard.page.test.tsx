import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '@/features/dashboard/dashboard.page'

describe('DashboardPage', () => {
  it('renders the five backend-owned operational metrics as placeholders', () => {
    render(<DashboardPage />)

    expect(
      screen.getByRole('heading', { name: 'Ringkasan operasional' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Menunggu data API')).toHaveLength(5)
    expect(screen.getByText('Total pasien')).toBeInTheDocument()
    expect(
      screen.getByText('Total pasien selesai dilayani'),
    ).toBeInTheDocument()
  })
})
