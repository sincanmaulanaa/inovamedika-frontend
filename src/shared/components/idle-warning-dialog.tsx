import { Button } from '@cloudflare/kumo/components/button'
import { Dialog } from '@cloudflare/kumo/components/dialog'
import { useUiStore } from '@/shared/stores/ui.store'

export function IdleWarningDialog() {
  const isVisible = useUiStore((state) => state.isIdleWarningVisible)
  const setVisible = useUiStore((state) => state.setIdleWarningVisible)

  return (
    <Dialog.Root role="alertdialog" open={isVisible} onOpenChange={setVisible}>
      <Dialog className="grid gap-5 px-5 py-4">
        <div className="grid gap-1.5">
          <Dialog.Title>Sesi akan berakhir</Dialog.Title>
          <Dialog.Description>
            Demi keamanan data pasien, sesi akan berakhir karena tidak ada
            aktivitas. Simpan pekerjaan sebelum melanjutkan.
          </Dialog.Description>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setVisible(false)}>
            Tutup peringatan
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  )
}
