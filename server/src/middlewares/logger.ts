/**
 * ============================================================================
 * Logger Middleware — her isteği terminale tek satır olarak yazar
 * ============================================================================
 *   time      method  route                  status  duration
 *   10:20:30  POST    /api/users/1/jobs      201     18 ms
 *
 * Yanıt gönderildiğinde ("finish") yazıldığı için 400/404/500 gibi erken
 * dönen yanıtlar da loglanır. Test ortamında (NODE_ENV=test) sessizdir.
 * ============================================================================
 */

import { NextFunction, Request, Response } from "express";

function clock(d: Date): string {
  return d.toTimeString().slice(0, 8); // HH:MM:SS
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = new Date();
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    if (process.env.NODE_ENV === "test") return;
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const line = [
      clock(startedAt),
      req.method.padEnd(6),
      req.originalUrl.padEnd(32),
      String(res.statusCode).padEnd(4),
      `${Math.round(ms)} ms`,
    ].join("  ");
    console.log(line);
  });

  next();
}
