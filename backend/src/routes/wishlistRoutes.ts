import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController";

const router = Router();

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);

export default router;
