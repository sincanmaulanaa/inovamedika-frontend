import { Text } from '@cloudflare/kumo/components/text'
import { Empty } from '@cloudflare/kumo/components/empty'
import { FileTextIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { queuesQueryOptions } from './queue.queries'
import { useCallNextQueueMutation, useRecallQueueMutation, useSkipQueueMutation, useStartQueueMutation } from './queue.mutations'
import { QueueCard } from './components/queue-card'
import type { QueueData } from './queue.types'
import { useNavigate } from 'react-router'
import { useAuthSession } from '@/features/auth/auth.queries'

export function QueueManagementPage() {
  const navigate = useNavigate()
  const sessionQuery = useAuthSession()
  const role = sessionQuery.data?.profile.role
  const isDoctor = role === 'DOCTOR'

  const query = useQuery(queuesQueryOptions({
    polyclinicId: undefined,
  }))

  const callNextMutation = useCallNextQueueMutation()
  const recallMutation = useRecallQueueMutation()
  const skipMutation = useSkipQueueMutation()
  const startExamMutation = useStartQueueMutation()

  const handleCallNext = (id: string | undefined) => {
    if (typeof id === 'string') {
      const today = new Date().toISOString().split('T')[0] as string
      callNextMutation.mutate({ polyclinicId: id, data: { serviceDate: today } })
    }
  }

  const handleRecall = (id: string, rowVersion: number) => recallMutation.mutate({ id, rowVersion })
  const handleSkip = (id: string, rowVersion: number) => skipMutation.mutate({ id, rowVersion })
  const handleStartExam = (id: string, rowVersion: number) => {
    startExamMutation.mutate({ id, rowVersion }, {
      onSuccess: (data) => {
        navigate(`/medical-records/new?registrationId=${data.registrationId}`)
      }
    })
  }

  const items = query.data?.items ?? []

  return (
    <div className="grid gap-6">
      <section
        aria-labelledby="queue-management-title"
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="grid gap-1.5">
          <Text as="h1" id="queue-management-title" variant="heading1">
            Manajemen Antrean
          </Text>
          <Text variant="secondary">
            Panggil pasien dan kelola status antrean hari ini.
          </Text>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full py-12">
            <Empty
              description="Tidak ada antrean aktif saat ini."
              icon={<FileTextIcon className="size-8" />}
              title="Antrean Kosong"
            />
          </div>
        ) : (
          items.map((queue: QueueData) => (
            <QueueCard
              key={queue.id}
              queue={queue}
              isDoctor={isDoctor}
              onCallNext={() => handleCallNext(queue.polyclinicId)}
              onRecall={() => handleRecall(queue.id, queue.rowVersion)}
              onSkip={() => handleSkip(queue.id, queue.rowVersion)}
              onStartExam={() => handleStartExam(queue.id, queue.rowVersion)}
            />
          ))
        )}
      </div>
    </div>
  )
}
