import api from './api';
// Get all products with filtering, sorting, and pagination
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', {
    params
  });
  return response.data;
};
// Get single product
export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
// Create new product
export const createProduct = async (productData: any) => {
  const response = await api.post('/products', productData);
  return response.data;
};
// Update product
export const updateProduct = async (id: string, productData: any) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};
// Delete product
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
// Upload product images
export const uploadProductImages = async (formData: FormData) => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};