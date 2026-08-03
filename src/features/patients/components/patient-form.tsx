import { Banner } from '@cloudflare/kumo/components/banner'
import { Button } from '@cloudflare/kumo/components/button'
import { Input, InputArea } from '@cloudflare/kumo/components/input'
import { Select } from '@cloudflare/kumo/components/select'
import { FloppyDiskIcon } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import {
  patientFormSchema,
  patientSexLabels,
  type ParsedPatientFormValues,
  type PatientFormValues,
  type PatientSex,
} from '@/features/patients/patient.types'

type PatientFieldErrors = Partial<Record<keyof PatientFormValues, string>>

interface PatientFormProps {
  readonly backPath: string
  readonly cancelLabel?: string
  readonly initialValues: PatientFormValues
  readonly isSubmitting: boolean
  readonly onSubmit: (values: ParsedPatientFormValues) => Promise<void>
  readonly submitError: {
    readonly title: string
    readonly message: string
    readonly requestId?: string
  } | null
  readonly submitLabel: string
}

const sexItems: ReadonlyArray<{ label: string; value: PatientSex }> = [
  { label: patientSexLabels.MALE, value: 'MALE' },
  { label: patientSexLabels.FEMALE, value: 'FEMALE' },
]

export function PatientForm({
  backPath,
  cancelLabel = 'Kembali',
  initialValues,
  isSubmitting,
  onSubmit,
  submitError,
  submitLabel,
}: PatientFormProps) {
  const [formValues, setFormValues] = useState(initialValues)
  const [fieldErrors, setFieldErrors] = useState<PatientFieldErrors>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedForm = patientFormSchema.safeParse(formValues)

    if (!parsedForm.success) {
      const errors = parsedForm.error.flatten().fieldErrors
      setFieldErrors({
        address: errors.address?.[0],
        dateOfBirth: errors.dateOfBirth?.[0],
        fullName: errors.fullName?.[0],
        nik: errors.nik?.[0],
        phone: errors.phone?.[0],
        sex: errors.sex?.[0],
      })
      return
    }

    setFieldErrors({})
    await onSubmit(parsedForm.data)
  }

  const updateField = <TField extends keyof PatientFormValues>(
    field: TField,
    value: PatientFormValues[TField],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }))
  }

  return (
    <form className="grid gap-6" noValidate onSubmit={handleSubmit}>
      {submitError ? (
        <Banner
          description={
            <div className="grid gap-1">
              <span>{submitError.message}</span>
              {submitError.requestId ? (
                <span className="text-[0.9em]">
                  Kode bantuan: {submitError.requestId}
                </span>
              ) : null}
            </div>
          }
          role="alert"
          size="sm"
          title={submitError.title}
          variant="error"
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          autoComplete="off"
          error={fieldErrors.nik}
          inputMode="numeric"
          label="NIK"
          maxLength={19}
          name="nik"
          onChange={(event) => updateField('nik', event.target.value)}
          placeholder="Masukkan 16 angka NIK"
          value={formValues.nik}
        />

        <Input
          autoComplete="name"
          error={fieldErrors.fullName}
          label="Nama lengkap"
          name="fullName"
          onChange={(event) => updateField('fullName', event.target.value)}
          placeholder="Masukkan nama sesuai identitas"
          value={formValues.fullName}
        />

        <Select<PatientSex>
          error={fieldErrors.sex}
          items={sexItems}
          label="Jenis kelamin"
          name="sex"
          onValueChange={(value) => updateField('sex', value ?? 'MALE')}
          value={formValues.sex as PatientSex}
        />

        <Input
          error={fieldErrors.dateOfBirth}
          label="Tanggal lahir"
          name="dateOfBirth"
          onChange={(event) => updateField('dateOfBirth', event.target.value)}
          type="date"
          value={formValues.dateOfBirth}
        />

        <Input
          autoComplete="tel"
          error={fieldErrors.phone}
          inputMode="tel"
          label="Nomor telepon"
          name="phone"
          onChange={(event) => updateField('phone', event.target.value)}
          placeholder="Contoh: 081234567890"
          value={formValues.phone}
        />
      </div>

      <InputArea
        error={fieldErrors.address}
        label="Alamat"
        name="address"
        onChange={(event) => updateField('address', event.target.value)}
        placeholder="Masukkan alamat pasien"
        rows={4}
        value={formValues.address}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-kumo-line pt-5 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-base font-medium text-kumo-default ring ring-kumo-line hover:bg-kumo-tint"
          to={backPath}
        >
          {cancelLabel}
        </Link>
        <Button
          icon={FloppyDiskIcon}
          loading={isSubmitting}
          type="submit"
          variant="primary"
        >
          {submitLabel}
        </Button>
      </div>

      <span className="sr-only" aria-live="polite">
        {isSubmitting ? 'Menyimpan data pasien' : ''}
      </span>
    </form>
  )
}
