import { Banner } from '@cloudflare/kumo/components/banner'
import { Button } from '@cloudflare/kumo/components/button'
import { Input } from '@cloudflare/kumo/components/input'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Loader } from '@cloudflare/kumo/components/loader'
import { Text } from '@cloudflare/kumo/components/text'
import {
  ClipboardTextIcon,
  LockKeyIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { getAuthErrorFeedback } from '@/features/auth/auth.copy'
import { useLoginMutation } from '@/features/auth/auth.mutations'
import { useAuthSession } from '@/features/auth/auth.queries'

const loginFormSchema = z.object({
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi.')
    .max(128, 'Kata sandi tidak dapat melebihi 128 karakter.'),
  username: z
    .string()
    .trim()
    .min(1, 'Nama pengguna wajib diisi.')
    .max(64, 'Nama pengguna tidak dapat melebihi 64 karakter.'),
})

interface LoginFormValues {
  readonly password: string
  readonly username: string
}

interface LoginFieldErrors {
  readonly password?: string
  readonly username?: string
}

interface LoginLocationState {
  readonly from?: unknown
  readonly notice?: unknown
}

const initialFormValues: LoginFormValues = {
  password: '',
  username: '',
}

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const sessionQuery = useAuthSession()
  const loginMutation = useLoginMutation()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [submitError, setSubmitError] = useState<ReturnType<
    typeof getAuthErrorFeedback
  > | null>(null)
  const locationState = readLocationState(location.state)

  if (sessionQuery.data) {
    return <Navigate replace to={getSafeReturnPath(locationState.from)} />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const parsedForm = loginFormSchema.safeParse(formValues)

    if (!parsedForm.success) {
      const errors = parsedForm.error.flatten().fieldErrors
      setFieldErrors({
        password: errors.password?.[0],
        username: errors.username?.[0],
      })
      return
    }

    setFieldErrors({})

    try {
      await loginMutation.mutateAsync(parsedForm.data)
      navigate(getSafeReturnPath(locationState.from), { replace: true })
    } catch (error) {
      setSubmitError(getAuthErrorFeedback(error))
    }
  }

  if (sessionQuery.isPending) {
    return (
      <main className="grid min-h-svh place-items-center bg-kumo-base">
        <Loader aria-label="Memeriksa sesi" />
      </main>
    )
  }

  return (
    <main className="grid min-h-svh bg-kumo-base lg:grid-cols-[minmax(0,1fr)_minmax(28rem,38rem)]">
      <section className="hidden bg-kumo-tint px-10 py-12 ring-1 ring-inset ring-kumo-line lg:flex lg:flex-col lg:justify-between">
        <BrandMark />

        <div className="grid max-w-xl gap-6">
          <div className="grid gap-2">
            <Text as="h1" variant="heading1">
              Pelayanan klinik dalam satu alur
            </Text>
            <Text variant="secondary">
              Kelola pendaftaran, antrean, dan pemeriksaan melalui akses yang
              sesuai dengan tugas setiap pengguna.
            </Text>
          </div>

          <div className="grid gap-3">
            <FeatureItem
              icon={ShieldCheckIcon}
              text="Akses data dibatasi sesuai peran dan hubungan pelayanan."
            />
            <FeatureItem
              icon={ClipboardTextIcon}
              text="Aktivitas penting tercatat untuk menjaga akuntabilitas."
            />
          </div>
        </div>

        <Text size="sm" variant="secondary">
          Sistem internal Inova Medika
        </Text>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="grid w-full max-w-md gap-6">
          <div className="lg:hidden">
            <BrandMark />
          </div>

          <LayerCard className="rounded-xl px-6 py-5 shadow-sm ring ring-kumo-line sm:px-7 sm:py-6">
            <div className="grid gap-6">
              <div className="grid gap-1.5">
                <Text as="h2" variant="heading2">
                  Masuk ke Inova Medika
                </Text>
                <Text variant="secondary">
                  Gunakan akun pribadi yang diberikan oleh administrator klinik.
                </Text>
              </div>

              {typeof locationState.notice === 'string' ? (
                <Banner
                  description={locationState.notice}
                  size="sm"
                  title="Sesi selesai"
                  variant="secondary"
                />
              ) : null}

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

              <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
                <Input
                  autoCapitalize="none"
                  autoComplete="username"
                  autoFocus
                  error={fieldErrors.username}
                  label="Nama pengguna"
                  name="username"
                  onChange={(event) => {
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      username: event.target.value,
                    }))
                    setFieldErrors((currentErrors) => ({
                      ...currentErrors,
                      username: undefined,
                    }))
                  }}
                  placeholder="Masukkan nama pengguna"
                  spellCheck={false}
                  value={formValues.username}
                />

                <Input
                  autoComplete="current-password"
                  error={fieldErrors.password}
                  label="Kata sandi"
                  name="password"
                  onChange={(event) => {
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      password: event.target.value,
                    }))
                    setFieldErrors((currentErrors) => ({
                      ...currentErrors,
                      password: undefined,
                    }))
                  }}
                  placeholder="Masukkan kata sandi"
                  type="password"
                  value={formValues.password}
                />

                <Button
                  className="w-full text-center"
                  loading={loginMutation.isPending}
                  type="submit"
                  variant="primary"
                >
                  Masuk
                </Button>
              </form>

              <div className="flex items-start gap-2 text-kumo-subtle">
                <span className="h-lh flex items-center">
                  <LockKeyIcon aria-hidden="true" className="size-4" />
                </span>
                <Text size="sm" variant="secondary">
                  Jangan bagikan akun atau kata sandi kepada pengguna lain.
                </Text>
              </div>
            </div>
          </LayerCard>
        </div>
      </section>
    </main>
  )
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-kumo-base ring ring-kumo-line">
        <span className="font-semibold text-kumo-strong" aria-hidden="true">
          IM
        </span>
      </div>
      <Text as="span" variant="heading2">
        Inova Medika
      </Text>
    </div>
  )
}

interface FeatureItemProps {
  readonly icon: typeof ShieldCheckIcon
  readonly text: string
}

function FeatureItem({ icon: IconComponent, text }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="h-lh flex items-center text-kumo-strong">
        <IconComponent aria-hidden="true" className="size-5" />
      </span>
      <Text>{text}</Text>
    </div>
  )
}

function readLocationState(state: unknown): LoginLocationState {
  if (typeof state !== 'object' || state === null) {
    return {}
  }

  const candidate = state as Readonly<Record<string, unknown>>
  return { from: candidate.from, notice: candidate.notice }
}

function getSafeReturnPath(value: unknown): string {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//')
    ? value
    : '/dashboard'
}
