<<<<<<< HEAD
# FoundIt — Integrated frontend

Project ini menggabungkan desain FoundIt dengan alur Supabase dari file awal yang kamu kirim.

## Tech stack
- React + Vite
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage

## Menjalankan project
1. Extract ZIP.
2. Buka folder project di VS Code.
3. Jalankan:

```bash
npm install
```

4. File `.env` sudah disertakan dan diarahkan ke project Supabase yang sama dengan `app.js` awal. Jika perlu mengganti project, edit file `.env` dengan format:

```env
VITE_SUPABASE_URL=https://ucpcqcrkuyowvjalexfs.supabase.co
VITE_SUPABASE_ANON_KEY=ISI_PUBLISHABLE_KEY_KAMU
```

5. Jalankan:

```bash
npm run dev
```

## Supabase
- File `schema.sql` berisi schema kompatibel dengan frontend ini.
- Jalankan SQL di Supabase SQL Editor jika tabel/function/policy belum tersedia.
- SQL ini sengaja tidak melakukan `DROP TABLE`, agar data tabel lama tidak terhapus.
- Pastikan bucket `foto` tersedia dan policy upload aktif.

## Catatan
- Login/register menggunakan Supabase Auth.
- Daftar laporan membaca tabel `items` dan hanya menampilkan laporan yang belum selesai.
- Form upload foto ke bucket `foto`, lalu menyimpan public URL ke kolom `foto`.
- Tombol "Tandai selesai" memanggil RPC `selesaikan`.
- Bukti rahasia (`bukti`) tidak diambil pada query daftar laporan dan tidak ditampilkan di UI.
- Supabase key publishable/anon memang digunakan di frontend. Jangan pernah memasukkan service_role key ke frontend.
- Karena policy tabel saat ini mengharuskan authenticated user, pengguna harus login untuk melihat dan mengirim laporan.

## Struktur
- `src/App.jsx`: halaman, form, auth, laporan, detail.
- `src/supabase.js`: koneksi Supabase.
- `src/index.css`: styling Tailwind dan custom CSS.
- `schema.sql`: database policy, function, storage bucket.
=======
# FoundIt-Project-Layap
>>>>>>> f9ce4cd339607fa20d7ae7b30a4496885d7267ad
