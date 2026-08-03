import { Text } from '@cloudflare/kumo/components/text'
import { SpeakerHighIcon, SkipForwardIcon, PlayIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import type { QueueData } from '../queue.types'

interface QueueCardProps {
  readonly queue: QueueData
  readonly onCallNext: (id: string) => void
  readonly onRecall: (id: string) => void
  readonly onSkip: (id: string) => void
  readonly onStartExam: (id: string) => void
  readonly isDoctor: boolean
}

export function QueueCard({
  queue,
  onCallNext,
  onRecall,
  onSkip,
  onStartExam,
  isDoctor,
}: QueueCardProps) {
  const isWaiting = queue.status === 'WAITING' || queue.status === 'SKIPPED'
  const isCalled = queue.status === 'SERVING' // or CALLED? The API says SERVING
  
  return (
    <div className="flex flex-col gap-4 p-4 border rounded shadow-sm">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <div className="tabular-nums">
            <Text as="h2" variant="heading2">
              {queue.queueNumber}
            </Text>
          </div>
          <Text variant="secondary">
            ID Pendaftaran: {queue.registrationId}
          </Text>
        </div>
        <div className="text-right">
          <Text variant="body">{queue.status}</Text>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end mt-2">
        {!isDoctor && isWaiting && (
          <button onClick={() => onCallNext(queue.polyclinicId)} className="btn btn-primary btn-sm">
            <SpeakerHighIcon className="size-4" />
            Panggil
          </button>
        )}
        
        {!isDoctor && isCalled && (
          <>
            <button onClick={() => onRecall(queue.id)} className="btn btn-secondary btn-sm">
              <ArrowCounterClockwiseIcon className="size-4" />
              Panggil Ulang
            </button>
            <button onClick={() => onSkip(queue.id)} className="btn btn-secondary btn-sm">
              <SkipForwardIcon className="size-4" />
              Lewati
            </button>
          </>
        )}
        
        {isDoctor && (isWaiting || isCalled) && (
          <button onClick={() => onStartExam(queue.id)} className="btn btn-primary btn-sm">
            <PlayIcon className="size-4" />
            Mulai Pemeriksaan
          </button>
        )}
      </div>
    </div>
  )
}
