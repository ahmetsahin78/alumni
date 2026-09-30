import { Request, Response } from "express";
import { alumniStore } from "../storage/inMemoryStore";

/**
 * Controller for Alumni Resource Management
 * Handles in-memory CRUD operations according to course specifications
 */
export class AlumniController {
  /**
   * GET /api/alumni and GET /api/users
   * Retrieves all alumni records
   */
  public static listAll(req: Request, res: Response): void {
    const records = alumniStore.getAll();
    res.status(200).json(records);
  }

  /**
   * GET /api/alumni/:id and GET /api/users/:id
   * Retrieves a single alumni record by its numeric identifier
   */
  public static getOne(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Geçersiz ID formatı. ID sayısal bir değer olmalıdır.",
      });
      return;
    }

    const item = alumniStore.getById(id);
    if (!item) {
      res.status(404).json({
        error: `ID'si ${id} olan mezun kaydı bulunamadı.`,
      });
      return;
    }

    res.status(200).json(item);
  }

  /**
   * POST /api/alumni and POST /api/users
   * Creates a new alumni record (Returns 201 Created as shown in lecture slide)
   */
  public static create(req: Request, res: Response): void {
    const { name, graduationYear, department, company, email, role } = req.body;

    // Validate required fields from lecture slide
    if (!name || graduationYear === undefined || graduationYear === null) {
      res.status(400).json({
        error: "Eksik bilgi: 'name' ve 'graduationYear' alanları zorunludur.",
      });
      return;
    }

    const yearNum = Number(graduationYear);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      res.status(400).json({
        error: "'graduationYear' geçerli bir yıl (1900-2100) olmalıdır.",
      });
      return;
    }

    const createdRecord = alumniStore.add({
      name: String(name),
      graduationYear: yearNum,
      department: department ? String(department) : undefined,
      company: company ? String(company) : undefined,
      email: email ? String(email) : undefined,
      role: role ? String(role) : undefined,
    });

    res.status(201).json(createdRecord);
  }

  /**
   * PUT /api/alumni/:id and PUT /api/users/:id
   * Bütünsel Güncelleme (Full replacement) - Replaces the whole record
   */
  public static replace(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Geçersiz ID formatı. ID sayısal bir değer olmalıdır.",
      });
      return;
    }

    const { name, graduationYear, department, company, email, role } = req.body;

    // In PUT, all required attributes must be provided
    if (!name || graduationYear === undefined || graduationYear === null) {
      res.status(400).json({
        error: "PUT (Bütünsel güncelleme) için hem 'name' hem de 'graduationYear' alanları zorunludur.",
      });
      return;
    }

    const yearNum = Number(graduationYear);
    if (isNaN(yearNum)) {
      res.status(400).json({
        error: "'graduationYear' sayısal bir yıl olmalıdır.",
      });
      return;
    }

    const replacedRecord = alumniStore.replace(id, {
      name: String(name),
      graduationYear: yearNum,
      department: department ? String(department) : undefined,
      company: company ? String(company) : undefined,
      email: email ? String(email) : undefined,
      role: role ? String(role) : undefined,
    });

    if (!replacedRecord) {
      res.status(404).json({
        error: `Güncellenecek ID: ${id} olan kayıt bulunamadı.`,
      });
      return;
    }

    res.status(200).json(replacedRecord);
  }

  /**
   * PATCH /api/alumni/:id and PATCH /api/users/:id
   * Kısmi Güncelleme (Partial update) - Modifies only provided fields
   */
  public static modify(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Geçersiz ID formatı. ID sayısal bir değer olmalıdır.",
      });
      return;
    }

    const { name, graduationYear, department, company, email, role } = req.body;

    // Check if at least one field is provided
    if (
      name === undefined &&
      graduationYear === undefined &&
      department === undefined &&
      company === undefined &&
      email === undefined &&
      role === undefined
    ) {
      res.status(400).json({
        error: "PATCH isteğinde güncellenecek en az bir alan gönderilmelidir.",
      });
      return;
    }

    let parsedYear: number | undefined;
    if (graduationYear !== undefined) {
      parsedYear = Number(graduationYear);
      if (isNaN(parsedYear)) {
        res.status(400).json({
          error: "'graduationYear' sayısal bir değer olmalıdır.",
        });
        return;
      }
    }

    const updatedRecord = alumniStore.patch(id, {
      name: name !== undefined ? String(name) : undefined,
      graduationYear: parsedYear,
      department: department !== undefined ? String(department) : undefined,
      company: company !== undefined ? String(company) : undefined,
      email: email !== undefined ? String(email) : undefined,
      role: role !== undefined ? String(role) : undefined,
    });

    if (!updatedRecord) {
      res.status(404).json({
        error: `Güncellenecek ID: ${id} olan kayıt bulunamadı.`,
      });
      return;
    }

    res.status(200).json(updatedRecord);
  }

  /**
   * DELETE /api/alumni/:id and DELETE /api/users/:id
   * Removes an alumni record
   */
  public static remove(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      res.status(400).json({
        error: "Geçersiz ID formatı. ID sayısal bir değer olmalıdır.",
      });
      return;
    }

    const removedItem = alumniStore.remove(id);
    if (!removedItem) {
      res.status(404).json({
        error: `Silinecek ID: ${id} olan kayıt bulunamadı.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${removedItem.name} adlı mezun kaydı başarıyla silindi.`,
      deletedRecord: removedItem,
    });
  }
}
