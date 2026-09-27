import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";
import { AuthRequest } from "../middlewares/auth";
import { RSVPStatus } from "@prisma/client";

export class EventController {
  static async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const upcomingOnly = req.query.upcoming === "true";
      const events = await EventService.listEvents({ upcomingOnly });
      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      return next(error);
    }
  }

  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const event = await EventService.getEventById(id);
      return res.status(200).json({ success: true, data: event });
    } catch (error) {
      return next(error);
    }
  }

  static async createEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user!.id;
      const created = await EventService.createEvent(organizerId, req.body);
      return res.status(201).json({
        success: true,
        message: "Etkinlik başarıyla oluşturuldu.",
        data: created,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async rsvp(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const { status } = req.body;

      if (!status || !Object.values(RSVPStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir RSVP durumu (ATTENDING, MAYBE, DECLINED) seçilmelidir.",
        });
      }

      const rsvpRecord = await EventService.rsvpEvent(userId, id, status);
      return res.status(200).json({
        success: true,
        message: "Etkinlik katılım durumunuz güncellendi.",
        data: rsvpRecord,
      });
    } catch (error) {
      return next(error);
    }
  }
}
