import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  legacyId: number;
  name: string;
  price: number;
  images: string[];
  image: string;
  description?: string;
  categoryName: string;
  category?: mongoose.Types.ObjectId;
  stock: number;
  isActive: boolean;
  status?: 'Active' | 'Inactive' | 'Out of Stock';
}

const productSchema = new Schema<IProduct>(
  {
    legacyId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    image: String,
    description: String,
    categoryName: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    stock: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['Active','Inactive','Out of Stock'], default: 'Active' }, 
  },
  { timestamps: true }
);
productSchema.pre('save', function (next) {
  if (this.stock <= 0 && this.status !== 'Inactive') {
    this.status = 'Out of Stock';
  }
  // Nếu isActive = false, status = Inactive
  if (!this.isActive) {
    this.status = 'Inactive';
  }
  next();
});
export default mongoose.model<IProduct>("Product", productSchema);
