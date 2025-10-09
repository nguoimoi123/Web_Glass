import { Router } from "express";
import { getSizeGuide, getAllSizeGuides } from "../controllers/sizeGuideController";

const router = Router();

router.get("/", getAllSizeGuides);
router.get("/:categoryName", getSizeGuide);

export default router;
