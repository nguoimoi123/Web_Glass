import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController";

const router = Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/remove/:productId", protect, removeFromCart);

export default router;
