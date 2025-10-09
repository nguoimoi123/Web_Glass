// export interface Product {
//   id: string;
//   legacyId: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   status: 'Active' | 'Inactive' | 'Out of Stock';
//   description?: string;
//   images?: string[];
//   newFiles?: File[];
// }
export interface Product {
  id: string;
  legacyId: string;
  name: string;
  category: string;
  categoryName?: string;  // thêm
  brand?: string;         // thêm
  material?: string;      // thêm
  gender?: string;        // thêm
  color?: string;         // thêm
  lensType?: string;      // thêm
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  images?: string[];
  newFiles?: File[];
  createdAt?: string;     // thêm
  updatedAt?: string;     // thêm
  _id?: string;           // thêm nếu backend trả về
}

export interface ApiProduct {
  _id: string;
  legacyId?: string | number;
  name: string;
  category?: string;
  categoryName?: string;
  price?: number;
  stock?: number;
  status?: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
}
