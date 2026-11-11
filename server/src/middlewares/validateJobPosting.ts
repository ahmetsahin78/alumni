/**
 * ============================================================================
 * validateJobPosting — Body doğrulama middleware'i
 * ============================================================================
 * Controller'a ulaşmadan önce iş ilanı body'sini domain kurallarına göre
 * kontrol eder (kurallar JobPostingModel.validate içinde, ddd.md'de belgeli).
 *
 *   geçerli body  -> next()  -> controller çalışır
 *   geçersiz body -> 400 { error: "validation failed", fields: { ... } }
 *                    zincir burada durur, controller hiç çalışmaz.
 * ============================================================================
 */

import { NextFunction, Request, Response } from "express";
import { JobPostingModel } from "../models/JobPosting.model";

export function validateJobPosting(req: Request, res: Response, next: NextFunction): void {
  const fields = JobPostingModel.validate(req.body);
  if (Object.keys(fields).length > 0) {
    res.status(400).json({ error: "validation failed", fields });
    return;
  }
  next();
}
