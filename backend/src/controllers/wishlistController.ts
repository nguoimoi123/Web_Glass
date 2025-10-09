import { Request, Response } from "express";
import User from "../models/User";
import Product from "../models/Product";
import { Types } from "mongoose";

// GET /api/wishlist
export const getWishlist = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist.product");
    res.json(user?.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/wishlist/add
export const addToWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.find((w: any) => w.product.toString() === productId);
    if (!exists) {
      user.wishlist.push({ product: product._id as Types.ObjectId, addedAt: new Date() });
      await user.save();
    }

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/wishlist/remove/:productId
export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter((w: any) => w.product.toString() !== productId);
    await user.save();

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
