/**
 * ============================================================================
 * Announcement Model (In-Memory / Database-Free)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Ödev Görevi (Homework)
 * Kural: Henüz veritabanı bağlantısı KULLANILMAYACAK ("without database yet").
 * Arayüz yönetimi ve API için ortak veri modelini ve CRUD operasyonlarını sağlar.
 * ============================================================================
 */

export type AnnouncementCategory = "General" | "Event" | "Career" | "Academic" | "Urgent";
export type AnnouncementPriority = "Low" | "Medium" | "High";

/**
 * Duyuru Modeli TypeScript Arayüzü (Contract Interface)
 */
export interface IAnnouncement {
  id: number;
  title: string;
  content: string;
  author: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDTO {
  title: string;
  content: string;
  author: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
}

export interface UpdateAnnouncementDTO {
  title: string;
  content: string;
  author: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
}

export interface PatchAnnouncementDTO {
  title?: string;
  content?: string;
  author?: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
}

export class AnnouncementModel {
  private announcements: IAnnouncement[] = [];
  private currentId: number = 1;

  constructor() {
    this.seedDefaultAnnouncements();
  }

  /**
   * Başlangıç mock duyurularını yükler
   */
  private seedDefaultAnnouncements(): void {
    const now = new Date();
    const seed: Omit<IAnnouncement, "id" | "createdAt" | "updatedAt" | "publishedAt">[] = [
      {
        title: "2026 Mezunlar Buluşması ve Kariyer Günü",
        content:
          "Tüm mezunlarımız ve son sınıf öğrencilerimiz için geleneksel Beyazıt Kampüsü Mezunlar Buluşması 15 Mayıs'ta gerçekleşecektir. Kayıt yaptırmayı unutmayınız.",
        author: "Mezunlar Ofisi Koordinatörlüğü",
        category: "Event",
        priority: "High",
      },
      {
        title: "Google & Microsoft Mentorluk Programı Başvuruları Başladı",
        content:
          "Sektörde çalışan deneyimli mezunlarımız ile öğrencilerimizi buluşturan 6 aylık mentorluk programı başvuruları açılmıştır.",
        author: "Kariyer Geliştirme Merkezi",
        category: "Career",
        priority: "High",
      },
      {
        title: "Web Programlama Dersi MVC Mimarisi Proje Teslimleri",
        content:
          "Hafta 04 kapsamında In-Memory MVC uygulaması, Controller, Model ve View entegrasyonu tamamlanmalıdır.",
        author: "Prof. Dr. Emre Akadal",
        category: "Academic",
        priority: "Medium",
      },
      {
        title: "Kütüphane Veritabanı ve Uzaktan Erişim Bakım Duyurusu",
        content:
          "Hafta sonu kütüphane dijital portalında planlı bakım çalışması yapılacaktır. Bilgilerinize sunulur.",
        author: "Bilgi İşlem Daire Başkanlığı",
        category: "General",
        priority: "Low",
      },
    ];

    const isoDate = now.toISOString();
    const formattedDate = now.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.announcements = seed.map((item, idx) => ({
      ...item,
      id: idx + 1,
      publishedAt: formattedDate,
      createdAt: isoDate,
      updatedAt: isoDate,
    }));
    this.currentId = this.announcements.length + 1;
  }

  /**
   * Tüm duyuruları opsiyonel filtreleme ile listeler (Read - All)
   */
  public findAll(query?: { category?: string; priority?: string; search?: string }): IAnnouncement[] {
    let result = [...this.announcements];

    if (query?.search) {
      const term = query.search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term) ||
          a.author.toLowerCase().includes(term)
      );
    }

    if (query?.category) {
      result = result.filter(
        (a) => a.category.toLowerCase() === query.category!.toLowerCase().trim()
      );
    }

    if (query?.priority) {
      result = result.filter(
        (a) => a.priority.toLowerCase() === query.priority!.toLowerCase().trim()
      );
    }

    return result;
  }

  /**
   * ID değerine göre tekil duyuru getirir (Read - One)
   */
  public findById(id: number): IAnnouncement | undefined {
    return this.announcements.find((a) => a.id === id);
  }

  /**
   * Yeni duyuru oluşturur (Create)
   */
  public create(data: CreateAnnouncementDTO): IAnnouncement {
    const now = new Date();
    const newAnnouncement: IAnnouncement = {
      id: this.currentId++,
      title: data.title.trim(),
      content: data.content.trim(),
      author: data.author.trim(),
      category: data.category || "General",
      priority: data.priority || "Medium",
      publishedAt: now.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.announcements.unshift(newAnnouncement); // Yeni duyuruyu başa ekle
    return newAnnouncement;
  }

  /**
   * Duyuruyu bütünsel olarak günceller (Update - PUT)
   */
  public replace(id: number, data: UpdateAnnouncementDTO): IAnnouncement | null {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = this.announcements[index];
    const updatedAnnouncement: IAnnouncement = {
      id,
      title: data.title.trim(),
      content: data.content.trim(),
      author: data.author.trim(),
      category: data.category,
      priority: data.priority,
      publishedAt: existing.publishedAt,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.announcements[index] = updatedAnnouncement;
    return updatedAnnouncement;
  }

  /**
   * Duyuruyu kısmi olarak günceller (Update - PATCH)
   */
  public patch(id: number, data: PatchAnnouncementDTO): IAnnouncement | null {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = this.announcements[index];
    const updatedAnnouncement: IAnnouncement = {
      ...existing,
      title: data.title !== undefined ? data.title.trim() : existing.title,
      content: data.content !== undefined ? data.content.trim() : existing.content,
      author: data.author !== undefined ? data.author.trim() : existing.author,
      category: data.category !== undefined ? data.category : existing.category,
      priority: data.priority !== undefined ? data.priority : existing.priority,
      updatedAt: new Date().toISOString(),
    };

    this.announcements[index] = updatedAnnouncement;
    return updatedAnnouncement;
  }

  /**
   * Duyuruyu siler (Delete)
   */
  public delete(id: number): IAnnouncement | null {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const [deleted] = this.announcements.splice(index, 1);
    return deleted;
  }

  /**
   * Duyuru sayısı
   */
  public count(): number {
    return this.announcements.length;
  }

  /**
   * Belleği sıfırlar
   */
  public reset(): void {
    this.seedDefaultAnnouncements();
  }
}

// Global Singleton Instance
export const announcementModel = new AnnouncementModel();
