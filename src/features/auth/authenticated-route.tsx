import { Banner } from '@cloudflare/kumo/components/banner'
import { Button } from '@cloudflare/kumo/components/button'
import { Loader } from '@cloudflare/kumo/components/loader'
import { Text } from '@cloudflare/kumo/components/text'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthSession } from '@/features/auth/auth.queries'

export function AuthenticatedRoute() {
  const location = useLocation()
  const sessionQuery = useAuthSession()

  if (sessionQuery.isPending) {
    return <SessionLoadingState />
  }

  if (sessionQuery.isError) {
    return (
      <SessionUnavailableState
        isRetrying={sessionQuery.isFetching}
        onRetry={() => void sessionQuery.refetch()}
      />
    )
  }

  if (!sessionQuery.data) {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}` }}
        to="/login"
      />
    )
  }

  return <Outlet />
}

function SessionLoadingState() {
  return (
    <main className="grid min-h-svh place-items-center bg-kumo-base px-4">
      <div
        className="grid justify-items-center gap-3 text-center"
        role="status"
      >
        <Loader aria-label="Memeriksa sesi" />
        <Text>Memeriksa sesi…</Text>
      </div>
    </main>
  )
}

interface SessionUnavailableStateProps {
  readonly isRetrying: boolean
  readonly onRetry: () => void
}

function SessionUnavailableState({
  isRetrying,
  onRetry,
}: SessionUnavailableStateProps) {
  return (
    <main className="grid min-h-svh place-items-center bg-kumo-base px-4">
      <div className="grid w-full max-w-md gap-4">
        <div className="grid gap-1.5 text-center">
          <Text as="h1" variant="heading1">
            Sesi belum dapat diperiksa
          </Text>
          <Text variant="secondary">
            Layanan belum dapat dihubungi. Periksa koneksi lalu coba lagi.
          </Text>
        </div>
        <Banner
          description="Data tetap aman dan belum ada perubahan yang dikirim."
          title="Koneksi terputus"
          variant="alert"
        />
        <Button loading={isRetrying} onClick={onRetry} variant="primary">
          Coba lagi
        </Button>
      </div>
    </main>
  )
}
