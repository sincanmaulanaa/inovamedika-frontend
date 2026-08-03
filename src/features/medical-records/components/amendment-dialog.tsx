import { Button } from '@cloudflare/kumo/components/button'
import { Dialog } from '@cloudflare/kumo/components/dialog'
import { Text } from '@cloudflare/kumo/components/text'
import { type FormEvent, useState } from 'react'

interface AmendmentDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onSubmit: (reason: string) => void
  readonly isLoading: boolean
}

export function AmendmentDialog({ isOpen, onClose, onSubmit, isLoading }: AmendmentDialogProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onSubmit(reason)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog className="grid gap-5 px-5 py-4">
        <div className="grid gap-1.5">
          <Dialog.Title>Pengajuan Perubahan Rekam Medis</Dialog.Title>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mt-2">
            <Text variant="body">
              Rekam medis ini telah dikunci (FINAL) dan sudah melewati batas 2x24 jam sejak finalisasi. 
              Anda harus mengajukan permohonan kepada Administrator untuk dapat mengubah (amend) rekam medis ini.
            </Text>
            
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-(--kumo-text-primary)">
                Alasan Perubahan
              </label>
              <textarea
                className="flex min-h-24 w-full rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                name="reason"
                placeholder="Contoh: Kesalahan input pada tekanan darah sebelumnya tertulis 12/80 seharusnya 120/80..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Ajukan Perubahan
            </Button>
          </div>
        </form>
      </Dialog>
    </Dialog.Root>
  )
}
