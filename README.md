# NextTask - Task Management System 🚀

**NextTask** adalah aplikasi manajemen tugas. Proyek ini dibangun sebagai solusi *full-stack* yang memisahkan tanggung jawab antara *Frontend* dan *Backend* secara tegas untuk menjaga skalabilitas dan kebersihan kode.

### 🌐 Live Demo
- **Frontend:** [https://client-nextask.vercel.app](https://client-nextask.vercel.app)
- **Backend API:** [https://server-nextask-production.up.railway.app](https://server-nextask-production.up.railway.app)

**Login:**
- Email: kevin@gmail.com
- Password: kevin1234
---

### 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, Tailwind CSS, Shadcn UI, Axios |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Security** | JWT, HttpOnly Cookies, Next.js Middleware |
| **Deploy** | Vercel, Railway |

---

### 🏗️ Project Architecture
Proyek ini terbagi menjadi dua: 
1. **[Client Repository](https://github.com/cavinsrya/client-nextask):** Handles the UI and client-side logic.
2. **[Server Repository](https://github.com/cavinsrya/server-nextask):** Handles business logic, database migrations, and authentication.

*Note: Frontend uses **Next.js Rewrites** as a proxy to communicate with the Backend to solve Cross-Origin Resource Sharing (CORS) and Cookie issues in production.*

---

## 📖 Cerita di Balik Arsitektur

Dalam membangun NextTask, fokus utama saya adalah **"Clean Code & Separation of Concerns"**. Saya percaya bahwa kode yang baik adalah kode yang tidak hanya berfungsi, tetapi juga mudah dibaca dan dipelihara oleh tim.

### 🏗️ Mengapa Memilih Express.js & TypeScript?
Untuk *Backend*, saya memilih **Express.js** dikombinasikan dengan **TypeScript**. Alasan utamanya adalah:
* **Minimalis & Cepat:** Express memberikan kebebasan penuh dalam menentukan struktur folder tanpa *boilerplate* yang berat.
* **Type Safety:** Dengan TypeScript, saya bisa menangkap potensi *error* sejak tahap pengembangan. Ini memastikan data yang mengalir dari *Database* ke *Frontend* selalu konsisten dan memiliki kontrak yang jelas.
* **Prisma ORM:** Memudahkan pengelolaan skema database PostgreSQL. Fitur migrasi yang *auto-generated types* yang membuat interaksi dengan database menjadi intuitif.

### 📂 Struktur Folder Backend
Saya membagi backend menjadi beberapa lapisan fungsional (Layered Architecture) untuk menghindari fenomena "Fat Controllers":

1.  **`src/controllers/`**: Bertindak sebagai gerbang utama. Hanya bertugas menerima *request* HTTP, memanggil *service* yang sesuai, dan mengirim kembali *response*.
2.  **`src/services/`**: Di sin "otak" dari aplikasi berada. Semua logika bisnis, perhitungan, dan interaksi langsung dengan database (Prisma) diisolasi di sini agar bisa digunakan kembali (*reusable*).
3.  **`src/schemas/`**: Menggunakan **Zod** untuk validasi skema data. Setiap data yang masuk akan diperiksa secara ketat. Jika tidak sesuai, sistem akan menolaknya di gerbang awal, menjaga integritas database.
4.  **`src/routes/`**: Jalur navigasi API yang tertata rapi dan modular berdasarkan entitas (misal: `/users` dan `/tasks`).
5.  **`src/middleware/`**: Lapisan keamanan tambahan, seperti pengecekan token JWT dan penanganan *error* secara global.

---

### 🎨 Frontend: Next.js & Modular Component UI
Di sisi *Frontend*, saya menggunakan **Next.js 15** dengan pendekatan komponen yang modular:

* **Modular Components**: Setiap fitur utama (*Home*, *My Task*, *Profile*) memiliki folder `_components/` lokal. Hal ini memastikan komponen UI tidak saling tumpang tindih dan sangat mudah untuk di-*debug*.
* **Shadcn UI & Tailwind CSS**: Kombinasi ini memungkinkan saya membangun antarmuka yang profesional dan konsisten dengan waktu pengembangan yang efisien.
* **Optimistic UI Update**: Pada fitur Kanban Board, saya menerapkan *Optimistic Update*. Status tugas akan berubah secara instan di layar saat

---

# 📡 API Documentation

Dokumentasi ini menjelaskan endpoint yang tersedia di sisi Backend.  
Seluruh endpoint yang dilindungi **[🔒 Auth Required]** mengecek keberadaan HttpOnly Cookie bernama `token`.

> **Catatan:**  
> Dari sisi Frontend Vercel, semua endpoint ini dipanggil melalui prefix `/api` yang secara otomatis di-proxy ke Backend.

---

# 👤 1. Authentication & User Management

## POST /users/register
Mendaftarkan pengguna baru ke dalam sistem.  
Password akan di-hash secara otomatis menggunakan **bcrypt (salt rounds: 10)** sebelum disimpan ke database.

### Request Body
```json
{
  "name": "Cavin Surya",
  "email": "cavin@example.com",
  "password": "securepassword123"
}
```

Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "data": { 
    "id": "uuid", 
    "name": "Cavin Surya", 
    "email": "cavin@example.com"
    "createdAt": "2026-03-30T10:00:00.000Z" 
  }
}
```
POST /users/login

Autentikasi pengguna. Jika email dan password valid, server akan menanamkan HttpOnly Cookie berisi token JWT ke browser pengguna dengan masa aktif 24 jam.

Request Body
```json
{
  "email": "cavin@example.com",
  "password": "securepassword123"
}
```
Success Response (200 OK)
```json
{
  "message": "Login successful",
  "data": { 
    "id": "uuid", 
    "name": "Cavin Surya", 
    "email": "cavin@example.com" 
  }
}
```
POST /users/logout

Menghapus sesi pengguna dengan mengosongkan dan mengubah tanggal kedaluwarsa token cookie di browser menjadi masa lalu.

Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```
GET /users/me [🔒 Auth Required]

Mengambil data profil pengguna yang sedang login berdasarkan token JWT di cookie.

Success Response (200 OK)
```json
{
  "message": "User profile retrieved successfully",
  "data": { 
    "id": "uuid", 
    "name": "Cavin Surya", 
    "email": "cavin@example.com" 
  }
}
```
PUT /users/me [🔒 Auth Required]

Memperbarui profil pengguna (nama atau password).
Jika password dikirim, sistem akan melakukan hashing ulang otomatis.

Request Body 
```json
{
  "name": "Cavin Surya Updated",
  "password": "newpassword123"
}
```
Success Response (200 OK)
```json
{
  "message": "Profile updated successfully",
  "data": { 
    "id": "uuid", 
    "name": "Cavin Surya Updated", 
    "email": "cavin@example.com" 
  }
}
```
📋 2. Task Management

Semua endpoint Task bersifat private dan terisolasi.
API hanya akan mengakses data berdasarkan userId dari pengguna yang sedang login (Tenant Isolation).

GET /tasks/my-tasks [🔒 Auth Required]

Mengambil seluruh daftar tugas milik pengguna, diurutkan dari yang terbaru.

Success Response (200 OK)
```json
{
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Revamp Dashboard UI",
      "description": "Improve user experience for the main dashboard.",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-04-12T10:00:00.000Z",
      "userId": "uuid"
      "createdAt": "2026-03-30T10:00:00.000Z"
      "updatedAt": "2026-03-30T10:00:00.000Z"
    }
  ]
}
```
POST /tasks [🔒 Auth Required]

Membuat task baru.

Keterangan Field
status: TODO | IN_PROGRESS | DONE
priority: LOW | MEDIUM | HIGH
Request Body
```json
{
  "title": "Fix Payment Integration",
  "description": "Resolve gateway timeout issues in production",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-04-15T14:00:00.000Z"
}
```
Success Response (201 Created)
```json
{
  "message": "Task created successfully",
  "data": {
      "id": "uuid",
      "title": "Fix Payment Integration",
      "description": "Resolve gateway timeout issues in production",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2026-04-12T10:00:00.000Z",
      "createdAt": "2026-03-30T10:00:00.000Z"
      "updatedAt": "2026-03-30T10:00:00.000Z"
  }
}
```
PUT /tasks/:id [🔒 Auth Required]

Memperbarui detail tugas tertentu. Misalnya untuk update status (dari TODO ke DONE).

Request Params
id: ID dari task
Request Body 
```json
{
  "title": "Fix Payment Integrations",
  "description": "Resolve gateway timeout issues in prod",
  "status": "DONE",
  "priority": "HIGH",
  "dueDate": "2026-04-15T14:00:00.000Z"
}
```
Success Response (200 OK)
```json
{
  "message": "Task updated successfully",
  "data": {
      "id": "944ef456-44d0-485e-ba15-d2e247d68e81",
      "title": "Fix Payment Integrations",
      "description": "Resolve gateway timeout issues in prod",
      "status": "DONE",
      "priority": "HIGH",
      "dueDate": "2026-04-15T14:00:00.000Z",
      "userId": "40f689a0-7134-40c1-9fb3-ec8eaa9f43c1",
      "createdAt": "2026-03-30T19:09:27.536Z",
      "updatedAt": "2026-03-30T19:19:10.664Z"
    }
}
```
DELETE /tasks/:id [🔒 Auth Required]

Menghapus tugas secara permanen.

Request Params
id: ID dari task
Success Response (200 OK)
```json
{
  "message": "Task deleted successfully"
}
```

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi Lokal (Step-by-Step)

Panduan ini akan membantu Anda menjalankan proyek NextTask di lingkungan lokal Anda dari awal hingga akhir.

### 📋 Prerequisites
Sebelum memulai, pastikan sistem telah memiliki:
* **Node.js** (Versi 18 atau lebih baru)
* **Git**
* **PostgreSQL** (Pastikan PostgreSQL sudah terinstal dan berjalan di komputer Anda, Buat database baru (misal: `nextask_db`))

---

### Langkah 1: Clone Repositori
Karena proyek ini memisahkan Frontend dan Backend demi menjaga kebersihan arsitektur, silakan *clone* kedua repositori ke dalam satu folder kerja Anda:

```bash
# Clone Backend (Server)
git clone https://github.com/cavinsrya/client-nextask

# Clone Frontend (Client)
git clone https://github.com/cavinsrya/server-nextask
```
### Langkah 2: Setup Backend (Server & Database)
1. Instalasi Dependensi
Buka terminal, masuk ke folder server, dan instal semua paket yang dibutuhkan:
```bash
cd server-nextask
npm install
```
2. Konfigurasi Environment Variables (.env)
Buat sebuah file baru bernama .env di root folder server-nextask. Anda bisa menyalin format dari file .env.example yang telah disediakan.

3. Setup Database (Migrasi Prisma)
Setelah DATABASE_URL terhubung ke PostgreSQL Anda, jalankan perintah ini untuk melakukan sinkronisasi skema dan membuat tabel secara otomatis:
```bash
npx prisma db push
```
4. Jalankan Server
```bash
npm run dev
```
### Langkah 3: Setup Frontend (Client)
1. Instalasi Dependensi
Buka tab terminal baru (biarkan server tetap berjalan), masuk ke folder client, dan instal paketnya:
```bash
cd client-nextask
npm install
```
2. Konfigurasi Environment Variables (.env.local)
Buat file baru bernama .env.local di root folder client-nextask. Anda dapat merujuk pada file .env.example yang tersedia.
3. Jalankan Aplikasi Web
```bash
npm run dev
```
### 🎉 Langkah 4: Akses Aplikasi
Buka browser favorit Anda dan navigasikan ke:
http://localhost:3000

---

## 🚀 Future Enhancements

Meskipun aplikasi ini sudah siap digunakan di tahap produksi (*production-ready*), arsitektur dasar telah dirancang agar mudah diskalakan. Berikut adalah beberapa rancangan arsitektur tingkat lanjut yang direncanakan untuk iterasi berikutnya:

### 1. In-Memory Caching & Session Management dengan Redis
Saat ini, autentikasi menggunakan JWT berumur pendek (24 jam). Ke depannya, implementasi **Redis** akan ditambahkan untuk:
* **Refresh Token Strategy:** Menyimpan *refresh token* di Redis memungkinkan kita memiliki kontrol penuh untuk mencabut (*revoke*) akses pengguna secara instan (misalnya saat pengguna mengganti *password*), sesuatu yang sulit dilakukan dengan JWT biasa.
* **Kecepatan Akses Tinggi:** Redis sangat ideal untuk menyimpan data sesi yang sifatnya sementara dan membutuhkan latensi pembacaan sub-milidetik. Konsep ini juga sangat krusial jika ekosistem aplikasi ini nantinya diperluas menjadi sistem yang menangani transaksi cepat (seperti saldo limit atau fitur *e-wallet* internal untuk pengguna berbayar).
* **OTP & Rate Limiting:** Redis akan digunakan untuk menyimpan kode OTP sementara saat registrasi dan membatasi jumlah *request* (Rate Limiting) untuk mencegah serangan *Brute Force*.

### 2. Asynchronous Processing dengan RabbitMQ
Untuk menjaga agar *response time* API utama tetap di bawah 100ms, proses yang memakan waktu lama akan dipindahkan ke *background worker* menggunakan **RabbitMQ** (Message Broker):
* **Email Notifications:** Saat status tugas berubah atau mendekati tenggat waktu (*due date*), API tidak akan memproses pengiriman email secara langsung. API cukup melempar pesan ke RabbitMQ, dan *worker* terpisah yang akan mengantre dan mengirimkan email melalui SMTP.
* **Report Generation:** Jika pengguna ingin mengunduh riwayat tugas selama 1 tahun dalam format PDF/Excel, *request* akan masuk ke antrean RabbitMQ agar peladen Node.js tidak mengalami *blocking*.

### 3. Enterprise DevOps & CI/CD Pipeline
Untuk otomatisasi peluncuran fitur baru tanpa *downtime*, infrastruktur peluncuran (*deployment*) akan ditingkatkan ke level *enterprise*:
* **Containerization:** Membungkus *Backend* dan *Database* menggunakan **Docker** agar lingkungan pengembangan lokal dan produksi 100% identik.
* **Automated Pipeline:** Menggunakan **Jenkins** (atau GitHub Actions) untuk menjalankan *Automated Testing* (Jest) secara otomatis setiap kali ada *Push* ke repositori, lalu melakukan *build* dan *deployment* gambar Docker tersebut secara langsung ke layanan *cloud* berskala besar seperti **Google Cloud Platform (GCP)**.

---
