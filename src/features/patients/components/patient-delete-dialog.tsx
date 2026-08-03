import { Button } from '@cloudflare/kumo/components/button'
import { Dialog } from '@cloudflare/kumo/components/dialog'
import { Text } from '@cloudflare/kumo/components/text'
import { TrashIcon } from '@phosphor-icons/react'

interface PatientDeleteDialogProps {
  readonly isDeleting: boolean
  readonly onConfirm: () => void
  readonly onOpenChange: (open: boolean) => void
  readonly open: boolean
  readonly patientName: string
}

export function PatientDeleteDialog({
  isDeleting,
  onConfirm,
  onOpenChange,
  open,
  patientName,
}: PatientDeleteDialogProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open} role="alertdialog">
      <Dialog className="grid gap-5 p-5" size="base">
        <div className="grid gap-2">
          <Dialog.Title>Hapus data pasien?</Dialog.Title>
          <Dialog.Description>
            Data pasien akan dihapus permanen. Tindakan ini tidak dapat
            dibatalkan.
          </Dialog.Description>
          <Text size="sm" variant="secondary">
            Pasien: {patientName}
          </Text>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="secondary"
          >
            Kembali
          </Button>
          <Button
            icon={TrashIcon}
            loading={isDeleting}
            onClick={onConfirm}
            type="button"
            variant="destructive"
          >
            Hapus data pasien
          </Button>
        </div>
      </Dialog>
    </Dialog.Root>
  )
}
