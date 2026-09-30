import { Router } from "express";
import { HealthController } from "../controllers/health.controller";
import alumniRoutes from "./alumni.routes";
import utilityRoutes from "./utility.routes";

const router = Router();

/**
 * 1. GET /api/health -> JSON system status
 */
router.get("/health", HealthController.check);

/**
 * 2. In-Memory CRUD Routes:
 * Mounted on both /api/alumni (as in lecture slide) AND /api/users (as on whiteboard)
 */
router.use("/alumni", alumniRoutes);
router.use("/users", alumniRoutes);

/**
 * 3. Utility Routes
 */
router.use("/", utilityRoutes);

export default router;
