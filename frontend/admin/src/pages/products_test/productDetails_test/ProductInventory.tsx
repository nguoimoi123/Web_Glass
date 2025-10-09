import React from "react";
import { Product } from "../types";

interface Props {
  product: Product;
}

const ProductInventory: React.FC<Props> = ({ product }) => {
  const stockStatus = () => {
    if (product.stock <= 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (product.stock < 10)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Details</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Current Stock
            </p>
            <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <span
              className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${stockStatus().color}`}
            >
              {stockStatus().label}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                product.stock <= 0
                  ? "bg-red-600"
                  : product.stock < 10
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
              style={{
                width: `${Math.min(100, (product.stock / 100) * 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0</span>
            <span className="text-xs text-gray-500">100+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInventory;
