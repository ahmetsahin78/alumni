/**
 * ============================================================================
 * UserController (MVC View Controller)
 * ============================================================================
 * İstanbul Üniversitesi Web Programlama Dersi - Hafta 04: Sınıf İçi Görevler
 * Görev: View katmanı ile bağlantılı UserController oluştur ve tüm CRUD
 * işlemlerini HTML arayüzü üzerinden yönet.
 * ============================================================================
 */

import { Request, Response } from "express";
import { userModel } from "../models/User.model";
import { UserViews } from "../views/user.views";

export class UserController {
  /**
   * 1. GET /users -> Kullanıcıları Listele (Read - All)
   */
  public static index(req: Request, res: Response): void {
    const search = req.query.search as string | undefined;
    const alertMessage = req.query.msg as string | undefined;
    const users = userModel.findAll({ search });
    const html = UserViews.renderList(users, search, alertMessage);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 2. GET /users/new -> Yeni Kullanıcı Formunu Göster
   */
  public static createForm(req: Request, res: Response): void {
    const html = UserViews.renderCreateForm();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 3. POST /users -> Yeni Kullanıcı Kaydet (Create)
   */
  public static create(req: Request, res: Response): void {
    const { name, email, role, graduationYear, department, company } = req.body;

    if (!name || !email || !graduationYear || !department) {
      const html = UserViews.renderCreateForm(
        req.body,
        "Lütfen tüm zorunlu alanları (Ad, E-Posta, Mezuniyet Yılı, Bölüm) doldurunuz."
      );
      res.status(400).send(html);
      return;
    }

    const yearNum = Number(graduationYear);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2035) {
      const html = UserViews.renderCreateForm(
        req.body,
        "Mezuniyet yılı 1900 ile 2035 arasında geçerli bir yıl olmalıdır."
      );
      res.status(400).send(html);
      return;
    }

    const newUser = userModel.create({
      name,
      email,
      role: role || "Alumni",
      graduationYear: yearNum,
      department,
      company: company || undefined,
    });

    res.redirect(`/users?msg=${encodeURIComponent(`${newUser.name} başarıyla sisteme eklendi!`)}`);
  }

  /**
   * 4. GET /users/:id -> Tekil Kullanıcı Detayı (Read - One)
   */
  public static show(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.redirect("/users?msg=" + encodeURIComponent("Geçersiz kullanıcı kimliği."));
      return;
    }

    const user = userModel.findById(id);
    if (!user) {
      res.status(404).send(
        UserViews.renderList(userModel.findAll(), undefined, `ID: #${id} olan kullanıcı bulunamadı.`)
      );
      return;
    }

    const html = UserViews.renderDetail(user);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 5. GET /users/:id/edit -> Kullanıcı Düzenleme Formu
   */
  public static editForm(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.redirect("/users");
      return;
    }

    const user = userModel.findById(id);
    if (!user) {
      res.redirect("/users");
      return;
    }

    const html = UserViews.renderEditForm(user);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  }

  /**
   * 6. POST /users/:id/edit (veya POST /users/:id) -> Kullanıcı Güncelle (Update)
   */
  public static update(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.redirect("/users");
      return;
    }

    const { name, email, role, graduationYear, department, company } = req.body;

    if (!name || !email || !graduationYear || !department) {
      const existing = userModel.findById(id);
      if (!existing) {
        res.redirect("/users");
        return;
      }
      const html = UserViews.renderEditForm(
        { ...existing, ...req.body },
        "Tüm zorunlu alanlar doldurulmalıdır."
      );
      res.status(400).send(html);
      return;
    }

    const updated = userModel.replace(id, {
      name,
      email,
      role: role || "Alumni",
      graduationYear: Number(graduationYear),
      department,
      company: company || undefined,
    });

    if (!updated) {
      res.redirect("/users");
      return;
    }

    res.redirect(`/users/${id}`);
  }

  /**
   * 7. POST /users/:id/delete -> Kullanıcı Sil (Delete)
   */
  public static delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);
    if (!isNaN(id)) {
      const deleted = userModel.delete(id);
      const msg = deleted
        ? `${deleted.name} başarıyla silindi.`
        : "Silinecek kullanıcı bulunamadı.";
      res.redirect(`/users?msg=${encodeURIComponent(msg)}`);
      return;
    }
    res.redirect("/users");
  }
}
