export const authKeys = {
  all: ['authentication'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}
