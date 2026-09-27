import prisma from "../prisma";
import { Role } from "@prisma/client";

export class AdminService {
  static async getStatistics() {
    const [
      totalUsers,
      totalAlumni,
      totalStudents,
      totalMentors,
      totalJobs,
      totalEvents,
      unverifiedAlumni,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.ALUMNI } }),
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.profile.count({ where: { isMentor: true } }),
      prisma.jobPosting.count({ where: { isActive: true } }),
      prisma.event.count(),
      prisma.user.count({ where: { role: Role.ALUMNI, isVerified: false } }),
    ]);

    // Employed Alumni: have at least one active work experience
    const employedAlumniCount = await prisma.user.count({
      where: {
        role: Role.ALUMNI,
        workExperiences: {
          some: { isCurrent: true },
        },
      },
    });

    const employmentRate =
      totalAlumni > 0 ? Math.round((employedAlumniCount / totalAlumni) * 100) : 0;

    // Industry Distribution
    const workExperiences = await prisma.workExperience.findMany({
      where: { isCurrent: true },
      select: { industry: true, company: true },
    });

    const industryMap: Record<string, number> = {};
    const companyMap: Record<string, number> = {};

    workExperiences.forEach((exp) => {
      if (exp.industry) {
        industryMap[exp.industry] = (industryMap[exp.industry] || 0) + 1;
      }
      if (exp.company) {
        companyMap[exp.company] = (companyMap[exp.company] || 0) + 1;
      }
    });

    const industryDistribution = Object.entries(industryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topCompanies = Object.entries(companyMap)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Graduation Years Distribution
    const academicHistories = await prisma.academicHistory.findMany({
      select: { graduationYear: true },
    });

    const yearMap: Record<number, number> = {};
    academicHistories.forEach((ah) => {
      yearMap[ah.graduationYear] = (yearMap[ah.graduationYear] || 0) + 1;
    });

    const graduationYearDistribution = Object.entries(yearMap)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year);

    return {
      overview: {
        totalUsers,
        totalAlumni,
        totalStudents,
        totalMentors,
        totalJobs,
        totalEvents,
        employedAlumniCount,
        employmentRate,
        unverifiedAlumni,
      },
      charts: {
        industryDistribution,
        topCompanies,
        graduationYearDistribution,
      },
    };
  }

  static async getPendingUsers() {
    return prisma.user.findMany({
      where: { isVerified: false },
      include: {
        profile: true,
        academicHistories: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async verifyUser(userId: string, isVerified: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isVerified },
      include: { profile: true },
    });
  }

  static async updateUserRole(userId: string, role: Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      include: { profile: true },
    });
  }
}
