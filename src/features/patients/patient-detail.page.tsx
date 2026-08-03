import { Banner } from '@cloudflare/kumo/components/banner'
import { Button, RefreshButton } from '@cloudflare/kumo/components/button'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Loader } from '@cloudflare/kumo/components/loader'
import { Text } from '@cloudflare/kumo/components/text'
import { NotePencilIcon, TrashIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { PatientDeleteDialog } from '@/features/patients/components/patient-delete-dialog'
import { getPatientErrorFeedback } from '@/features/patients/patient.copy'
import {
  formatDateOnly,
  formatDateTime,
  formatPatientSex,
} from '@/features/patients/patient-format'
import { useDeletePatientMutation } from '@/features/patients/patient.mutations'
import { usePatientDetailQuery } from '@/features/patients/patient.queries'
import type { Patient } from '@/features/patients/patient.types'
import { NotFoundPage } from '@/shared/components/not-found.page'
import { useAuthSession } from '@/features/auth/auth.queries'
import { medicalRecordsQueryOptions } from '@/features/medical-records/medical-record.queries'
import { MedicalRecordHistory } from '@/features/medical-records/components/medical-record-history'
import { useQuery } from '@tanstack/react-query'

interface PatientDetailLocationState {
  readonly notice?: unknown
}

export function PatientDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { patientId } = useParams()
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<ReturnType<
    typeof getPatientErrorFeedback
  > | null>(null)

  const patientQuery = usePatientDetailQuery(patientId ?? '')
  const deletePatientMutation = useDeletePatientMutation()
  const locationState = readPatientDetailLocationState(location.state)

  const sessionQuery = useAuthSession()
  const role = sessionQuery.data?.profile.role
  const isDoctor = role === 'DOCTOR'
  const currentDoctorName = sessionQuery.data?.profile.displayName

  const medicalRecordsQuery = useQuery({
    ...medicalRecordsQueryOptions({
      patientId: patientId ?? '',
      limit: 50,
    }),
    enabled: isDoctor && Boolean(patientId),
    retry: false,
  })

  if (!patientId) {
    return <NotFoundPage />
  }

  const loadFeedback = patientQuery.error
    ? getPatientErrorFeedback(patientQuery.error)
    : null

  const handleConfirmDelete = async () => {
    setDeleteError(null)

    try {
      await deletePatientMutation.mutateAsync(patientId)
      navigate('/patients', {
        state: { notice: 'Data pasien dihapus.' },
      })
    } catch (error) {
      setDeleteError(getPatientErrorFeedback(error))
      setDeleteDialogOpen(false)
    }
  }

  if (patientQuery.isPending) {
    return (
      <div className="grid min-h-80 place-items-center" role="status">
        <div className="grid justify-items-center gap-3">
          <Loader aria-label="Memuat data pasien" />
          <Text>Memuat data pasien…</Text>
        </div>
      </div>
    )
  }

  if (loadFeedback) {
    return (
      <section className="mx-auto grid max-w-2xl gap-4 py-10">
        <Banner
          description={
            <div className="grid gap-2">
              <span>{loadFeedback.message}</span>
              {loadFeedback.requestId ? (
                <span className="text-[0.9em]">
                  Kode bantuan: {loadFeedback.requestId}
                </span>
              ) : null}
            </div>
          }
          role="alert"
          title={loadFeedback.title}
          variant="error"
        />
        <div className="flex gap-3">
          <Button
            loading={patientQuery.isFetching}
            onClick={() => void patientQuery.refetch()}
            variant="primary"
          >
            Coba lagi
          </Button>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-base font-medium text-kumo-default ring ring-kumo-line hover:bg-kumo-tint"
            to="/patients"
          >
            Kembali ke data pasien
          </Link>
        </div>
      </section>
    )
  }

  const patient = patientQuery.data

  if (!patient) {
    return null
  }

  return (
    <div className="grid gap-6">
      <section
        aria-labelledby="patient-detail-title"
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="grid gap-1.5">
          <Link
            className="text-sm font-medium text-kumo-subtle hover:text-kumo-strong"
            to="/patients"
          >
            Kembali ke data pasien
          </Link>
          <Text as="h1" id="patient-detail-title" variant="heading1">
            {patient.fullName}
          </Text>
          <Text variant="secondary">
            Nomor rekam medis {patient.medicalRecordNumber}
          </Text>
        </div>
        <div className="flex flex-wrap gap-3">
          <RefreshButton
            aria-label="Muat ulang data pasien"
            loading={patientQuery.isFetching}
            onClick={() => void patientQuery.refetch()}
            variant="ghost"
          />
          <Link
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-base font-medium text-kumo-default ring ring-kumo-line hover:bg-kumo-tint"
            to={`/patients/${patient.id}/edit`}
          >
            <NotePencilIcon aria-hidden="true" className="size-4" />
            Ubah data
          </Link>
          <Button
            icon={TrashIcon}
            onClick={() => setDeleteDialogOpen(true)}
            variant="secondary-destructive"
          >
            Hapus
          </Button>
        </div>
      </section>

      {typeof locationState.notice === 'string' ? (
        <Banner
          description={locationState.notice}
          size="sm"
          title="Berhasil"
          variant="default"
        />
      ) : null}

      {deleteError ? (
        <Banner
          description={
            <div className="grid gap-1">
              <span>{deleteError.message}</span>
              {deleteError.requestId ? (
                <span className="text-[0.9em]">
                  Kode bantuan: {deleteError.requestId}
                </span>
              ) : null}
            </div>
          }
          role="alert"
          size="sm"
          title={deleteError.title}
          variant="error"
        />
      ) : null}

      <LayerCard className="p-5">
        <PatientDetailGrid patient={patient} />
      </LayerCard>

      {isDoctor && (
        <LayerCard className="p-5">
          {medicalRecordsQuery.isPending ? (
            <div className="py-4 text-center grid justify-items-center gap-3">
              <Loader aria-label="Memuat riwayat medis" />
              <Text>Memuat riwayat medis...</Text>
            </div>
          ) : medicalRecordsQuery.isError ? (
            <Banner
              title="Akses Terbatas"
              description="Anda tidak dapat melihat riwayat klinis pasien ini karena tidak ada hubungan pelayanan aktif hari ini."
              variant="default"
              size="sm"
            />
          ) : (
            <MedicalRecordHistory 
              records={medicalRecordsQuery.data?.items ?? []} 
              currentDoctorName={currentDoctorName ?? undefined} 
            />
          )}
        </LayerCard>
      )}

      <PatientDeleteDialog
        isDeleting={deletePatientMutation.isPending}
        onConfirm={handleConfirmDelete}
        onOpenChange={setDeleteDialogOpen}
        open={isDeleteDialogOpen}
        patientName={patient.fullName}
      />
    </div>
  )
}

