import { Text } from '@cloudflare/kumo/components/text'
import { Outlet } from 'react-router'
import { roleLabels, type UserRole } from '@/features/auth/auth.types'
import { useAuthSession } from '@/features/auth/auth.queries'

interface AuthorizedRouteProps {
  readonly allowedRoles: readonly UserRole[]
}

export function AuthorizedRoute({ allowedRoles }: AuthorizedRouteProps) {
  const sessionQuery = useAuthSession()
  const profile = sessionQuery.data?.profile

  if (profile && allowedRoles.includes(profile.role)) {
    return <Outlet />
  }

  return (
    <section className="mx-auto grid max-w-lg justify-items-start gap-3 py-16">
      <Text as="h1" variant="heading1">
        Akses belum tersedia
      </Text>
      <Text variant="secondary">
        Halaman ini hanya tersedia untuk{' '}
        {allowedRoles.map((role) => roleLabels[role]).join(' dan ')}.
      </Text>
    </section>
  )
}
