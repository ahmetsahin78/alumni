/**
 * ============================================================================
 * 404 Guardian — hiçbir rotanın karşılamadığı istekleri yakalar
 * ============================================================================
 * Tüm rotalardan SONRA, error handler'dan ÖNCE bağlanır.
 *
 *   /api/... veya JSON isteyen istemci (Postman, fetch)
 *       -> 404 { error: "not found", reason, method, path, docs }
 *   Tarayıcıdan gelen GET isteği (Accept: text/html, /api dışı)
 *       -> 302 redirect -> /404?path=<istenen-yol>  (genel 404 sayfası)
 * ============================================================================
 */

import { Request, Response } from "express";

export function notFound(req: Request, res: Response): void {
  const path = req.originalUrl;
  const isApi = path === "/api" || path.startsWith("/api/");
  const wantsHtml = req.accepts(["json", "html"]) === "html";

  if (!isApi && wantsHtml && req.method === "GET") {
    res.redirect(302, `/404?path=${encodeURIComponent(path)}`);
    return;
  }

  res.status(404).json({
    error: "not found",
    reason: `No route matches ${req.method} ${path}`,
    method: req.method,
    path,
    docs: "/api/swagger",
  });
}
