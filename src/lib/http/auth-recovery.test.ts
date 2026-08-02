import { describe, expect, it } from 'vitest'
import {
  recoverAuthentication,
  registerAuthRecoveryHandler,
} from '@/lib/http/auth-recovery'

describe('authentication recovery', () => {
  it('shares one refresh operation across concurrent requests', async () => {
    let releaseRecovery: () => void = () => undefined
    let recoveryCount = 0
    const recoveryBarrier = new Promise<void>((resolve) => {
      releaseRecovery = resolve
    })
    const unregister = registerAuthRecoveryHandler(async () => {
      recoveryCount += 1
      await recoveryBarrier
    })

    const firstRecovery = recoverAuthentication()
    const secondRecovery = recoverAuthentication()

    expect(recoveryCount).toBe(1)
    releaseRecovery()
    await Promise.all([firstRecovery, secondRecovery])
    unregister()
  })
})
