/**
 * ============================================================================
 * ApiUserController (RESTful JSON API Controller - Database Persistence)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Sınıf İçi Görevler
 * Görev: ApiUserController üzerinden veritabanı (db conn) bağlantılı
 * RESTful JSON CRUD işlemlerini sağlamak.
 * ============================================================================
 */

import { Request, Response } from "express";
import { userModel } from "../models/User.model";

export class ApiUserController {
  /**
   * GET /api/users -> Tüm kullanıcıları JSON formatında listele
   */
  public static async getUsers(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string | undefined;
    const department = req.query.department as string | undefined;
    const role = req.query.role as string | undefined;

    const users = await userModel.findAll({ search, department, role });
    res.status(200).json(users);
  }

  /**
   * GET /api/users/:id -> ID'ye göre tekil kullanıcı getir
   */
  public static async getUserById(req: Request, res: Response): Promise<void> {
    const id = (req.params.id as string)?.trim();
    if (!id) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).json({ error: `ID: ${id} olan kullanıcı bulunamadı.` });
      return;
    }

    res.status(200).json(user);
  }

  /**
   * POST /api/users -> Yeni kullanıcı ekle (201 Created)
   */
  public static async createUser(req: Request, res: Response): Promise<void> {
    const { name, email, role, graduationYear, department, company } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "'name' alanı zorunludur ve boş olamaz." });
      return;
    }

    if (!graduationYear || isNaN(Number(graduationYear))) {
      res.status(400).json({ error: "'graduationYear' alanı zorunludur ve geçerli bir sayı olmalıdır." });
      return;
    }

    const defaultEmail = email && typeof email === "string" && email.includes("@")
      ? email.trim()
      : `${name.toLowerCase().replace(/\s+/g, ".")}@alumni.edu`;

    const newUser = await userModel.create({
      name: name.trim(),
      email: defaultEmail,
      role: role || "Alumni",
      graduationYear: Number(graduationYear),
      department: department ? department.trim() : "Genel",
      company: company ? company.trim() : undefined,
    });

    res.status(201).json(newUser);
  }

  /**
   * PUT /api/users/:id -> Bütünsel güncelleme
   */
  public static async updateUser(req: Request, res: Response): Promise<void> {
    const id = (req.params.id as string)?.trim();
    if (!id) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    const { name, email, role, graduationYear, department, company } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "'name' alanı zorunludur." });
      return;
    }

    if (!graduationYear || isNaN(Number(graduationYear))) {
      res.status(400).json({ error: "'graduationYear' alanı zorunludur ve geçerli bir sayı olmalıdır." });
      return;
    }

    const updatedUser = await userModel.replace(id, {
      name: name.trim(),
      email: email ? email.trim() : `${name.toLowerCase().replace(/\s+/g, ".")}@alumni.edu`,
      role: role || "Alumni",
      graduationYear: Number(graduationYear),
      department: department ? department.trim() : "Genel",
      company: company ? company.trim() : undefined,
    });

    if (!updatedUser) {
      res.status(404).json({ error: `ID: ${id} olan kullanıcı bulunamadı.` });
      return;
    }

    res.status(200).json(updatedUser);
  }

  /**
   * PATCH /api/users/:id -> Kısmi güncelleme
   */
  public static async patchUser(req: Request, res: Response): Promise<void> {
    const id = (req.params.id as string)?.trim();
    if (!id) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Güncellenecek en az bir alan belirtilmelidir." });
      return;
    }

    const patchedUser = await userModel.patch(id, req.body);
    if (!patchedUser) {
      res.status(404).json({ error: `ID: ${id} olan kullanıcı bulunamadı.` });
      return;
    }

    res.status(200).json(patchedUser);
  }

  /**
   * DELETE /api/users/:id -> Kullanıcı kaydını sil
   */
  public static async deleteUser(req: Request, res: Response): Promise<void> {
    const id = (req.params.id as string)?.trim();
    if (!id) {
      res.status(400).json({ error: "Geçersiz ID formatı." });
      return;
    }

    const deletedUser = await userModel.delete(id);
    if (!deletedUser) {
      res.status(404).json({ error: `ID: ${id} olan kullanıcı bulunamadı.` });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Kullanıcı başarıyla silindi.",
      deletedRecord: deletedUser,
    });
  }
}
