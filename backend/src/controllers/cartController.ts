import { Request, Response } from "express";
import User from "../models/User";
import Product from "../models/Product";
import { Types } from "mongoose";

// GET /api/cart
export const getCart = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user?.cart || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart/add
export const addToCart = async (req: any, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.cart.find((item: any) => item.product.toString() === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({
        product: product._id as Types.ObjectId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/remove/:productId
export const removeFromCart = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((item: any) => item.product.toString() !== productId);

    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
