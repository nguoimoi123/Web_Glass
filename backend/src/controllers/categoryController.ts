import { Request, Response } from "express";
import Category from "../models/Category";
import Product from "../models/Product";

// GET /api/categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "name",
          foreignField: "categoryName",
          as: "productsList"
        }
      },
      {
        $addFields: {
          products: { $size: "$productsList" }
        }
      },
      {
        $project: { productsList: 0 }
      }
    ]);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name, status: status || "Active" });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) category.name = name;
    if (status) category.status = status; // có thể Active hoặc Inactive
    await category.save();

    // Nếu category inactive, cũng có thể cập nhật tất cả product liên quan
    if (status === "Inactive") {
      await Product.updateMany(
        { category: category._id },
        { status: "Inactive" }
      );
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Optionally: cũng xóa tất cả product thuộc category này
    await Product.deleteMany({ category: category._id });

    res.json({ message: "Category and related products deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};