import { Toasty } from '@cloudflare/kumo/components/toast'
import { TooltipProvider } from '@cloudflare/kumo/components/tooltip'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { createAppQueryClient } from '@/app/query-client'
import { AuthSessionProvider } from '@/features/auth/auth-session.provider'

const appQueryClient = createAppQueryClient()
const shouldShowDevtools =
  import.meta.env.DEV && import.meta.env.MODE !== 'test'

interface AppProvidersProps {
  readonly children: ReactNode
  readonly queryClient?: QueryClient
}

export function AppProviders({
  children,
  queryClient = appQueryClient,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toasty>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </Toasty>
      </TooltipProvider>
      {shouldShowDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}
