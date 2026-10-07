/**
 * ============================================================================
 * AnnouncementController (MVC View Controller)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Ödev Görevleri (Homework)
 * Görev: Duyurular için View controller'ı oluştur ve kullanıcıların tarayıcı
 * üzerinden duyuruları yönetmesini sağlayan arayüz operasyonlarını bağla.
 * ============================================================================
 */

import { Request, Response } from "express";
import { announcementModel, AnnouncementCategory, AnnouncementPriority } from "../models/Announcement.model";
import { AnnouncementViews } from "../views/announcement.views";

export class AnnouncementController {
  /**
   * 1. GET /announcements -> Duyuruları Listele (Yönetim Arayüzü)
   */
  public static index(req: Request, res: Response): void {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const alertMessage = req.query.msg as string | undefined;

    const announcements = announcementModel.findAll({ search, category });
    const html = AnnouncementViews.renderList(announcements, { search, category }, alertMessage);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 2. GET /announcements/new -> Yeni Duyuru Formunu Göster
   */
  public static createForm(req: Request, res: Response): void {
    const html = AnnouncementViews.renderCreateForm();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 3. POST /announcements -> Yeni Duyuru Yayınla (Create)
   */
  public static create(req: Request, res: Response): void {
    const { title, content, author, category, priority } = req.body;

    if (!title || !content || !author) {
      const html = AnnouncementViews.renderCreateForm(
        req.body,
        "Başlık, içerik ve yayınlayan birim alanları zorunludur."
      );
      res.status(400).send(html);
      return;
    }

    const newAnnouncement = announcementModel.create({
      title,
      content,
      author,
      category: (category as AnnouncementCategory) || "General",
      priority: (priority as AnnouncementPriority) || "Medium",
    });

    res.redirect(
      `/announcements?msg=${encodeURIComponent(`"${newAnnouncement.title}" başlıklı duyuru yayınlandı!`)}`
    );
  }

  /**
   * 4. GET /announcements/:id -> Tekil Duyuru Detayı (Read - One)
   */
  public static show(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.redirect("/announcements");
      return;
    }

    const announcement = announcementModel.findById(id);
    if (!announcement) {
      res.status(404).send(
        AnnouncementViews.renderList(
          announcementModel.findAll(),
          {},
          `#${id} numaralı duyuru bulunamadı.`
        )
      );
      return;
    }

    const html = AnnouncementViews.renderDetail(announcement);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 5. GET /announcements/:id/edit -> Duyuru Düzenleme Formu
   */
  public static editForm(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.redirect("/announcements");
      return;
    }

    const announcement = announcementModel.findById(id);
    if (!announcement) {
      res.redirect("/announcements");
      return;
    }

    const html = AnnouncementViews.renderEditForm(announcement);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 6. POST /announcements/:id/edit (veya POST /announcements/:id) -> Duyuru Güncelle (Update)
   */
  public static update(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.redirect("/announcements");
      return;
    }

    const { title, content, author, category, priority } = req.body;

    if (!title || !content || !author) {
      const existing = announcementModel.findById(id);
      if (!existing) {
        res.redirect("/announcements");
        return;
      }
      const html = AnnouncementViews.renderEditForm(
        { ...existing, ...req.body },
        "Tüm zorunlu alanlar doldurulmalıdır."
      );
      res.status(400).send(html);
      return;
    }

    const updated = announcementModel.replace(id, {
      title,
      content,
      author,
      category: (category as AnnouncementCategory) || "General",
      priority: (priority as AnnouncementPriority) || "Medium",
    });

    if (!updated) {
      res.redirect("/announcements");
      return;
    }

    res.redirect(`/announcements/${id}`);
  }

  /**
   * 7. POST /announcements/:id/delete -> Duyuru Sil (Delete)
   */
  public static delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (!isNaN(id)) {
      const deleted = announcementModel.delete(id);
      const msg = deleted
        ? `"${deleted.title}" başlıklı duyuru silindi.`
        : "Silinecek duyuru bulunamadı.";
      res.redirect(`/announcements?msg=${encodeURIComponent(msg)}`);
      return;
    }
    res.redirect("/announcements");
  }
}
