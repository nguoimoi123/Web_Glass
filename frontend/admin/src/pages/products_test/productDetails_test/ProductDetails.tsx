import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "../../../components/ui/Spinner";
import { getProductById } from "../../../services/product.service";
import { Product } from "../types";

import {
  ProductHeader,
  ProductImages,
  ProductInfo,
  ProductInventory,
  ProductPricing,
} from "./index";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const response = await getProductById(id);
        const data = response?.data || response;
        if (!data) {
          toast.error("Product not found");
          return;
        }
        setProduct(data);
        setActiveImage(data.image || data.images?.[0] || "");
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product not found
        </h2>
      </div>
    );

  return (
    <div>
      <ProductHeader product={product} />
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row">
            <ProductImages
              product={product}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductInventory product={product} />
        <ProductPricing product={product} />
      </div>
    </div>
  );
};

export default ProductDetails;
