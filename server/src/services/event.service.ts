import prisma from "../prisma";
import { RSVPStatus } from "@prisma/client";

export class EventService {
  static async listEvents(params?: { upcomingOnly?: boolean }) {
    const where: any = {};
    if (params?.upcomingOnly) {
      where.eventDate = { gte: new Date() };
    }

    return prisma.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            rsvps: {
              where: { status: RSVPStatus.ATTENDING },
            },
          },
        },
      },
    });
  }

  static async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                avatarUrl: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      const error: any = new Error("Etkinlik bulunamadı.");
      error.statusCode = 404;
      throw error;
    }

    return event;
  }

  static async createEvent(organizerId: string, data: any) {
    return prisma.event.create({
      data: {
        organizerId,
        title: data.title,
        description: data.description,
        location: data.location,
        eventDate: new Date(data.eventDate),
        isOnline: Boolean(data.isOnline),
        meetingUrl: data.meetingUrl,
        maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : null,
      },
    });
  }

  static async rsvpEvent(userId: string, eventId: string, status: RSVPStatus) {
    return prisma.eventRSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      create: {
        eventId,
        userId,
        status,
      },
      update: {
        status,
      },
    });
  }
}
