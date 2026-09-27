import { Request, Response, NextFunction } from "express";
import { AlumniService } from "../services/alumni.service";
import { AuthRequest } from "../middlewares/auth";
import { updateProfileSchema } from "../validations/auth.validation";

export class AlumniController {
  static async getAlumni(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, department, graduationYear, industry, company, isMentor, page, limit } = req.query;

      const result = await AlumniService.getAlumniList({
        search: search as string,
        department: department as string,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        industry: industry as string,
        company: company as string,
        isMentor: isMentor !== undefined ? isMentor === "true" : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
      });

      return res.status(200).json({
        success: true,
        data: result.alumni,
        meta: result.meta,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getAlumniById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const user = await AlumniService.getAlumniById(id);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const validatedData = updateProfileSchema.parse(req.body);
      const updated = await AlumniService.updateProfile(userId, validatedData);

      return res.status(200).json({
        success: true,
        message: "Profil güncellendi.",
        data: updated,
      });
    } catch (error) {
      return next(error);
    }
  }

  // Work experiences
  static async addWorkExperience(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const created = await AlumniService.addWorkExperience(userId, req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (error) {
      return next(error);
    }
  }

  static async updateWorkExperience(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const updated = await AlumniService.updateWorkExperience(userId, id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteWorkExperience(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const result = await AlumniService.deleteWorkExperience(userId, id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return next(error);
    }
  }

  // Academic history
  static async addAcademicHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const created = await AlumniService.addAcademicHistory(userId, req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (error) {
      return next(error);
    }
  }

  static async updateAcademicHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const updated = await AlumniService.updateAcademicHistory(userId, id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteAcademicHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params as { id: string };
      const result = await AlumniService.deleteAcademicHistory(userId, id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return next(error);
    }
  }

  // Skills
  static async addSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { name } = req.body;
      const result = await AlumniService.addSkill(userId, name);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  static async removeSkill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { skillId } = req.params as { skillId: string };
      const result = await AlumniService.removeSkill(userId, skillId);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return next(error);
    }
  }
}
