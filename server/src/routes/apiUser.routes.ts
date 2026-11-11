/**
 * ============================================================================
 * ApiUser Routes (JSON REST API Katmanı)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Sınıf İçi Görevler
 * Görev 4: api User rotasını ApiUserController'a bağla.
 * Endpoint: /api/users
 * ============================================================================
 */

import { Router } from "express";
import { ApiUserController } from "../controllers/ApiUserController";
import { ApiJobController } from "../controllers/ApiJobController";
import { validateJobPosting } from "../middlewares/validateJobPosting";

const router = Router();

// GET /api/users -> Tüm kullanıcıları listele
router.get("/", ApiUserController.getUsers);

// POST /api/users -> Yeni kullanıcı ekle (201 Created)
router.post("/", ApiUserController.createUser);

// POST /api/users/:id/jobs -> Kullanıcı adına iş ilanı oluştur
//   validateJobPosting (400 validation failed) -> controller (404 bilinmeyen kullanıcı / 201)
router.post("/:id/jobs", validateJobPosting, ApiJobController.createForUser);

// GET /api/users/:id/jobs -> Kullanıcının iş ilanları (bilinmeyen kullanıcı 404)
router.get("/:id/jobs", ApiJobController.listForUser);

// GET /api/users/:id/applications -> Kullanıcının yaptığı başvurular
router.get("/:id/applications", ApiJobController.listApplicationsOfUser);

// GET /api/users/:id -> ID'ye göre tekil kullanıcı getir (ilanları "jobs" alanında)
router.get("/:id", ApiUserController.getUserById);

// PUT /api/users/:id -> Bütünsel güncelleme
router.put("/:id", ApiUserController.updateUser);

// PATCH /api/users/:id -> Kısmi güncelleme
router.patch("/:id", ApiUserController.patchUser);

// DELETE /api/users/:id -> Kullanıcı sil
router.delete("/:id", ApiUserController.deleteUser);

export default router;

