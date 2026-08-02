import { z } from 'zod'

export const userRoles = [
  'ADMINISTRATOR',
  'REGISTRATION_OFFICER',
  'DOCTOR',
] as const

export const userRoleSchema = z.enum(userRoles)

export type UserRole = z.infer<typeof userRoleSchema>

export const roleLabels = {
  ADMINISTRATOR: 'Administrator',
  REGISTRATION_OFFICER: 'Petugas pendaftaran',
  DOCTOR: 'Dokter',
} as const satisfies Readonly<Record<UserRole, string>>

export const authProfileSchema = z.object({
  displayName: z.string().trim().min(1),
  id: z.uuid(),
  permissions: z.array(z.string().trim().min(1)),
  role: userRoleSchema,
  username: z.string().trim().min(1),
})

export const issuedAuthSessionSchema = z.object({
  accessToken: z.string().trim().min(1),
  accessTokenExpiresInSeconds: z.number().int().positive(),
  csrfToken: z.string().trim().min(1),
  profile: authProfileSchema,
  sessionExpiresAt: z.iso.datetime(),
})

export const authSessionSchema = issuedAuthSessionSchema.omit({
  accessToken: true,
  csrfToken: true,
})

export type AuthProfile = z.infer<typeof authProfileSchema>
export type AuthSession = z.infer<typeof authSessionSchema>
export type IssuedAuthSession = z.infer<typeof issuedAuthSessionSchema>

export interface LoginCredentials {
  readonly password: string
  readonly username: string
}
