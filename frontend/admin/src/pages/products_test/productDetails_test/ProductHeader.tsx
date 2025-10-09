import React from "react";
import { ArrowLeft, Edit } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";

interface Props {
  product: Product;
}

const ProductHeader: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate("/products")}
        >
          Back to Products
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
      </div>
      <Button
        variant="primary"
        leftIcon={<Edit size={16} />}
        onClick={() => navigate(`/products/edit/${product.id}`)}
      >
        Edit Product
      </Button>
    </div>
  );
};

export default ProductHeader;
