/**
 * ============================================================================
 * Application Model & Repository (Prisma ORM)
 * ============================================================================
 * applications tablosu: bir kullanıcının bir iş ilanına başvurusu.
 * İlişkiler: Application N:1 JobPosting, Application N:1 User
 * Unique pair: (jobId, userId) -> aynı kullanıcı aynı ilana bir kez başvurur.
 * ============================================================================
 */

import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export class DuplicateApplicationError extends Error {
  constructor() {
    super("Bu kullanıcı bu ilana zaten başvurmuş.");
    this.name = "DuplicateApplicationError";
  }
}

const applicantSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  department: true,
  graduationYear: true,
} as const;

export class ApplicationModel {
  /**
   * Yeni başvuru oluşturur. (jobId, userId) çifti zaten varsa
   * veritabanındaki UNIQUE kısıtı P2002 hatası verir -> DuplicateApplicationError.
   */
  public static async create(jobId: number, userId: string, coverLetter?: string) {
    try {
      return await prisma.application.create({
        data: { jobId, userId, coverLetter },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new DuplicateApplicationError();
      }
      throw err;
    }
  }

  /** Bir ilana başvuranlar */
  public static async findApplicantsOfJob(jobId: number) {
    return prisma.application.findMany({
      where: { jobId },
      orderBy: { id: "asc" },
      include: { user: { select: applicantSelect } },
    });
  }

  /** Bir kullanıcının yaptığı başvurular */
  public static async findByUser(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { id: "asc" },
      include: {
        job: { select: { id: true, title: true, company: true, location: true, type: true } },
      },
    });
  }
}
