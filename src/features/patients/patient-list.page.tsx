import { Banner } from '@cloudflare/kumo/components/banner'
import { Button, RefreshButton } from '@cloudflare/kumo/components/button'
import { Empty } from '@cloudflare/kumo/components/empty'
import { Input } from '@cloudflare/kumo/components/input'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Pagination } from '@cloudflare/kumo/components/pagination'
import { Table } from '@cloudflare/kumo/components/table'
import { Text } from '@cloudflare/kumo/components/text'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import { type FormEvent } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { getPatientErrorFeedback } from '@/features/patients/patient.copy'
import {
  formatDateOnly,
  formatPatientSex,
  maskNik,
} from '@/features/patients/patient-format'
import {
  createPatientListSearchParams,
  patientPageSizeOptions,
  readPatientListSearchParams,
} from '@/features/patients/patient-search-params'
import { usePatientListQuery } from '@/features/patients/patient.queries'
import type { Patient } from '@/features/patients/patient.types'

interface PatientListLocationState {
  readonly notice?: unknown
}

export function PatientListPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = readPatientListSearchParams(searchParams)
  const patientListQuery = usePatientListQuery(params)
  const locationState = readPatientListLocationState(location.state)
  const feedback = patientListQuery.error
    ? getPatientErrorFeedback(patientListQuery.error)
    : null

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = String(formData.get('search') ?? '').trim()

    setSearchParams(
      createPatientListSearchParams({
        limit: params.limit,
        page: 1,
        ...(search ? { search } : {}),
      }),
    )
  }

  const handlePageChange = (page: number) => {
    setSearchParams(createPatientListSearchParams({ ...params, page }))
  }

  const handlePageSizeChange = (limit: number) => {
    setSearchParams(
      createPatientListSearchParams({ ...params, limit, page: 1 }),
    )
  }

  return (
    <div className="grid gap-6">
      <section
        aria-labelledby="patient-list-title"
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="grid gap-1.5">
          <Text as="h1" id="patient-list-title" variant="heading1">
            Data pasien
          </Text>
          <Text variant="secondary">
            Kelola data identitas pasien untuk kebutuhan pendaftaran klinik.
          </Text>
        </div>
        <Link
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-(--kumo-button-emphasis-bg) px-3 text-base font-medium !text-white ring ring-(--kumo-button-emphasis-ring)"
          to="/patients/new"
        >
          <PlusIcon aria-hidden="true" className="size-4" />
          Tambah pasien
        </Link>
      </section>

      {typeof locationState.notice === 'string' ? (
        <Banner
          description={locationState.notice}
          size="sm"
          title="Berhasil"
          variant="default"
        />
      ) : null}

      <LayerCard className="grid gap-4 p-4">
        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
          noValidate
          onSubmit={handleSearchSubmit}
        >
          <Input
            autoComplete="off"
            defaultValue={params.search ?? ''}
            key={params.search ?? 'all-patients'}
            label="Cari pasien"
            name="search"
            placeholder="Cari nama, NIK, atau nomor rekam medis"
          />
          <Button
            className="self-end"
            icon={MagnifyingGlassIcon}
            type="submit"
            variant="secondary"
          >
            Cari
          </Button>
          {params.search ? (
            <Link
              className="inline-flex h-9 items-center justify-center self-end rounded-lg px-3 text-base font-medium text-kumo-default ring ring-kumo-line hover:bg-kumo-tint"
              to="/patients"
            >
              Tampilkan semua
            </Link>
          ) : null}
        </form>

        {feedback ? (
          <Banner
            description={
              <div className="grid gap-2">
                <span>{feedback.message}</span>
                {feedback.requestId ? (
                  <span className="text-[0.9em]">
                    Kode bantuan: {feedback.requestId}
                  </span>
                ) : null}
                <Button
                  className="w-fit"
                  loading={patientListQuery.isFetching}
                  onClick={() => void patientListQuery.refetch()}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Coba lagi
                </Button>
              </div>
            }
            role="alert"
            size="sm"
            title={feedback.title}
            variant="error"
          />
        ) : null}

        {patientListQuery.isPending ? (
          <div className="grid min-h-52 place-items-center" role="status">
            <Text>Memuat data pasien…</Text>
          </div>
        ) : null}

        {patientListQuery.data ? (
          <PatientListContent
            isRefreshing={patientListQuery.isFetching}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRefresh={() => void patientListQuery.refetch()}
            patients={patientListQuery.data.items}
            page={patientListQuery.data.pagination.page}
            perPage={patientListQuery.data.pagination.limit}
            search={params.search}
            totalCount={patientListQuery.data.pagination.totalItems}
          />
        ) : null}
      </LayerCard>
    </div>
  )
}

