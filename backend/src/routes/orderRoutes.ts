import { Router } from "express";
import { adminOnly, protect } from "../middleware/authMiddleware";
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController";

const router = Router();
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({ message: 'OK' });
});

router.options('/:id', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).json({ message: 'OK' });
});

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
