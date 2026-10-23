# 🎓 Alumni Tracking System

A modern, comprehensive web platform designed for universities (such as Istanbul University) and educational academies to maintain strong, lifelong connections with their graduates. This system centralizes career tracking, mentorship programs, job postings, and detailed institutional statistics under one roof.

> 📊 **Veritabanı ve Veri Tasarımı Dokümantasyonu:**
> Tüm veritabanı tabloları, ER diyagramı, PK/FK kısıtlamaları ve alan spesifikasyonları için ➡️ [ddd.md (Data Design Documentation)](./ddd.md) dosyasına bakınız.

---

## 🏛️ Mimari: MVC + PostgreSQL (Prisma ORM)

Proje **MVC (Model-View-Controller)** desenine göre katmanlanmıştır. Hafta 04'te modeller **In-Memory** olarak başladı; sonraki haftalarda kalıcılık **PostgreSQL + Prisma ORM** ile sağlandı. Modeller (`User.model.ts` vb.) artık doğrudan veritabanını kullanır. Veritabanına ulaşılamazsa `User`/`Announcement` modelleri geçici olarak bellek içi yedek veriye düşer (sadece demo amaçlı).

### 📐 Katmanlı Mimari Şeması

```
[İstemci / Tarayıcı]
       │
       ▼
 [Express Router] (server/src/routes)
   ├── /users                    ──► UserController          ──► UserViews (HTML)   ◄── UserModel ─┐
   ├── /api/users                ──► ApiUserController       ──► JSON               ◄── UserModel  │
   ├── /api/users/:id/jobs       ──► ApiJobController        ──► JSON               ◄── JobPostingModel
   ├── /api/jobs/:id/applications──► ApiJobController        ──► JSON               ◄── ApplicationModel
   ├── /announcements            ──► AnnouncementController  ──► AnnouncementViews  ◄── AnnouncementModel
   └── /api/announcements        ──► ApiAnnouncementController ► JSON               ◄── AnnouncementModel
                                                                                          │
                                                                    Prisma Client ◄───────┘──► PostgreSQL
```

### 🧱 Katmanların Rolleri ve Sorumlulukları

1. **Model Katmanı (`server/src/models/`)**:
   - **`User.model.ts`**: Kullanıcı/Mezun verilerini (`IUser`) Prisma üzerinden `users` tablosunda yönetir. Temel CRUD metotlarını (`findAll`, `findById`, `findByEmail`, `create`, `replace`, `patch`, `delete`, `reset`) barındırır.
   - **`Announcement.model.ts`**: Ödev görevi (Homework) kapsamında duyuruların (`IAnnouncement`) model yapısını ve CRUD işlemlerini yürütür.
   - **`JobPosting.model.ts`**: `job_postings` tablosu (kullanıcının ilanları, doğrulama, oluşturma).
   - **`Application.model.ts`**: `applications` tablosu (başvuru oluşturma, `(jobId, userId)` tekrarında `DuplicateApplicationError` → 409, iki liste).
   - Prisma şeması ve ilişkiler: `server/prisma/schema.prisma`. Tablo tasarımı: [ddd.md](./ddd.md).

2. **View Katmanı (`server/src/views/`)**:
   - Sunucu taraflı HTML (Server-Side Rendering) görünüm şablonları üretir.
   - **`layout.ts`**: Ortak responsive gezinme çubuğu (Navbar), sistem bildirimleri (Alerts), başlık ve altbilgi (Footer).
   - **`user.views.ts`**: Kullanıcı listesi (tablo & arama), kullanıcı profil detayı, yeni kullanıcı kayıt formu ve düzenleme formu.
   - **`announcement.views.ts`**: Duyuru panosu (kartlar & filtreleme), duyuru detayı, duyuru ekleme ve düzenleme arayüzü (**Homework Management Interface**).

3. **Controller Katmanı (`server/src/controllers/`)**:
   - **View Controller'lar (`UserController.ts`, `AnnouncementController.ts`)**: HTTP isteklerini karşılar, Model'den veriyi çeker ve ilgili HTML görünümünü oluşturup tarayıcıya döner veya form işlemlerinde yönlendirme (redirect) yapar.
   - **API Controller'lar (`ApiUserController.ts`, `ApiAnnouncementController.ts`, `ApiJobController.ts`)**: RESTful JSON servisleridir. Standart HTTP durum kodları (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict) ile JSON yanıt döner.

4. **Routing Katmanı (`server/src/routes/`)**:
   - İstek URL'lerini ve HTTP metotlarını (GET, POST, PUT, PATCH, DELETE) ilgili Controller fonksiyonlarına eşler.
   - `user.routes.ts` & `announcement.routes.ts` (View rotaları).
   - `apiUser.routes.ts` & `apiAnnouncement.routes.ts` (JSON API rotaları).

