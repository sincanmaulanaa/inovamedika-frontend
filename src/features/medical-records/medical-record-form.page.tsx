import { Button } from '@cloudflare/kumo/components/button'
import { Text } from '@cloudflare/kumo/components/text'
import { CaretLeftIcon } from '@phosphor-icons/react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useCreateMedicalRecordMutation, useFinalizeMedicalRecordMutation } from './medical-record.mutations'
import { useCreatePrescriptionMutation } from '@/features/prescriptions/prescription.mutations'
import { PrescriptionForm } from '@/features/prescriptions/components/prescription-form'
import type { PrescriptionItemMutationData } from '@/features/prescriptions/prescription.types'
import { useQuery } from '@tanstack/react-query'
import { registrationQueryOptions } from '@/features/registrations/registration.queries'
import { medicalRecordsQueryOptions } from './medical-record.queries'
import { MedicalRecordHistory } from './components/medical-record-history'
// In MVP we assume registrationId is passed via URL query params

export function MedicalRecordFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const registrationId = searchParams.get('registrationId')
  
  const createMutation = useCreateMedicalRecordMutation()
  const createPrescriptionMutation = useCreatePrescriptionMutation()
  const finalizeMutation = useFinalizeMedicalRecordMutation()

  const { data: registrationData } = useQuery({
    ...registrationQueryOptions(registrationId ?? ''),
    enabled: Boolean(registrationId),
  })

  const { data: medicalRecordsData } = useQuery({
    ...medicalRecordsQueryOptions({
      patientId: registrationData?.patientId ?? '',
      page: 1,
      limit: 10,
    }),
    enabled: Boolean(registrationData?.patientId),
  })

  const [prescriptionItems, setPrescriptionItems] = useState<readonly PrescriptionItemMutationData[]>([])
  const [isFinal, setIsFinal] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!registrationId) {
      alert('Pendaftaran tidak valid')
      return
    }

    const formData = new FormData(event.currentTarget)

    const bloodPressure = String(formData.get('bloodPressure'))
    const temperature = String(formData.get('temperature'))
    const weight = String(formData.get('weight'))
    const height = String(formData.get('height'))
    const objectiveNotes = String(formData.get('objectiveNotes')).trim()

    const objectiveParts = [
      `TD: ${bloodPressure} mmHg`,
      `Suhu: ${temperature} °C`,
      `BB: ${weight} kg`,
      `TB: ${height} cm`,
    ]
    if (objectiveNotes) {
      objectiveParts.push(`Catatan: ${objectiveNotes}`)
    }

    createMutation.mutate(
      {
        registrationId,
        subjective: String(formData.get('subjective')),
        objective: objectiveParts.join('; '),
        assessment: String(formData.get('assessment')),
        plan: String(formData.get('plan')),
      },
      {
        onSuccess: (medicalRecordData) => {
          const handleNext = () => {
            if (isFinal) {
              finalizeMutation.mutate({ id: medicalRecordData.id, data: { rowVersion: medicalRecordData.rowVersion } }, {
                onSuccess: () => navigate('/queues', { state: { notice: 'Rekam medis dan resep berhasil disimpan dan difinalisasi.' } }),
                onError: () => alert('Gagal memfinalisasi rekam medis.')
              })
            } else {
              navigate('/queues', { state: { notice: 'Rekam medis berhasil disimpan sebagai DRAFT.' } })
            }
          }

          if (prescriptionItems.length > 0) {
            createPrescriptionMutation.mutate({
              medicalRecordId: medicalRecordData.id,
              notes: null,
              items: prescriptionItems
            }, {
              onSuccess: handleNext,
              onError: () => alert('Gagal menyimpan resep. Rekam medis sudah tersimpan.')
            })
          } else {
            handleNext()
          }
        },
      }
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 pb-12 items-start">
      <div className="grid gap-8">
        <section aria-labelledby="medical-record-title" className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <Link
            className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-(--kumo-text-secondary) hover:bg-black/5"
            to="/queues"
          >
            <CaretLeftIcon className="size-4" />
            Kembali ke Antrean
          </Link>
        </div>
        <Text as="h1" id="medical-record-title" variant="heading1">
          Pemeriksaan Medis (SOAP)
        </Text>
        <Text variant="secondary">
          Catat keluhan, pemeriksaan fisik, diagnosis, dan rencana tata laksana pasien.
        </Text>
      </section>

      <form className="grid gap-8" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-(--kumo-text-primary)">
              Subjektif (S)
            </label>
            <textarea
              className="flex min-h-24 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
              name="subjective"
              placeholder="Keluhan utama pasien..."
              required
            />
          </div>
          
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-(--kumo-text-primary)">
              Objektif (O) — Tanda Vital
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-xs text-(--kumo-text-secondary)">Tekanan Darah (sistolik/diastolik)</label>
                <input
                  className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                  name="bloodPressure"
                  placeholder="120/80"
                  required
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-(--kumo-text-secondary)">Suhu Tubuh (°C)</label>
                <input
                  className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  placeholder="36.5"
                  required
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-(--kumo-text-secondary)">Berat Badan (kg)</label>
                <input
                  className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="65"
                  required
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-(--kumo-text-secondary)">Tinggi Badan (cm)</label>
                <input
                  className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                  name="height"
                  type="number"
                  step="0.1"
                  min="1"
                  placeholder="170"
                  required
                />
              </div>
            </div>
            <textarea
              className="mt-2 flex min-h-16 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
              name="objectiveNotes"
              placeholder="Catatan pemeriksaan fisik tambahan (opsional)..."
            />
          </div>
          
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-(--kumo-text-primary)">
              Asesmen (A)
            </label>
            <textarea
              className="flex min-h-24 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
              name="assessment"
              placeholder="Diagnosis kerja dan banding..."
              required
            />
          </div>
          
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-(--kumo-text-primary)">
              Plan (P)
            </label>
            <textarea
              className="flex min-h-24 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
              name="plan"
              placeholder="Rencana tata laksana dan edukasi..."
              required
            />
          </div>
          
          <hr className="border-black/10 my-4" />
          
          <PrescriptionForm items={prescriptionItems} onChange={setPrescriptionItems} />
          
          <hr className="border-black/10 my-4" />
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFinal"
              className="size-4 rounded border-black/20"
              checked={isFinal}
              onChange={(e) => setIsFinal(e.target.checked)}
            />
            <label htmlFor="isFinal" className="text-sm font-medium text-(--kumo-text-primary)">
              Tandai sebagai Final
            </label>
          </div>
          <div className="-mt-4 ml-6">
            <Text variant="secondary">
              Pemeriksaan dan resep yang difinalisasi akan mengakhiri antrean dan tidak dapat diubah lagi.
            </Text>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link 
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-base font-medium text-black ring-1 ring-inset ring-black/20 hover:bg-black/5" 
            to="/queues"
          >
            Batal
          </Link>
          <Button
            loading={createMutation.isPending || createPrescriptionMutation.isPending || finalizeMutation.isPending}
            type="submit"
            variant="primary"
          >
            Simpan Data Pemeriksaan
          </Button>
        </div>
      </form>
      </div>
      
      <aside className="sticky top-4 hidden lg:block">
        <MedicalRecordHistory records={medicalRecordsData?.items ?? []} />
      </aside>
    </div>
  )
}
