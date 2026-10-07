/**
 * ============================================================================
 * User Model (In-Memory / Database-Free)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: MVC Mimarisi
 * Kural: Henüz veritabanı bağlantısı KULLANILMAYACAK ("without database yet").
 * Tüm veri yönetimi bellek içinde (in-memory) tip güvenli olarak yürütülür.
 * ============================================================================
 */

export interface IUser {
  id: number;
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

export class UserModel {
  private users: IUser[] = [];
  private currentId: number = 1;

  constructor() {
    this.seedDefaultUsers();
  }

  /**
   * Varsayılan başlangıç verilerini yükler
   */
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
    this.users = seed.map((item, idx) => ({
      ...item,
      id: idx + 1,
      createdAt: now,
      updatedAt: now,
    }));
    this.currentId = this.users.length + 1;
  }

  /**
   * Tüm kullanıcıları filtreleme seçeneği ile listeler (Read - All)
   */
  public findAll(query?: { search?: string; department?: string; role?: string }): IUser[] {
    let result = [...this.users];

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
      const dept = query.department.toLowerCase().trim();
      result = result.filter((u) => u.department.toLowerCase() === dept);
    }

    if (query?.role) {
      result = result.filter((u) => u.role.toLowerCase() === query.role!.toLowerCase());
    }

    return result;
  }

  /**
   * ID değerine göre tekil kullanıcı getirir (Read - One)
   */
  public findById(id: number): IUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  /**
   * E-posta adresine göre kullanıcı arar
   */
  public findByEmail(email: string): IUser | undefined {
    const cleanEmail = email.toLowerCase().trim();
    return this.users.find((u) => u.email.toLowerCase() === cleanEmail);
  }

  /**
   * Yeni kullanıcı ekler (Create)
   */
  public create(data: CreateUserDTO): IUser {
    const now = new Date().toISOString();
    const newUser: IUser = {
      id: this.currentId++,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      role: data.role || "Alumni",
      graduationYear: Number(data.graduationYear),
      department: data.department.trim(),
      company: data.company ? data.company.trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Kullanıcı kaydını bütünsel olarak günceller (Update - PUT)
   */
  public replace(id: number, data: UpdateUserDTO): IUser | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const existing = this.users[index];
    const updatedUser: IUser = {
      id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      role: data.role || existing.role,
      graduationYear: Number(data.graduationYear),
      department: data.department.trim(),
      company: data.company ? data.company.trim() : undefined,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * Kullanıcı kaydını kısmi olarak günceller (Update - PATCH)
   */
  public patch(id: number, data: PatchUserDTO): IUser | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const existing = this.users[index];
    const updatedUser: IUser = {
      ...existing,
      name: data.name !== undefined ? data.name.trim() : existing.name,
      email: data.email !== undefined ? data.email.toLowerCase().trim() : existing.email,
      role: data.role !== undefined ? data.role : existing.role,
      graduationYear:
        data.graduationYear !== undefined ? Number(data.graduationYear) : existing.graduationYear,
      department: data.department !== undefined ? data.department.trim() : existing.department,
      company: data.company !== undefined ? data.company?.trim() : existing.company,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * Kullanıcıyı siler (Delete)
   */
  public delete(id: number): IUser | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const [deleted] = this.users.splice(index, 1);
    return deleted;
  }

  /**
   * Toplam kayıt sayısı
   */
  public count(): number {
    return this.users.length;
  }

  /**
   * Belleği sıfırlar ve varsayılan test verilerine döner
   */
  public reset(): void {
    this.seedDefaultUsers();
  }
}

// Global Singleton Instance
export const userModel = new UserModel();
