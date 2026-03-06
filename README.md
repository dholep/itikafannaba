# I'tikaf Masjid An‑Naba'

Aplikasi pendaftaran peserta, panel admin, absensi, dan dashboard publik berbasis Next.js.

## Prasyarat
- Node.js 18+
- npm (atau pnpm/yarn)

## Menjalankan Lokal
- Instal dependencies: `npm install`
- Salin `.env.example` menjadi `.env` dan isi variabel:
  - `ADMIN_PASSWORD=...`
- Jalankan dev server: `npm run dev`
- Buka: `http://localhost:3000`

## Struktur Data
- Data disimpan dalam folder `data/` sebagai file JSON lokal.
- File di `data/*.json` di-ignore dari Git karena berisi data pribadi.
- Gunakan file kosong atau dummy jika perlu, atau buat script seed sendiri.

## Upload ke GitHub
1. Buat repository baru di GitHub (mis. `itikaf-annaba`)
2. Inisialisasi Git dan commit awal:
   ```powershell
   git init
   git add .
   git commit -m "Initial import"
   git branch -M main
   ```
3. Tambah remote dan push:
   ```powershell
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

## Catatan Penting
- Jangan commit `.env` dan data peserta nyata; file tersebut sudah di-ignore.
- `.env.example` aman untuk dibagikan sebagai contoh.
- Normalisasi line endings ke LF dikonfigurasi melalui `.gitattributes`.

## Lisensi
- Silakan tambahkan file LICENSE (mis. MIT) sesuai kebutuhan Anda.
