import React from "react";
import { getImageUrl } from "../../../utils/getImageUrl";
import { Product } from "../types";

interface Props {
  product: Product;
  activeImage: string;
  setActiveImage: (img: string) => void;
}

const ProductImages: React.FC<Props> = ({ product, activeImage, setActiveImage }) => {
  return (
    <div className="md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0">
      <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
        {activeImage && (
          <img
            src={getImageUrl(activeImage)}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {product.images && product.images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`h-20 bg-gray-100 rounded-md overflow-hidden cursor-pointer ${
                activeImage === image ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setActiveImage(image)}
            >
              <img
                src={getImageUrl(image)}
                alt={`${product.name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
