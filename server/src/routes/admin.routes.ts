import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize([Role.ADMIN]));

router.get("/statistics", AdminController.getStatistics);
router.get("/verifications", AdminController.getPendingUsers);
router.patch("/verifications/:id", AdminController.verifyUser);
router.patch("/users/:id/role", AdminController.updateUserRole);

export default router;
