/**
 * ============================================================================
 * ApiJobController (RESTful JSON API - İş İlanları & Başvurular)
 * ============================================================================
 *   POST /api/users/:id/jobs           -> kullanıcı adına ilan oluştur (201)
 *   GET  /api/users/:id/jobs           -> kullanıcının ilanları
 *   GET  /api/users/:id/applications   -> kullanıcının başvuruları
 *   POST /api/jobs/:id/applications    -> ilana başvur (201 / 409 / 404)
 *   GET  /api/jobs/:id/applications    -> ilana başvuranlar
 * Bilinmeyen kullanıcı veya ilan her zaman 404 döner.
 * ============================================================================
 */

import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { JobPostingModel } from "../models/JobPosting.model";
import { ApplicationModel, DuplicateApplicationError } from "../models/Application.model";

/** "12" -> 12, "abc" / "0" / "1.5" -> null */
function parseJobId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

async function userExists(id: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  return user !== null;
}

export class ApiJobController {
  /** POST /api/users/:id/jobs */
  public static async createForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = String(req.params.id);
      if (!(await userExists(userId))) {
        res.status(404).json({ error: `ID: ${userId} olan kullanıcı bulunamadı.` });
        return;
      }

      const errors = JobPostingModel.validate(req.body);
      if (errors.length > 0) {
        res.status(400).json({ error: "Geçersiz ilan verisi.", details: errors });
        return;
      }

      const job = await JobPostingModel.createForAuthor(userId, req.body);
      res.status(201).json(job);
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/users/:id/jobs */
  public static async listForUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = String(req.params.id);
      if (!(await userExists(userId))) {
        res.status(404).json({ error: `ID: ${userId} olan kullanıcı bulunamadı.` });
        return;
      }
      res.status(200).json(await JobPostingModel.findByAuthor(userId));
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/users/:id/applications */
  public static async listApplicationsOfUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = String(req.params.id);
      if (!(await userExists(userId))) {
        res.status(404).json({ error: `ID: ${userId} olan kullanıcı bulunamadı.` });
        return;
      }
      res.status(200).json(await ApplicationModel.findByUser(userId));
    } catch (err) {
      next(err);
    }
  }

  /** POST /api/jobs/:id/applications  body: { userId, coverLetter? } */
  public static async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobId = parseJobId(String(req.params.id));
      const job = jobId ? await JobPostingModel.findById(jobId) : null;
      if (!job) {
        res.status(404).json({ error: `ID: ${req.params.id} olan iş ilanı bulunamadı.` });
        return;
      }

      const userId = req.body?.userId;
      if (!userId || typeof userId !== "string") {
        res.status(400).json({ error: "'userId' alanı zorunludur." });
        return;
      }
      if (!(await userExists(userId))) {
        res.status(404).json({ error: `ID: ${userId} olan kullanıcı bulunamadı.` });
        return;
      }

      const application = await ApplicationModel.create(job.id, userId, req.body?.coverLetter);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof DuplicateApplicationError) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  }

  /** GET /api/jobs/:id/applications */
  public static async listApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobId = parseJobId(String(req.params.id));
      const job = jobId ? await JobPostingModel.findById(jobId) : null;
      if (!job) {
        res.status(404).json({ error: `ID: ${req.params.id} olan iş ilanı bulunamadı.` });
        return;
      }
      res.status(200).json(await ApplicationModel.findApplicantsOfJob(job.id));
    } catch (err) {
      next(err);
    }
  }
}
