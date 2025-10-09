import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: { product: mongoose.Types.ObjectId; quantity: number; price: number }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    firstName?: string;  // Thêm nếu cần
    lastName?: string;   // Thêm nếu cần
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentDetails?: any;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  email: string;
  phone: string;
  payment?: mongoose.Types.ObjectId;
  shipping?: mongoose.Types.ObjectId;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true,  // Thêm để bắt buộc
        validate: {
          validator: (v: string) => mongoose.Types.ObjectId.isValid(v),  // Check ID hợp lệ
          message: 'Invalid Product ID'
        }
      },
      quantity: { type: Number, required: true, min: 1 },  // Thêm required và min
      price: { type: Number, required: true, min: 0 },     // Thêm required và min
    },
  ],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  billingAddress: {
    firstName: String,  // Optional hoặc required tùy nhu cầu
    lastName: String,
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentDetails: Schema.Types.Mixed,
  total: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  shipping: { type: Schema.Types.ObjectId, ref: 'Shipping' },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema);