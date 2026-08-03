import { Button, RefreshButton } from '@cloudflare/kumo/components/button'
import { Empty } from '@cloudflare/kumo/components/empty'
import { Input } from '@cloudflare/kumo/components/input'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Table } from '@cloudflare/kumo/components/table'
import { Text } from '@cloudflare/kumo/components/text'
import { PlusIcon, FileTextIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { registrationsQueryOptions } from './registration.queries'
import { RegistrationStatusBadge } from './components/registration-status-badge'
import type { RegistrationData, RegistrationStatus } from './registration.types'

const statusFilterOptions: readonly { value: string; label: string }[] = [
  { value: '', label: 'Semua status' },
  { value: 'WAITING', label: 'Menunggu' },
  { value: 'CHECKED_IN', label: 'Check In' },
  { value: 'IN_EXAM', label: 'Pemeriksaan' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Batal' },
  { value: 'NO_SHOW', label: 'Tidak Hadir' },
]

export function RegistrationListPage() {
  const today = new Date().toISOString().split('T')[0] as string
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState(today)
  const [page, setPage] = useState(1)

  const registrationListQuery = useQuery(registrationsQueryOptions({
    page,
    limit: 10,
    search: search || undefined,
    status: (statusFilter as RegistrationStatus) || undefined,
    date: dateFilter || undefined,
  }))

  const items = registrationListQuery.data?.items ?? []
  const pagination = registrationListQuery.data?.pagination

  return (
    <div className="grid gap-6">
      <section
        aria-labelledby="registration-list-title"
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="grid gap-1.5">
          <Text as="h1" id="registration-list-title" variant="heading1">
            Data Pendaftaran
          </Text>
          <Text variant="secondary">
            Kelola data pendaftaran kunjungan pasien.
          </Text>
        </div>
        <Link
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-(--kumo-button-emphasis-bg) px-3 text-base font-medium !text-white ring ring-(--kumo-button-emphasis-ring)"
          to="/registrations/new"
        >
          <PlusIcon aria-hidden="true" className="size-4" />
          Pendaftaran baru
        </Link>
      </section>

      <LayerCard className="grid gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            name="search"
            placeholder="Cari nama atau NIK pasien..."
          />
          <input
            className="flex h-9 rounded-md border border-black/20 bg-transparent px-3 text-sm focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1) }}
          />
          <select
            className="flex h-9 rounded-md border border-black/20 bg-transparent px-3 text-sm focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          >
            {statusFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <RefreshButton
            loading={registrationListQuery.isFetching}
            onClick={() => registrationListQuery.refetch()}
            variant="ghost"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Pasien</Table.Head>
                <Table.Head>No. RM</Table.Head>
                <Table.Head>Poli</Table.Head>
                <Table.Head>Dokter</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Aksi</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="h-32 text-center" colSpan={6}>
                    <Empty
                      description="Belum ada pendaftaran yang sesuai pencarian"
                      icon={<FileTextIcon className="size-8" />}
                      title="Tidak ditemukan"
                    />
                  </Table.Cell>
                </Table.Row>
              ) : (
                items.map((item: RegistrationData) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Text>{item.patientName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="tabular-nums">
                        <Text>{item.patientMedicalRecordNumber}</Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{item.polyclinicName ?? '-'}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{item.doctorName ?? '-'}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <RegistrationStatusBadge status={item.status} />
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-(--kumo-button-text-text) hover:underline"
                        to={`/registrations/${item.id}`}
                      >
                        Detail
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>

        {pagination && pagination.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-black/10 pt-3">
            <Text variant="secondary" size="sm">
              Halaman {pagination.page} dari {pagination.totalPages} ({pagination.totalItems} data)
            </Text>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        ) : null}
      </LayerCard>
    </div>
  )
}
