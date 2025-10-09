import mongoose, { Document, Schema } from "mongoose";

export interface IShipping extends Document {
  _id: mongoose.Types.ObjectId;  // Add this
  order: mongoose.Types.ObjectId;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethod: string;
  trackingNumber?: string;
  status: "preparing" | "shipped" | "delivered";
}

const shippingSchema = new Schema<IShipping>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String,
    shippingMethod: { type: String, default: "Standard" },
    trackingNumber: String,
    status: {
      type: String,
      enum: ["preparing", "shipped", "delivered"],
      default: "preparing",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IShipping>("Shipping", shippingSchema);