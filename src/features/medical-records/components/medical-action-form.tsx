import { Button } from '@cloudflare/kumo/components/button'
import { Text } from '@cloudflare/kumo/components/text'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'

import type { MedicalActionMutationData } from '../medical-record.types'

interface MedicalActionFormProps {
  readonly value: readonly MedicalActionMutationData[]
  readonly onChange: (actions: readonly MedicalActionMutationData[]) => void
}

export function MedicalActionForm({ value, onChange }: MedicalActionFormProps) {
  const addAction = () => {
    onChange([...value, { actionName: '', notes: '' }])
  }

  const removeAction = (index: number) => {
    const newActions = [...value]
    newActions.splice(index, 1)
    onChange(newActions)
  }

  const updateActionName = (index: number, actionName: string) => {
    const newActions = [...value]
    const item = newActions[index]
    if (item) {
      newActions[index] = { ...item, actionName }
      onChange(newActions)
    }
  }

  const updateNotes = (index: number, notes: string) => {
    const newActions = [...value]
    const item = newActions[index]
    if (item) {
      newActions[index] = { ...item, notes }
      onChange(newActions)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Text as="h3" variant="body" bold>Tindakan Medis</Text>
        <Button type="button" variant="secondary" onClick={addAction}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Tindakan
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-sm italic text-(--kumo-text-secondary)">Belum ada tindakan medis yang ditambahkan.</p>
      ) : (
        <div className="grid gap-4">
          {value.map((action, index) => (
            <div key={`action-${index}`} className="flex items-start gap-4 p-4 border border-black/10 rounded-md">
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label htmlFor={`actionName-${index}`} className="text-sm font-medium text-(--kumo-text-primary)">
                    Nama Tindakan
                  </label>
                  <input
                    id={`actionName-${index}`}
                    className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                    value={action.actionName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateActionName(index, e.target.value)}
                    placeholder="Contoh: Injeksi IM"
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor={`actionNotes-${index}`} className="text-sm font-medium text-(--kumo-text-primary)">
                    Catatan (Opsional)
                  </label>
                  <input
                    id={`actionNotes-${index}`}
                    className="flex h-9 w-full rounded-md border border-black/20 bg-transparent px-3 text-sm placeholder:text-black/50 focus:border-black/50 focus:outline-none focus:ring-1 focus:ring-black/50"
                    value={action.notes ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNotes(index, e.target.value)}
                    placeholder="Contoh: Di lengan kiri"
                  />
                </div>
              </div>
              <button
                type="button"
                className="mt-6 text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50"
                onClick={() => removeAction(index)}
                title="Hapus tindakan"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
