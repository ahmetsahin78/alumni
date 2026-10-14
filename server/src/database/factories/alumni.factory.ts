/**
 * ============================================================================
 * Alumni Factory
 * ============================================================================
 * Hafta 03 Mezun kayıtları için test ve tohum (seed) verisi üretici.
 * ============================================================================
 */

export interface AlumniFactoryInput {
  name?: string;
  email?: string;
  graduationYear?: number;
  department?: string;
  company?: string;
  role?: string;
}

const SEED_ALUMNI = [
  {
    name: "Elif Kaya",
    email: "elif.kaya@alumni.edu",
    graduationYear: 2024,
    department: "Bilgisayar Mühendisliği",
    company: "Google",
    role: "Software Engineer",
  },
  {
    name: "Mert Aydın",
    email: "mert.aydin@alumni.edu",
    graduationYear: 2021,
    department: "Endüstri Mühendisliği",
    company: "Microsoft",
    role: "Product Manager",
  },
  {
    name: "Zeynep Arslan",
    email: "zeynep.arslan@alumni.edu",
    graduationYear: 2019,
    department: "İktisat",
    company: "FinScale",
    role: "Lead Analyst",
  },
  {
    name: "Can Öztürk",
    email: "can.ozturk@alumni.edu",
    graduationYear: 2023,
    department: "Yazılım Mühendisliği",
    company: "Trendyol",
    role: "Frontend Developer",
  },
];

export class AlumniFactory {
  public static build(overrides: AlumniFactoryInput = {}): Required<AlumniFactoryInput> {
    const template = SEED_ALUMNI[Math.floor(Math.random() * SEED_ALUMNI.length)];
    return {
      name: overrides.name || template.name,
      email: overrides.email || template.email,
      graduationYear: overrides.graduationYear || template.graduationYear,
      department: overrides.department || template.department,
      company: overrides.company || template.company,
      role: overrides.role || template.role,
    };
  }

  public static buildMany(count: number): Required<AlumniFactoryInput>[] {
    const list: Required<AlumniFactoryInput>[] = [];
    for (let i = 0; i < count; i++) {
      list.push(SEED_ALUMNI[i % SEED_ALUMNI.length]);
    }
    return list;
  }
}

