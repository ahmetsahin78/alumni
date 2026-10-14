/**
 * ============================================================================
 * ApiAnnouncement Routes (JSON REST API Katmanı)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Ödev Görevleri (Homework)
 * Duyuruların JSON REST API üzerinden yönetilmesini sağlayan uç noktalar.
 * Endpoint: /api/announcements
 * ============================================================================
 */

import { Router } from "express";
import { ApiAnnouncementController } from "../controllers/ApiAnnouncementController";

const router = Router();

// GET /api/announcements -> Tüm duyuruları listele
router.get("/", ApiAnnouncementController.getAnnouncements);

// POST /api/announcements -> Yeni duyuru ekle (201 Created)
router.post("/", ApiAnnouncementController.createAnnouncement);

// GET /api/announcements/:id -> ID'ye göre tekil duyuru getir
router.get("/:id", ApiAnnouncementController.getAnnouncementById);

// PUT /api/announcements/:id -> Bütünsel güncelleme
router.put("/:id", ApiAnnouncementController.updateAnnouncement);

// PATCH /api/announcements/:id -> Kısmi güncelleme
router.patch("/:id", ApiAnnouncementController.patchAnnouncement);

// DELETE /api/announcements/:id -> Duyuru sil
router.delete("/:id", ApiAnnouncementController.deleteAnnouncement);

export default router;

