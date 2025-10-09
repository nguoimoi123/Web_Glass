import { Response } from "express";
import Review from "../models/Review";
import Product from "../models/Product";
import { AuthRequest } from "../types/AuthRequest"; 

// GET /api/reviews/product/:productId
export const getReviewsByProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId); // dùng _id
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
// GET /api/reviews
export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/reviews
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let status: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
    if (rating === 5) {
      status = 'Approved';
    } else if (rating === 1) {
      status = 'Rejected';
    }
    const review = await Review.create({
      product: product._id,
      author: `${user.firstName} ${user.lastName}`,
      authorId: user._id,
      rating,
      title,
      comment,
      verified: true,
      helpfulCount: 0,
      status,
    });

    return res.status(201).json({ review });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


// PUT /api/reviews/:id
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.authorId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { rating, title, comment } = req.body;
    const newRating = rating ?? review.rating;
    review.rating = newRating;
    review.title = title ?? review.title;
    review.comment = comment ?? review.comment;

    let status: 'Pending' | 'Approved' | 'Rejected' = review.status;
    if (rating !== undefined) {
      if (newRating === 5) {
        status = 'Approved';
      } else if (newRating === 1) {
        status = 'Rejected';
      } else {
        status = 'Pending';
      }
    }
    review.status = status;

    await review.save();
    return res.json({ review }); // 👈 bọc vào object
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.authorId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    return res.json({ message: "Review deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
