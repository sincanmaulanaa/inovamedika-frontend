import { Banner } from '@cloudflare/kumo/components/banner'
import { Button } from '@cloudflare/kumo/components/button'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Loader } from '@cloudflare/kumo/components/loader'
import { Text } from '@cloudflare/kumo/components/text'
import { CaretLeftIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { RegistrationStatusBadge } from './components/registration-status-badge'
import { useUpdateRegistrationMutation } from './registration.mutations'
import { registrationQueryOptions } from './registration.queries'
import type { RegistrationData, RegistrationStatus } from './registration.types'

export function RegistrationDetailPage() {
  const { registrationId } = useParams()
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const registrationQuery = useQuery(
    registrationQueryOptions(registrationId ?? '')
  )
  const updateMutation = useUpdateRegistrationMutation()

  if (!registrationId) {
    return null
  }

  if (registrationQuery.isPending) {
    return (
      <div className="grid min-h-80 place-items-center" role="status">
        <div className="grid justify-items-center gap-3">
          <Loader aria-label="Memuat data pendaftaran" />
          <Text>Memuat data pendaftaran…</Text>
        </div>
      </div>
    )
  }

  if (registrationQuery.error) {
    return (
      <section className="mx-auto grid max-w-2xl gap-4 py-10">
        <Banner
          description="Tidak dapat memuat data pendaftaran."
          role="alert"
          title="Terjadi kesalahan"
          variant="error"
        />
      </section>
    )
  }

  const registration = registrationQuery.data
  if (!registration) return null

  const handleStatusTransition = (
    newStatus: RegistrationStatus,
    successMessage: string,
    reason?: string
  ) => {
    setNotice(null)
    setError(null)

    updateMutation.mutate(
      {
        id: registrationId,
        data: {
          status: newStatus,
          rowVersion: registration.rowVersion,
          ...(newStatus === 'CANCELLED' && reason ? { cancelledReason: reason } : {}),
          ...(newStatus === 'NO_SHOW' && reason ? { noShowReason: reason } : {}),
        },
      },
      {
        onSuccess: () => setNotice(successMessage),
        onError: () => setError('Gagal mengubah status pendaftaran. Silakan coba lagi.'),
      }
    )
  }

  const handleCheckIn = () =>
    handleStatusTransition('CHECKED_IN', 'Pasien berhasil check-in.')

  const handleCancel = () => {
    const reason = prompt('Masukkan alasan pembatalan:')
    if (reason !== null && reason.trim().length > 0) {
      handleStatusTransition('CANCELLED', 'Kunjungan berhasil dibatalkan.', reason.trim())
    }
  }

  const handleNoShow = () => {
    const reason = prompt('Masukkan alasan tidak hadir:')
    if (reason !== null && reason.trim().length > 0) {
      handleStatusTransition('NO_SHOW', 'Pasien ditandai tidak hadir.', reason.trim())
    }
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <section aria-labelledby="reg-detail-title" className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <Link
            className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-(--kumo-text-secondary) hover:bg-black/5"
            to="/registrations"
          >
            <CaretLeftIcon className="size-4" />
            Kembali ke daftar pendaftaran
          </Link>
        </div>
        <Text as="h1" id="reg-detail-title" variant="heading1">
          Detail Pendaftaran
        </Text>
      </section>

      {notice ? (
        <Banner description={notice} size="sm" title="Berhasil" variant="default" />
      ) : null}
      {error ? (
        <Banner description={error} role="alert" size="sm" title="Gagal" variant="error" />
      ) : null}

      <LayerCard className="p-5">
        <RegistrationDetailGrid registration={registration} />
      </LayerCard>

      <div className="flex flex-wrap gap-3">
        {registration.status === 'WAITING' && (
          <>
            <Button
              loading={updateMutation.isPending}
              onClick={handleCheckIn}
              variant="primary"
            >
              Check-In Pasien
            </Button>
            <Button
              loading={updateMutation.isPending}
              onClick={handleNoShow}
              variant="secondary"
            >
              Tandai Tidak Hadir
            </Button>
            <Button
              loading={updateMutation.isPending}
              onClick={handleCancel}
              variant="secondary-destructive"
            >
              Batalkan
            </Button>
          </>
        )}
        {registration.status === 'CHECKED_IN' && (
          <Button
            loading={updateMutation.isPending}
            onClick={handleCancel}
            variant="secondary-destructive"
          >
            Batalkan Kunjungan
          </Button>
        )}
      </div>
    </div>
  )
}

function RegistrationDetailGrid({
  registration,
}: {
  readonly registration: RegistrationData
}) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <DetailItem label="Pasien" value={registration.patientName} />
      <DetailItem label="No. RM" value={registration.patientMedicalRecordNumber} />
      <DetailItem label="Dokter" value={registration.doctorName} />
      <DetailItem label="Poliklinik" value={registration.polyclinicName} />
      <DetailItem label="Tanggal Kunjungan" value={registration.serviceDate} />
      <div className="grid gap-1">
        <dt>
          <Text size="sm" variant="secondary">Status</Text>
        </dt>
        <dd>
          <RegistrationStatusBadge status={registration.status} />
        </dd>
      </div>
      <DetailItem label="Alasan Kunjungan" value={registration.visitReason} />
      <DetailItem label="Pembiayaan" value={registration.financingType} />
      {registration.payerName ? (
        <DetailItem label="Pembayar" value={registration.payerName} />
      ) : null}
      {registration.cancelledReason ? (
        <DetailItem label="Alasan Batal" value={registration.cancelledReason} />
      ) : null}
      {registration.noShowReason ? (
        <DetailItem label="Alasan Tidak Hadir" value={registration.noShowReason} />
      ) : null}
    </dl>
  )
}

function DetailItem({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}) {
  return (
    <div className="grid gap-1">
      <dt>
        <Text size="sm" variant="secondary">{label}</Text>
      </dt>
      <dd className="break-words">
        <Text>{value}</Text>
      </dd>
    </div>
  )
}
