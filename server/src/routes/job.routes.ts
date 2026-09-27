import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", JobController.listJobs);
router.get("/:id", JobController.getJobById);
router.post("/", authenticate, authorize([Role.ALUMNI, Role.ADMIN]), JobController.createJob);
router.delete("/:id", authenticate, JobController.deleteJob);

export default router;
