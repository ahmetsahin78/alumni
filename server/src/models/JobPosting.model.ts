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
  location: string;
  description: string;
  type?: JobType;
  industry?: string;
  requirements?: string;
  applicationUrl?: string;
  salaryRange?: string;
}

const JOB_TYPES = Object.values(JobType) as string[];

export class JobPostingModel {
  /** Gelen body'yi doğrular; hata varsa mesaj listesi döner. */
  public static validate(body: any): string[] {
    const errors: string[] = [];
    for (const field of ["title", "company", "location", "description"]) {
      if (!body?.[field] || typeof body[field] !== "string" || !body[field].trim()) {
        errors.push(`'${field}' alanı zorunludur.`);
      }
    }
    if (body?.type !== undefined && !JOB_TYPES.includes(body.type)) {
      errors.push(`'type' şunlardan biri olmalıdır: ${JOB_TYPES.join(", ")}.`);
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
      location: data.location.trim(),
      description: data.description.trim(),
      type: data.type ?? JobType.FULL_TIME,
      industry: data.industry,
      requirements: data.requirements,
      applicationUrl: data.applicationUrl,
      salaryRange: data.salaryRange,
    };
    return prisma.jobPosting.create({ data: payload });
  }
}
