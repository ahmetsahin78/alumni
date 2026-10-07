/**
 * ============================================================================
 * User View Routes (HTML Katmanı)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Sınıf İçi Görevler
 * Görev 5 & 6:
 * - GET /users -> Listeleme (R)
 * - POST /users -> Yeni kayıt oluşturma (C)
 * - Kalan tüm CRUD operasyonları (Detay, Form, Güncelleme, Silme)
 * ============================================================================
 */

import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

// 1. Yeni kullanıcı formu (Önce tanımlanmalı ki /users/:id ile çakışmasın)
router.get("/new", UserController.createForm);

// 2. Kullanıcı listesi (Read - All) & Yeni kayıt ekleme (Create)
router.get("/", UserController.index);
router.post("/", UserController.create);

// 3. Tekil kullanıcı detay (Read - One)
router.get("/:id", UserController.show);

// 4. Düzenleme formu ve güncelleme işlemleri (Update)
router.get("/:id/edit", UserController.editForm);
router.post("/:id/edit", UserController.update);
router.post("/:id", UserController.update);

// 5. Silme işlemleri (Delete)
router.post("/:id/delete", UserController.delete);
router.get("/:id/delete", UserController.delete);

export default router;
