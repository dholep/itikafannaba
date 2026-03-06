# PRD -- Aplikasi Web Pendaftaran I'tikaf Masjid An‑Naba'

## 1. Overview Produk

Aplikasi web ini digunakan untuk pendaftaran peserta i'tikaf di Masjid
An‑Naba'. Sistem membantu panitia mengelola data peserta, pilihan malam
i'tikaf, konsumsi sahur dan berbuka, absensi peserta, serta menampilkan
dashboard statistik.

------------------------------------------------------------------------

## 2. Tujuan Produk

### Tujuan Utama

1.  Mempermudah pendaftaran i'tikaf secara online
2.  Memudahkan panitia dalam pendataan peserta
3.  Mengelola konsumsi sahur dan berbuka
4.  Memudahkan proses absensi peserta setiap malam

### Target User

-   Peserta i'tikaf
-   Admin / Panitia masjid

------------------------------------------------------------------------

## 3. Teknologi

### Frontend

-   Next.js
-   TailwindCSS

### Backend

-   Next.js API Routes / Server Actions

### Database

-   NeonDB (PostgreSQL Serverless)

### Deployment

-   Vercel (opsional)

------------------------------------------------------------------------

## 4. User Journey

### Peserta

1.  Masuk ke halaman pendaftaran
2.  Input nomor handphone
3.  Verifikasi captcha
4.  Isi data diri (nama dan alamat)
5.  Pilih malam i'tikaf
6.  Pilih sahur dan berbuka
7.  Tambah anak (opsional)
8.  Submit pendaftaran
9.  Sistem menghasilkan ID peserta dan QR Code

### Admin

1.  Login ke admin panel
2.  Melihat daftar peserta
3.  Edit atau hapus peserta
4.  Melakukan absensi
5.  Melihat dashboard statistik

------------------------------------------------------------------------

## 5. Fitur Utama

### 5.1 Pendaftaran Peserta

Field form: - Nomor HP - Captcha - Nama - Alamat

Validasi: - Nomor HP wajib diisi - Nomor HP unik - Captcha wajib

------------------------------------------------------------------------

### 5.2 Pilihan Malam I'tikaf

Peserta dapat memilih malam:

  Malam   Tanggal
  ------- ---------------
  21      10 Maret 2026
  22      11 Maret 2026
  23      12 Maret 2026
  24      13 Maret 2026
  25      14 Maret 2026
  26      15 Maret 2026
  27      16 Maret 2026
  28      17 Maret 2026
  29      18 Maret 2026
  30      19 Maret 2026

Semua dimulai pukul **18:00**.

------------------------------------------------------------------------

### 5.3 Pilihan Konsumsi

Untuk setiap malam tersedia pilihan:

-   Makan Sahur
-   Makan Berbuka

Contoh:

    Malam 23
    [✓] Sahur
    [✓] Berbuka

------------------------------------------------------------------------

### 5.4 Penambahan Anak (Opsional)

Peserta dapat menambahkan data anak.

Field: - Nama Anak - Umur

Dapat menambahkan lebih dari satu anak.

------------------------------------------------------------------------

### 5.5 Generate ID Peserta

Format ID:

    ITIKAF-001
    ITIKAF-002
    ITIKAF-003

ID otomatis dari database.

------------------------------------------------------------------------

### 5.6 QR Code Peserta

Setelah registrasi berhasil sistem akan menghasilkan QR Code berisi:

``` json
{
  "id": "ITIKAF-001",
  "nama": "Ahmad"
}
```

QR digunakan untuk identifikasi peserta dan absensi.

------------------------------------------------------------------------

### 5.7 Absensi Admin

Admin dapat melakukan absensi dengan input:

-   ID Peserta
-   Malam ke berapa
-   Hadir Sahur
-   Hadir Berbuka

Contoh:

    ID Peserta: ITIKAF-003
    Malam: 23

    [✓] Hadir Sahur
    [✓] Hadir Berbuka

------------------------------------------------------------------------

### 5.8 Manajemen Peserta (Admin)

Admin dapat: - Melihat daftar peserta - Edit data peserta - Hapus
peserta

Contoh tabel:

  ID   Nama   HP   Anak   Malam   Action
  ---- ------ ---- ------ ------- --------

------------------------------------------------------------------------

### 5.9 Dashboard Publik

Halaman dashboard dapat diakses tanpa login.

Menampilkan:

-   Total jumlah pendaftar
-   Total peserta hari ini
-   Tabel peserta
-   Daftar anak peserta
-   Status absensi sahur dan berbuka

Contoh:

    Total Pendaftar: 120
    Peserta Hari Ini: 35

------------------------------------------------------------------------

## 6. Struktur Database

### Table participants

-   id
-   participant_code
-   name
-   phone
-   address
-   created_at

### Table nights

-   id
-   participant_id
-   night_number
-   date
-   sahur
-   iftar

### Table children

-   id
-   participant_id
-   name
-   age

### Table attendance

-   id
-   participant_id
-   night_number
-   sahur_attended
-   iftar_attended
-   timestamp

------------------------------------------------------------------------

## 7. Struktur Halaman

### Public

    /
    /register
    /qr/[id]

### Admin

    /admin
    /admin/participants
    /admin/attendance

------------------------------------------------------------------------

## 8. Non Functional Requirement

### Performance

-   Page load \< 2 detik

### Security

-   Captcha
-   Validasi input
-   Rate limit API

### Scalability

-   NeonDB autoscale
-   Next.js serverless

------------------------------------------------------------------------

## 9. Estimasi Timeline

  Task               Estimasi
  ------------------ ----------
  Setup project      1 hari
  Database design    1 hari
  Form pendaftaran   2 hari
  QR generator       1 hari
  Admin panel        2 hari
  Absensi            1 hari
  Dashboard          1 hari

Total estimasi pengerjaan: **7--9 hari**
