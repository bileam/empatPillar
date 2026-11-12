Instruksi Project --- Empat Pilar (Frontend User)
Dokumen ini menjadi panduan bagi AI coding assistant (GitHub Copilot)
ketika membantu mengembangkan project frontend Empat Pilar
Kebangsaan.

1. Tujuan Project
   Membangun prototipe frontend untuk platform pembelajaran 4 Pilar
   Kebangsaan Indonesia:
1. Pancasila
1. Undang-Undang Dasar 1945
1. Negara Kesatuan Republik Indonesia (NKRI)
1. Bhinneka Tunggal Ika
   Fokus saat ini hanya frontend pengguna (user). Jangan membuat
   halaman admin sampai diminta secara eksplisit.

Untuk tahap prototipe, gunakan dummy data. Belum perlu menghubungkan
Supabase, Prisma, API backend, atau autentikasi sungguhan. 2. Teknologi

- Next.js dengan App Router
- React
- TypeScript
- Tailwind CSS
- MUI (Material UI), jika sudah terpasang dan memang dibutuhkan
- Lucide React untuk ikon
- Dummy data lokal untuk simulasi
  Sebelum menggunakan library, periksa package.json dan kode yang sudah
  ada. Jangan memasang dependency baru tanpa alasan dan tanpa menjelaskan
  manfaatnya.

3. Acuan Desain
   Ikuti gambar referensi UI yang diberikan oleh pemilik project. Desain
   memiliki karakteristik:

- Warna utama merah, putih, dan aksen abu-abu muda.
- Identitas visual Garuda Pancasila, Monas, dan bendera Merah Putih.
- Tampilan bersih, sederhana, modern, dan mudah digunakan.
- Halaman autentikasi menggunakan layout dua kolom: ilustrasi/branding
  di kiri dan form di kanan.
- Halaman setelah login menggunakan sidebar di kiri dan area konten di
  kanan.
- Menu aktif menggunakan warna merah.
- Kartu, tabel, progress bar, form, dan tombol memiliki gaya visual
  yang konsisten.
- Buat layout responsif untuk desktop, tablet, dan ponsel.
  Jangan mengganti konsep visual utama tanpa persetujuan pemilik project.
  Jika aset gambar belum tersedia, gunakan placeholder yang jelas dan
  jangan mengarang logo resmi.

4. Struktur Folder Target
   Gunakan struktur berikut jika project dibuat dengan folder src/. Jika
   project yang aktif tidak memiliki src/, jangan membuat ulang atau
   memindahkan seluruh project secara otomatis. Sesuaikan lokasi folder
   dengan struktur bawaan yang sudah ada.
   empat-pilar-frontend/
   ├── public/
   │ ├── images/
   │ │ ├── auth/
   │ │ ├── modules/
   │ │ └── certificates/
   │ └── icons/
   │
   ├── src/
   │ ├── app/
   │ │ ├── (auth)/
   │ │ │ ├── login/
   │ │ │ │ └── page.tsx
   │ │ │ └── register/
   │ │ │ └── page.tsx
   │ │ │
   │ │ ├── (user)/
   │ │ │ ├── layout.tsx
   │ │ │ ├── dashboard/
   │ │ │ │ └── page.tsx
   │ │ │ ├── modul/
   │ │ │ │ ├── page.tsx
   │ │ │ │ └── [moduleId]/
   │ │ │ │ └── page.tsx
   │ │ │ ├── pembelajaran/
   │ │ │ │ └── [lessonId]/
   │ │ │ │ └── page.tsx
   │ │ │ ├── kuis/
   │ │ │ │ └── [quizId]/
   │ │ │ │ └── page.tsx
   │ │ │ ├── hasil-ujian/
   │ │ │ │ └── [attemptId]/
   │ │ │ │ └── page.tsx
   │ │ │ ├── rating/
   │ │ │ │ └── page.tsx
   │ │ │ ├── sertifikat/
   │ │ │ │ ├── page.tsx
   │ │ │ │ └── [certificateId]/
   │ │ │ │ └── page.tsx
   │ │ │ └── profil/
   │ │ │ └── page.tsx
   │ │ │
   │ │ ├── globals.css
   │ │ ├── layout.tsx
   │ │ └── page.tsx
   │ │
   │ ├── components/
   │ │ ├── layout/
   │ │ │ ├── Sidebar.tsx
   │ │ │ ├── Navbar.tsx
   │ │ │ └── UserLayout.tsx
   │ │ ├── auth/
   │ │ │ ├── LoginForm.tsx
   │ │ │ └── RegisterForm.tsx
   │ │ ├── dashboard/
   │ │ │ ├── WelcomeCard.tsx
   │ │ │ ├── ProgressCard.tsx
   │ │ │ └── ModuleCard.tsx
   │ │ ├── modul/
   │ │ │ ├── ModuleList.tsx
   │ │ │ └── ModuleDetail.tsx
   │ │ ├── pembelajaran/
   │ │ │ ├── VideoPlayer.tsx
   │ │ │ └── VideoList.tsx
   │ │ ├── kuis/
   │ │ │ ├── QuizQuestion.tsx
   │ │ │ └── QuizTimer.tsx
   │ │ ├── sertifikat/
   │ │ │ └── CertificateCard.tsx
   │ │ └── ui/
   │ │ ├── Button.tsx
   │ │ ├── Input.tsx
   │ │ └── Card.tsx
   │ │
   │ ├── data/
   │ │ └── dummy/
   │ │ ├── users.ts
   │ │ ├── modules.ts
   │ │ ├── lessons.ts
   │ │ ├── quizzes.ts
   │ │ └── certificates.ts
   │ │
   │ ├── hooks/
   │ │ └── useQuiz.ts
   │ ├── lib/
   │ │ └── utils.ts
   │ └── types/
   │ ├── user.ts
   │ ├── module.ts
   │ ├── lesson.ts
   │ └── quiz.ts
   │
   ├── .github/
   │ └── copilot-instructions.md
   ├── package.json
   ├── tsconfig.json
   └── next.config.ts
   Struktur di atas adalah target bertahap, bukan perintah untuk membuat
   semua file kosong sekaligus. Buat file saat mulai mengerjakan fitur
   terkait.
