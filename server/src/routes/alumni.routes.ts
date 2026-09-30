import { Router } from "express";
import { AlumniController } from "../controllers/alumni.controller";

const router = Router();

// CRUD Endpoints for Alumni (supports in-memory CRUD from lecture)
router.get("/", AlumniController.listAll);
router.get("/:id", AlumniController.getOne);
router.post("/", AlumniController.create);
router.put("/:id", AlumniController.replace);
router.patch("/:id", AlumniController.modify);
router.delete("/:id", AlumniController.remove);

export default router;
