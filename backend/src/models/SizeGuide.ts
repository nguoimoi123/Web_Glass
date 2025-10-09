import mongoose, { Document, Schema } from "mongoose";

export interface ISizeGuide extends Document {
  name: string;
  frameWidth: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
  lensHeight: string;
  weight: string;
  faceShapes: string[];
}

const sizeGuideSchema = new Schema<ISizeGuide>(
  {
    name: { type: String, required: true },
    frameWidth: String,
    lensWidth: String,
    bridgeWidth: String,
    templeLength: String,
    lensHeight: String,
    weight: String,
    faceShapes: [String],
  },
  { timestamps: true }
);

export default mongoose.model<ISizeGuide>("SizeGuide", sizeGuideSchema);
