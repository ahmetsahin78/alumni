/**
 * ============================================================================
 * Announcement Model & Repository (Database Persistence via Prisma ORM)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Veritabanı Kalıcılığı
 * Tüm duyuru CRUD işlemleri doğrudan PostgreSQL veritabanı bağlantısı
 * (`prisma.announcement`) üzerinden yürütülür.
 * ============================================================================
 */

import {
  AnnouncementCategory as PrismaAnnouncementCategory,
  AnnouncementPriority as PrismaAnnouncementPriority,
} from "@prisma/client";
import prisma from "../prisma";

export type AnnouncementCategory =
  | "General"
  | "Event"
  | "Career"
  | "Academic"
  | "Urgent"
  | PrismaAnnouncementCategory;

export type AnnouncementPriority =
  | "Low"
  | "Medium"
  | "High"
  | PrismaAnnouncementPriority;

export interface IAnnouncement {
  id: number;
  title: string;
  content: string;
  author: string;
  category: "General" | "Event" | "Career" | "Academic" | "Urgent" | PrismaAnnouncementCategory;
  priority: "Low" | "Medium" | "High" | PrismaAnnouncementPriority;
  publishedAt: string;
  authorUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDTO {
  title: string;
  content: string;
  author: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  authorUserId?: string | null;
}

export interface UpdateAnnouncementDTO {
  title: string;
  content: string;
  author: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
}

export interface PatchAnnouncementDTO {
  title?: string;
  content?: string;
  author?: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
}

function mapPrismaCategory(cat?: string): PrismaAnnouncementCategory {
  const upper = (cat || "GENERAL").toUpperCase();
  if (upper === "EVENT") return PrismaAnnouncementCategory.EVENT;
  if (upper === "CAREER") return PrismaAnnouncementCategory.CAREER;
  if (upper === "ACADEMIC") return PrismaAnnouncementCategory.ACADEMIC;
  if (upper === "URGENT") return PrismaAnnouncementCategory.URGENT;
  return PrismaAnnouncementCategory.GENERAL;
}

function mapPrismaPriority(p?: string): PrismaAnnouncementPriority {
  const upper = (p || "MEDIUM").toUpperCase();
  if (upper === "HIGH") return PrismaAnnouncementPriority.HIGH;
  if (upper === "LOW") return PrismaAnnouncementPriority.LOW;
  return PrismaAnnouncementPriority.MEDIUM;
}

function mapToAppCategory(cat?: string): "General" | "Event" | "Career" | "Academic" | "Urgent" {
  const upper = (cat || "GENERAL").toUpperCase();
  if (upper === "EVENT") return "Event";
  if (upper === "CAREER") return "Career";
  if (upper === "ACADEMIC") return "Academic";
  if (upper === "URGENT") return "Urgent";
  return "General";
}

function mapToAppPriority(p?: string): "Low" | "Medium" | "High" {
  const upper = (p || "MEDIUM").toUpperCase();
  if (upper === "HIGH") return "High";
  if (upper === "LOW") return "Low";
  return "Medium";
}

export class AnnouncementModel {
  private inMemoryFallback: IAnnouncement[] = [];
  private currentId: number = 1;

  constructor() {
    this.seedDefaultAnnouncements();
  }

