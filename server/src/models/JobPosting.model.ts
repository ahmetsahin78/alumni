/**
 * ============================================================================
 * JobPosting Model & Repository (Prisma ORM)
 * ============================================================================
 * job_postings tablosu üzerindeki işlemler.
 * İlişkiler: JobPosting N:1 User (author), JobPosting 1:N Application
 * Delete rule: kullanıcı silinince ilanları, ilan silinince başvuruları silinir.
 * ============================================================================
 */

import { JobType, Prisma } from "@prisma/client";
import prisma from "../prisma";

export interface CreateJobInput {
  title: string;
  company: string;
  location?: string;
  description?: string;
  type?: JobType;
  industry?: string;
  requirements?: string;
  applicationUrl?: string;
  salaryRange?: string;
}

const JOB_TYPES = Object.values(JobType) as string[];
export const JOB_TITLE_MAX = 120;

export class JobPostingModel {
  /**
   * Domain kuralları (ddd.md -> job_postings / Kurallar):
   *   - title       : zorunlu, string, en fazla 120 karakter
   *   - company     : zorunlu, string
   *   - location    : opsiyonel (şehir), verilirse string
   *   - description : opsiyonel, verilirse string
   *   - type        : opsiyonel, JobType enum değerlerinden biri
   * Hata yoksa boş obje döner; varsa { alan: "mesaj" }.
   */
  public static validate(body: any): Record<string, string> {
    const errors: Record<string, string> = {};
    const isBlank = (v: unknown) => typeof v !== "string" || !v.trim();

    if (body?.title === undefined || body?.title === null || isBlank(body.title)) {
      errors.title = "title is required";
    } else if (body.title.trim().length > JOB_TITLE_MAX) {
      errors.title = `title must be at most ${JOB_TITLE_MAX} characters`;
    }

    if (body?.company === undefined || body?.company === null || isBlank(body.company)) {
      errors.company = "company is required";
    }

    for (const field of ["location", "description"]) {
      const v = body?.[field];
      if (v !== undefined && v !== null && typeof v !== "string") {
        errors[field] = `${field} must be a string`;
      }
    }

    if (body?.type !== undefined && !JOB_TYPES.includes(body.type)) {
      errors.type = `type must be one of: ${JOB_TYPES.join(", ")}`;
    }
    return errors;
  }

  public static async findById(id: number) {
    return prisma.jobPosting.findUnique({ where: { id } });
  }

  /** Bir kullanıcının yayınladığı ilanlar (en yeni önce) */
  public static async findByAuthor(authorId: string) {
    return prisma.jobPosting.findMany({
      where: { authorId },
      orderBy: { id: "desc" },
      include: { _count: { select: { applications: true } } },
    });
  }

  public static async createForAuthor(authorId: string, data: CreateJobInput) {
    const payload: Prisma.JobPostingUncheckedCreateInput = {
      authorId,
      title: data.title.trim(),
      company: data.company.trim(),
      location: data.location?.trim() || null,
      description: data.description?.trim() || null,
      type: data.type ?? JobType.FULL_TIME,
      industry: data.industry,
      requirements: data.requirements,
      applicationUrl: data.applicationUrl,
      salaryRange: data.salaryRange,
    };
    return prisma.jobPosting.create({ data: payload });
  }
}
