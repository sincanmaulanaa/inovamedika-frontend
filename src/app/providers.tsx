import { Toasty } from '@cloudflare/kumo/components/toast'
import { TooltipProvider } from '@cloudflare/kumo/components/tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { createAppQueryClient } from '@/app/query-client'

const appQueryClient = createAppQueryClient()
const shouldShowDevtools =
  import.meta.env.DEV && import.meta.env.MODE !== 'test'

interface AppProvidersProps {
  readonly children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={appQueryClient}>
      <TooltipProvider>
        <Toasty>{children}</Toasty>
      </TooltipProvider>
      {shouldShowDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}
