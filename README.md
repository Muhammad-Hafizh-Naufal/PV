# Hafizh Portfolio

Portfolio Muhammad Hafizh Naufal berdasarkan `Blueprint_Proyek_Portfolio_Muhammad_Hafizh_Naufal.docx`. Next.js App Router, TypeScript, Tailwind CSS v4, Geist, Motion, komponen Spotlight Aceternity UI, serta Supabase PostgreSQL/Auth/Storage.

## Menjalankan lokal

Gunakan Node.js 22.13+ dan npm.

```powershell
npm ci
npm run dev
```

Buka `http://localhost:3000`. Tanpa konfigurasi Supabase, website menggunakan konten contoh dari `lib/demo.ts`; `/admin` menjadi preview **read-only**. Tidak ada password demo atau jalur bypass untuk menyimpan data.

Mode development menggunakan Webpack; `npm run dev:turbo` tersedia untuk mencoba Turbopack. Pengaturan `.vscode/settings.json` menonaktifkan integrasi otomatis Console Ninja dengan Next.js/Webpack hanya untuk workspace ini. Pada insiden lokal, JavaScript di disk valid tetapi respons yang dikirim proses dev berinstrumentasi terpotong dan gagal diparse browser. Karena itu, pengujian runtime memeriksa respons HTTP JavaScript serta error browser, bukan hanya hasil build.

Jika muncul `Unexpected end of input` atau `missing ) after argument list` pada chunk React/Next.js, hentikan server proyek yang lama sebelum menjalankan `npm run dev` kembali. Pastikan banner menampilkan `(webpack)` tanpa pesan Console Ninja. Refresh browser dengan `Ctrl+Shift+R` agar menggunakan chunk baru. Cache dev lama saat perbaikan disimpan di `.next/dev-before-js-fix`; data Supabase tidak diubah.

Dengan server aktif, jalankan `npm run test:runtime` untuk menguji JavaScript halaman login pada desktop/mobile. Tes ini tidak membutuhkan kredensial admin dan tidak menulis ke database. Gunakan `PLAYWRIGHT_CHANNEL=chrome` bila ingin memakai Chrome yang sudah terpasang (lihat bagian pemeriksaan di bawah).

## Mengaktifkan database dan admin

1. Buat project Supabase. Jalankan `supabase/migrations/001_portfolio.sql`, lalu `002_seed.sql` lewat SQL Editor. Migration pertama ditujukan untuk project baru; seed bisa dijalankan ulang tanpa menimpa record yang ada.
2. Buat `.env.local` berdasarkan `.env.example`. Isi URL project dan publishable key (atau legacy anon key), serta alamat website. Jangan memasukkan service-role key ke environment `NEXT_PUBLIC_*`.
3. Di Supabase Authentication → Users, buat user admin dengan email/password dan konfirmasi emailnya. Nonaktifkan public signup jika tidak diperlukan. Atur Site URL ke domain aplikasi.
4. Salin UUID user admin dan jalankan melalui SQL Editor:

```sql
insert into public.admin_users(user_id)
values ('GANTI-DENGAN-UUID-USER-ADMIN')
on conflict do nothing;
```

5. Restart server dan buka `/admin/login`. Akun login biasa tidak menjadi admin secara otomatis; keanggotaan `admin_users` diperlukan untuk membaca draft dan menulis data.
6. Jalankan `supabase/tests/authorization.sql` untuk pemeriksaan RLS pada project Supabase. Skrip mengembalikan semua perubahan pengujian dengan `ROLLBACK`.

## Fitur

