import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  useLogoutMutation,
  useRefreshSessionMutation,
} from '@/features/auth/auth.mutations'
import { IdleWarningDialog } from '@/shared/components/idle-warning-dialog'
import { useUiStore } from '@/shared/stores/ui.store'

const idleTimeoutMs = 15 * 60_000
const idleWarningMs = idleTimeoutMs - 2 * 60_000
const activitySyncIntervalMs = 5 * 60_000
const activityHandlingIntervalMs = 1_000

export function SessionActivityMonitor() {
  const navigate = useNavigate()
  const refreshMutation = useRefreshSessionMutation()
  const logoutMutation = useLogoutMutation()
  const [hasContinuationError, setHasContinuationError] = useState(false)
  const setWarningVisible = useUiStore((state) => state.setIdleWarningVisible)
  const lastSyncedAtRef = useRef(Date.now())
  const resetTimersRef = useRef<() => void>(() => undefined)
  const refreshSessionRef = useRef(refreshMutation.mutateAsync)
  const logoutRef = useRef(logoutMutation.mutateAsync)

  refreshSessionRef.current = refreshMutation.mutateAsync
  logoutRef.current = logoutMutation.mutateAsync

  useEffect(() => {
    let warningTimer: ReturnType<typeof setTimeout> | undefined
    let logoutTimer: ReturnType<typeof setTimeout> | undefined
    let lastHandledActivityAt = 0

    const clearTimers = () => {
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
    }

    const endExpiredSession = () => {
      void logoutRef
        .current()
        .catch(() => undefined)
        .finally(() => {
          navigate('/login', {
            replace: true,
            state: {
              notice:
                'Sesi berakhir karena tidak ada aktivitas. Silakan masuk kembali.',
            },
          })
        })
    }

    const scheduleTimers = () => {
      clearTimers()
      warningTimer = setTimeout(() => {
        setWarningVisible(true)
      }, idleWarningMs)
      logoutTimer = setTimeout(endExpiredSession, idleTimeoutMs)
    }

    const handleActivity = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest('[role="alertdialog"]')
      ) {
        return
      }

      const now = Date.now()

      if (now - lastHandledActivityAt < activityHandlingIntervalMs) {
        return
      }

      lastHandledActivityAt = now
      setHasContinuationError(false)
      setWarningVisible(false)
      scheduleTimers()

      if (now - lastSyncedAtRef.current < activitySyncIntervalMs) {
        return
      }

      lastSyncedAtRef.current = now
      void refreshSessionRef.current().catch(() => {
        lastSyncedAtRef.current = 0
      })
    }

    resetTimersRef.current = scheduleTimers
    scheduleTimers()

    document.addEventListener('pointerdown', handleActivity, { passive: true })
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('scroll', handleActivity, { passive: true })

    return () => {
      clearTimers()
      resetTimersRef.current = () => undefined
      document.removeEventListener('pointerdown', handleActivity)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('scroll', handleActivity)
    }
  }, [navigate, setWarningVisible])

  const handleContinue = async () => {
    setHasContinuationError(false)

    try {
      await refreshMutation.mutateAsync()
      lastSyncedAtRef.current = Date.now()
      setWarningVisible(false)
      resetTimersRef.current()
    } catch {
      setHasContinuationError(true)
    }
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
    <IdleWarningDialog
      hasContinuationError={hasContinuationError}
      isContinuing={refreshMutation.isPending}
      isLoggingOut={logoutMutation.isPending}
      onContinue={() => void handleContinue()}
      onLogout={handleLogout}
    />
  )
}
