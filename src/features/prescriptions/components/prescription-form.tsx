import { Button } from '@cloudflare/kumo/components/button'
import { Text } from '@cloudflare/kumo/components/text'
import { Input } from '@cloudflare/kumo/components/input'
import { TrashIcon, PlusIcon } from '@phosphor-icons/react'
import type { PrescriptionItemMutationData } from '../prescription.types'
import { useQuery } from '@tanstack/react-query'
import { medicationsQueryOptions } from '@/features/master-data/master-data.queries'

interface PrescriptionFormProps {
  readonly items: readonly PrescriptionItemMutationData[]
  readonly onChange: (items: readonly PrescriptionItemMutationData[]) => void
}

export function PrescriptionForm({ items, onChange }: PrescriptionFormProps) {
  const { data: medications = [] } = useQuery(medicationsQueryOptions)

  const handleAddItem = () => {
    onChange([
      ...items,
      {
        medicationId: '',
        quantity: 1,
        dosageInstructions: '',
        notes: null,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleChangeItem = (
    index: number,
    field: keyof PrescriptionItemMutationData,
    value: string | number | null
  ) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    } as PrescriptionItemMutationData
    onChange(newItems)
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <Text as="h3" variant="heading3">
          Resep Obat
        </Text>
        <Button type="button" variant="secondary" onClick={handleAddItem}>
          <PlusIcon className="mr-2 size-4" />
          Tambah Obat
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center italic py-4">
          <Text variant="secondary">
            Belum ada obat yang ditambahkan ke resep.
          </Text>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item, index) => (
            <div key={index} className="grid gap-4 p-4 border rounded-md relative bg-black/5">
              <div className="absolute top-4 right-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveItem(index)}
                  title="Hapus obat ini"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>

              <div className="grid gap-1.5 pr-12">
                <label className="text-sm font-medium text-(--kumo-text-primary)">
                  Obat
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 py-1 text-sm shadow-sm focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                  value={item.medicationId}
                  onChange={(e) => handleChangeItem(index, 'medicationId', e.target.value)}
                  required
                >
                  <option value="" disabled>Pilih obat...</option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} - {med.dosageForm} {med.strength}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-(--kumo-text-primary)">
                    Jumlah
                  </label>
                  <Input
                    name={`quantity-${index}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleChangeItem(index, 'quantity', parseInt(e.target.value, 10))}
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-(--kumo-text-primary)">
                    Instruksi Dosis
                  </label>
                  <Input
                    name={`dosage-${index}`}
                    placeholder="Contoh: 3 x sehari 1 tablet sesudah makan"
                    value={item.dosageInstructions}
                    onChange={(e) => handleChangeItem(index, 'dosageInstructions', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-(--kumo-text-primary)">
                  Catatan Tambahan (Opsional)
                </label>
                <Input
                  name={`notes-${index}`}
                  placeholder="Catatan tambahan untuk apoteker"
                  value={item.notes ?? ''}
                  onChange={(e) => handleChangeItem(index, 'notes', e.target.value || null)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
