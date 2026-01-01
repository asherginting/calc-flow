import { Router } from "express";
import { createNode, getNodesByProject } from "../controllers/nodeController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:projectId", getNodesByProject); 
router.post("/", protect, createNode);

export default router;