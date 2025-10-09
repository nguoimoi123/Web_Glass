import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;  // Add this
  order: mongoose.Types.ObjectId;
  method: string;
  amount: number;
  currency: string;
  isPaid: boolean;
  paidAt?: Date;
  transactionId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    method: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    transactionId: String,
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);