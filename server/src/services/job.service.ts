import prisma from "../prisma";
import { JobType, Role } from "@prisma/client";

export class JobService {
  static async listJobs(params: {
    search?: string;
    type?: JobType;
    industry?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (params.search) {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.industry) {
      where.industry = { equals: params.industry, mode: "insensitive" };
    }

    const [total, jobs] = await Promise.all([
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              role: true,
              avatarUrl: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  headline: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getJobById(id: string) {
    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
            avatarUrl: true,
            profile: true,
          },
        },
      },
    });

    if (!job) {
      const error: any = new Error("İş ilanı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    return job;
  }

  static async createJob(authorId: string, data: any) {
    return prisma.jobPosting.create({
      data: {
        authorId,
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type || JobType.FULL_TIME,
        industry: data.industry,
        description: data.description,
        requirements: data.requirements,
        applicationUrl: data.applicationUrl,
        salaryRange: data.salaryRange,
      },
    });
  }

  static async deleteJob(userId: string, role: Role, id: string) {
    const job = await prisma.jobPosting.findUnique({ where: { id } });

    if (!job) {
      const error: any = new Error("İş ilanı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    if (job.authorId !== userId && role !== Role.ADMIN) {
      const error: any = new Error("Bu ilanı silme yetkiniz yok.");
      error.statusCode = 403;
      throw error;
    }

    await prisma.jobPosting.delete({ where: { id } });
    return { message: "İlan başarıyla silindi." };
  }
}
