import { Router } from "express";
import  upload  from "../middleware/upload";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controllers/productController";

const router = Router();

// GET
router.get("/", getProducts);
router.get("/:id", getProductById);

// POST

router.post("/", upload.array("images"), createProduct); // array nếu nhiều file

// PUT
router.put("/:id", upload.array("images"), updateProductById);

// DELETE
router.delete("/:id", deleteProductById);

export default router;
