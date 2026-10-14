/**
 * ============================================================================
 * ApiAnnouncementController (RESTful JSON API Controller - Database Persistence)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Ödev Görevleri (Homework)
 * Görev: Duyurular için API controller'ı oluştur ve doğrudan PostgreSQL veritabanı
 * (`prisma.announcement`) üzerinden JSON tabanlı CRUD servislerini sağla.
 * ============================================================================
 */

import { Request, Response } from "express";
import {
  announcementModel,
  AnnouncementCategory,
  AnnouncementPriority,
} from "../models/Announcement.model";

export class ApiAnnouncementController {
  /**
   * GET /api/announcements -> Tüm duyuruları listele
   */
  public static async getAnnouncements(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const priority = req.query.priority as string | undefined;

    const announcements = await announcementModel.findAll({ search, category, priority });
    res.status(200).json(announcements);
  }

  /**
   * GET /api/announcements/:id -> ID'ye göre tekil duyuru getir
   */
  public static async getAnnouncementById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Geçersiz ID formatı. Sayısal bir değer giriniz." });
      return;
    }

    const announcement = await announcementModel.findById(id);
    if (!announcement) {
      res.status(404).json({ error: `ID: ${id} olan duyuru bulunamadı.` });
      return;
    }

    res.status(200).json(announcement);
  }

  /**
   * POST /api/announcements -> Yeni duyuru ekle (201 Created)
   */
  public static async createAnnouncement(req: Request, res: Response): Promise<void> {
    const { title, content, author, category, priority } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({ error: "'title' (başlık) alanı zorunludur ve boş olamaz." });
      return;
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      res.status(400).json({ error: "'content' (içerik) alanı zorunludur ve boş olamaz." });
      return;
    }

    if (!author || typeof author !== "string" || !author.trim()) {
      res.status(400).json({ error: "'author' (yazar) alanı zorunludur." });
      return;
    }

    const newAnnouncement = await announcementModel.create({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: (category as AnnouncementCategory) || "GENERAL",
      priority: (priority as AnnouncementPriority) || "MEDIUM",
    });

    res.status(201).json(newAnnouncement);
  }

  /**
   * PUT /api/announcements/:id -> Bütünsel güncelleme
   */
  public static async updateAnnouncement(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    const { title, content, author, category, priority } = req.body;

    if (!title || !content || !author) {
      res.status(400).json({
        error: "Bütünsel güncelleme için 'title', 'content' ve 'author' alanları zorunludur.",
      });
      return;
    }

    const updated = await announcementModel.replace(id, {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: (category as AnnouncementCategory) || "GENERAL",
      priority: (priority as AnnouncementPriority) || "MEDIUM",
    });

    if (!updated) {
      res.status(404).json({ error: `ID: ${id} olan duyuru bulunamadı.` });
      return;
    }

    res.status(200).json(updated);
  }

  /**
   * PATCH /api/announcements/:id -> Kısmi güncelleme
   */
  public static async patchAnnouncement(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Güncellenecek en az bir alan belirtilmelidir." });
      return;
    }

    const patched = await announcementModel.patch(id, req.body);
    if (!patched) {
      res.status(404).json({ error: `ID: ${id} olan duyuru bulunamadı.` });
      return;
    }

    res.status(200).json(patched);
  }

  /**
   * DELETE /api/announcements/:id -> Duyuru sil
   */
  public static async deleteAnnouncement(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    const deleted = await announcementModel.delete(id);
    if (!deleted) {
      res.status(404).json({ error: `ID: ${id} olan duyuru bulunamadı.` });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Duyuru başarıyla silindi.",
      deletedRecord: deleted,
    });
  }
}