function PatientDetailGrid({ patient }: { readonly patient: Patient }) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <PatientDetailItem
        label="Nomor rekam medis"
        value={patient.medicalRecordNumber}
      />
      <PatientDetailItem label="NIK" value={patient.nik} />
      <PatientDetailItem
        label="Jenis kelamin"
        value={formatPatientSex(patient.sex)}
      />
      <PatientDetailItem
        label="Tanggal lahir"
        value={formatDateOnly(patient.dateOfBirth)}
      />
      <PatientDetailItem label="Nomor telepon" value={patient.phone ?? '-'} />
      <PatientDetailItem label="Alamat" value={patient.address ?? '-'} />
      <PatientDetailItem
        label="Dibuat"
        value={formatDateTime(patient.createdAt)}
      />
      <PatientDetailItem
        label="Terakhir diubah"
        value={formatDateTime(patient.updatedAt)}
      />
    </dl>
  )
}

function PatientDetailItem({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}) {
  return (
    <div className="grid gap-1">
      <dt>
        <Text size="sm" variant="secondary">
          {label}
        </Text>
      </dt>
      <dd className="break-words">
        <Text>{value}</Text>
      </dd>
    </div>
  )
}

function readPatientDetailLocationState(
  state: unknown,
): PatientDetailLocationState {
  if (typeof state !== 'object' || state === null) {
    return {}
  }

  const candidate = state as Readonly<Record<string, unknown>>
  return { notice: candidate.notice }
}
