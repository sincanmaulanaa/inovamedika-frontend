import { Badge } from '@cloudflare/kumo/components/badge'
import type { RegistrationStatus } from '../registration.types'

interface RegistrationStatusBadgeProps {
  readonly status: RegistrationStatus
}

const statusConfig: Record<RegistrationStatus, { label: string; variant: 'warning' | 'info' | 'primary' | 'success' | 'neutral' | 'error' }> = {
  WAITING: { label: 'Menunggu', variant: 'warning' },
  CHECKED_IN: { label: 'Check In', variant: 'info' },
  IN_EXAM: { label: 'Pemeriksaan', variant: 'primary' },
  COMPLETED: { label: 'Selesai', variant: 'success' },
  CANCELLED: { label: 'Batal', variant: 'neutral' },
  NO_SHOW: { label: 'Tidak Hadir', variant: 'error' },
}

export function RegistrationStatusBadge({ status }: RegistrationStatusBadgeProps) {
  const config = statusConfig[status]

  if (!config) {
    return <Badge variant="neutral">{status}</Badge>
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
