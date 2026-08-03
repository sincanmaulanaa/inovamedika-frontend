import { Button } from '@cloudflare/kumo/components/button'
import { Text } from '@cloudflare/kumo/components/text'
import { Banner } from '@cloudflare/kumo/components/banner'
import { Loader } from '@cloudflare/kumo/components/loader'
import { CaretLeftIcon } from '@phosphor-icons/react'
import { type FormEvent, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useUpdateMedicalRecordMutation, useAmendMedicalRecordMutation } from './medical-record.mutations'
import { useMedicalRecordDetailQuery } from './medical-record.queries'

export function MedicalRecordEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const query = useMedicalRecordDetailQuery(id ?? '')
  const updateMutation = useUpdateMedicalRecordMutation()
  const amendMutation = useAmendMedicalRecordMutation()

  const [subjective, setSubjective] = useState('')
  const [bloodPressure, setBloodPressure] = useState('')
  const [temperature, setTemperature] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [objectiveNotes, setObjectiveNotes] = useState('')
  const [assessment, setAssessment] = useState('')
  const [plan, setPlan] = useState('')
  const [amendmentReason, setAmendmentReason] = useState('')

  useEffect(() => {
    if (query.data) {
      setSubjective(query.data.subjective ?? '')
      setAssessment(query.data.assessment ?? '')
      setPlan(query.data.plan ?? '')
      
      const obj = query.data.objective ?? ''
      const tdMatch = obj.match(/TD:\s*(.*?)\s*mmHg/)
      const suhuMatch = obj.match(/Suhu:\s*(.*?)\s*°C/)
      const bbMatch = obj.match(/BB:\s*(.*?)\s*kg/)
      const tbMatch = obj.match(/TB:\s*(.*?)\s*cm/)
      const catMatch = obj.match(/Catatan:\s*(.*)/)

      if (tdMatch) setBloodPressure(tdMatch[1] ?? '')
      if (suhuMatch) setTemperature(suhuMatch[1] ?? '')
      if (bbMatch) setWeight(bbMatch[1] ?? '')
      if (tbMatch) setHeight(tbMatch[1] ?? '')
      if (catMatch) setObjectiveNotes(catMatch[1] ?? '')
    }
  }, [query.data])

  if (!id) return null

  if (query.isPending) {
    return (
      <div className="grid min-h-80 place-items-center" role="status">
        <div className="grid justify-items-center gap-3">
          <Loader aria-label="Memuat rekam medis" />
          <Text>Memuat rekam medis…</Text>
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <Banner
        title="Gagal Memuat"
        description="Gagal memuat rekam medis."
        variant="error"
      />
    )
  }

  const isFinal = query.data.status !== 'DRAFT'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const objectiveParts = [
      `TD: ${bloodPressure} mmHg`,
      `Suhu: ${temperature} °C`,
      `BB: ${weight} kg`,
      `TB: ${height} cm`,
    ]
    if (objectiveNotes) {
      objectiveParts.push(`Catatan: ${objectiveNotes.trim()}`)
    }
    const objective = objectiveParts.join('; ')

    if (isFinal) {
      amendMutation.mutate({
        id,
        data: {
          subjective,
          objective,
          assessment,
          plan,
          amendmentReason,
          rowVersion: query.data.rowVersion
        }
      }, {
        onSuccess: () => navigate(`/patients/${query.data.patientId}`, { state: { notice: 'Amandemen rekam medis berhasil disimpan.' } }),
        onError: () => alert('Gagal menyimpan amandemen.')
      })
    } else {
      updateMutation.mutate({
        id,
        data: {
          subjective,
          objective,
          assessment,
          plan,
          rowVersion: query.data.rowVersion
        }
      }, {
        onSuccess: () => navigate(`/patients/${query.data.patientId}`, { state: { notice: 'Draft rekam medis berhasil diperbarui.' } }),
        onError: () => alert('Gagal memperbarui draft rekam medis.')
      })
    }
  }

  return (
    <div className="grid max-w-3xl gap-8 pb-12 items-start">
      <div className="grid gap-8">
        <section aria-labelledby="medical-record-title" className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <Link
              className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-(--kumo-text-secondary) hover:bg-black/5"
              to={`/patients/${query.data.patientId}`}
            >
              <CaretLeftIcon className="size-4" />
              Kembali ke Detail Pasien
            </Link>
          </div>
          <Text as="h1" id="medical-record-title" variant="heading1">
            {isFinal ? 'Koreksi / Amandemen Rekam Medis' : 'Ubah Draft Rekam Medis'}
          </Text>
          <Text variant="secondary">
            {isFinal ? 'Tambahkan addendum untuk mengoreksi catatan yang sudah final. Riwayat versi sebelumnya akan tetap disimpan.' : 'Ubah catatan rekam medis yang belum difinalisasi.'}
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
                value={subjective}
                onChange={e => setSubjective(e.target.value)}
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
                    value={bloodPressure}
                    onChange={e => setBloodPressure(e.target.value)}
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
                    value={temperature}
                    onChange={e => setTemperature(e.target.value)}
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
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
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
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    required
                  />
                </div>
              </div>
              <textarea
                className="mt-2 flex min-h-16 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                name="objectiveNotes"
                value={objectiveNotes}
                onChange={e => setObjectiveNotes(e.target.value)}
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
                value={assessment}
                onChange={e => setAssessment(e.target.value)}
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
                value={plan}
                onChange={e => setPlan(e.target.value)}
                required
              />
            </div>
            
            {isFinal && (
              <>
                <hr className="border-black/10 my-4" />
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-(--kumo-text-primary)">
                    Alasan Koreksi / Amandemen
                  </label>
                  <textarea
                    className="flex min-h-24 w-full rounded-md border border-red-500 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    name="amendmentReason"
                    value={amendmentReason}
                    onChange={e => setAmendmentReason(e.target.value)}
                    placeholder="Wajib mengisi alasan perubahan untuk riwayat audit..."
                    required
                  />
                  <Text size="sm" variant="secondary">Alasan amandemen wajib diisi sesuai aturan rekam medis.</Text>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Link 
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-base font-medium text-black ring-1 ring-inset ring-black/20 hover:bg-black/5" 
              to={`/patients/${query.data.patientId}`}
            >
              Batal
            </Link>
            <Button
              loading={updateMutation.isPending || amendMutation.isPending}
              type="submit"
              variant="primary"
            >
              {isFinal ? 'Simpan Amandemen' : 'Simpan Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
