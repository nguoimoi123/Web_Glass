import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getMe, updateUser, } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/upload";

const router = Router();

router.get("/me", protect, getMe);
router.get("/user", getAllUsers);
router.post("/user", upload.single("avatar"), createUser);
router.put("/user/:id", upload.single("avatar"), updateUser);
router.delete("/user/:id", deleteUser);
export default router;
