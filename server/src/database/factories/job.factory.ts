/**
 * ============================================================================
 * JobPosting Factory
 * ============================================================================
 * job_postings tablosu için gerçekçi ilan verisi üretir.
 * authorId dışarıdan verilmelidir (FK -> users.id).
 * ============================================================================
 */

import { JobType, Prisma } from "@prisma/client";

const TITLES = [
  "Junior Backend Developer",
  "Frontend Developer (React)",
  "Data Analyst Intern",
  "DevOps Engineer",
  "Mobile Developer (Flutter)",
  "QA Automation Engineer",
  "Business Analyst",
  "Machine Learning Engineer",
];

const COMPANIES = ["Trendyol", "Getir", "Hepsiburada", "Turkcell", "Aselsan", "Garanti BBVA", "Insider", "Peak Games"];
const LOCATIONS = ["İstanbul (Hibrit)", "Ankara", "İzmir", "Uzaktan", "İstanbul (Ofis)"];
const INDUSTRIES = ["Teknoloji", "Finans", "E-Ticaret", "Savunma", "Telekom"];
const TYPES = Object.values(JobType);

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export class JobFactory {
  public static build(
    authorId: string,
    overrides: Partial<Prisma.JobPostingUncheckedCreateInput> = {}
  ): Prisma.JobPostingUncheckedCreateInput {
    const title = pick(TITLES);
    const company = pick(COMPANIES);
    return {
      authorId,
      title,
      company,
      location: pick(LOCATIONS),
      type: pick(TYPES),
      industry: pick(INDUSTRIES),
      description: `${company} bünyesinde ${title} pozisyonu için mezunlarımızı bekliyoruz.`,
      requirements: "Takım çalışmasına yatkınlık, Git bilgisi, iyi derecede İngilizce.",
      isActive: true,
      ...overrides,
    };
  }

  public static buildMany(count: number, authorId: string): Prisma.JobPostingUncheckedCreateInput[] {
    return Array.from({ length: count }, () => this.build(authorId));
  }
}
