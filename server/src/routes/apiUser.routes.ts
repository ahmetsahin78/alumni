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

const router = Router();

// GET /api/users -> Tüm kullanıcıları listele
router.get("/", ApiUserController.getUsers);

// POST /api/users -> Yeni kullanıcı ekle (201 Created)
router.post("/", ApiUserController.createUser);

// GET /api/users/:id -> ID'ye göre tekil kullanıcı getir
router.get("/:id", ApiUserController.getUserById);

// PUT /api/users/:id -> Bütünsel güncelleme
router.put("/:id", ApiUserController.updateUser);

// PATCH /api/users/:id -> Kısmi güncelleme
router.patch("/:id", ApiUserController.patchUser);

// DELETE /api/users/:id -> Kullanıcı sil
router.delete("/:id", ApiUserController.deleteUser);

export default router;
