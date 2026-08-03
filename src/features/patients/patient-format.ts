import {
  patientSexLabels,
  type PatientSex,
} from '@/features/patients/patient.types'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: 'long',
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
})

export function formatPatientSex(sex: PatientSex): string {
  return patientSexLabels[sex]
}

export function formatDateOnly(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00.000Z`))
}

export function formatDateTime(date: string): string {
  return dateTimeFormatter.format(new Date(date))
}

export function maskNik(nik: string): string {
  if (nik.length !== 16) {
    return nik
  }

  return `${nik.slice(0, 4)}••••••••${nik.slice(12)}`
}
