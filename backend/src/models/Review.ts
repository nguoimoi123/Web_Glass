import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  legacyProductId: number;
  author: string;
  authorId: mongoose.Types.ObjectId; 
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    author: String,
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    title: String,
    comment: String,
    verified: Boolean,
    helpfulCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
