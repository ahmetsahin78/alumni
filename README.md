# 🎓 Alumni Tracking System

A modern, comprehensive web platform designed for universities (such as Istanbul University) and educational academies to maintain strong, lifelong connections with their graduates. This system centralizes career tracking, mentorship programs, job postings, and detailed institutional statistics under one roof.

> 📊 **Veritabanı ve Veri Tasarımı Dokümantasyonu:**
> Tüm veritabanı tabloları, ER diyagramı, PK/FK kısıtlamaları ve alan spesifikasyonları için ➡️ [ddd.md (Data Design Documentation)](./ddd.md) dosyasına bakınız.

---

## 🏛️ Hafta 04: MVC (Model - View - Controller) Mimarisi ve Veritabanı Entegrasyonu

Bu hafta kapsamında projemiz, **Clean Architecture** ve **MVC (Model-View-Controller)** tasarım deseni prensiplerine göre yapılandırılmıştır. Eğitmenin ders içi yönergesi doğrultusunda **henüz herhangi bir veritabanı bağlantısı kullanılmamış** ("without database yet"), tüm veri modeli ve CRUD operasyonları tip güvenli biçimde **In-Memory (Bellek İçi)** olarak kurgulanmıştır.

### 📐 Katmanlı Mimari Şeması

```
[İstemci / Tarayıcı] 
       │
       ▼
 [Express Router] (server/src/routes)
   ├── /users          ──► UserController          ──► UserViews (HTML)          ◄── UserModel (In-Memory)
   ├── /api/users      ──► ApiUserController       ──► JSON Response (REST API)  ◄── UserModel (In-Memory)
   ├── /announcements  ──► AnnouncementController  ──► AnnouncementViews (HTML)   ◄── AnnouncementModel (In-Memory)
   └── /api/announc... ──► ApiAnnouncementContr... ──► JSON Response (REST API)  ◄── AnnouncementModel (In-Memory)
```

### 🧱 Katmanların Rolleri ve Sorumlulukları

1. **Model Katmanı (`server/src/models/`)**:
   - **`User.model.ts`**: Kullanıcı/Mezun verilerinin (`IUser`) bellek içi koleksiyonunu yönetir. Temel CRUD metotlarını (`findAll`, `findById`, `findByEmail`, `create`, `replace`, `patch`, `delete`, `reset`) barındırır.
   - **`Announcement.model.ts`**: Ödev görevi (Homework) kapsamında duyuruların (`IAnnouncement`) model yapısını ve CRUD işlemlerini yürütür.

2. **View Katmanı (`server/src/views/`)**:
   - Sunucu taraflı HTML (Server-Side Rendering) görünüm şablonları üretir.
   - **`layout.ts`**: Ortak responsive gezinme çubuğu (Navbar), sistem bildirimleri (Alerts), başlık ve altbilgi (Footer).
   - **`user.views.ts`**: Kullanıcı listesi (tablo & arama), kullanıcı profil detayı, yeni kullanıcı kayıt formu ve düzenleme formu.
   - **`announcement.views.ts`**: Duyuru panosu (kartlar & filtreleme), duyuru detayı, duyuru ekleme ve düzenleme arayüzü (**Homework Management Interface**).

3. **Controller Katmanı (`server/src/controllers/`)**:
   - **View Controller'lar (`UserController.ts`, `AnnouncementController.ts`)**: HTTP isteklerini karşılar, Model'den veriyi çeker ve ilgili HTML görünümünü oluşturup tarayıcıya döner veya form işlemlerinde yönlendirme (redirect) yapar.
   - **API Controller'lar (`ApiUserController.ts`, `ApiAnnouncementController.ts`)**: RESTful JSON servisleridir. Standart HTTP durum kodları (200 OK, 201 Created, 400 Bad Request, 404 Not Found) ile JSON yanıt döner.

4. **Routing Katmanı (`server/src/routes/`)**:
   - İstek URL'lerini ve HTTP metotlarını (GET, POST, PUT, PATCH, DELETE) ilgili Controller fonksiyonlarına eşler.
   - `user.routes.ts` & `announcement.routes.ts` (View rotaları).
   - `apiUser.routes.ts` & `apiAnnouncement.routes.ts` (JSON API rotaları).

---

## 📁 Detaylı Proje Dizin Yapısı

