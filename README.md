# Inova Medika Frontend

Frontend React untuk Sistem Informasi Klinik Mini. Aplikasi ini menyediakan *shell* aplikasi, dasbor responsif, serta integrasi dengan API backend.

## 1. Cara instalasi aplikasi

Pastikan Anda memiliki Node.js 22.12 atau yang lebih baru, dan pnpm 11.18.

Jalankan perintah berikut untuk menginstal _dependencies_:
```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
```

## 2. Cara menjalankan aplikasi

Setelah berhasil melakukan instalasi, jalankan *development server*:
```bash
pnpm dev
```
Aplikasi akan bisa diakses melalui browser pada `http://localhost:5173`.

## 3. Struktur project

```text
src/
├── app/                    # Providers, env, query client, dan routing
├── features/               # Halaman dan komponen spesifik domain
├── lib/http/               # Transport Axios dan error handling API
├── shared/components/      # Komponen UI global (aplikasi shell)
├── shared/stores/          # Non-sensitive Zustand state
└── test/                   # Setup pengujian
```

## 4. Akun login

Gunakan akun demonstrasi berikut yang sudah di-generate dari backend (pastikan backend sudah di-*seed*):
- **Admin**: `admin` (Role: ADMINISTRATOR)
- **Petugas Pendaftaran**: `registration` (Role: REGISTRATION_OFFICER)
- **Dokter**: `doctor` (Role: DOCTOR)

**Kata sandi**: `PXVwME_C3EXm1KOoacyNhZWU3Vm2QB1z`

## 5. Konfigurasi file .env

Aplikasi ini menggunakan file `.env.local` untuk menyimpan variabel lingkungan (_environment variables_). 

Daftar variabel yang digunakan:
| Variabel | Default | Tujuan |
|----------|---------|--------|
| `VITE_API_BASE_URL` | `http://localhost:3100` | URL dasar untuk Backend API |
| `VITE_API_TIMEOUT_MS` | `10000` | Timeout untuk Axios (dalam milidetik) |

> **Perhatian**: Variabel dengan prefix `VITE_` bersifat publik. Jangan pernah menyimpan data sensitif seperti *password* di frontend.

## 6. Cara melakukan migrasi database (jika menggunakan migration)

Frontend tidak berinteraksi langsung dengan database. Semua migrasi dan interaksi data sepenuhnya ditangani oleh proyek **inovamedika-backend**. Silakan ikuti instruksi instalasi dan migrasi pada file `README.md` di sisi backend.
