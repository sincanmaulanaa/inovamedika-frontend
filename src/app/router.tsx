import { Navigate, createBrowserRouter, type RouteObject } from 'react-router'
import { AuthorizedRoute } from '@/features/auth/authorized-route'
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
            element: (
              <AuthorizedRoute
                allowedRoles={['ADMINISTRATOR', 'REGISTRATION_OFFICER']}
              />
            ),
            children: [
              {
                path: 'registrations',
                lazy: async () => {
                  const { RegistrationListPage } = await import('@/features/registrations/registration-list.page')
                  return { Component: RegistrationListPage }
                },
              },
              {
                path: 'registrations/new',
                lazy: async () => {
                  const { RegistrationCreatePage } = await import('@/features/registrations/registration-create.page')
                  return { Component: RegistrationCreatePage }
                },
              },
              {
                path: 'registrations/:registrationId',
                lazy: async () => {
                  const { RegistrationDetailPage } = await import('@/features/registrations/registration-detail.page')
                  return { Component: RegistrationDetailPage }
                },
              },
              {
                path: 'patients/new',
                lazy: async () => {
                  const { PatientCreatePage } = await import('@/features/patients/patient-create.page')
                  return { Component: PatientCreatePage }
                },
              },
              {
                path: 'patients/:patientId/edit',
                lazy: async () => {
                  const { PatientEditPage } = await import('@/features/patients/patient-edit.page')
                  return { Component: PatientEditPage }
                },
              },
            ],
          },
          {
            element: (
              <AuthorizedRoute
                allowedRoles={['ADMINISTRATOR', 'REGISTRATION_OFFICER', 'DOCTOR']}
              />
            ),
            children: [
              {
                path: 'queues',
                lazy: async () => {
                  const { QueueManagementPage } = await import('@/features/queues/queue-management.page')
                  return { Component: QueueManagementPage }
                },
              },
              {
                path: 'patients',
                lazy: async () => {
                  const { PatientListPage } = await import('@/features/patients/patient-list.page')
                  return { Component: PatientListPage }
                },
              },
              {
                path: 'patients/:patientId',
                lazy: async () => {
                  const { PatientDetailPage } = await import('@/features/patients/patient-detail.page')
                  return { Component: PatientDetailPage }
                },
              },
            ],
          },
          {
            element: (
              <AuthorizedRoute
                allowedRoles={['DOCTOR']}
              />
            ),
            children: [
              {
                path: 'medical-records/new',
                lazy: async () => {
                  const { MedicalRecordFormPage } = await import('@/features/medical-records/medical-record-form.page')
                  return { Component: MedicalRecordFormPage }
                },
              },
              {
                path: 'medical-records/:id/edit',
                lazy: async () => {
                  const { MedicalRecordEditPage } = await import('@/features/medical-records/medical-record-edit.page')
                  return { Component: MedicalRecordEditPage }
                },
              },
            ],
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
