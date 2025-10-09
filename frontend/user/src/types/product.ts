export interface Product {
  _id: string;              // MongoDB ObjectId dưới dạng string
  legacyId: number;
  name: string;
  price: number;
  images: string[];
  image: string;
  description?: string;
  categoryName: string;
  category?: string;        // chỉ dùng string thay vì ObjectId
  stock: number;
  isActive: boolean;
  status?: "Active" | "Inactive" | "Out of Stock";
  createdAt?: string;
  updatedAt?: string;
}
