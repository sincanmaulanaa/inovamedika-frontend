import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Text } from '@cloudflare/kumo/components/text'
import {
  CalendarCheckIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  ListNumbersIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { MetricCard } from '@/features/dashboard/metric-card'
import { dashboardSummaryQueryOptions } from './dashboard.queries'

const metricDefinitions = [
  {
    description: 'Seluruh pasien yang belum dihapus',
    icon: UsersThreeIcon,
    id: 'total-patients',
    label: 'Total pasien',
  },
  {
    description: 'Pendaftaran pada tanggal layanan hari ini',
    icon: CalendarCheckIcon,
    id: 'today-registrations',
    label: 'Total kunjungan hari ini',
  },
  {
    description: 'Nomor antrean yang diterbitkan hari ini',
    icon: ListNumbersIcon,
    id: 'today-queues',
    label: 'Total antrean hari ini',
  },
  {
    description: 'Antrean menunggu, dipanggil, atau dilewati',
    icon: ClockCountdownIcon,
    id: 'waiting-patients',
    label: 'Pasien menunggu pelayanan',
  },
  {
    description: 'Kunjungan yang selesai dilayani hari ini',
    icon: CheckCircleIcon,
    id: 'completed-patients',
    label: 'Total pasien selesai dilayani',
  },
] as const

const workflowSteps = [
  {
    description: 'Cari atau buat data administratif pasien.',
    label: 'Data pasien',
  },
  {
    description: 'Daftarkan kunjungan lalu lakukan check-in.',
    label: 'Pendaftaran',
  },
  {
    description: 'Kelola antrean sampai pemeriksaan selesai.',
    label: 'Pelayanan',
  },
] as const

export function DashboardPage() {
  const { data: metrics } = useQuery(dashboardSummaryQueryOptions())

  return (
    <div className="grid gap-8">
      <section className="grid gap-1.5" aria-labelledby="dashboard-title">
        <Text as="h1" variant="heading1" id="dashboard-title">
          Ringkasan operasional
        </Text>
        <Text variant="secondary">
          Pantau aktivitas klinik untuk tanggal layanan hari ini.
        </Text>
      </section>

      <section aria-labelledby="metrics-title" className="grid gap-4">
        <Text as="h2" variant="heading3" id="metrics-title">
          Metrik hari ini
        </Text>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            {...metricDefinitions[0]}
            value={metrics?.totalPatients ?? 0}
          />
          <MetricCard
            {...metricDefinitions[1]}
            value={metrics?.totalRegistrations ?? 0}
          />
          <MetricCard
            {...metricDefinitions[2]}
            value={(metrics?.waitingPatients ?? 0) + (metrics?.completedVisits ?? 0)}
          />
          <MetricCard
            {...metricDefinitions[3]}
            value={metrics?.waitingPatients ?? 0}
          />
          <MetricCard
            {...metricDefinitions[4]}
            value={metrics?.completedVisits ?? 0}
          />
        </div>
      </section>

      <section aria-labelledby="workflow-title" className="grid gap-4">
        <div className="grid gap-1.5">
          <Text as="h2" variant="heading3" id="workflow-title">
            Alur pelayanan utama
          </Text>
          <Text variant="secondary">
            Fondasi navigasi mengikuti urutan kerja Petugas Pendaftaran dan
            Dokter.
          </Text>
        </div>
        <LayerCard className="px-5 py-4">
          <ol className="grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <li key={step.label} className="flex items-start gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-kumo-tint text-sm font-medium text-kumo-strong ring ring-kumo-line">
                  {index + 1}
                </span>
                <div className="grid gap-1.5">
                  <Text as="h3" variant="heading3">
                    {step.label}
                  </Text>
                  <Text variant="secondary" size="sm">
                    {step.description}
                  </Text>
                </div>
              </li>
            ))}
          </ol>
        </LayerCard>
      </section>
    </div>
  )
}
