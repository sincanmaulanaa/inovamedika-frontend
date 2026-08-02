import { Badge } from '@cloudflare/kumo/components/badge'
import { LayerCard } from '@cloudflare/kumo/components/layer-card'
import { Text } from '@cloudflare/kumo/components/text'
import type { Icon } from '@phosphor-icons/react'

interface MetricCardProps {
  readonly description: string
  readonly icon: Icon
  readonly id: string
  readonly label: string
}

export function MetricCard({
  description,
  icon: IconComponent,
  id,
  label,
}: MetricCardProps) {
  const labelId = `${id}-label`

  return (
    <LayerCard
      aria-labelledby={labelId}
      className="grid min-h-44 content-between gap-5 px-5 py-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-kumo-tint text-kumo-strong ring ring-kumo-line">
          <IconComponent aria-hidden="true" className="size-5" />
        </span>
        <Badge variant="neutral" appearance="dot">
          Menunggu data API
        </Badge>
      </div>
      <dl className="grid gap-1.5">
        <Text as="dt" variant="secondary">
          <span id={labelId}>{label}</span>
        </Text>
        <Text as="dd" variant="heading2">
          —
        </Text>
        <Text as="dd" variant="secondary" size="sm">
          {description}
        </Text>
      </dl>
    </LayerCard>
  )
}
