import { Router } from "express";
import { AlumniController } from "../controllers/alumni.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Public / Authenticated search & detail
router.get("/", AlumniController.getAlumni);
router.get("/:id", AlumniController.getAlumniById);

// Profile & Career Management (requires auth)
router.put("/profile", authenticate, AlumniController.updateProfile);

// Work Experience
router.post("/experience", authenticate, AlumniController.addWorkExperience);
router.put("/experience/:id", authenticate, AlumniController.updateWorkExperience);
router.delete("/experience/:id", authenticate, AlumniController.deleteWorkExperience);

// Academic History
router.post("/academic", authenticate, AlumniController.addAcademicHistory);
router.put("/academic/:id", authenticate, AlumniController.updateAcademicHistory);
router.delete("/academic/:id", authenticate, AlumniController.deleteAcademicHistory);

// Skills
router.post("/skills", authenticate, AlumniController.addSkill);
router.delete("/skills/:skillId", authenticate, AlumniController.removeSkill);

export default router;