---

## 📁 Detaylı Proje Dizin Yapısı

```plaintext
alumni-tracking-system/
├── docker-compose.yml              # PostgreSQL + server + client konteynerleri
├── .env.example                    # Kök ortam değişkenleri şablonu (docker compose okur)
├── README.md                       # Bu dosya
├── ddd.md                          # Veri tasarımı: tablolar, FK'ler, delete rule
│
├── client/                         # Frontend (Next.js 14 + Tailwind CSS)
│   └── src/app, src/components, src/lib
│
└── server/                         # Backend (Node.js + Express + TypeScript + Prisma)
    ├── .env.example                # Server ortam değişkenleri şablonu (cp ile .env yapılır)
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma           # Modeller ve ilişkiler (User, JobPosting, Application, ...)
    │   ├── seed.ts                 # Tabloları doğru sırayla boşaltır, id sayaçlarını sıfırlar, örnek veri ekler
    │   └── migrations/
    │       ├── 20261014_init/                          # İlk şema
    │       └── 20261023160000_job_postings_applications/ # job_postings INT id + applications tablosu
    ├── public/                     # Statik sayfalar (index.html, about.html)
    └── src/
        ├── index.ts                # Express uygulaması ve global middleware'ler
        ├── prisma.ts               # Paylaşılan PrismaClient
        ├── test-runner.ts          # Uçtan uca testler (npm test)
        ├── models/                 # [MODEL] User, Announcement, JobPosting, Application
        ├── views/                  # [VIEW] layout, user.views (profil + ilanlar), announcement.views
        ├── controllers/            # [CONTROLLER] UserController, ApiUserController, ApiJobController, ...
        ├── routes/                 # Rota tanımları (index.ts hepsini /api altında birleştirir)
        ├── database/factories/     # user, job, application, announcement, alumni factory'leri
        ├── services/               # job, auth, event, mentorship servisleri
        ├── docs/swaggerSpec.ts     # OpenAPI 3.0 tanımları
        ├── storage/                # Hafta 03 in-memory alumni deposu
        └── types/
```

---

## 🌐 Uç Noktalar ve Rota Haritası (Endpoint Map)

### 1. Kullanıcı Modülü (User Module - Sınıf İçi Görevler)

| HTTP Metodu | Rota / URL | Katman | Açıklama |
| :--- | :--- | :--- | :--- |
| **GET** | `/users` | View | Kullanıcı listesi HTML sayfası (Arama & filtreleme destekli) |
| **GET** | `/users/new` | View | Yeni kullanıcı oluşturma HTML formu |
| **POST** | `/users` | View | Form verisi ile yeni kullanıcı kaydetme ve listeye yönlendirme |
| **GET** | `/users/:id` | View | Tekil kullanıcı profil detayı HTML sayfası |
| **GET** | `/users/:id/edit` | View | Kullanıcı bilgisi düzenleme HTML formu |
| **POST** | `/users/:id/edit` | View | Kullanıcı güncelleme formunu işleme |
| **POST/GET** | `/users/:id/delete` | View | Kullanıcı kaydını silme ve listeye yönlendirme |
| **GET** | `/api/users` | REST API | Tüm kullanıcıları JSON formatında getirir |
| **POST** | `/api/users` | REST API | Yeni kullanıcı oluşturur (`201 Created`) |
| **GET** | `/api/users/:id` | REST API | ID'ye göre tekil kullanıcı JSON verisi |
| **PUT** | `/api/users/:id` | REST API | Kullanıcıyı bütünsel olarak günceller |
| **PATCH** | `/api/users/:id` | REST API | Kullanıcıyı kısmi olarak günceller |
| **DELETE** | `/api/users/:id` | REST API | Kullanıcı kaydını siler (`200 OK`) |

### 1b. İş İlanları ve Başvurular (Jobs & Applications)

