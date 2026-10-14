/**
 * ============================================================================
 * User Factory
 * ============================================================================
 * Test ve geliştirme ortamında kullanılmak üzere gerçekçi/rastgele
 * kullanıcı ve mezun verileri üreten Factory yapısı.
 * ============================================================================
 */

import { Role } from "@prisma/client";

export interface UserFactoryInput {
  name?: string;
  email?: string;
  role?: Role;
  graduationYear?: number;
  department?: string;
  company?: string;
  isVerified?: boolean;
  avatarUrl?: string;
  passwordHash?: string;
}

const FIRST_NAMES = [
  "Ahmet", "Mehmet", "Elif", "Zeynep", "Can", "Burak", "Ayşe", "Fatma",
  "Mustafa", "Emre", "Selin", "Deniz", "Murat", "Büşra", "Cem", "Ece",
  "Oğuz", "Gülşen", "Kerem", "Hande", "Tarık", "İrem", "Kaan", "Ezgi"
];

const LAST_NAMES = [
  "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk",
  "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara",
  "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Özcan", "Korkmaz", "Erdoğan"
];

const DEPARTMENTS = [
  "Bilgisayar Mühendisliği",
  "Yazılım Mühendisliği",
  "Endüstri Mühendisliği",
  "Elektrik-Elektronik Mühendisliği",
  "İktisat",
  "İşletme",
  "Yönetim Bilişim Sistemleri",
  "Hukuk",
  "İletişim",
  "Tıp"
];

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Trendyol", "Getir", "Hepsiburada",
  "FinScale", "Garanti BBVA", "Turkcell", "Aselsan", "Baykar", "Siemens",
  "TÜBİTAK", "İstanbul Üniversitesi", "Vodafone", "Beko Global"
];

export class UserFactory {
  /**
   * Tekil gerçekçi kullanıcı verisi üretir
   */
  public static build(overrides: UserFactoryInput = {}): Required<UserFactoryInput> {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const fullName = overrides.name || `${firstName} ${lastName}`;
    
    const randomSlug = Math.random().toString(36).substring(2, 7);
    const cleanEmail = overrides.email || 
      `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}.${randomSlug}@istanbul.edu.tr`;

    const randomYear = overrides.graduationYear || Math.floor(Math.random() * (2025 - 2005 + 1)) + 2005;
    const randomDept = overrides.department || DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const randomCompany = overrides.company || COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
    const randomRole = overrides.role || (Math.random() > 0.3 ? Role.ALUMNI : Role.STUDENT);

    return {
      name: fullName,
      email: cleanEmail,
      role: randomRole,
      graduationYear: randomYear,
      department: randomDept,
      company: randomCompany,
      isVerified: overrides.isVerified ?? true,
      avatarUrl: overrides.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      passwordHash: overrides.passwordHash || "$2a$10$wT0dYwWfx9.pZ5pD7QhL1.K5nK2O5m3z9ZJ8YnU.k5a8wYy.nB1e.", // "Password123!"
    };
  }

  /**
   * Belirtilen adet kadar gerçekçi kullanıcı listesi üretir
   */
  public static buildMany(count: number, overrides: UserFactoryInput | UserFactoryInput[] = {}): Required<UserFactoryInput>[] {
    const list: Required<UserFactoryInput>[] = [];
    for (let i = 0; i < count; i++) {
      list.push(this.build(Array.isArray(overrides) ? (overrides[i] || {}) : overrides));
    }
    return list;
  }
}
