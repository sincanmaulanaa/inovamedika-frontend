type AuthRecoveryHandler = () => Promise<void>

let authRecoveryHandler: AuthRecoveryHandler | null = null
let recoveryPromise: Promise<void> | null = null

export function registerAuthRecoveryHandler(
  handler: AuthRecoveryHandler,
): () => void {
  authRecoveryHandler = handler

  return () => {
    if (authRecoveryHandler === handler) {
      authRecoveryHandler = null
    }
  }
}

export async function recoverAuthentication(): Promise<void> {
  if (!authRecoveryHandler) {
    throw new Error('Authentication recovery is not configured')
  }

  recoveryPromise ??= authRecoveryHandler().finally(() => {
    recoveryPromise = null
  })

  await recoveryPromise
}
