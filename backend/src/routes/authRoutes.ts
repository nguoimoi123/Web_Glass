import { Router } from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe); // Added route for getting current user info
export default router;
    