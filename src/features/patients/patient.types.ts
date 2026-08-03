import { z } from 'zod'

export const patientSexes = ['MALE', 'FEMALE'] as const

export const patientSexSchema = z.enum(patientSexes)

export type PatientSex = z.infer<typeof patientSexSchema>

export const patientSexLabels = {
  FEMALE: 'Perempuan',
  MALE: 'Laki-laki',
} as const satisfies Readonly<Record<PatientSex, string>>

export const patientSchema = z.object({
  address: z.string().nullable(),
  createdAt: z.iso.datetime(),
  dateOfBirth: z.iso.date(),
  fullName: z.string().min(1),
  id: z.uuid(),
  medicalRecordNumber: z.string().min(1),
  nik: z.string().regex(/^\d{16}$/),
  phone: z.string().nullable(),
  rowVersion: z.number().int().positive(),
  sex: patientSexSchema,
  updatedAt: z.iso.datetime(),
})

export const patientPaginationSchema = z.object({
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
})

export const patientListSchema = z.object({
  items: z.array(patientSchema),
  pagination: patientPaginationSchema,
})

const phoneCharacterPattern = /^[0-9+().\-\s]+$/

export const patientFormSchema = z.object({
  address: z
    .string()
    .trim()
    .max(1000, 'Alamat tidak dapat melebihi 1.000 karakter.'),
  dateOfBirth: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi.')
    .refine((value) => z.iso.date().safeParse(value).success, {
      message: 'Tanggal lahir belum sesuai.',
    }),
  fullName: z
    .string()
    .trim()
    .min(1, 'Nama pasien wajib diisi.')
    .max(200, 'Nama pasien tidak dapat melebihi 200 karakter.'),
  nik: z
    .string()
    .transform((value) => value.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{16}$/, 'NIK harus berisi 16 angka.')),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || phoneCharacterPattern.test(value),
      'Nomor telepon hanya dapat memuat angka dan tanda telepon umum.',
    )
    .refine((value) => {
      if (value.length === 0) {
        return true
      }

      const digitCount = value.replace(/\D/g, '').length
      return digitCount >= 8 && digitCount <= 15
    }, 'Nomor telepon harus terdiri dari 8 sampai 15 angka.'),
  sex: patientSexSchema,
})

export type Patient = z.infer<typeof patientSchema>
export type PatientList = z.infer<typeof patientListSchema>
export type PatientFormValues = z.input<typeof patientFormSchema>
export type ParsedPatientFormValues = z.output<typeof patientFormSchema>

export interface PatientListParams {
  readonly limit: number
  readonly page: number
  readonly search?: string
}

export type CreatePatientRequest = {
  readonly address: string | null
  readonly dateOfBirth: string
  readonly fullName: string
  readonly nik: string
  readonly phone: string | null
  readonly sex: PatientSex
}

export type UpdatePatientRequest = CreatePatientRequest & {
  readonly rowVersion: number
}

export const emptyPatientFormValues: PatientFormValues = {
  address: '',
  dateOfBirth: '',
  fullName: '',
  nik: '',
  phone: '',
  sex: 'MALE',
}

export function patientToFormValues(patient: Patient): PatientFormValues {
  return {
    address: patient.address ?? '',
    dateOfBirth: patient.dateOfBirth,
    fullName: patient.fullName,
    nik: patient.nik,
    phone: patient.phone ?? '',
    sex: patient.sex,
  }
}

export function patientFormValuesToRequest(
  values: ParsedPatientFormValues,
): CreatePatientRequest {
  return {
    address: values.address.length > 0 ? values.address : null,
    dateOfBirth: values.dateOfBirth,
    fullName: values.fullName,
    nik: values.nik,
    phone: values.phone.length > 0 ? values.phone : null,
    sex: values.sex,
  }
}
