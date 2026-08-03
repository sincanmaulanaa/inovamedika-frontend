import { Button } from '@cloudflare/kumo/components/button'
import { Input } from '@cloudflare/kumo/components/input'
import { Text } from '@cloudflare/kumo/components/text'
import { CaretLeftIcon } from '@phosphor-icons/react'
import { type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCreateRegistrationMutation } from './registration.mutations'
import type { FinancingType } from './registration.types'

const financingTypeOptions: readonly { value: FinancingType; label: string }[] = [
  { value: 'SELF_PAY', label: 'Umum / Biaya Sendiri' },
  { value: 'BPJS_KESEHATAN', label: 'BPJS Kesehatan' },
  { value: 'COMPANY', label: 'Perusahaan' },
  { value: 'PRIVATE_INSURANCE', label: 'Asuransi Swasta' },
]

export function RegistrationCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateRegistrationMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const financingType = String(formData.get('financingType')) as FinancingType
    const payerIdRaw = String(formData.get('payerId')).trim()

    createMutation.mutate(
      {
        patientId: String(formData.get('patientId')),
        doctorId: String(formData.get('doctorId')),
        polyclinicId: String(formData.get('polyclinicId')),
        serviceDate: String(formData.get('serviceDate')),
        financingType,
        payerId: financingType === 'SELF_PAY' ? null : (payerIdRaw || null),
        payerMemberNumber: String(formData.get('payerMemberNumber')).trim() || null,
        visitReason: String(formData.get('visitReason')),
        repeatVisitReason: null,
      },
      {
        onSuccess: () => {
          navigate('/registrations', {
            state: { notice: 'Pendaftaran kunjungan berhasil dibuat.' },
          })
        },
      }
    )
  }

  return (
    <div className="grid max-w-2xl gap-8 pb-12">
      <section aria-labelledby="registration-create-title" className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <Link
            className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-(--kumo-text-secondary) hover:bg-black/5"
            to="/registrations"
          >
            <CaretLeftIcon className="size-4" />
            Kembali
          </Link>
        </div>
        <Text as="h1" id="registration-create-title" variant="heading1">
          Pendaftaran baru
        </Text>
        <Text variant="secondary">
          Buat pendaftaran kunjungan untuk pasien.
        </Text>
      </section>

      <form className="grid gap-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <Text as="h2" variant="heading3">
            Identitas Kunjungan
          </Text>

          <Input
            description="Masukkan ID Pasien (UUID)"
            label="ID Pasien"
            name="patientId"
            required
          />

          <Input
            description="Masukkan ID Dokter (UUID)"
            label="ID Dokter"
            name="doctorId"
            required
          />

          <Input
            description="Masukkan ID Poli (UUID)"
            label="ID Poli"
            name="polyclinicId"
            required
          />

          <Input
            label="Tanggal Kunjungan"
            name="serviceDate"
            required
            type="date"
          />

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-(--kumo-text-primary)">
              Jenis Pembiayaan
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 py-1 text-sm shadow-sm focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
              name="financingType"
              required
            >
              {financingTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <Input
            description="Wajib diisi untuk BPJS, Perusahaan, dan Asuransi Swasta"
            label="ID Pembayar (UUID)"
            name="payerId"
          />

          <Input
            label="Nomor Peserta / Polis"
            name="payerMemberNumber"
          />

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-(--kumo-text-primary)">
              Alasan Kunjungan
            </label>
            <textarea
              className="flex min-h-20 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
              name="visitReason"
              placeholder="Keluhan atau alasan kunjungan singkat..."
              required
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-base font-medium text-black ring-1 ring-inset ring-black/20 hover:bg-black/5"
            to="/registrations"
          >
            Batal
          </Link>
          <Button
            loading={createMutation.isPending}
            type="submit"
            variant="primary"
          >
            Simpan pendaftaran
          </Button>
        </div>
      </form>
    </div>
  )
}
