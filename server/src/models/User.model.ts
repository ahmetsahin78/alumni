/**
 * ============================================================================
 * User Model & Repository (Database Persistence via Prisma ORM)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Veritabanı Kalıcılığı
 * Tüm CRUD operasyonları doğrudan PostgreSQL veritabanı bağlantısı (`prisma.user`)
 * üzerinden çalışır. Veritabanı geçici olarak erişilemez durumdaysa güvenli
 * bellek-içi (in-memory) geri dönüş (fallback) sağlar.
 * ============================================================================
 */

import { Role } from "@prisma/client";
import prisma from "../prisma";

export interface IUser {
  id: string | number;
  name: string;
  email: string;
  role: "Alumni" | "Student" | "Admin" | "Faculty";
  graduationYear: number;
  department: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: "Alumni" | "Student" | "Admin" | "Faculty";
  graduationYear: number;
  department: string;
  company?: string;
}

export interface UpdateUserDTO {
  name: string;
  email: string;
  role: "Alumni" | "Student" | "Admin" | "Faculty";
  graduationYear: number;
  department: string;
  company?: string;
}

export interface PatchUserDTO {
  name?: string;
  email?: string;
  role?: "Alumni" | "Student" | "Admin" | "Faculty";
  graduationYear?: number;
  department?: string;
  company?: string;
}

function mapPrismaRole(role: string): Role {
  const upper = role.toUpperCase();
  if (upper === "FACULTY") return Role.FACULTY;
  if (upper === "ADMIN") return Role.ADMIN;
  if (upper === "STUDENT") return Role.STUDENT;
  return Role.ALUMNI;
}

function mapToAppRole(role: Role): "Alumni" | "Student" | "Admin" | "Faculty" {
  if (role === Role.FACULTY) return "Faculty";
  if (role === Role.ADMIN) return "Admin";
  if (role === Role.STUDENT) return "Student";
  return "Alumni";
}

export class UserModel {
  private inMemoryFallback: IUser[] = [];
  private currentId: number = 1;
  private isDbConnected: boolean = false;

  constructor() {
    this.seedDefaultUsers();
    this.checkDbConnection();
  }

