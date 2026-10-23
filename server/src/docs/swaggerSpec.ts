export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Alumni Tracking System API & MVC Documentation",
    version: "2.0.0",
    description:
      "İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: In-Memory MVC Mimarisi (User & Announcement Modülleri, HTML View Katmanı ve RESTful JSON API).",
    contact: {
      name: "Alumni Tracking Project",
    },
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Yerel Geliştirme Sunucusu (Port 5001)",
    },
    {
      url: "http://localhost:3000",
      description: "Frontend Proxy / Alternatif Port (Port 3000)",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Sistem ve sunucu durumu kontrol endpoint'i",
    },
    {
      name: "User View (HTML)",
      description: "Kullanıcı Yönetimi HTML Görünümleri (/users) - MVC View Katmanı",
    },
    {
      name: "User API (JSON)",
      description: "Kullanıcı Yönetimi RESTful JSON API (/api/users) - ApiUserController",
    },
    {
      name: "Announcement View (HTML)",
      description: "Duyuru Panosu HTML Yönetim Arayüzü (/announcements) - Homework Interface",
    },
    {
      name: "Announcement API (JSON)",
      description: "Duyuru Yönetimi RESTful JSON API (/api/announcements) - ApiAnnouncementController",
    },
    {
      name: "Jobs & Applications (JSON)",
      description: "İş ilanları ve başvurular (/api/users/:id/jobs, /api/jobs/:id/applications)",
    },
    {
      name: "Alumni",
      description: "Hafta 03 Mezun kayıtları CRUD işlemleri (/api/alumni)",
    },
    {
      name: "Utility",
      description: "Ders içi yardımcı fonksiyonlar (Hello & Sum)",
    },
  ],
  paths: {
    // ------------------------------------------------------------------------
    // HEALTH ENDPOINT
    // ------------------------------------------------------------------------
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Sunucu sağlık ve sistem durumunu döndürür",
        description: "Uptime, bellek kullanımı, CPU sayısı ve çalışma ortamı bilgilerini JSON formatında sağlar.",
        responses: {
          "200": {
            description: "Sunucu sağlıklı çalışıyor",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },

    // ------------------------------------------------------------------------
    // USER VIEW ENDPOINTS (/users)
    // ------------------------------------------------------------------------
    "/users": {
      get: {
        tags: ["User View (HTML)"],
        summary: "Kullanıcı listesi HTML sayfası (Read - All)",
        description: "MVC mimarisinde UserController tarafından üretilen sunucu taraflı HTML tablosu.",
        parameters: [
          {
            name: "search",
            in: "query",
            description: "İsim veya e-posta ile arama",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "HTML kullanıcı listesi sayfası",
            content: { "text/html": {} },
          },
        },
      },
      post: {
        tags: ["User View (HTML)"],
        summary: "HTML formu üzerinden yeni kullanıcı kaydı oluştur (Create)",
        description: "Web formundan gönderilen veriyi alarak yeni kullanıcı kaydeder ve listeye yönlendirir.",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: { $ref: "#/components/schemas/CreateUserInput" },
            },
          },
        },
        responses: {
          "302": { description: "Başarılı oluşturma sonrası /users sayfasına yönlendirme" },
          "400": { description: "Form doğrulama hatası (HTML hata sayfası döner)" },
        },
      },
    },
    "/users/new": {
      get: {
        tags: ["User View (HTML)"],
        summary: "Yeni kullanıcı ekleme HTML formu",
        description: "Kullanıcı oluşturmak için doldurulacak formu sunar.",
        responses: {
          "200": {
            description: "HTML form sayfası",
            content: { "text/html": {} },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["User View (HTML)"],
        summary: "Tekil kullanıcı profil detayı HTML sayfası (Read - One)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Kullanıcı profili HTML sayfası" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
    },
    "/users/{id}/edit": {
      get: {
        tags: ["User View (HTML)"],
        summary: "Kullanıcı düzenleme HTML formu",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Düzenleme formu HTML sayfası" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
      post: {
        tags: ["User View (HTML)"],
        summary: "Kullanıcı güncelleme formunu işle (Update)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: { $ref: "#/components/schemas/CreateUserInput" },
            },
          },
        },
        responses: {
          "302": { description: "Güncelleme sonrası profil sayfasına yönlendirme" },
        },
      },
    },

    // ------------------------------------------------------------------------
    // USER API ENDPOINTS (/api/users)
    // ------------------------------------------------------------------------
    "/api/users": {
      get: {
        tags: ["User API (JSON)"],
        summary: "Tüm kullanıcıları JSON formatında listele (ApiUserController)",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "department", in: "query", schema: { type: "string" } },
          { name: "role", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Kullanıcı JSON dizisi",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/User" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["User API (JSON)"],
        summary: "Yeni kullanıcı ekle (201 Created)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserInput" },
              example: {
                name: "Ahmet Yılmaz",
                email: "ahmet.yilmaz@istanbul.edu.tr",
                role: "Alumni",
                graduationYear: 2024,
                department: "Bilgisayar Mühendisliği",
                company: "Google",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Kullanıcı başarıyla oluşturuldu",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/User" } },
            },
          },
          "400": { description: "Eksik veya hatalı veri" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["User API (JSON)"],
        summary: "ID'ye göre tekil kullanıcı getir (ilanları 'jobs' alanında)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "Kullanıcı detayı",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/User" } },
            },
          },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
      put: {
        tags: ["User API (JSON)"],
        summary: "Kullanıcıyı bütünsel olarak güncelle (PUT)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateUserInput" } },
          },
        },
        responses: {
          "200": { description: "Kullanıcı güncellendi" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
      patch: {
        tags: ["User API (JSON)"],
        summary: "Kullanıcıyı kısmi olarak güncelle (PATCH)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PatchUserInput" } },
          },
        },
        responses: {
          "200": { description: "Kullanıcı güncellendi" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
      delete: {
        tags: ["User API (JSON)"],
        summary: "Kullanıcı kaydını sil (DELETE)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Kullanıcı silindi" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
    },

    // ------------------------------------------------------------------------
    // JOBS & APPLICATIONS (JSON)
    // ------------------------------------------------------------------------
    "/api/users/{id}/jobs": {
      get: {
        tags: ["Jobs & Applications (JSON)"],
        summary: "Kullanıcının iş ilanları",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Kullanıcı UUID" }],
        responses: { "200": { description: "İlan listesi" }, "404": { description: "Kullanıcı bulunamadı" } },
      },
      post: {
        tags: ["Jobs & Applications (JSON)"],
        summary: "Kullanıcı adına iş ilanı oluştur",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Kullanıcı UUID" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "company", "location", "description"],
                properties: {
                  title: { type: "string", example: "Junior Backend Developer" },
                  company: { type: "string", example: "Trendyol" },
                  location: { type: "string", example: "İstanbul (Hibrit)" },
                  description: { type: "string", example: "Node.js bilen mezun arıyoruz." },
                  type: { type: "string", enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "REMOTE", "CONTRACT"] },
                  industry: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "İlan oluşturuldu" },
          "400": { description: "Eksik/geçersiz alan" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
    },
    "/api/users/{id}/applications": {
      get: {
        tags: ["Jobs & Applications (JSON)"],
        summary: "Kullanıcının yaptığı başvurular",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Kullanıcı UUID" }],
        responses: { "200": { description: "Başvuru listesi (ilan bilgisiyle)" }, "404": { description: "Kullanıcı bulunamadı" } },
      },
    },
    "/api/jobs/{id}/applications": {
      get: {
        tags: ["Jobs & Applications (JSON)"],
        summary: "İlana başvuranlar",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, description: "İlan ID" }],
        responses: { "200": { description: "Başvuran listesi (kullanıcı bilgisiyle)" }, "404": { description: "İlan bulunamadı" } },
      },
      post: {
        tags: ["Jobs & Applications (JSON)"],
        summary: "İlana başvur",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, description: "İlan ID" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId"],
                properties: { userId: { type: "string" }, coverLetter: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "201": { description: "Başvuru oluşturuldu" },
          "400": { description: "userId eksik" },
          "404": { description: "İlan ya da kullanıcı bulunamadı" },
          "409": { description: "Bu kullanıcı bu ilana zaten başvurmuş" },
        },
      },
    },

    // ------------------------------------------------------------------------
    // ANNOUNCEMENT VIEW ENDPOINTS (/announcements) - HOMEWORK INTERFACE
    // ------------------------------------------------------------------------
    "/announcements": {
      get: {
        tags: ["Announcement View (HTML)"],
        summary: "Duyuru Panosu HTML Arayüzü (Homework Interface)",
        description: "Duyuruları yönetmek için hazırlanan web kullanıcı arayüzü.",
        responses: {
          "200": { description: "HTML duyuru panosu sayfası" },
        },
      },
      post: {
        tags: ["Announcement View (HTML)"],
        summary: "Web formu ile yeni duyuru yayınla",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: { $ref: "#/components/schemas/CreateAnnouncementInput" },
            },
          },
        },
        responses: {
          "302": { description: "Duyurular listesine yönlendirme" },
        },
      },
    },
    "/announcements/new": {
      get: {
        tags: ["Announcement View (HTML)"],
        summary: "Yeni duyuru oluşturma HTML formu",
        responses: {
          "200": { description: "HTML form sayfası" },
        },
      },
    },
    "/announcements/{id}": {
      get: {
        tags: ["Announcement View (HTML)"],
        summary: "Tekil duyuru detay sayfası",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Duyuru detay sayfası" },
          "404": { description: "Duyuru bulunamadı" },
        },
      },
    },

    // ------------------------------------------------------------------------
    // ANNOUNCEMENT API ENDPOINTS (/api/announcements)
    // ------------------------------------------------------------------------
    "/api/announcements": {
      get: {
        tags: ["Announcement API (JSON)"],
        summary: "Tüm duyuruları JSON formatında listele (ApiAnnouncementController)",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "priority", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Duyuru JSON dizisi",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Announcement" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Announcement API (JSON)"],
        summary: "Yeni duyuru ekle (201 Created)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAnnouncementInput" },
              example: {
                title: "2026 Mezunlar Buluşması",
                content: "Geleneksel mezunlar buluşması Beyazıt Kampüsünde yapılacaktır.",
                author: "Mezunlar Koordinatörlüğü",
                category: "Event",
                priority: "High",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Duyuru oluşturuldu",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Announcement" } },
            },
          },
        },
      },
    },
    "/api/announcements/{id}": {
      get: {
        tags: ["Announcement API (JSON)"],
        summary: "ID'ye göre tekil duyuru getir",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Duyuru detayı" },
          "404": { description: "Duyuru bulunamadı" },
        },
      },
      put: {
        tags: ["Announcement API (JSON)"],
        summary: "Duyuruyu bütünsel olarak güncelle (PUT)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateAnnouncementInput" } },
          },
        },
        responses: {
          "200": { description: "Duyuru güncellendi" },
          "404": { description: "Duyuru bulunamadı" },
        },
      },
      patch: {
        tags: ["Announcement API (JSON)"],
        summary: "Duyuruyu kısmi olarak güncelle (PATCH)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PatchAnnouncementInput" } },
          },
        },
        responses: {
          "200": { description: "Duyuru güncellendi" },
        },
      },
      delete: {
        tags: ["Announcement API (JSON)"],
        summary: "Duyuruyu sil (DELETE)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Duyuru silindi" },
          "404": { description: "Duyuru bulunamadı" },
        },
      },
    },

    // ------------------------------------------------------------------------
    // WEEK 03 ALUMNI ENDPOINTS (/api/alumni)
    // ------------------------------------------------------------------------
    "/api/alumni": {
      get: {
        tags: ["Alumni"],
        summary: "Tüm mezun listesini getir (Week 03)",
        responses: {
          "200": {
            description: "Mezun listesi başarıyla getirildi",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Alumnus" } },
              },
            },
          },
        },
      },
      post: {
        tags: ["Alumni"],
        summary: "Yeni mezun kaydı ekle (201 Created)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAlumniInput" },
            },
          },
        },
        responses: {
          "201": { description: "Kayıt başarıyla oluşturuldu" },
          "400": { description: "Geçersiz veri" },
        },
      },
    },
    "/api/alumni/{id}": {
      get: {
        tags: ["Alumni"],
        summary: "ID'ye göre tekil mezun getir",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Mezun kaydı bulundu" },
          "404": { description: "Kayıt bulunamadı" },
        },
      },
      put: {
        tags: ["Alumni"],
        summary: "Bütünsel güncelleme (PUT)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateAlumniInput" } },
          },
        },
        responses: {
          "200": { description: "Kayıt güncellendi" },
        },
      },
      patch: {
        tags: ["Alumni"],
        summary: "Kısmi güncelleme (PATCH)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/PatchAlumniInput" } },
          },
        },
        responses: {
          "200": { description: "Kayıt güncellendi" },
        },
      },
      delete: {
        tags: ["Alumni"],
        summary: "Kayıt sil (DELETE)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Kayıt silindi" },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Elif Kaya" },
          email: { type: "string", example: "elif.kaya@istanbul.edu.tr" },
          role: { type: "string", example: "Alumni" },
          graduationYear: { type: "integer", example: 2024 },
          department: { type: "string", example: "Bilgisayar Mühendisliği" },
          company: { type: "string", example: "Google" },
          createdAt: { type: "string", example: "2026-10-08T01:00:00.000Z" },
          updatedAt: { type: "string", example: "2026-10-08T01:00:00.000Z" },
        },
        required: ["id", "name", "email", "role", "graduationYear", "department"],
      },
      CreateUserInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Elif Kaya" },
          email: { type: "string", example: "elif.kaya@istanbul.edu.tr" },
          role: { type: "string", enum: ["Alumni", "Student", "Admin", "Faculty"], example: "Alumni" },
          graduationYear: { type: "integer", example: 2024 },
          department: { type: "string", example: "Bilgisayar Mühendisliği" },
          company: { type: "string", example: "Google" },
        },
        required: ["name", "email", "graduationYear", "department"],
      },
      PatchUserInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
          graduationYear: { type: "integer" },
          department: { type: "string" },
          company: { type: "string" },
        },
      },
      Announcement: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "2026 Mezunlar Buluşması" },
          content: { type: "string", example: "Mezunlar buluşması 15 Mayıs'ta yapılacaktır." },
          author: { type: "string", example: "Mezunlar Ofisi" },
          category: { type: "string", example: "Event" },
          priority: { type: "string", example: "High" },
          publishedAt: { type: "string", example: "8 Ekim 2026" },
          createdAt: { type: "string", example: "2026-10-08T01:00:00.000Z" },
          updatedAt: { type: "string", example: "2026-10-08T01:00:00.000Z" },
        },
        required: ["id", "title", "content", "author", "category", "priority"],
      },
      CreateAnnouncementInput: {
        type: "object",
        properties: {
          title: { type: "string", example: "2026 Mezunlar Buluşması" },
          content: { type: "string", example: "Mezunlar buluşması detayları..." },
          author: { type: "string", example: "Kariyer Merkezi" },
          category: { type: "string", enum: ["General", "Event", "Career", "Academic", "Urgent"], example: "Event" },
          priority: { type: "string", enum: ["Low", "Medium", "High"], example: "High" },
        },
        required: ["title", "content", "author"],
      },
      PatchAnnouncementInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          author: { type: "string" },
          category: { type: "string" },
          priority: { type: "string" },
        },
      },
      Alumnus: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Elif Kaya" },
          graduationYear: { type: "integer", example: 2024 },
          department: { type: "string", example: "Bilgisayar Mühendisliği" },
          company: { type: "string", example: "Google" },
          email: { type: "string", example: "elif.kaya@alumni.edu" },
          role: { type: "string", example: "Software Engineer" },
        },
        required: ["id", "name", "graduationYear"],
      },
      CreateAlumniInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Elif Kaya" },
          graduationYear: { type: "integer", example: 2024 },
          department: { type: "string", example: "Bilgisayar Mühendisliği" },
          company: { type: "string", example: "Google" },
          email: { type: "string", example: "elif.kaya@alumni.edu" },
          role: { type: "string", example: "Software Engineer" },
        },
        required: ["name", "graduationYear"],
      },
      PatchAlumniInput: {
        type: "object",
        properties: {
          name: { type: "string", example: "Elif Kaya Demir" },
          graduationYear: { type: "integer", example: 2024 },
          department: { type: "string" },
          company: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "healthy" },
          service: { type: "string", example: "alumni-tracker-api" },
          timestamp: { type: "string", example: "2026-10-08T01:00:00.000Z" },
          uptime: {
            type: "object",
            properties: {
              seconds: { type: "integer", example: 3600 },
              formatted: { type: "string", example: "1h 0m 0s" },
            },
          },
          memory: {
            type: "object",
            properties: {
              systemTotal: { type: "string", example: "16384.00 MB" },
              systemUsed: { type: "string", example: "8192.00 MB" },
              usagePercentage: { type: "string", example: "50.00%" },
            },
          },
        },
      },
    },
  },
};
