import { Router } from "express";
import { MentorshipController } from "../controllers/mentorship.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/requests", MentorshipController.sendRequest);
router.get("/requests", MentorshipController.getMyRequests);
router.patch("/requests/:id", MentorshipController.updateStatus);

export default router;
