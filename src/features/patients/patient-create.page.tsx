import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Text } from '@cloudflare/kumo/components/text'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PatientForm } from '@/features/patients/components/patient-form'
import { getPatientErrorFeedback } from '@/features/patients/patient.copy'
import { useCreatePatientMutation } from '@/features/patients/patient.mutations'
import {
  emptyPatientFormValues,
  patientFormValuesToRequest,
  type ParsedPatientFormValues,
} from '@/features/patients/patient.types'

export function PatientCreatePage() {
  const navigate = useNavigate()
  const createPatientMutation = useCreatePatientMutation()
  const [submitError, setSubmitError] = useState<ReturnType<
    typeof getPatientErrorFeedback
  > | null>(null)

  const handleSubmit = async (values: ParsedPatientFormValues) => {
    setSubmitError(null)

    try {
      const patient = await createPatientMutation.mutateAsync(
        patientFormValuesToRequest(values),
      )
      navigate(`/patients/${patient.id}`, {
        state: { notice: 'Data pasien disimpan.' },
      })
    } catch (error) {
      setSubmitError(getPatientErrorFeedback(error))
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <section className="grid gap-1.5" aria-labelledby="patient-create-title">
        <Text as="h1" id="patient-create-title" variant="heading1">
          Tambah pasien
        </Text>
        <Text variant="secondary">
          Isi data identitas pasien sebelum membuat pendaftaran.
        </Text>
      </section>

      <LayerCard className="p-5">
        <PatientForm
          backPath="/patients"
          initialValues={emptyPatientFormValues}
          isSubmitting={createPatientMutation.isPending}
          onSubmit={handleSubmit}
          submitError={submitError}
          submitLabel="Simpan data pasien"
        />
      </LayerCard>
    </div>
  )
}
