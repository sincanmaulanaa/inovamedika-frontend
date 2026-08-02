import { Button } from '@cloudflare/kumo/components/button'
import { Text } from '@cloudflare/kumo/components/text'
import { useNavigate } from 'react-router'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <section className="mx-auto grid max-w-lg justify-items-start gap-5 py-16">
      <div className="grid gap-1.5">
        <Text as="h1" variant="heading1">
          Halaman tidak ditemukan
        </Text>
        <Text variant="secondary">
          Alamat yang dibuka tidak tersedia pada aplikasi ini.
        </Text>
      </div>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        Kembali ke dashboard
      </Button>
    </section>
  )
}
