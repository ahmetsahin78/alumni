import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authenticate, authorize } from "../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", EventController.listEvents);
router.get("/:id", EventController.getEventById);

router.post("/", authenticate, authorize([Role.ALUMNI, Role.ADMIN]), EventController.createEvent);
router.post("/:id/rsvp", authenticate, EventController.rsvp);

export default router;
