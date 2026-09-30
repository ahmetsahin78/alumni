export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Alumni Tracking System API",
    version: "1.0.0",
    description:
      "İstanbul Üniversitesi Web Programlama Dersi - Hafta 03: In-Memory RESTful CRUD API & Sistem Sağlık Servisi.",
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
    {
      url: "http://localhost:5000",
      description: "Alternatif Backend Portu (Port 5000)",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Sistem ve sunucu durumu kontrol endpoint'i",
    },
    {
      name: "Alumni",
      description: "Mezun kayıtları CRUD işlemleri (In-Memory)",
    },
    {
      name: "Users",
      description: "Kullanıcı/Mezun alias endpoint'leri (/api/users)",
    },
    {
      name: "Utility",
      description: "Ders içi yardımcı fonksiyonlar (Hello & Sum)",
    },
  ],
  paths: {
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
    "/api/alumni": {
      get: {
        tags: ["Alumni"],
        summary: "Tüm mezun listesini getir",
        description: "Hafızadaki (in-memory) tüm mezun kayıtlarını listeler.",
        responses: {
          "200": {
            description: "Mezun listesi başarıyla getirildi",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Alumnus" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Alumni"],
        summary: "Yeni mezun kaydı ekle (201 Created)",
        description: "Yeni bir mezun kaydeder. 'name' ve 'graduationYear' alanları zorunludur.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAlumniInput" },
              example: {
                name: "Elif Kaya",
                graduationYear: 2024,
                department: "Bilgisayar Mühendisliği",
                company: "Google",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Mezun başarıyla oluşturuldu",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alumnus" },
                example: {
                  id: 5,
                  name: "Elif Kaya",
                  graduationYear: 2024,
                  department: "Bilgisayar Mühendisliği",
                  company: "Google",
                },
              },
            },
          },
          "400": {
            description: "Geçersiz veya eksik veri gönderildi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/alumni/{id}": {
      get: {
        tags: ["Alumni"],
        summary: "ID ile tekil mezun kaydı getir",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mezun ID numarası",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Mezun kaydı bulundu",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alumnus" },
              },
            },
          },
          "404": {
            description: "Belirtilen ID bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Alumni"],
        summary: "Mezun kaydını tamamen güncelle (PUT - Bütünsel)",
        description: "Kaydı bütünsel olarak yenisiyle değiştirir. 'name' ve 'graduationYear' zorunludur.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mezun ID numarası",
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAlumniInput" },
              example: {
                name: "Elif Kaya Güncellendi",
                graduationYear: 2024,
                department: "Bilgisayar Mühendisliği",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Kayıt başarıyla güncellendi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alumnus" },
              },
            },
          },
          "400": {
            description: "Zorunlu alanlar eksik",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Kayıt bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Alumni"],
        summary: "Mezun kaydını kısmi güncelle (PATCH)",
        description: "Yalnızca gönderilen alanları günceller. Diğer alanlar korunur.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mezun ID numarası",
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatchAlumniInput" },
              example: {
                graduationYear: 2025,
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Kayıt kısmi olarak güncellendi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alumnus" },
              },
            },
          },
          "400": {
            description: "Geçersiz güncelleme verisi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Kayıt bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Alumni"],
        summary: "Mezun kaydı sil",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Mezun ID numarası",
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Kayıt başarıyla silindi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Elif Kaya adlı mezun kaydı başarıyla silindi." },
                    deletedRecord: { $ref: "#/components/schemas/Alumnus" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Silinecek kayıt bulunamadı",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Tüm kullanıcıları/mezunları listele (/api/users alias)",
        responses: {
          "200": {
            description: "Kullanıcı listesi",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Alumnus" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Yeni kullanıcı/mezun ekle (201 Created)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAlumniInput" },
              example: {
                name: "Mert Aydın",
                graduationYear: 2021,
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Kullanıcı oluşturuldu",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Alumnus" },
              },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "ID ile kullanıcı getir",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Kullanıcı bulundu" },
          "404": { description: "Kullanıcı bulunamadı" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Kullanıcıyı bütünsel güncelle (PUT)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAlumniInput" },
            },
          },
        },
        responses: {
          "200": { description: "Güncellendi" },
          "404": { description: "Bulunamadı" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Kullanıcıyı kısmi güncelle (PATCH)",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatchAlumniInput" },
            },
          },
        },
        responses: {
          "200": { description: "Kısmi güncellendi" },
          "404": { description: "Bulunamadı" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Kullanıcı sil",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Silindi" },
          "404": { description: "Bulunamadı" },
        },
      },
    },
    "/hello/{name}": {
      get: {
        tags: ["Utility"],
        summary: "Selamlama metni",
        parameters: [
          {
            name: "name",
            in: "path",
            required: true,
            schema: { type: "string", example: "Emre" },
          },
        ],
        responses: {
          "200": {
            description: "Selamlama",
            content: { "text/plain": { schema: { type: "string", example: "Hello,Emre!" } } },
          },
        },
      },
    },
    "/sum/{number1}/{number2}": {
      get: {
        tags: ["Utility"],
        summary: "İki sayıyı topla",
        parameters: [
          { name: "number1", in: "path", required: true, schema: { type: "number", example: 10 } },
          { name: "number2", in: "path", required: true, schema: { type: "number", example: 32 } },
        ],
        responses: {
          "200": {
            description: "Toplam sonucu",
            content: { "text/plain": { schema: { type: "string", example: "42" } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
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
          timestamp: { type: "string", example: "2026-09-30T20:15:00.000Z" },
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
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Kayıt bulunamadı." },
        },
      },
    },
  },
};