interface PatientListContentProps {
  readonly isRefreshing: boolean
  readonly onPageChange: (page: number) => void
  readonly onPageSizeChange: (pageSize: number) => void
  readonly onRefresh: () => void
  readonly page: number
  readonly patients: readonly Patient[]
  readonly perPage: number
  readonly search?: string
  readonly totalCount: number
}

function PatientListContent({
  isRefreshing,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  page,
  patients,
  perPage,
  search,
  totalCount,
}: PatientListContentProps) {
  if (patients.length === 0) {
    return (
      <Empty
        contents={
          search ? (
            <Link
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-base font-medium text-kumo-default ring ring-kumo-line hover:bg-kumo-tint"
              to="/patients"
            >
              Tampilkan semua pasien
            </Link>
          ) : (
            <Link
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-(--kumo-button-emphasis-bg) px-3 text-base font-medium !text-white ring ring-(--kumo-button-emphasis-ring)"
              to="/patients/new"
            >
              <PlusIcon aria-hidden="true" className="size-4" />
              Tambah pasien
            </Link>
          )
        }
        description={
          search
            ? 'Periksa kata pencarian atau tambahkan pasien baru.'
            : 'Tambahkan pasien untuk mulai membuat pendaftaran.'
        }
        icon={<UserCircleIcon aria-hidden="true" className="size-10" />}
        title={search ? 'Pasien tidak ditemukan' : 'Belum ada pasien'}
      />
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <Text size="sm" variant="secondary">
          {totalCount} pasien ditemukan
        </Text>
        <RefreshButton
          aria-label="Muat ulang data pasien"
          loading={isRefreshing}
          onClick={onRefresh}
          variant="ghost"
        />
      </div>

      <div className="overflow-x-auto rounded-lg ring ring-kumo-line">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Pasien</Table.Head>
              <Table.Head>NIK</Table.Head>
              <Table.Head>Jenis kelamin</Table.Head>
              <Table.Head>Tanggal lahir</Table.Head>
              <Table.Head>Telepon</Table.Head>
              <Table.Head className="text-right">Aksi</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {patients.map((patient) => (
              <PatientTableRow key={patient.id} patient={patient} />
            ))}
          </Table.Body>
        </Table>
      </div>

      <Pagination
        labels={{
          firstPage: 'Halaman pertama',
          lastPage: 'Halaman terakhir',
          navigation: 'Navigasi halaman pasien',
          nextPage: 'Halaman berikutnya',
          pageNumber: 'Nomor halaman',
          pageSize: 'Jumlah pasien per halaman',
          previousPage: 'Halaman sebelumnya',
        }}
        page={page}
        perPage={perPage}
        setPage={onPageChange}
        totalCount={totalCount}
      >
        <Pagination.Info>
          {({ pageShowingRange, totalCount: count }) =>
            `${pageShowingRange} dari ${count ?? 0} pasien`
          }
        </Pagination.Info>
        <Pagination.Separator />
        <Pagination.PageSize
          label="Per halaman:"
          onChange={onPageSizeChange}
          options={patientPageSizeOptions}
          value={perPage}
        />
        <Pagination.Controls />
      </Pagination>
    </div>
  )
}

function PatientTableRow({ patient }: { readonly patient: Patient }) {
  return (
    <Table.Row>
      <Table.Cell>
        <div className="grid gap-1">
          <Link
            className="font-medium text-kumo-strong hover:underline"
            to={`/patients/${patient.id}`}
          >
            {patient.fullName}
          </Link>
          <Text size="sm" variant="secondary">
            {patient.medicalRecordNumber}
          </Text>
        </div>
      </Table.Cell>
      <Table.Cell>{maskNik(patient.nik)}</Table.Cell>
      <Table.Cell>{formatPatientSex(patient.sex)}</Table.Cell>
      <Table.Cell>{formatDateOnly(patient.dateOfBirth)}</Table.Cell>
      <Table.Cell>{patient.phone ?? '-'}</Table.Cell>
      <Table.Cell className="text-right">
        <Link
          className="inline-flex h-8 items-center justify-center rounded-md px-2 text-sm font-medium text-kumo-default ring ring-kumo-line hover:bg-kumo-tint"
          to={`/patients/${patient.id}`}
        >
          Lihat
        </Link>
      </Table.Cell>
    </Table.Row>
  )
}

function readPatientListLocationState(
  state: unknown,
): PatientListLocationState {
  if (typeof state !== 'object' || state === null) {
    return {}
  }

  const candidate = state as Readonly<Record<string, unknown>>
  return { notice: candidate.notice }
}
