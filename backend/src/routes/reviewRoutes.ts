import { Router } from "express";
import { getReviewsByProduct, addReview, updateReview, deleteReview, getAllReviews } from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// đổi từ :legacyId → :productId (_id của MongoDB)
router.get("/product/:productId", getReviewsByProduct);
router.post("/", protect, addReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
router.get("/", getAllReviews); // Thêm route để lấy tất cả đánh giá
export default router;
