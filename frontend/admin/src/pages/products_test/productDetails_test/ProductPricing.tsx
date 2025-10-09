import React from "react";
import { Product } from "../types";

interface Props {
  product: Product;
}

const ProductPricing: React.FC<Props> = ({ product }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Pricing Information</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Base Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Value
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ${(product.price * product.stock).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Cost (estimated)</span>
            <span className="text-sm font-medium">
              ${(product.price * 0.6).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Margin (estimated)</span>
            <span className="text-sm font-medium">40%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              Profit per unit (estimated)
            </span>
            <span className="text-sm font-medium">
              ${(product.price * 0.4).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
