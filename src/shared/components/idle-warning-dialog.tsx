import { Banner } from '@cloudflare/kumo/components/banner'
import { Button } from '@cloudflare/kumo/components/button'
import { Dialog } from '@cloudflare/kumo/components/dialog'
import { useUiStore } from '@/shared/stores/ui.store'

interface IdleWarningDialogProps {
  readonly hasContinuationError: boolean
  readonly isContinuing: boolean
  readonly isLoggingOut: boolean
  readonly onContinue: () => void
  readonly onLogout: () => void
}

export function IdleWarningDialog({
  hasContinuationError,
  isContinuing,
  isLoggingOut,
  onContinue,
  onLogout,
}: IdleWarningDialogProps) {
  const isVisible = useUiStore((state) => state.isIdleWarningVisible)

  return (
    <Dialog.Root
      role="alertdialog"
      open={isVisible}
      onOpenChange={() => undefined}
    >
      <Dialog className="grid gap-5 px-5 py-4">
        <div className="grid gap-1.5">
          <Dialog.Title>Sesi akan berakhir</Dialog.Title>
          <Dialog.Description>
            Demi keamanan data pasien, sesi akan berakhir dalam dua menit. Pilih
            tetap masuk untuk melanjutkan pekerjaan.
          </Dialog.Description>
        </div>
        {hasContinuationError ? (
          <Banner
            description="Periksa koneksi lalu coba lagi, atau keluar dengan aman."
            role="alert"
            size="sm"
            title="Sesi belum dapat diperpanjang"
            variant="error"
          />
        ) : null}
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button
            disabled={isContinuing}
            loading={isLoggingOut}
            onClick={onLogout}
            variant="secondary"
          >
            Keluar sekarang
          </Button>
          <Button
            disabled={isLoggingOut}
            loading={isContinuing}
            onClick={onContinue}
            variant="primary"
          >
            Tetap masuk
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  )
}