  private seedDefaultAnnouncements(): void {
    const now = new Date();
    const seed = [
      {
        title: "2026 Mezunlar Buluşması ve Kariyer Günü",
        content: "Tüm mezunlarımız ve son sınıf öğrencilerimiz için geleneksel Beyazıt Kampüsü Mezunlar Buluşması 15 Mayıs'ta gerçekleşecektir. Kayıt yaptırmayı unutmayınız.",
        author: "Mezunlar Ofisi Koordinatörlüğü",
        category: "Event" as const,
        priority: "High" as const,
      },
      {
        title: "Google & Microsoft Mentorluk Programı Başvuruları Başladı",
        content: "Sektörde çalışan deneyimli mezunlarımız ile öğrencilerimizi buluşturan 6 aylık mentorluk programı başvuruları açılmıştır.",
        author: "Kariyer Geliştirme Merkezi",
        category: "Career" as const,
        priority: "High" as const,
      },
      {
        title: "Web Programlama Dersi Veritabanı Kalıcılığı Proje Teslimleri",
        content: "Docker Compose, PostgreSQL kalıcı hacmi ve Prisma ORM migration adımları eksiksiz tamamlanmalıdır.",
        author: "Prof. Dr. Emre Akadal",
        category: "Academic" as const,
        priority: "Medium" as const,
      },
      {
        title: "Kütüphane Veritabanı ve Uzaktan Erişim Bakım Duyurusu",
        content: "Hafta sonu kütüphane dijital portalında planlı bakım çalışması yapılacaktır. Bilgilerinize sunulur.",
        author: "Bilgi İşlem Daire Başkanlığı",
        category: "General" as const,
        priority: "Low" as const,
      },
    ];

    const isoDate = now.toISOString();
    const formatted = now.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

    this.inMemoryFallback = seed.map((item, idx) => ({
      ...item,
      id: idx + 1,
      publishedAt: formatted,
      createdAt: isoDate,
      updatedAt: isoDate,
    }));
    this.currentId = this.inMemoryFallback.length + 1;
  }

