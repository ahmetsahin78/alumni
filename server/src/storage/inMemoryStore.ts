import { AlumniMember, CreateAlumniDTO, UpdateAlumniDTO, PatchAlumniDTO } from "../types/alumni.types";

/**
 * In-Memory Data Store for Alumni Management
 * Complies with lecture requirement: "don't use any database yet"
 */
export class InMemoryAlumniStore {
  private records: AlumniMember[];
  private autoIncrementId: number;

  constructor() {
    // Initial Seed Data directly matching the lecture slides (Assoc. Prof. Dr. Emre Akadal - Week 03)
    this.records = [
      {
        id: 1,
        name: "Elif Kaya",
        graduationYear: 2024,
        department: "Bilgisayar Mühendisliği",
        company: "Google",
        email: "elif.kaya@alumni.edu",
        role: "Software Engineer",
      },
      {
        id: 2,
        name: "Mert Aydın",
        graduationYear: 2021,
        department: "Endüstri Mühendisliği",
        company: "Microsoft",
        email: "mert.aydin@alumni.edu",
        role: "Product Manager",
      },
      {
        id: 3,
        name: "Zeynep Arslan",
        graduationYear: 2019,
        department: "İktisat",
        company: "FinScale",
        email: "zeynep.arslan@alumni.edu",
        role: "Lead Analyst",
      },
      {
        id: 4,
        name: "Can Öztürk",
        graduationYear: 2023,
        department: "Yazılım Mühendisliği",
        company: "Trendyol",
        email: "can.ozturk@alumni.edu",
        role: "Frontend Developer",
      },
    ];
    this.autoIncrementId = 5;
  }

  /**
   * Return all alumni records
   */
  public getAll(): AlumniMember[] {
    return [...this.records];
  }

  /**
   * Find a single record by ID
   */
  public getById(id: number): AlumniMember | undefined {
    return this.records.find((item) => item.id === id);
  }

  /**
   * Add a new alumni record (POST)
   */
  public add(dto: CreateAlumniDTO): AlumniMember {
    const newEntry: AlumniMember = {
      id: this.autoIncrementId++,
      name: dto.name.trim(),
      graduationYear: Number(dto.graduationYear),
      ...(dto.department ? { department: dto.department.trim() } : {}),
      ...(dto.company ? { company: dto.company.trim() } : {}),
      ...(dto.email ? { email: dto.email.trim() } : {}),
      ...(dto.role ? { role: dto.role.trim() } : {}),
    };

    this.records.push(newEntry);
    return newEntry;
  }

  /**
   * Full update (PUT) - replaces entire record
   */
  public replace(id: number, dto: UpdateAlumniDTO): AlumniMember | null {
    const targetIndex = this.records.findIndex((item) => item.id === id);
    if (targetIndex === -1) {
      return null;
    }

    const replacedEntry: AlumniMember = {
      id,
      name: dto.name.trim(),
      graduationYear: Number(dto.graduationYear),
      department: dto.department ? dto.department.trim() : undefined,
      company: dto.company ? dto.company.trim() : undefined,
      email: dto.email ? dto.email.trim() : undefined,
      role: dto.role ? dto.role.trim() : undefined,
    };

    this.records[targetIndex] = replacedEntry;
    return replacedEntry;
  }

  /**
   * Partial update (PATCH) - modifies only specified fields
   */
  public patch(id: number, dto: PatchAlumniDTO): AlumniMember | null {
    const targetIndex = this.records.findIndex((item) => item.id === id);
    if (targetIndex === -1) {
      return null;
    }

    const current = this.records[targetIndex];
    const updatedEntry: AlumniMember = {
      ...current,
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.graduationYear !== undefined ? { graduationYear: Number(dto.graduationYear) } : {}),
      ...(dto.department !== undefined ? { department: dto.department?.trim() } : {}),
      ...(dto.company !== undefined ? { company: dto.company?.trim() } : {}),
      ...(dto.email !== undefined ? { email: dto.email?.trim() } : {}),
      ...(dto.role !== undefined ? { role: dto.role?.trim() } : {}),
    };

    this.records[targetIndex] = updatedEntry;
    return updatedEntry;
  }

  /**
   * Delete record by ID (DELETE)
   */
  public remove(id: number): AlumniMember | null {
    const targetIndex = this.records.findIndex((item) => item.id === id);
    if (targetIndex === -1) {
      return null;
    }

    const [deletedItem] = this.records.splice(targetIndex, 1);
    return deletedItem;
  }

  /**
   * Reset store to initial state (for testing)
   */
  public resetToDefault(): void {
    this.records = [
      { id: 1, name: "Elif Kaya", graduationYear: 2024, department: "Bilgisayar Mühendisliği" },
      { id: 2, name: "Mert Aydın", graduationYear: 2021, department: "Endüstri Mühendisliği" },
      { id: 3, name: "Zeynep Arslan", graduationYear: 2019, department: "İktisat" },
      { id: 4, name: "Can Öztürk", graduationYear: 2023, department: "Yazılım Mühendisliği" },
    ];
    this.autoIncrementId = 5;
  }
}

// Export singleton instance
export const alumniStore = new InMemoryAlumniStore();
