import { Router } from "express";
import { HealthController } from "../controllers/health.controller";
import alumniRoutes from "./alumni.routes";
import apiUserRoutes from "./apiUser.routes";
import apiAnnouncementRoutes from "./apiAnnouncement.routes";
import utilityRoutes from "./utility.routes";

const router = Router();

/**
 * 1. GET /api/health -> JSON system status
 */
router.get("/health", HealthController.check);

/**
 * 2. In-Memory Alumni CRUD Routes (Week 03)
 */
router.use("/alumni", alumniRoutes);

/**
 * 3. In-Memory User REST API Routes (Week 04 MVC Architecture - ApiUserController)
 */
router.use("/users", apiUserRoutes);

/**
 * 4. In-Memory Announcement REST API Routes (Week 04 MVC Homework - ApiAnnouncementController)
 */
router.use("/announcements", apiAnnouncementRoutes);

/**
 * 5. Utility Routes (/api/hello, /api/sum)
 */
router.use("/", utilityRoutes);

export default router;
