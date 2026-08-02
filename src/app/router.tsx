import { Navigate, createBrowserRouter, type RouteObject } from 'react-router'
import { AuthenticatedRoute } from '@/features/auth/authenticated-route'
import { AppShell } from '@/shared/components/app-shell'
import { NotFoundPage } from '@/shared/components/not-found.page'

export const appRoutes: RouteObject[] = [
  {
    path: '/login',
    lazy: async () => {
      const { LoginPage } = await import('@/features/auth/login.page')

      return { Component: LoginPage }
    },
  },
  {
    element: <AuthenticatedRoute />,
    children: [
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
    ],
  },
]

export const appRouter = createBrowserRouter(appRoutes)
