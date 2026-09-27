import prisma from "../prisma";
import { MentorshipStatus, Role } from "@prisma/client";

export class MentorshipService {
  static async sendRequest(menteeId: string, mentorId: string, message: string) {
    if (menteeId === mentorId) {
      const error: any = new Error("Kendinize mentorluk talebi gönderemezsiniz.");
      error.statusCode = 400;
      throw error;
    }

    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
      include: { profile: true },
    });

    if (!mentor || !mentor.profile?.isMentor) {
      const error: any = new Error("Belirtilen kullanıcı mentor olarak kayıtlı değil.");
      error.statusCode = 400;
      throw error;
    }

    const existing = await prisma.mentorshipRequest.findFirst({
      where: {
        mentorId,
        menteeId,
        status: { in: [MentorshipStatus.PENDING, MentorshipStatus.ACCEPTED] },
      },
    });

    if (existing) {
      const error: any = new Error("Bu mentora yönelik zaten aktif veya bekleyen bir talebiniz var.");
      error.statusCode = 400;
      throw error;
    }

    return prisma.mentorshipRequest.create({
      data: {
        menteeId,
        mentorId,
        message,
      },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
      },
    });
  }

  static async listMyRequests(userId: string, type: "mentor" | "mentee") {
    const where = type === "mentor" ? { mentorId: userId } : { menteeId: userId };

    return prisma.mentorshipRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            profile: true,
          },
        },
        mentee: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            profile: true,
          },
        },
      },
    });
  }

  static async updateStatus(
    mentorId: string,
    requestId: string,
    status: MentorshipStatus,
    meetingUrl?: string,
    notes?: string
  ) {
    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      const error: any = new Error("Mentorluk talebi bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    if (request.mentorId !== mentorId) {
      const error: any = new Error("Bu talebi yanıtlama yetkiniz bulunmuyor.");
      error.statusCode = 403;
      throw error;
    }

    return prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: {
        status,
        meetingUrl: meetingUrl !== undefined ? meetingUrl : request.meetingUrl,
        notes: notes !== undefined ? notes : request.notes,
      },
    });
  }
}
