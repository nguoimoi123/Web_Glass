import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  status: "Active" | "Inactive";
}

const categorySchema = new Schema<ICategory>(
  { 
    name: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
