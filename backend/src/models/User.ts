import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  lastLogin?: Date;
  wishlist: { product: mongoose.Types.ObjectId; addedAt: Date }[];
  cart: { product: mongoose.Types.ObjectId; name: string; price: number; quantity: number; image: string }[];
  createdAt?: Date; 
  updatedAt?: Date; 
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    avatar: { type: String },
    lastLogin: { type: Date, default: null },
    wishlist: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
