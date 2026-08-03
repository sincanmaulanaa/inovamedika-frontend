import { Banner } from '@cloudflare/kumo/components/banner'
import { Button } from '@cloudflare/kumo/components/button'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Loader } from '@cloudflare/kumo/components/loader'
import { Text } from '@cloudflare/kumo/components/text'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PatientForm } from '@/features/patients/components/patient-form'
import { getPatientErrorFeedback } from '@/features/patients/patient.copy'
import { useUpdatePatientMutation } from '@/features/patients/patient.mutations'
import { usePatientDetailQuery } from '@/features/patients/patient.queries'
import {
  patientFormValuesToRequest,
  patientToFormValues,
  type ParsedPatientFormValues,
} from '@/features/patients/patient.types'
import { NotFoundPage } from '@/shared/components/not-found.page'

export function PatientEditPage() {
  const navigate = useNavigate()
  const { patientId } = useParams()
  const updatePatientMutation = useUpdatePatientMutation()
  const [submitError, setSubmitError] = useState<ReturnType<
    typeof getPatientErrorFeedback
  > | null>(null)

  const patientQuery = usePatientDetailQuery(patientId ?? '')

  if (!patientId) {
    return <NotFoundPage />
  }

  const loadFeedback = patientQuery.error
    ? getPatientErrorFeedback(patientQuery.error)
    : null

  const handleSubmit = async (values: ParsedPatientFormValues) => {
    if (!patientQuery.data) {
      return
    }

    setSubmitError(null)

    try {
      const patient = await updatePatientMutation.mutateAsync({
        patientId,
        values: {
          ...patientFormValuesToRequest(values),
          rowVersion: patientQuery.data.rowVersion,
        },
      })
      navigate(`/patients/${patient.id}`, {
        state: { notice: 'Perubahan data pasien disimpan.' },
      })
    } catch (error) {
      setSubmitError(getPatientErrorFeedback(error))
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
          description={loadFeedback.message}
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
    <div className="mx-auto grid max-w-4xl gap-6">
      <section className="grid gap-1.5" aria-labelledby="patient-edit-title">
        <Text as="h1" id="patient-edit-title" variant="heading1">
          Ubah data pasien
        </Text>
        <Text variant="secondary">
          Perbarui data identitas untuk {patient.fullName}.
        </Text>
      </section>

      <LayerCard className="p-5">
        <PatientForm
          backPath={`/patients/${patient.id}`}
          initialValues={patientToFormValues(patient)}
          isSubmitting={updatePatientMutation.isPending}
          key={patient.id}
          onSubmit={handleSubmit}
          submitError={submitError}
          submitLabel="Simpan perubahan"
        />
      </LayerCard>
    </div>
  )
}