```plaintext
alumni-tracking-system/
├── docker-compose.yml              # Konteyner orkestrasyon dosyası
├── .env.example                    # Örnek çevre değişkenleri
├── README.md                       # Proje dokümantasyonu & MVC mimari rehberi
│
├── client/                         # Frontend (Next.js 14+ & Tailwind CSS)
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app/                    # Next.js uygulama sayfaları ve routing
│   │   ├── components/             # Yeniden kullanılabilir UI bileşenleri
│   │   └── styles/                 # Global CSS ve stiller
│   └── tsconfig.json
│
└── server/                         # Backend (Node.js + Express + TypeScript)
    ├── Dockerfile
    ├── package.json
    ├── public/                     # Statik HTML & varlıklar (Landing page, about)
    │   ├── index.html              # API Paneli ve hızlı erişim sayfası
    │   └── about.html              # Hakkında sayfası
    │
    ├── src/
    │   ├── index.ts                # Sunucu ana giriş noktası ve global middleware'ler
    │   ├── test-runner.ts          # Otomatik uçtan uca test koşucusu (In-Memory & MVC)
    │   │
    │   ├── models/                 # [MODEL KATMANI] Veri modelleri ve In-Memory CRUD
    │   │   ├── User.model.ts       # Kullanıcı modeli (IUser, CRUD metotları)
    │   │   └── Announcement.model.ts # Duyuru modeli (IAnnouncement, CRUD metotları)
    │   │
    │   ├── views/                  # [VIEW KATMANI] Sunucu taraflı HTML Görünümleri
    │   │   ├── layout.ts           # Ortak responsive sayfa şablonu ve navbar
    │   │   ├── user.views.ts       # Kullanıcı liste, detay, form görünümleri
    │   │   └── announcement.views.ts # Duyuru panosu ve yönetim arayüzü
    │   │
    │   ├── controllers/            # [CONTROLLER KATMANI] İstek yöneticileri
    │   │   ├── UserController.ts   # Kullanıcı View Controller (HTML sayfaları)
    │   │   ├── ApiUserController.ts # Kullanıcı API Controller (JSON REST)
    │   │   ├── AnnouncementController.ts # Duyuru View Controller (HTML sayfaları)
    │   │   ├── ApiAnnouncementController.ts # Duyuru API Controller (JSON REST)
    │   │   ├── alumni.controller.ts # Hafta 03 mezun kontrolcüsü
    │   │   └── health.controller.ts # Sistem sağlık kontrolcüsü
    │   │
    │   ├── routes/                 # [ROUTING KATMANI] Rota tanımlamaları
    │   │   ├── index.ts            # API rotalarını birleştiren ana yönlendirici
    │   │   ├── user.routes.ts      # GET/POST /users (View rotaları)
    │   │   ├── apiUser.routes.ts   # CRUD /api/users (JSON REST API rotaları)
    │   │   ├── announcement.routes.ts # GET/POST /announcements (View rotaları)
    │   │   ├── apiAnnouncement.routes.ts # CRUD /api/announcements (JSON REST rotaları)
    │   │   ├── alumni.routes.ts    # /api/alumni rotaları (Hafta 03)
    │   └── utility.routes.ts   # /hello/:name, /sum/:n1/:n2 rotaları
    │   │
    │   ├── docs/                   # Dokümantasyon
    │   │   └── swaggerSpec.ts      # OpenAPI 3.0 / Swagger tanımları
    │   │
    │   ├── storage/                # Depolama
    │   │   └── inMemoryStore.ts    # Hafta 03 in-memory alumni deposu
    │   │
    │   └── types/                  # TypeScript tip ve arayüz tanımları
    │       └── alumni.types.ts
    └── tsconfig.json
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

## 🛠️ Kurulum ve Çalıştırma

### 1. Geliştirme Sunucusunu Başlatma

```bash
cd server
npm install
npm run dev
```

Sunucu varsayılan olarak **`http://localhost:5001`** üzerinde çalışır:
- 👤 Kullanıcı Yönetim Arayüzü: [http://localhost:5001/users](http://localhost:5001/users)
- 📢 Duyurular Panosu (Ödev Arayüzü): [http://localhost:5001/announcements](http://localhost:5001/announcements)
- 📖 Swagger Dokümantasyonu: [http://localhost:5001/api/swagger](http://localhost:5001/api/swagger)
- 💚 Sağlık Kontrolü: [http://localhost:5001/api/health](http://localhost:5001/api/health)

### 2. Otomatik Testleri Koşma

Tüm In-Memory CRUD operasyonlarını, HTML görünümlerini ve Swagger entegrasyonunu doğrulamak için:

```bash
npm test
```

---

## 🔐 Ortam Değişkenleri (Environment Variables)

Projede veritabanı bağlantı bilgileri, portlar ve uygulama sırları `.env` dosyası üzerinden okunur:
- **Gizlilik & Git:** `.env` dosyası `.gitignore` içinde tanımlanmış olup versiyon kontrolüne kesinlikle dahil edilmez.
- **Şablon Dosyaları:** Yeni geliştiriciler ve kurulumlar için hassas bilgi içermeyen `.env.example` ve `.example.env` şablonları hem kök dizinde hem de `server/` altında sunulmuştur:
  ```bash
  # Kök dizinde:
  cp .env.example .env
  # veya
  cp .example.env .env

  # server dizininde:
  cp server/.env.example server/.env
  ```

---

## 🐳 Docker ile Başlatma ve Veri Kalıcılığı ("The Forgetting Test")

Sistem, çoklu konteyner mimarisini yönetmek ve veritabanı kalıcılığını sağlamak için `docker-compose.yml` kullanır:

```bash
# 1. Konteynerleri inşa et ve başlat
docker compose up --build -d

# 2. Veritabanı tablolarını göç et (Migration)
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