| HTTP Metodu | Rota / URL | Başarılı | Hata durumları |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/users/:id/jobs` | `201` oluşturulan ilan | `400` eksik alan (`title`, `company`, `location`, `description`), `404` kullanıcı yok |
| **GET** | `/api/users/:id/jobs` | `200` kullanıcının ilanları | `404` kullanıcı yok |
| **GET** | `/api/users/:id` | `200` kullanıcı + `jobs` dizisi | `404` kullanıcı yok |
| **GET** | `/users/:id` | HTML profil sayfası + ilan tablosu | `404` |
| **POST** | `/api/jobs/:id/applications` | `201` başvuru (body: `{ "userId": "..." }`) | `409` aynı kullanıcı ikinci kez, `404` ilan ya da kullanıcı yok, `400` `userId` eksik |
| **GET** | `/api/jobs/:id/applications` | `200` ilana başvuranlar (kullanıcı bilgisiyle) | `404` ilan yok |
| **GET** | `/api/users/:id/applications` | `200` kullanıcının başvuruları (ilan bilgisiyle) | `404` kullanıcı yok |

> Kullanıcı id'leri UUID, ilan ve başvuru id'leri INT'tir. **Delete rule:** kullanıcı silinince ilanları ve başvuruları, ilan silinince başvuruları silinir (`ON DELETE CASCADE`, ayrıntı: [ddd.md](./ddd.md), bölüm 7b).

Hızlı deneme (seed sonrası; `<USER_ID>` için `GET /api/users` çıktısından bir id alın). En kolayı **Swagger** (`http://localhost:5001/api/swagger` → "Jobs & Applications" → *Try it out*). Terminalden denemek için:

**macOS / Linux / Git Bash:**

```bash
curl -X POST http://localhost:5001/api/users/<USER_ID>/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Stajyer","company":"Trendyol","location":"İstanbul","description":"Yaz stajı"}'

curl -X POST http://localhost:5001/api/jobs/1/applications \
  -H "Content-Type: application/json" -d '{"userId":"<USER_ID>"}'   # 201, tekrar -> 409
```

