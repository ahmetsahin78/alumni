/**
 * ============================================================================
 * Announcement Factory
 * ============================================================================
 * Test ve geliştirme ortamında kullanılmak üzere duyuru verileri üreten Factory.
 * ============================================================================
 */

import { AnnouncementCategory, AnnouncementPriority } from "@prisma/client";

export interface AnnouncementFactoryInput {
  title?: string;
  content?: string;
  author?: string;
  category?: AnnouncementCategory;
  priority?: AnnouncementPriority;
  publishedAt?: Date;
}

const SAMPLE_ANNOUNCEMENTS = [
  {
    title: "2026 Mezunlar Buluşması ve Kariyer Günü",
    content: "Tüm mezunlarımız ve son sınıf öğrencilerimiz için geleneksel Beyazıt Kampüsü Mezunlar Buluşması 15 Mayıs'ta gerçekleşecektir. Kayıt yaptırmayı unutmayınız.",
    author: "Mezunlar Ofisi Koordinatörlüğü",
    category: AnnouncementCategory.EVENT,
    priority: AnnouncementPriority.HIGH,
  },
  {
    title: "Google & Microsoft Mentorluk Programı Başvuruları Başladı",
    content: "Sektörde çalışan deneyimli mezunlarımız ile öğrencilerimizi buluşturan 6 aylık mentorluk programı başvuruları açılmıştır.",
    author: "Kariyer Geliştirme Merkezi",
    category: AnnouncementCategory.CAREER,
    priority: AnnouncementPriority.HIGH,
  },
  {
    title: "Web Programlama Dersi Veritabanı Kalıcılığı Proje Teslimleri",
    content: "Docker Compose, PostgreSQL kalıcı hacmi ve Prisma ORM migration adımları eksiksiz tamamlanmalıdır.",
    author: "Prof. Dr. Emre Akadal",
    category: AnnouncementCategory.ACADEMIC,
    priority: AnnouncementPriority.MEDIUM,
  },
  {
    title: "Kütüphane Veritabanı ve Uzaktan Erişim Bakım Duyurusu",
    content: "Hafta sonu kütüphane dijital portalında planlı bakım çalışması yapılacaktır. Bilgilerinize sunulur.",
    author: "Bilgi İşlem Daire Başkanlığı",
    category: AnnouncementCategory.GENERAL,
    priority: AnnouncementPriority.LOW,
  },
  {
    title: "FinTech Hackathonu 2026 Başvuruları Açıldı",
    content: "Öğrenci ve mezun takımlarının katılımına açık 50.000 TL ödüllü inovasyon hackathonu için başvurular devam ediyor.",
    author: "Girişimcilik Kulübü",
    category: AnnouncementCategory.CAREER,
    priority: AnnouncementPriority.MEDIUM,
  },
  {
    title: "Acil: Kampüs İçi Ulaşım Güzergah Değişikliği",
    content: "Metro hattı entegrasyon çalışmaları nedeniyle ana kapı servis kalkış noktası geçici olarak rektörlük otoparkına alınmıştır.",
    author: "Güvenlik ve İdari İşler",
    category: AnnouncementCategory.URGENT,
    priority: AnnouncementPriority.HIGH,
  },
];

export class AnnouncementFactory {
  public static build(overrides: AnnouncementFactoryInput = {}): Required<AnnouncementFactoryInput> {
    const template = SAMPLE_ANNOUNCEMENTS[Math.floor(Math.random() * SAMPLE_ANNOUNCEMENTS.length)];

    return {
      title: overrides.title || template.title,
      content: overrides.content || template.content,
      author: overrides.author || template.author,
      category: overrides.category || template.category,
      priority: overrides.priority || template.priority,
      publishedAt: overrides.publishedAt || new Date(),
    };
  }

  public static buildMany(count: number, overrides: AnnouncementFactoryInput = {}): Required<AnnouncementFactoryInput>[] {
    const list: Required<AnnouncementFactoryInput>[] = [];
    for (let i = 0; i < count; i++) {
      const template = SAMPLE_ANNOUNCEMENTS[i % SAMPLE_ANNOUNCEMENTS.length];
      list.push({
        title: overrides.title ? `${overrides.title} #${i + 1}` : template.title,
        content: overrides.content || template.content,
        author: overrides.author || template.author,
        category: overrides.category || template.category,
        priority: overrides.priority || template.priority,
        publishedAt: overrides.publishedAt || new Date(),
      });
    }
    return list;
  }
}

