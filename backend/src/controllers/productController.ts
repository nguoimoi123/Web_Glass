import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import { Types } from "mongoose";
import fs from "fs";
import path from "path";

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    // Lọc category active
    const activeCategories = await Category.find({ status: "Active" }).select("_id name");
    const activeCategoryIds = activeCategories.map(cat => cat._id);

    const query: any = {  };
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      // chỉ lấy khi category được chọn và nó active
      if (activeCategoryIds.includes(category.toString())) {
        query.category = category;
      } else {
        query.category = null; // không tìm thấy gì
      }
    } else {
      query.category = { $in: activeCategoryIds };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name status")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ products, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products
export const createProduct = async (req: any, res: Response) => {
  try {
    const { legacyId, name, price, description, categoryName, category, stock, isActive, status } = req.body;

    let categoryId = null;
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        categoryId = category._id;
      }
    }
    // Nếu có file upload thì thêm vào images[]
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = (req.files as Express.Multer.File[]).map((file) => `/uploads/${file.filename}`);
    }

    const newProduct = new Product({
      legacyId,
      name,
      price,
      description,
      categoryName,
      category: categoryId,
      stock,
      isActive,
      status,
      images, 
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/products/:id
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      price, 
      description, 
      category, 
      categoryName, 
      legacyId, 
      stock, 
      status, 
      images, 
      removeImages 
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Nếu có đổi category theo tên
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        product.category = category._id as Types.ObjectId;
        product.categoryName = category.name;
      }
    }

    // Update các field cơ bản
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.legacyId = legacyId ?? product.legacyId;
    product.stock = stock ?? product.stock;
    product.status = status ?? product.status;
    product.isActive = status !== "Inactive";

    // 👉 Xử lý removeImages
    if (removeImages) {
      let toRemove: string[] = [];
      try {
        toRemove = JSON.parse(removeImages); // client gửi dạng JSON array
      } catch {
        toRemove = [removeImages]; // nếu gửi string
      }

      // Lọc giữ lại ảnh chưa xóa
      product.images = product.images.filter((img: string) => !toRemove.includes(img));

      // Xóa file vật lý trong uploads/
      toRemove.forEach((imgPath) => {
        const relativePath = imgPath.startsWith("/") ? imgPath.slice(1) : imgPath;
        const absolutePath = path.join(__dirname, "..", "..", relativePath);

        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
          console.log("🗑️ Deleted file:", absolutePath);
        } else {
          console.warn("⚠️ File not found:", absolutePath);
        }
      });
    }

    // 👉 Thêm ảnh mới (append, không xóa ảnh cũ trừ khi có removeImages)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/products/:id
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Xóa ảnh local trong uploads
    if (product.images && product.images.length > 0) {
      for (const imgPath of product.images) {
        // lấy tên file từ DB
        const filename = path.basename(imgPath); 
        const filePath = path.join(process.cwd(), "uploads", filename);

        console.log("Deleting file at:", filePath);

        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log("Deleted:", filePath);
          } else {
            console.log("File not found:", filePath);
          }
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};
