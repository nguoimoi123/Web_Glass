import React from "react";
import { Tag, Package, Users, PaintBucket, Ruler, Star } from "lucide-react";
import { Product } from "../types";

interface Props {
  product: Product;
}

const ProductInfo: React.FC<Props> = ({ product }) => {
  const stockStatus = () => {
    if (product.stock <= 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (product.stock < 10)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    };

  return (
    <div className="md:w-1/2">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mb-2">
            {product.categoryName}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h2>
        </div>
        <span
          className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${stockStatus().color}`}
        >
          {stockStatus().label}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          ID: {product.legacyId || product._id}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">Brand</p>
            <p className="text-sm font-semibold">{product.brand}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">Stock</p>
            <p className="text-sm font-semibold">{product.stock} units</p>
          </div>
        </div>

        {product.material && (
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Material</p>
              <p className="text-sm font-semibold">{product.material}</p>
            </div>
          </div>
        )}

        {product.gender && (
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-sm font-semibold capitalize">
                {product.gender}
              </p>
            </div>
          </div>
        )}

        {product.color && (
          <div className="flex items-center space-x-2">
            <PaintBucket className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Color</p>
              <p className="text-sm font-semibold">{product.color}</p>
            </div>
          </div>
        )}

        {product.lensType && (
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Lens Type</p>
              <p className="text-sm font-semibold">{product.lensType}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Description
        </h3>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <p className="text-gray-500">Created:</p>
          <p className="font-medium">{formatDate(product.createdAt)}</p>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <p className="text-gray-500">Last Updated:</p>
          <p className="font-medium">{formatDate(product.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
