import { Badge } from '@cloudflare/kumo/components/badge'
import { Button } from '@cloudflare/kumo/components/button'
import { Text } from '@cloudflare/kumo/components/text'
import {
  CalendarBlankIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  HouseIcon,
  ListIcon,
  ListNumbersIcon,
  UsersThreeIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { useLogoutMutation } from '@/features/auth/auth.mutations'
import { useAuthSession } from '@/features/auth/auth.queries'
import { SessionActivityMonitor } from '@/features/auth/session-activity-monitor'
import { roleLabels, type UserRole } from '@/features/auth/auth.types'
import { useUiStore } from '@/shared/stores/ui.store'

interface NavigationItem {
  readonly allowedRoles: readonly UserRole[]
  readonly icon: Icon
  readonly isAvailable: boolean
  readonly label: string
  readonly path: string
}

const navigationItems = [
  {
    allowedRoles: ['ADMINISTRATOR', 'REGISTRATION_OFFICER', 'DOCTOR'],
    icon: HouseIcon,
    isAvailable: true,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    allowedRoles: ['ADMINISTRATOR', 'REGISTRATION_OFFICER', 'DOCTOR'],
    icon: UsersThreeIcon,
    isAvailable: true,
    label: 'Pasien',
    path: '/patients',
  },
  {
    allowedRoles: ['ADMINISTRATOR', 'REGISTRATION_OFFICER'],
    icon: CalendarBlankIcon,
    isAvailable: true,
    label: 'Pendaftaran',
    path: '/registrations',
  },
  {
    allowedRoles: ['ADMINISTRATOR', 'REGISTRATION_OFFICER', 'DOCTOR'],
    icon: ListNumbersIcon,
    isAvailable: true,
    label: 'Antrean',
    path: '/queues',
  },
] as const satisfies readonly NavigationItem[]

interface SidebarContentProps {
  readonly isCollapsed: boolean
  readonly onNavigate?: () => void
  readonly role: UserRole
}

function SidebarContent({
  isCollapsed,
  onNavigate = () => undefined,
  role,
}: SidebarContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-kumo-base">
      <div className="flex h-16 items-center gap-3 border-b border-kumo-line px-4">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-kumo-tint ring ring-kumo-line">
          <span className="font-semibold text-kumo-strong" aria-hidden="true">
            IM
          </span>
        </div>
        <span className={isCollapsed ? 'sr-only' : 'whitespace-nowrap'}>
          <Text as="span" variant="heading3">
            Inova Medika
          </Text>
        </span>
      </div>

      <nav
        aria-label="Navigasi utama"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
      >
        {navigationItems
          .filter((item) => canRoleAccessNavigation(item, role))
          .map((item) => (
            <NavigationItemLink
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          ))}
      </nav>

      <div className="border-t border-kumo-line px-4 py-3">
        <div className={isCollapsed ? 'sr-only' : undefined}>
          <Text variant="secondary" size="sm">
            {roleLabels[role]}
          </Text>
        </div>
      </div>
    </div>
  )
}

interface NavigationItemLinkProps {
  readonly isCollapsed: boolean
  readonly item: NavigationItem
  readonly onNavigate: () => void
}

function NavigationItemLink({
  isCollapsed,
  item,
  onNavigate,
}: NavigationItemLinkProps) {
  const IconComponent = item.icon
  const content = (
    <>
      <IconComponent aria-hidden="true" className="size-5 shrink-0" />
      <span className={isCollapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
      {!isCollapsed && !item.isAvailable ? (
        <Badge variant="secondary" className="ml-auto">
          Segera
        </Badge>
      ) : null}
    </>
  )
  const sharedClassName =
    'flex min-h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

  if (!item.isAvailable) {
    return (
      <span
        aria-disabled="true"
        aria-label={`${item.label}, segera tersedia`}
        className={`${sharedClassName} cursor-not-allowed text-kumo-subtle opacity-70`}
        title={isCollapsed ? `${item.label} (segera tersedia)` : undefined}
      >
        {content}
      </span>
    )
  }

  return (
    <NavLink
      aria-label={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        `${sharedClassName} ${
          isActive
            ? 'bg-kumo-tint text-kumo-strong ring ring-kumo-line'
            : 'text-kumo-default hover:bg-kumo-tint'
        }`
      }
      onClick={onNavigate}
      title={isCollapsed ? item.label : undefined}
      to={item.path}
    >
      {content}
    </NavLink>
  )
}

export function AppShell() {
  const navigate = useNavigate()
  const sessionQuery = useAuthSession()
  const logoutMutation = useLogoutMutation()
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const isMobileSidebarOpen = useUiStore((state) => state.isMobileSidebarOpen)
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const profile = sessionQuery.data?.profile

  if (!profile) {
    return null
  }

  const handleLogout = () => {
    void logoutMutation
      .mutateAsync()
      .catch(() => undefined)
      .finally(() => {
        navigate('/login', {
          replace: true,
          state: { notice: 'Anda telah keluar.' },
        })
      })
  }

  return (
    <div className="min-h-svh bg-kumo-base text-kumo-default md:grid md:grid-cols-[auto_minmax(0,1fr)]">
      <a
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-kumo-base px-3 py-2 ring ring-kumo-line focus:translate-y-0"
        href="#main-content"
      >
        Lewati ke konten utama
      </a>

      <aside
        aria-label="Navigasi desktop"
        className={`sticky top-0 hidden h-svh border-r border-kumo-line md:block ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent isCollapsed={isSidebarCollapsed} role={profile.role} />
      </aside>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            aria-label="Tutup navigasi"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
            type="button"
          />
          <aside
            aria-label="Navigasi seluler"
            className="relative h-full w-72 max-w-[85vw] border-r border-kumo-line"
          >
            <div className="absolute right-3 top-3 z-10">
              <Button
                aria-label="Tutup navigasi"
                icon={XIcon}
                onClick={() => setMobileSidebarOpen(false)}
                shape="square"
                size="sm"
                variant="ghost"
              />
            </div>
            <SidebarContent
              isCollapsed={false}
              onNavigate={() => setMobileSidebarOpen(false)}
              role={profile.role}
            />
          </aside>
        </div>
      ) : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-kumo-line bg-kumo-base/95 px-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              aria-label="Buka navigasi"
              className="md:hidden"
              icon={ListIcon}
              onClick={() => setMobileSidebarOpen(true)}
              shape="square"
              variant="ghost"
            />
            <Button
              aria-label={
                isSidebarCollapsed ? 'Perluas navigasi' : 'Ciutkan navigasi'
              }
              className="hidden md:inline-flex"
              icon={
                isSidebarCollapsed ? CaretDoubleRightIcon : CaretDoubleLeftIcon
              }
              onClick={toggleSidebar}
              shape="square"
              variant="ghost"
            />
            <div className="min-w-0">
              <Text as="span" variant="heading3" truncate>
                Operasional klinik
              </Text>
              <Text variant="secondary" size="sm" truncate>
                Asia/Jakarta
              </Text>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <Text as="span" variant="heading3" truncate>
                {profile.displayName}
              </Text>
              <Text size="sm" variant="secondary" truncate>
                {roleLabels[profile.role]}
              </Text>
            </div>
            <Button
              loading={logoutMutation.isPending}
              onClick={handleLogout}
              variant="secondary"
            >
              Keluar
            </Button>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>

      <SessionActivityMonitor />
    </div>
  )
}

function canRoleAccessNavigation(
  item: NavigationItem,
  role: UserRole,
): boolean {
  return item.allowedRoles.includes(role)
}