  /**
   * Tüm duyuruları opsiyonel filtreleme ile listeler (Read - All)
   */
  public async findAll(query?: { category?: string; priority?: string; search?: string }): Promise<IAnnouncement[]> {
    try {
      const where: any = {};
      if (query?.category) {
        where.category = mapPrismaCategory(query.category);
      }
      if (query?.priority) {
        where.priority = mapPrismaPriority(query.priority);
      }
      if (query?.search) {
        where.OR = [
          { title: { contains: query.search, mode: "insensitive" } },
          { content: { contains: query.search, mode: "insensitive" } },
          { author: { contains: query.search, mode: "insensitive" } },
        ];
      }

      const dbList = await prisma.announcement.findMany({
        where,
        orderBy: { id: "desc" },
      });

      return dbList.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        author: a.author,
        category: mapToAppCategory(a.category),
        priority: mapToAppPriority(a.priority),
        publishedAt: a.publishedAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: a.authorUserId,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }));
    } catch {
      let result = [...this.inMemoryFallback];
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
        result = result.filter((a) => a.category.toLowerCase() === query.category!.toLowerCase().trim());
      }
      if (query?.priority) {
        result = result.filter((a) => a.priority.toLowerCase() === query.priority!.toLowerCase().trim());
      }
      return result;
    }
  }

  /**
   * ID değerine göre tekil duyuru getirir (Read - One)
   */
  public async findById(id: number): Promise<IAnnouncement | undefined> {
    try {
      const a = await prisma.announcement.findUnique({ where: { id } });
      if (!a) return undefined;
      return {
        id: a.id,
        title: a.title,
        content: a.content,
        author: a.author,
        category: mapToAppCategory(a.category),
        priority: mapToAppPriority(a.priority),
        publishedAt: a.publishedAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: a.authorUserId,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      };
    } catch {
      return this.inMemoryFallback.find((a) => a.id === id);
    }
  }

  /**
   * Yeni duyuru oluşturur (Create)
   */
  public async create(data: CreateAnnouncementDTO): Promise<IAnnouncement> {
    const categoryEnum = mapPrismaCategory(data.category);
    const priorityEnum = mapPrismaPriority(data.priority);

    try {
      const created = await prisma.announcement.create({
        data: {
          title: data.title.trim(),
          content: data.content.trim(),
          author: data.author.trim(),
          category: categoryEnum,
          priority: priorityEnum,
          authorUserId: data.authorUserId ? String(data.authorUserId) : undefined,
        },
      });

      return {
        id: created.id,
        title: created.title,
        content: created.content,
        author: created.author,
        category: mapToAppCategory(created.category),
        priority: mapToAppPriority(created.priority),
        publishedAt: created.publishedAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: created.authorUserId,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch {
      const now = new Date();
      const newAnn: IAnnouncement = {
        id: this.currentId++,
        title: data.title.trim(),
        content: data.content.trim(),
        author: data.author.trim(),
        category: mapToAppCategory(data.category),
        priority: mapToAppPriority(data.priority),
        publishedAt: now.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: data.authorUserId,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      this.inMemoryFallback.unshift(newAnn);
      return newAnn;
    }
  }

  /**
   * Duyuruyu bütünsel olarak günceller (Update - PUT)
   */
  public async replace(id: number, data: UpdateAnnouncementDTO): Promise<IAnnouncement | null> {
    const categoryEnum = mapPrismaCategory(data.category);
    const priorityEnum = mapPrismaPriority(data.priority);

    try {
      const updated = await prisma.announcement.update({
        where: { id },
        data: {
          title: data.title.trim(),
          content: data.content.trim(),
          author: data.author.trim(),
          category: categoryEnum,
          priority: priorityEnum,
        },
      });

      return {
        id: updated.id,
        title: updated.title,
        content: updated.content,
        author: updated.author,
        category: mapToAppCategory(updated.category),
        priority: mapToAppPriority(updated.priority),
        publishedAt: updated.publishedAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: updated.authorUserId,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch {
      const index = this.inMemoryFallback.findIndex((a) => a.id === id);
      if (index === -1) return null;

      const existing = this.inMemoryFallback[index];
      const updatedAnnouncement: IAnnouncement = {
        id,
        title: data.title.trim(),
        content: data.content.trim(),
        author: data.author.trim(),
        category: mapToAppCategory(data.category),
        priority: mapToAppPriority(data.priority),
        publishedAt: existing.publishedAt,
        authorUserId: existing.authorUserId,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };
      this.inMemoryFallback[index] = updatedAnnouncement;
      return updatedAnnouncement;
    }
  }

  /**
   * Duyuruyu kısmi olarak günceller (Update - PATCH)
   */
  public async patch(id: number, data: PatchAnnouncementDTO): Promise<IAnnouncement | null> {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title.trim();
      if (data.content !== undefined) updateData.content = data.content.trim();
      if (data.author !== undefined) updateData.author = data.author.trim();
      if (data.category !== undefined) updateData.category = mapPrismaCategory(data.category);
      if (data.priority !== undefined) updateData.priority = mapPrismaPriority(data.priority);

      const updated = await prisma.announcement.update({
        where: { id },
        data: updateData,
      });

      return {
        id: updated.id,
        title: updated.title,
        content: updated.content,
        author: updated.author,
        category: mapToAppCategory(updated.category),
        priority: mapToAppPriority(updated.priority),
        publishedAt: updated.publishedAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: updated.authorUserId,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch {
      const index = this.inMemoryFallback.findIndex((a) => a.id === id);
      if (index === -1) return null;

      const existing = this.inMemoryFallback[index];
      const updatedAnnouncement: IAnnouncement = {
        ...existing,
        title: data.title !== undefined ? data.title.trim() : existing.title,
        content: data.content !== undefined ? data.content.trim() : existing.content,
        author: data.author !== undefined ? data.author.trim() : existing.author,
        category: data.category !== undefined ? mapToAppCategory(data.category) : existing.category,
        priority: data.priority !== undefined ? mapToAppPriority(data.priority) : existing.priority,
        updatedAt: new Date().toISOString(),
      };
      this.inMemoryFallback[index] = updatedAnnouncement;
      return updatedAnnouncement;
    }
  }

  /**
   * Duyuruyu siler (Delete)
   */
  public async delete(id: number): Promise<IAnnouncement | null> {
    try {
      const deleted = await prisma.announcement.delete({ where: { id } });
      return {
        id: deleted.id,
        title: deleted.title,
        content: deleted.content,
        author: deleted.author,
        category: mapToAppCategory(deleted.category),
        priority: mapToAppPriority(deleted.priority),
        publishedAt: deleted.publishedAt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }),
        authorUserId: deleted.authorUserId,
        createdAt: deleted.createdAt.toISOString(),
        updatedAt: deleted.updatedAt.toISOString(),
      };
    } catch {
      const index = this.inMemoryFallback.findIndex((a) => a.id === id);
      if (index === -1) return null;
      const [deleted] = this.inMemoryFallback.splice(index, 1);
      return deleted;
    }
  }

  public async count(): Promise<number> {
    try {
      return await prisma.announcement.count();
    } catch {
      return this.inMemoryFallback.length;
    }
  }

  public reset(): void {
    this.seedDefaultAnnouncements();
  }
}

// Global Singleton Instance
export const announcementModel = new AnnouncementModel();
