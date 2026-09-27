import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import { Role } from "@prisma/client";

export class AdminController {
  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getStatistics();
      return res.status(200).json({ success: true, data: stats });
    } catch (error) {
      return next(error);
    }
  }

  static async getPendingUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const pendingUsers = await AdminService.getPendingUsers();
      return res.status(200).json({ success: true, data: pendingUsers });
    } catch (error) {
      return next(error);
    }
  }

  static async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { isVerified } = req.body;

      if (typeof isVerified !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isVerified (boolean) alanı zorunludur.",
        });
      }

      const updated = await AdminService.verifyUser(id, isVerified);
      return res.status(200).json({
        success: true,
        message: `Kullanıcı ${isVerified ? "doğrulandı" : "reddedildi"}.`,
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { role } = req.body;

      if (!role || !Object.values(Role).includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Geçerli bir kullanıcı rolü (STUDENT, ALUMNI, ADMIN) girilmelidir.",
        });
      }

      const updated = await AdminService.updateUserRole(id, role);
      return res.status(200).json({
        success: true,
        message: "Kullanıcı rolü güncellendi.",
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }
}
