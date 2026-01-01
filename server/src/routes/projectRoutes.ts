import { Router } from "express";
import { getProjects, createProject } from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getProjects);       
router.post("/", protect, createProject);    

export default router;