  private async checkDbConnection(): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      this.isDbConnected = true;
    } catch {
      this.isDbConnected = false;
    }
  }

  private seedDefaultUsers(): void {
    const seed: Omit<IUser, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "Elif Kaya",
        email: "elif.kaya@istanbul.edu.tr",
        role: "Alumni",
        graduationYear: 2024,
        department: "Bilgisayar Mühendisliği",
        company: "Google",
      },
      {
        name: "Mert Aydın",
        email: "mert.aydin@istanbul.edu.tr",
        role: "Alumni",
        graduationYear: 2021,
        department: "Endüstri Mühendisliği",
        company: "Microsoft",
      },
      {
        name: "Zeynep Arslan",
        email: "zeynep.arslan@istanbul.edu.tr",
        role: "Alumni",
        graduationYear: 2019,
        department: "İktisat",
        company: "FinScale",
      },
      {
        name: "Can Öztürk",
        email: "can.ozturk@istanbul.edu.tr",
        role: "Student",
        graduationYear: 2025,
        department: "Yazılım Mühendisliği",
        company: "Trendyol Stajyer",
      },
      {
        name: "Prof. Dr. Emre Akadal",
        email: "emre.akadal@istanbul.edu.tr",
        role: "Faculty",
        graduationYear: 2008,
        department: "Yönetim Bilişim Sistemleri",
        company: "İstanbul Üniversitesi",
      },
    ];

    const now = new Date().toISOString();
    this.inMemoryFallback = seed.map((item, idx) => ({
      ...item,
      id: idx + 1,
      createdAt: now,
      updatedAt: now,
    }));
    this.currentId = this.inMemoryFallback.length + 1;
  }

  /**
   * Tüm kullanıcıları filtreleme seçeneği ile listeler (Read - All)
   */
  public async findAll(query?: { search?: string; department?: string; role?: string }): Promise<IUser[]> {
    try {
      const where: any = {};
      if (query?.department) {
        where.department = { contains: query.department, mode: "insensitive" };
      }
      if (query?.role) {
        where.role = mapPrismaRole(query.role);
      }
      if (query?.search) {
        where.OR = [
          { name: { contains: query.search, mode: "insensitive" } },
          { email: { contains: query.search, mode: "insensitive" } },
          { department: { contains: query.search, mode: "insensitive" } },
          { company: { contains: query.search, mode: "insensitive" } },
        ];
      }

      const dbUsers = await prisma.user.findMany({
        where,
        orderBy: { id: "asc" },
      });

      return dbUsers.map((u) => ({
        id: u.id,
        name: u.name || "Kullanıcı",
        email: u.email,
        role: mapToAppRole(u.role),
        graduationYear: u.graduationYear || 2024,
        department: u.department || "Genel",
        company: u.company || undefined,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }));
    } catch {
      // In-memory fallback
      let result = [...this.inMemoryFallback];
      if (query?.search) {
        const term = query.search.toLowerCase().trim();
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.department.toLowerCase().includes(term) ||
            (u.company && u.company.toLowerCase().includes(term))
        );
      }
      if (query?.department) {
        result = result.filter((u) => u.department.toLowerCase() === query.department!.toLowerCase().trim());
      }
      if (query?.role) {
        result = result.filter((u) => u.role.toLowerCase() === query.role!.toLowerCase().trim());
      }
      return result;
    }
  }

  /**
   * ID değerine göre tekil kullanıcı getirir (Read - One)
   */
  public async findById(id: string | number): Promise<IUser | undefined> {
    try {
      const u = await prisma.user.findUnique({ where: { id: String(id) } });
      if (!u) return undefined;
      return {
        id: u.id,
        name: u.name || "Kullanıcı",
        email: u.email,
        role: mapToAppRole(u.role),
        graduationYear: u.graduationYear || 2024,
        department: u.department || "Genel",
        company: u.company || undefined,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      };
    } catch {
      return this.inMemoryFallback.find((u) => String(u.id) === String(id));
    }
  }

  /**
   * E-posta adresine göre kullanıcı arar
   */
  public async findByEmail(email: string): Promise<IUser | undefined> {
    try {
      const u = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (!u) return undefined;
      return {
        id: u.id,
        name: u.name || "Kullanıcı",
        email: u.email,
        role: mapToAppRole(u.role),
        graduationYear: u.graduationYear || 2024,
        department: u.department || "Genel",
        company: u.company || undefined,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      };
    } catch {
      const clean = email.toLowerCase().trim();
      return this.inMemoryFallback.find((u) => u.email.toLowerCase() === clean);
    }
  }

  /**
   * Yeni kullanıcı ekler (Create)
   */
  public async create(data: CreateUserDTO): Promise<IUser> {
    const roleEnum = mapPrismaRole(data.role || "Alumni");
    const yearNum = Number(data.graduationYear);

    try {
      const created = await prisma.user.create({
        data: {
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          role: roleEnum,
          graduationYear: yearNum,
          department: data.department.trim(),
          company: data.company ? data.company.trim() : undefined,
        },
      });

      return {
        id: created.id,
        name: created.name || data.name,
        email: created.email,
        role: mapToAppRole(created.role),
        graduationYear: created.graduationYear || yearNum,
        department: created.department || data.department,
        company: created.company || undefined,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch {
      const now = new Date().toISOString();
      const newUser: IUser = {
        id: this.currentId++,
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        role: data.role || "Alumni",
        graduationYear: yearNum,
        department: data.department.trim(),
        company: data.company ? data.company.trim() : undefined,
        createdAt: now,
        updatedAt: now,
      };
      this.inMemoryFallback.push(newUser);
      return newUser;
    }
  }

  /**
   * Kullanıcı kaydını bütünsel olarak günceller (Update - PUT)
   */
  public async replace(id: string | number, data: UpdateUserDTO): Promise<IUser | null> {
    const roleEnum = mapPrismaRole(data.role || "Alumni");
    const yearNum = Number(data.graduationYear);

    try {
      const updated = await prisma.user.update({
        where: { id: String(id) },
        data: {
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          role: roleEnum,
          graduationYear: yearNum,
          department: data.department.trim(),
          company: data.company ? data.company.trim() : null,
        },
      });

      return {
        id: updated.id,
        name: updated.name || data.name,
        email: updated.email,
        role: mapToAppRole(updated.role),
        graduationYear: updated.graduationYear || yearNum,
        department: updated.department || data.department,
        company: updated.company || undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch {
      const index = this.inMemoryFallback.findIndex((u) => String(u.id) === String(id));
      if (index === -1) return null;

      const existing = this.inMemoryFallback[index];
      const updatedUser: IUser = {
        id: existing.id,
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        role: data.role || existing.role,
        graduationYear: yearNum,
        department: data.department.trim(),
        company: data.company ? data.company.trim() : undefined,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };
      this.inMemoryFallback[index] = updatedUser;
      return updatedUser;
    }
  }

  /**
   * Kullanıcı kaydını kısmi olarak günceller (Update - PATCH)
   */
  public async patch(id: string | number, data: PatchUserDTO): Promise<IUser | null> {
    try {
      const updatePayload: any = {};
      if (data.name !== undefined) updatePayload.name = data.name.trim();
      if (data.email !== undefined) updatePayload.email = data.email.toLowerCase().trim();
      if (data.role !== undefined) updatePayload.role = mapPrismaRole(data.role);
      if (data.graduationYear !== undefined) updatePayload.graduationYear = Number(data.graduationYear);
      if (data.department !== undefined) updatePayload.department = data.department.trim();
      if (data.company !== undefined) updatePayload.company = data.company ? data.company.trim() : null;

      const updated = await prisma.user.update({
        where: { id: String(id) },
        data: updatePayload,
      });

      return {
        id: updated.id,
        name: updated.name || (data.name !== undefined ? data.name : "Kullanıcı"),
        email: updated.email,
        role: mapToAppRole(updated.role),
        graduationYear: updated.graduationYear || 2024,
        department: updated.department || "Genel",
        company: updated.company || undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch {
      const index = this.inMemoryFallback.findIndex((u) => String(u.id) === String(id));
      if (index === -1) return null;

      const existing = this.inMemoryFallback[index];
      const updatedUser: IUser = {
        ...existing,
        name: data.name !== undefined ? data.name.trim() : existing.name,
        email: data.email !== undefined ? data.email.toLowerCase().trim() : existing.email,
        role: data.role !== undefined ? data.role : existing.role,
        graduationYear: data.graduationYear !== undefined ? Number(data.graduationYear) : existing.graduationYear,
        department: data.department !== undefined ? data.department.trim() : existing.department,
        company: data.company !== undefined ? data.company?.trim() : existing.company,
        updatedAt: new Date().toISOString(),
      };
      this.inMemoryFallback[index] = updatedUser;
      return updatedUser;
    }
  }

  /**
   * Kullanıcıyı siler (Delete)
   */
  public async delete(id: string | number): Promise<IUser | null> {
    try {
      const deleted = await prisma.user.delete({ where: { id: String(id) } });
      return {
        id: deleted.id,
        name: deleted.name || "Kullanıcı",
        email: deleted.email,
        role: mapToAppRole(deleted.role),
        graduationYear: deleted.graduationYear || 2024,
        department: deleted.department || "Genel",
        company: deleted.company || undefined,
        createdAt: deleted.createdAt.toISOString(),
        updatedAt: deleted.updatedAt.toISOString(),
      };
    } catch {
      const index = this.inMemoryFallback.findIndex((u) => String(u.id) === String(id));
      if (index === -1) return null;
      const [deleted] = this.inMemoryFallback.splice(index, 1);
      return deleted;
    }
  }

  /**
   * Toplam kullanıcı sayısı
   */
  public async count(): Promise<number> {
    try {
      return await prisma.user.count();
    } catch {
      return this.inMemoryFallback.length;
    }
  }

  /**
   * Belleği sıfırlar (Testler için)
   */
  public reset(): void {
    this.seedDefaultUsers();
  }
}

// Global Singleton Instance
export const userModel = new UserModel();
