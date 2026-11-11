/**
 * ============================================================================
 * Error Handler — 4xx yanıtları ve 5xx Guardian
 * ============================================================================
 * Controller'lar hatayı kendileri cevaplamaz; next(err) ile buraya iletir.
 * Tek bir yer, tek bir yanıt formatı:
 *
 *   ZodError                       -> 400 { error: "validation failed", fields }
 *   Bozuk JSON body                -> 400 { error: "invalid JSON", reason }
 *   err.statusCode / err.status 4xx -> aynı kod, { error: err.message }
 *   Diğer her şey (5xx)            -> 500 { error: "internal server error", errorId }
 *       + detay (stack dahil) logs/error.log dosyasına yazılır.
 *       Stack trace istemciye ASLA gönderilmez.
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const DEFAULT_ERROR_LOG_FILE = path.join(__dirname, "../../logs/error.log");

/** server/logs/error.log (testlerde ERROR_LOG_FILE env ile değiştirilebilir) */
export function errorLogFile(): string {
  return process.env.ERROR_LOG_FILE || DEFAULT_ERROR_LOG_FILE;
}

/** Controller/servislerde belirli bir HTTP kodu ile hata fırlatmak için. */
export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

/** 5xx hatayı logs/error.log dosyasına ekler (klasör yoksa oluşturur). */
export function writeErrorLog(errorId: string, req: Request, err: any): void {
  const entry =
    `[${new Date().toISOString()}] ${errorId} ${req.method} ${req.originalUrl}\n` +
    `${err?.stack || err?.message || String(err)}\n\n`;
  try {
    const file = errorLogFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, entry, "utf8");
  } catch (fileErr) {
    console.error("logs/error.log yazılamadı:", fileErr);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.errors) fields[issue.path.join(".") || "body"] = issue.message;
    res.status(400).json({ error: "validation failed", fields });
    return;
  }

  // express.json() bozuk JSON'da bu hatayı fırlatır
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "invalid JSON", reason: "Request body is not valid JSON." });
    return;
  }

  const status = Number(err?.statusCode || err?.status) || 500;
  if (status >= 400 && status < 500) {
    res.status(status).json({ error: err.message || "bad request" });
    return;
  }

  // ---- 5xx Guardian ----
  const errorId = randomUUID();
  writeErrorLog(errorId, req, err);
  console.error(`💥 ${status} ${req.method} ${req.originalUrl} (errorId: ${errorId}) -> logs/error.log`);
  res.status(status >= 500 && status < 600 ? status : 500).json({
    error: "internal server error",
    reason: "Something went wrong on our side. The error has been logged.",
    errorId,
  });
}
