/**
 * ============================================================================
 * Announcement View Routes (HTML Yönetim Arayüzü Katmanı)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Ödev Görevleri (Homework)
 * Duyuruların tarayıcı arayüzü üzerinden listelenmesi, oluşturulması,
 * incelenmesi, düzenlenmesi ve silinmesi rotaları.
 * ============================================================================
 */

import { Router } from "express";
import { AnnouncementController } from "../controllers/AnnouncementController";

const router = Router();

// 1. Yeni duyuru formu (Önce tanımlanmalı)
router.get("/new", AnnouncementController.createForm);

// 2. Duyuru panosu listesi (Read - All) & Yeni duyuru ekle (Create)
router.get("/", AnnouncementController.index);
router.post("/", AnnouncementController.create);

// 3. Tekil duyuru inceleme (Read - One)
router.get("/:id", AnnouncementController.show);

// 4. Düzenleme formu ve güncelleme işlemleri (Update)
router.get("/:id/edit", AnnouncementController.editForm);
router.post("/:id/edit", AnnouncementController.update);
router.post("/:id", AnnouncementController.update);

// 5. Silme işlemleri (Delete)
router.post("/:id/delete", AnnouncementController.delete);
router.get("/:id/delete", AnnouncementController.delete);

export default router;
