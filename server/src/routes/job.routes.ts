import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { ApiJobController } from "../controllers/ApiJobController";
import { authenticate, authorize } from "../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", JobController.listJobs);
router.get("/:id", JobController.getJobById);

// Başvurular: POST 201 / 409 (ikinci kez) / 404 (ilan ya da kullanıcı yok)
router.post("/:id/applications", ApiJobController.apply);
router.get("/:id/applications", ApiJobController.listApplicants);
router.post("/", authenticate, authorize([Role.ALUMNI, Role.ADMIN]), JobController.createJob);
router.delete("/:id", authenticate, JobController.deleteJob);

export default router;