**Windows PowerShell** (yukarıdaki `\` ve tek tırnaklı `curl` komutları Windows'ta çalışmaz):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5001/api/users/<USER_ID>/jobs `
  -ContentType "application/json" `
  -Body '{"title":"Stajyer","company":"Trendyol","location":"Istanbul","description":"Yaz staji"}'

Invoke-RestMethod -Method Post -Uri http://localhost:5001/api/jobs/1/applications `
  -ContentType "application/json" -Body '{"userId":"<USER_ID>"}'
```

### 2. Duyuru Modülü (Announcement Module - Ödev Görevleri)

| HTTP Metodu | Rota / URL | Katman | Açıklama |
| :--- | :--- | :--- | :--- |
| **GET** | `/announcements` | View UI | Duyuru panosu ve yönetim arayüzü (Filtreleme & Arama) |
| **GET** | `/announcements/new` | View UI | Yeni duyuru yayınlama formu |
| **POST** | `/announcements` | View UI | Yeni duyuru oluşturup panoya yönlendirme |
| **GET** | `/announcements/:id` | View UI | Tekil duyuru makale görünümü |
| **GET** | `/announcements/:id/edit`| View UI | Duyuru düzenleme formu |
| **POST** | `/announcements/:id/edit`| View UI | Duyuruyu güncelleme |
| **POST/GET** | `/announcements/:id/delete`| View UI | Duyuruyu silme |
| **GET** | `/api/announcements` | REST API | Tüm duyuruları JSON formatında getirir |
| **POST** | `/api/announcements` | REST API | Yeni duyuru ekler (`201 Created`) |
| **GET** | `/api/announcements/:id` | REST API | Tekil duyuru JSON verisi |
| **PUT** | `/api/announcements/:id` | REST API | Duyuruyu bütünsel olarak günceller |
| **PATCH** | `/api/announcements/:id` | REST API | Duyuruyu kısmi olarak günceller |
| **DELETE** | `/api/announcements/:id` | REST API | Duyuruyu siler |

### 3. Sistem & Ders İçi Temel Uç Noktalar (Whiteboard Rotaları)

| HTTP Metodu | Rota / URL | Açıklama | Beklenen Yanıt Örneği |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Temel kök kontrol yanıtı | `"ok"` |
| **GET** | `/hello` | Statik karşılama mesajı | `"Hello, World!"` |
| **GET** | `/hello/:name` (veya `/hello/{name}`) | Dinamik karşılama mesajı | `/hello/emre` ➡️ `"Hello, Emre!"` |
| **GET** | `/sum/:number1/:number2` | İki sayıyı toplama rotası | `/sum/15/27` ➡️ `"42"` |
| **GET** | `/api/swagger` (veya `/api-docs`) | Swagger UI Etkileşimli API Dokümantasyonu | HTML Arayüzü |
| **GET** | `/api/swagger.json` | OpenAPI 3.0 Ham JSON Spesifikasyonu | JSON |
| **GET** | `/api/health` | Sunucu sağlık durumu (Uptime, RAM, CPU) | JSON |

---

## 🛠️ Kurulum ve Çalıştırma (sıfırdan, adım adım)

**Gerekenler:** Node.js 20+, npm, Git ve Docker Desktop (veritabanı için). Docker yerine kendi PostgreSQL 16 kurulumunuzu da kullanabilirsiniz (aşağıda not var).

> Komutlar macOS/Linux terminali ve Windows **PowerShell** için aynıdır. (Eski `cmd.exe` kullanıyorsanız `cp` yerine `copy` yazın.)

### 1. Clone

```bash
git clone https://github.com/ahmetsahin78/alumni-tracking-system.git
cd alumni-tracking-system
```

### 2. Install

```bash
cd server
npm install
```

`npm install` sonunda Prisma Client otomatik üretilir. Üretilmezse: `npx prisma generate`.

### 3. `.env` dosyası

```bash
# hâlâ server/ klasöründesiniz
cp .env.example .env
```

Şablondaki `DATABASE_URL` (`postgres` / `postgres` @ `localhost:5432` / `alumni_db`), `docker-compose.yml` içindeki Postgres ile birebir aynıdır, değiştirmeden çalışır. Kendi Postgres'inizi kullanıyorsanız sadece `DATABASE_URL`'i düzenleyin. `.env` git'e eklenmez (`.gitignore`).

### 4. Database'i başlat

```bash
# proje kök klasöründen sadece veritabanı konteynerini açın
cd ..
docker compose up -d postgres
docker compose ps          # alumni_postgres "healthy" olana kadar birkaç saniye bekleyin
cd server
```

*Docker yoksa:* kendi PostgreSQL'inizde `alumni_db` adında bir veritabanı oluşturup `.env` içindeki `DATABASE_URL`'i ona göre güncelleyin.

### 5. Migrate (ve Prisma Client'ı üret)

```bash
npx prisma migrate deploy
npx prisma generate
```

`prisma generate`, şemadaki modellere (`Application` vb.) göre Prisma Client'ı yeniden üretir. Daha önce `npm install` yapılmış bir klasörde (ör. `git pull` sonrası) bu adım atlanırsa seed `Property 'application' does not exist` hatası verir.

Bu komut `prisma/migrations/` altındaki iki migration'ı sırayla uygular: `init` ve `job_postings_applications`. Şemayı kendiniz değiştirdiğinizde yeni migration üretmek için `npm run prisma:migrate` (`prisma migrate dev`) kullanın.

### 6. Seed

```bash
npm run prisma:seed
```

Seed tabloları FK sırasına göre (önce `applications`, en son `users`) boşaltır, INT id sayaçlarını 1'e sıfırlar ve örnek kullanıcı, ilan ve başvuru ekler. Tekrar tekrar çalıştırılabilir. Her seferinde ilk ilanın id'si `1` olur.

> Her şeyi silip baştan kurmak için: `npx prisma migrate reset` (migration'ları yeniden uygular ve seed'i otomatik çalıştırır).

### 7. Start

```bash
npm run dev
```

Sunucu **`http://localhost:5001`** adresinde açılır:
- 👤 Kullanıcılar (HTML): [http://localhost:5001/users](http://localhost:5001/users). Bir kullanıcıya tıklayınca profilinde **iş ilanları** listelenir.
- 🔌 Kullanıcılar API: [http://localhost:5001/api/users](http://localhost:5001/api/users)
- 📢 Duyurular: [http://localhost:5001/announcements](http://localhost:5001/announcements)
- 📖 Swagger: [http://localhost:5001/api/swagger](http://localhost:5001/api/swagger)
- 💚 Sağlık: [http://localhost:5001/api/health](http://localhost:5001/api/health)

### 8. Testler

```bash
npm test
```

Testler kullanıcı, duyuru, view ve swagger uçlarına ek olarak, veritabanı bağlıyken **jobs ve applications** akışını da sınar: 201/400/404, `GET /api/users/:id` içindeki `jobs`, başvuruda 201/409/404, iki liste, profil sayfası ve delete rule (cascade). Sonda `0 FAILED` görmelisiniz.

### (Opsiyonel) Frontend

```bash
cd ../client
npm install
npm run dev      # http://localhost:3000
```

### 🧯 Sık Karşılaşılan Hatalar

| Hata | Sebep / Çözüm |
| :--- | :--- |
| `P1000: Authentication failed` | `server/.env` içindeki kullanıcı/şifre, çalışan Postgres ile uyuşmuyor. Docker kullanıyorsanız şablondaki `postgres:postgres` değerini değiştirmeyin. |
| `P1001: Can't reach database server at localhost:5432` | Postgres çalışmıyor: `docker compose up -d postgres`. |
| `port 5432 is already allocated` | Bilgisayarda başka bir Postgres çalışıyor. Onu durdurun ya da kök `.env`'de `DB_PORT=5433` yapıp `DATABASE_URL`'deki portu da `5433` yapın. |
| `@prisma/client did not initialize yet` ya da `Property 'application' does not exist on type 'PrismaClient'` | Prisma Client eski şemaya göre üretilmiş: `npx prisma generate` çalıştırın. |
| `The table "public.applications" does not exist` | Migration uygulanmamış: `npx prisma migrate deploy`. |

---

## 🔐 Ortam Değişkenleri (Environment Variables)

- **`server/.env`**: `npm run dev`, Prisma CLI ve seed bunu okur. `server/.env.example`'dan kopyalanır (adım 3).
- **Kök `.env`** (opsiyonel): sadece `docker compose` okur (DB kullanıcı/şifre/port). Yoksa varsayılanlar kullanılır: `postgres` / `postgres` / `alumni_db` / `5432`. Oluşturmak için kök dizinde `cp .env.example .env`.
- `.env` dosyaları `.gitignore` içindedir. Repoda yalnızca hassas bilgi içermeyen şablonlar (`.env.example`, `.example.env`) bulunur.

---

## ✅ Sınav Öncesi Kontrol: "README'den Kurulum" Testi

Amaç: bir sınıf arkadaşının projeyi **sadece bu README'yi** takip ederek sıfırdan kurabilmesi (clone → install → .env → database → migrate → seed → start).

- **Bulunan ilk takılma noktası:** Önceki README'de yerel kurulum sadece `npm install` + `npm run dev`'den ibaretti. `.env`, veritabanı, migrate ve seed adımları yoktu. Ayrıca `server/.env.example` şifre olarak `your_secure_password_here` içeriyordu, Docker'daki Postgres ise `postgres` şifresiyle açılıyordu. Bu yüzden şablonu kopyalayan biri `prisma migrate` adımında **`P1000: Authentication failed`** hatası alıyordu.
- **İkinci takılma noktası:** Projeyi daha önce kurmuş biri `git pull` sonrası sadece `migrate deploy` + seed çalıştırdığında Prisma Client eski şemayla kalıyordu ve seed `Property 'application' does not exist` hatası veriyordu. Çözüm olarak 5. adıma `npx prisma generate` eklendi.
- **Üçüncü olası takılma:** README'deki `curl` örnekleri Windows cmd/PowerShell'de çalışmıyordu. PowerShell karşılıkları ve Swagger yolu eklendi.
- **Düzeltme:**
  - Kurulum bölümü yukarıdaki 7 adımlı sıraya getirildi.
  - `server/.env.example` ve `server/.example.env` içindeki bağlantı bilgileri `docker-compose.yml` varsayılanlarıyla eşitlendi.
  - Seed script'i tek seferlik çalışan `ts-node` ile çalıştırılıyor.
  - `prisma migrate reset` için `"prisma": { "seed": ... }` ayarı eklendi.
  - Hata tablosu eklendi.

---

## 🐳 Docker ile Başlatma ve Veri Kalıcılığı ("The Forgetting Test")

Sistem, çoklu konteyner mimarisini yönetmek ve veritabanı kalıcılığını sağlamak için `docker-compose.yml` kullanır:

```bash
# 1. Konteynerleri inşa et ve başlat
docker compose up --build -d

# 2. Veritabanı tablolarını oluştur (Migration: init + job_postings_applications)
docker compose exec server npx prisma migrate deploy

# 3. Başlangıç verilerini (Seed) yükle
docker compose exec server npm run prisma:seed
```

### 🧪 "The Forgetting Test" Doğrulama Adımları:
1. **Kayıt Oluştur:** [http://localhost:5001/users](http://localhost:5001/users) veya `/api/users` üzerinden yeni bir mezun kaydı ekleyin.
2. **Konteynerleri Kapat:** `docker compose down` komutunu çalıştırın. (Konteynerler ve ağ durdurulur; ancak `alumni_tracking_postgres_data` hacmi korunur).
3. **Konteynerleri Yeniden Başlat:** `docker compose up -d` komutu ile tekrar ayağa kaldırın.
4. **Kayıt Kontrolü:** [http://localhost:5001/users](http://localhost:5001/users) adresini açtığınızda oluşturduğunuz kaydın silinmediğini ve eksiksiz durduğunu doğrulayın.

---

> 📖 **Veri Modeli Detayları:** Tablolar ve ilişkiler için ➡️ [ddd.md](./ddd.md) dokümanını inceleyebilirsiniz.
