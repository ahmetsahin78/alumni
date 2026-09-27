import { Router } from "express";
import authRoutes from "./auth.routes";
import alumniRoutes from "./alumni.routes";
import jobRoutes from "./job.routes";
import mentorshipRoutes from "./mentorship.routes";
import eventRoutes from "./event.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Alumni Tracking System API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount modules
router.use("/auth", authRoutes);
router.use("/alumni", alumniRoutes);
router.use("/jobs", jobRoutes);
router.use("/mentorship", mentorshipRoutes);
router.use("/events", eventRoutes);
router.use("/admin", adminRoutes);

export default router;
