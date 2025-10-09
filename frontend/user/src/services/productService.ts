import api from "./api";

function filterProductsByRole(products: any[], role: string) {
  if (role === "user") {
    return products.filter(
      (p) => p.status === "Active" && p.category?.status === "Active"
    );
  }
  return products; // admin thì giữ nguyên
}

export async function getProducts(params?: Record<string, any>, role = "user") {
  const res = await api.get("/products", { params });
  const products = res.data.products || [];
  return filterProductsByRole(products, role);
}

export async function getProductById(id: string) {
  const res = await api.get(`/products/${id}`);
  return res.data.product || res.data; // backend có thể trả product trực tiếp
}

export async function searchProducts(query: string, params?: Record<string, any>) {
  const res = await api.get("/products", { params: { search: query, ...params } });
  return res.data.products || [];
}

export async function getRelatedProducts(id: string) {
  const res = await api.get(`/products/${id}/related`);
  return res.data.products || [];
}
