import prisma from "../prisma";
import { Role } from "@prisma/client";

export interface AlumniFilterParams {
  search?: string;
  department?: string;
  graduationYear?: number;
  industry?: string;
  company?: string;
  isMentor?: boolean;
  page?: number;
  limit?: number;
}

export class AlumniService {
  static async getAlumniList(params: AlumniFilterParams) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const where: any = {
      role: Role.ALUMNI,
    };

    if (params.search) {
      const q = params.search.trim();
      where.OR = [
        { profile: { firstName: { contains: q, mode: "insensitive" } } },
        { profile: { lastName: { contains: q, mode: "insensitive" } } },
        { profile: { headline: { contains: q, mode: "insensitive" } } },
        { profile: { bio: { contains: q, mode: "insensitive" } } },
        {
          academicHistories: {
            some: { department: { contains: q, mode: "insensitive" } },
          },
        },
        {
          workExperiences: {
            some: {
              OR: [
                { company: { contains: q, mode: "insensitive" } },
                { position: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    if (params.department) {
      where.academicHistories = {
        some: { department: { equals: params.department, mode: "insensitive" } },
      };
    }

    if (params.graduationYear) {
      where.academicHistories = {
        some: { graduationYear: Number(params.graduationYear) },
      };
    }

    if (params.industry) {
      where.workExperiences = {
        some: { industry: { equals: params.industry, mode: "insensitive" } },
      };
    }

    if (params.company) {
      where.workExperiences = {
        some: { company: { contains: params.company, mode: "insensitive" } },
      };
    }

    if (typeof params.isMentor === "boolean") {
      where.profile = {
        ...(where.profile || {}),
        isMentor: params.isMentor,
      };
    }

    const [total, alumni] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
          profile: true,
          academicHistories: {
            orderBy: { graduationYear: "desc" },
            take: 1,
          },
          workExperiences: {
            where: { isCurrent: true },
            orderBy: { startDate: "desc" },
            take: 1,
          },
          skills: {
            include: { skill: true },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      alumni,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getAlumniById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
        profile: true,
        academicHistories: {
          orderBy: { graduationYear: "desc" },
        },
        workExperiences: {
          orderBy: { startDate: "desc" },
        },
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!user) {
      const error: any = new Error("Mezun profili bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  static async updateProfile(userId: string, data: any) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        firstName: data.firstName || "İsimsiz",
        lastName: data.lastName || "Kullanıcı",
        ...data,
      },
    });
  }

  // Work Experience Operations
  static async addWorkExperience(userId: string, data: any) {
    return prisma.workExperience.create({
      data: {
        userId,
        company: data.company,
        position: data.position,
        industry: data.industry,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: Boolean(data.isCurrent),
        description: data.description,
      },
    });
  }

  static async updateWorkExperience(userId: string, experienceId: string, data: any) {
    const existing = await prisma.workExperience.findFirst({
      where: { id: experienceId, userId },
    });

    if (!existing) {
      const error: any = new Error("İş deneyimi kaydı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    return prisma.workExperience.update({
      where: { id: experienceId },
      data: {
        company: data.company,
        position: data.position,
        industry: data.industry,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent !== undefined ? Boolean(data.isCurrent) : undefined,
        description: data.description,
      },
    });
  }

  static async deleteWorkExperience(userId: string, experienceId: string) {
    const existing = await prisma.workExperience.findFirst({
      where: { id: experienceId, userId },
    });

    if (!existing) {
      const error: any = new Error("İş deneyimi kaydı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    await prisma.workExperience.delete({
      where: { id: experienceId },
    });

    return { message: "İş deneyimi başarıyla silindi." };
  }

  // Academic History Operations
  static async addAcademicHistory(userId: string, data: any) {
    return prisma.academicHistory.create({
      data: {
        userId,
        university: data.university || "İstanbul Üniversitesi",
        faculty: data.faculty,
        department: data.department,
        degree: data.degree || "Lisans",
        startYear: Number(data.startYear),
        graduationYear: Number(data.graduationYear),
      },
    });
  }

  static async updateAcademicHistory(userId: string, academicId: string, data: any) {
    const existing = await prisma.academicHistory.findFirst({
      where: { id: academicId, userId },
    });

    if (!existing) {
      const error: any = new Error("Akademik geçmiş kaydı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    return prisma.academicHistory.update({
      where: { id: academicId },
      data: {
        university: data.university,
        faculty: data.faculty,
        department: data.department,
        degree: data.degree,
        startYear: data.startYear ? Number(data.startYear) : undefined,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : undefined,
      },
    });
  }

  static async deleteAcademicHistory(userId: string, academicId: string) {
    const existing = await prisma.academicHistory.findFirst({
      where: { id: academicId, userId },
    });

    if (!existing) {
      const error: any = new Error("Akademik geçmiş kaydı bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    await prisma.academicHistory.delete({
      where: { id: academicId },
    });

    return { message: "Akademik geçmiş kaydı başarıyla silindi." };
  }

  // Skills
  static async addSkill(userId: string, skillName: string) {
    const trimmed = skillName.trim();
    if (!trimmed) throw new Error("Yetenek adı boş olamaz.");

    let skill = await prisma.skill.findUnique({
      where: { name: trimmed },
    });

    if (!skill) {
      skill = await prisma.skill.create({ data: { name: trimmed } });
    }

    return prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
      create: {
        userId,
        skillId: skill.id,
      },
      update: {},
      include: {
        skill: true,
      },
    });
  }

  static async removeSkill(userId: string, skillId: string) {
    await prisma.userSkill.deleteMany({
      where: {
        userId,
        skillId,
      },
    });

    return { message: "Yetenek profilden kaldırıldı." };
  }
}
