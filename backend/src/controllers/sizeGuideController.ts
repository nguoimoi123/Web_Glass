import { Request, Response } from "express";
import SizeGuide from "../models/SizeGuide";

// GET /api/sizeguides/:categoryName
export const getSizeGuide = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.params;

    const sizeGuide = await SizeGuide.findOne({ name: categoryName });
    if (!sizeGuide) return res.status(404).json({ message: "Size guide not found" });

    res.json(sizeGuide);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/sizeguides
export const getAllSizeGuides = async (req: Request, res: Response) => {
  try {
    const guides = await SizeGuide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
