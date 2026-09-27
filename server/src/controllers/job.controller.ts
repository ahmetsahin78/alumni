import { Request, Response, NextFunction } from "express";
import { JobService } from "../services/job.service";
import { AuthRequest } from "../middlewares/auth";
import { JobType } from "@prisma/client";

export class JobController {
  static async listJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, type, industry, page, limit } = req.query;
      const result = await JobService.listJobs({
        search: search as string,
        type: type as JobType,
        industry: industry as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      });

      return res.status(200).json({
        success: true,
        data: result.jobs,
        meta: result.meta,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const job = await JobService.getJobById(id);
      return res.status(200).json({ success: true, data: job });
    } catch (error) {
      return next(error);
    }
  }

  static async createJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authorId = req.user!.id;
      const job = await JobService.createJob(authorId, req.body);
      return res.status(201).json({
        success: true,
        message: "İş ilanı başarıyla yayınlandı.",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;
      const { id } = req.params as { id: string };
      const result = await JobService.deleteJob(userId, role, id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      return next(error);
    }
  }
}
