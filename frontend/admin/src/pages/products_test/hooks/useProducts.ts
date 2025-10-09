import { useState, useEffect } from "react";
import { Product, ApiProduct, Category } from "../types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const mapFunc = (prod: ApiProduct): Product => ({
          id: prod._id,
          legacyId: prod.legacyId?.toString() ?? "",
          name: prod.name,
          category: prod.categoryName ?? prod.category ?? "",
          price: prod.price ?? 0,
          stock: prod.stock ?? 0,
          status: prod.status ?? "Active",
          description: prod.description,
          images: prod.images,
        });
        const mapped =
          Array.isArray(data)
            ? data.map(mapFunc)
            : data.products?.map(mapFunc) ?? [];
        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const mapped = data.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  return { products, setProducts, categories };
};