5. Daftar Halaman dan Routing
   Fitur URL
   Login /login
   Registrasi /register
   Dashboard /dashboard
   Daftar modul /modul
   Detail modul /modul/[moduleId]
   Video pembelajaran /pembelajaran/[lessonId]
   Kuis /kuis/[quizId]
   Hasil ujian /hasil-ujian/[attemptId]
   Rating dan ulasan /rating
   Daftar sertifikat /sertifikat
   Detail sertifikat /sertifikat/[certificateId]
   Profil /profil

Folder route group (auth) dan (user) tidak menjadi bagian URL.
Contohnya, src/app/(auth)/login/page.tsx tetap menghasilkan URL
/login. 6. Aturan Pengembangan untuk AI Assistant

1. Periksa struktur project dan file terkait sebelum mengubah kode.
2. Kerjakan satu halaman atau satu fitur dalam satu waktu.
3. Jangan membuat seluruh halaman sekaligus tanpa diminta.
4. Jangan mengubah atau menghapus file yang tidak terkait dengan tugas.
5. Gunakan TypeScript dengan tipe data yang jelas; hindari any jika
   tidak diperlukan.
6. Pisahkan komponen yang dipakai berulang ke folder components/.
7. Simpan data simulasi di data/dummy/, bukan menulis data berulang
   di banyak halaman.
8. Gunakan nama komponen PascalCase dan nama fungsi/variabel camelCase.
9. Perhatikan penggunaan Server Component dan Client Component pada
   Next.js. Tambahkan "use client" hanya pada komponen yang
   memerlukan state, event handler, atau browser API.
10. Gunakan semantic HTML, label form yang jelas, dan aksesibilitas
    dasar.
11. Pastikan tampilan responsif.
12. Setelah perubahan, jalankan pemeriksaan yang sesuai, misalnya
    npm run lint dan npm run build jika tersedia.
13. Jika ada keputusan desain atau arsitektur yang belum jelas, tanyakan
    sebelum mengambil keputusan besar.
14. Jelaskan file yang dibuat/diubah dan cara menguji hasilnya dengan
    bahasa sederhana.
15. Batasan Tahap Prototipe

- Jangan membuat koneksi Supabase.
- Jangan menggunakan Prisma.
- Jangan membuat API backend kecuali diminta.
- Jangan membuat autentikasi sungguhan.
- Login dan registrasi boleh berupa simulasi frontend.
- Gunakan data dummy yang konsisten ant halaman.
- Simulasikan alur belajar, progres video, kuis, hasil nilai, ulasan,
  dan sertifikat di sisi frontend.
- Jangan menyimpan password asli dalam dummy data.
- Tandai dengan jelas fitur yang masih berupa simulasi.

8. Alur Fitur Pembelajaran
   Alur prototipe pengguna:
1. Pengguna membuka halaman login atau registrasi.
1. Pengguna masuk ke dashboard (simulasi).
1. Pengguna memilih salah satu dari empat modul.
1. Pengguna membuka video pembelajaran.
1. Setelah materi selesai, pengguna dapat membuka kuis.
1. Kuis berisi soal pilihan ganda dan menghitung nilai.
1. Nilai minimal kelulusan adalah 80.
1. Jika nilai di bawah 80, pengguna dapat mengulang kuis atau melihat
   pembahasan sesuai rancangan.
1. Jika lulus, pengguna dapat memberikan rating/ulasan dan memperoleh
   sertifikat (simulasi).
1. Pengguna dapat melihat daftar sertifikat dan profil.
1. Cara Memulai Tugas
   Saat menerima tugas baru, AI assistant harus:
1. Membaca instruksi project ini.
1. Memeriksa file dan struktur project yang benar-benar ada.
1. Menjelaskan rencana singkat.
1. Mengubah hanya file yang diperlukan.
1. Menjelaskan cara menjalankan dan menguji hasilnya.
   Tugas awal yang disarankan: siapkan struktur folder inti dan tema
   global berdasarkan gambar referensi, tanpa membuat halaman admin atau
   backend.
