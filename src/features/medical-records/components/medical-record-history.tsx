import { Text } from '@cloudflare/kumo/components/text'
import { Empty } from '@cloudflare/kumo/components/empty'
import { ClipboardTextIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import type { MedicalRecordData } from '../medical-record.types'

interface MedicalRecordHistoryProps {
  readonly records: readonly MedicalRecordData[]
  readonly currentDoctorName?: string
}

export function MedicalRecordHistory({ records, currentDoctorName }: MedicalRecordHistoryProps) {
  if (records.length === 0) {
    return (
      <Empty
        description="Belum ada riwayat medis sebelumnya."
        icon={<ClipboardTextIcon className="size-8" />}
        title="Riwayat Kosong"
      />
    )
  }

  return (
    <div className="grid gap-4">
      <Text as="h3" variant="heading3">Riwayat Medis Pasien</Text>
      <div className="grid gap-4">
        {records.map((record) => (
          <div key={record.id} className="p-4 flex flex-col gap-2 border rounded-md">
            <div className="flex justify-between items-center pb-2 border-b">
              <Text as="strong" bold>{record.visitDate}</Text>
              <Text variant="secondary">{record.polyclinicName}</Text>
            </div>
            <dl className="grid gap-2 text-sm">
              <div className="grid">
                <Text variant="secondary">S - Subjektif</Text>
                <Text variant="body">{record.subjective || '-'}</Text>
              </div>
              <div className="grid">
                <Text variant="secondary">O - Objektif</Text>
                <Text variant="body">
                  {[
                    record.bloodPressureSystolic && record.bloodPressureDiastolic ? `TD: ${record.bloodPressureSystolic}/${record.bloodPressureDiastolic} mmHg` : null,
                    record.temperatureCelsius ? `Suhu: ${record.temperatureCelsius} °C` : null,
                    record.weightKg ? `BB: ${record.weightKg} kg` : null,
                    record.heightCm ? `TB: ${record.heightCm} cm` : null,
                  ].filter(Boolean).join('; ') || '-'}
                </Text>
              </div>
              <div className="grid">
                <Text variant="secondary">A - Asesmen</Text>
                <Text variant="body">{record.assessment || '-'}</Text>
              </div>
              <div className="grid">
                <Text variant="secondary">P - Plan</Text>
                <Text variant="body">{record.plan || '-'}</Text>
              </div>
              {record.actions && record.actions.length > 0 && (
                <div className="grid">
                  <Text variant="secondary">Tindakan</Text>
                  <Text variant="body">
                    {record.actions.map(a => a.actionName + (a.notes ? ` (${a.notes})` : '')).join(', ')}
                  </Text>
                </div>
              )}
            </dl>
            <div className="mt-2 flex items-center justify-between border-t pt-2">
              <Text variant="secondary">Dokter: {record.doctorName}</Text>
              {currentDoctorName === record.doctorName ? (
                <Link
                  className="text-sm font-medium text-kumo-default hover:text-kumo-strong underline"
                  to={`/medical-records/${record.id}/edit`}
                >
                  Ubah / Koreksi
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
