import { Request, Response, NextFunction } from "express";
import { MentorshipService } from "../services/mentorship.service";
import { AuthRequest } from "../middlewares/auth";
import { MentorshipStatus } from "@prisma/client";

export class MentorshipController {
  static async sendRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const menteeId = req.user!.id;
      const { mentorId, message } = req.body;

      if (!mentorId || !message) {
        return res.status(400).json({
          success: false,
          message: "mentorId ve message alanları zorunludur.",
        });
      }

      const request = await MentorshipService.sendRequest(menteeId, mentorId, message);
      return res.status(201).json({
        success: true,
        message: "Mentorluk talebi başarıyla iletildi.",
        data: request,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMyRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const type = (req.query.type as "mentor" | "mentee") || "mentee";

      const requests = await MentorshipService.listMyRequests(userId, type);
      return res.status(200).json({ success: true, data: requests });
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const mentorId = req.user!.id;
      const { id } = req.params as { id: string };
      const { status, meetingUrl, notes } = req.body;

      if (!status || !Object.values(MentorshipStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir durum (status) belirtilmelidir.",
        });
      }

      const updated = await MentorshipService.updateStatus(
        mentorId,
        id,
        status,
        meetingUrl,
        notes
      );

      return res.status(200).json({
        success: true,
        message: "Mentorluk talebi güncellendi.",
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }
}
