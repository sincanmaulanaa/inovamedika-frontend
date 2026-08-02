import { Navigate, createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from '@/shared/components/app-shell'
import { NotFoundPage } from '@/shared/components/not-found.page'

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/dashboard" />,
      },
      {
        path: 'dashboard',
        lazy: async () => {
          const { DashboardPage } =
            await import('@/features/dashboard/dashboard.page')

          return { Component: DashboardPage }
        },
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const appRouter = createBrowserRouter(appRoutes)
