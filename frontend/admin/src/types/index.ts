// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}
// Product types
export interface Product {
  _id: string;
  legacyId?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: string;
  categoryName: string;
  brand: string;
  material?: string;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  color?: string;
  lensType?: string;
  images: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Order types
export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'unpaid' | 'refunded';
  shippingStatus: 'preparing' | 'shipped' | 'delivered';
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface OrderItem {
  product: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}
// Review types
export interface Review {
  _id: string;
  user: string;
  product: string;
  rating: number;
  comment: string;
  images?: string[];
  helpfulCount: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// SizeGuide types
export interface SizeGuide {
  _id: string;
  name: string;
  category: string;
  categoryName: string;
  type: 'Frames' | 'Lenses' | 'Sunglasses';
  measurements: Measurement[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Measurement {
  name: string;
  value: string;
}
// Payment types
export interface Payment {
  _id: string;
  order: string;
  user: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}
// Coupon types
export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumPurchase?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}