- Homepage responsive dengan hero, selected work, about, pengalaman, skills, sertifikat opsional, dan kontak.
- Detail studi kasus di `/projects/[slug]`; proyek draft dan slug yang tidak dikenal tidak tampil ke publik.
- Editor profil, proyek, pengalaman, teknologi, sertifikat, social links, serta pengaturan SEO/kontak.
- Proyek memiliki featured flag, draft/published, slug, tag teknologi, dan urutan numerik. Proyek featured tampil lebih dulu, lalu `sort_order`.
- Pencarian proyek dan filter publikasi; konfirmasi penghapusan; pesan hasil penyimpanan.
- Upload JPEG/PNG/WebP/PDF hingga 8 MB dengan pengecekan signature; preview gambar, penggantian CV, dan media library dengan pagination.
- Simpan proyek dan relasi teknologi secara atomik melalui `save_project` dengan RLS tetap aktif.
- File baru mendapatkan nama UUID. File lama tidak otomatis dihapus; hapus file yang sudah tidak dipakai lewat media library. Penghapusan file bersifat permanen dan memerlukan konfirmasi.
- Bucket `portfolio-media` **publik**. Hanya upload materi yang memang akan dipublikasikan; status draft proyek tidak membuat file di bucket menjadi privat. Library menampilkan file yang diunggah akun admin aktif.
- Navigasi mobile, keyboard focus, skip link, reduced-motion, loading/error/404, metadata, Open Graph, sitemap, dan robots.
- Konten publik menggunakan client anonim terpisah dari sesi admin dan dimuat saat request. Perubahan melalui studio langsung menginvalidasi halaman terkait.

## Konten yang perlu dilengkapi

Blueprint belum menyertakan foto, screenshot asli, CV, email, URL sosial, link proyek, tanggal pengalaman, maupun rincian sertifikasi. Kolom tersebut sengaja kosong. Preview proyek adalah ilustrasi antarmuka berlabel "INTERFACE CONCEPT", bukan screenshot produk asli. Nama organisasi berasal dari blueprint; deskripsi peran yang masih umum harus diverifikasi sebelum publikasi. Perbarui semuanya melalui admin setelah Supabase aktif.

Halaman publik menggunakan bahasa Inggris sesuai copy awal blueprint. Editor menyediakan plain text dengan paragraf terpisah baris kosong; heading bagian ditulis pada baris pertama sebuah blok. Tidak ada rendering HTML mentah dari konten.

## Pemeriksaan

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

E2E default menguji mode preview tanpa kredensial Supabase. Jalankan dengan `.env.local` Supabase tidak aktif. Jika menggunakan Chrome yang sudah terpasang:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e
```

Unit/integration tests memeriksa validasi dan menjalankan SQL migration/RLS sebenarnya di PostgreSQL WASM (PGlite), dengan schema Auth/Storage minimum sebagai test harness. Pengujian ini tidak menggantikan pemeriksaan login/session dan upload melalui layanan Supabase nyata. E2E mencakup desktop/mobile, routes, admin preview, aksesibilitas, metadata, dan reduced motion. Screenshot pengujian tersimpan di `test-results/`.

## Deployment

1. Push repository ke akun Git milik Anda dan import ke Vercel (framework Next.js).
2. Pasang environment variables yang sama di Vercel; isi `NEXT_PUBLIC_SITE_URL` dengan domain production HTTPS. Redeploy setelah mengubah environment publik.
3. Jalankan migration/seed pada Supabase production dan daftarkan admin production.
4. Verifikasi login/logout, CRUD proyek, draft/publish, upload/replacement, dan penolakan user non-admin pada environment production.
5. Ganti konten contoh dan cek metadata/social preview sebelum menghubungkan domain utama.

Tidak ada deployment atau pembuatan akun eksternal otomatis. Kredensial Supabase dan akses hosting harus berasal dari pemilik proyek.

## Struktur

```text
app/                    Public routes, admin studio, SEO endpoints
components/             Portfolio, native interface artwork, admin forms
components/ui/          Adapted Aceternity component
lib/                    Queries, validation, authentication, server actions
supabase/migrations/    Schema, RLS, storage policies, seed
supabase/tests/         Authorization checks for live Supabase
tests/                  Validation, PostgreSQL integration, browser E2E
```

Referensi implementasi: [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client), dan [Aceternity Spotlight](https://ui.aceternity.com/components/spotlight). Spotlight diadaptasi untuk filter ID unik, tema terang, dekorasi noninteraktif, dan reduced motion. Efek lain serta ilustrasi antarmuka dibuat sebagai komponen lokal.

Fitur lanjutan yang belum termasuk: drag-and-drop ordering, rich-text editor, live preview berdampingan, contact form, analytics, error monitoring eksternal, dan multi-bahasa. Urutan konten saat ini dikelola melalui angka `Display order`.
