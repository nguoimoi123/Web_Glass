import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Star, Package, DollarSign, Tag, Users, PaintBucket, Ruler } from 'lucide-react';
import { getProductById } from '../../services/product.service';
import { Product } from '../../types';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { getImageUrl } from "../../utils/getImageUrl";
import { toast } from 'sonner';
const ProductDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  useEffect(() => {
    const fetchProduct = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const response = await getProductById(id);
      console.log('API Response:', response); // check

      const productData = response?.data || response; // fallback nếu axios trả data trực tiếp
      if (!productData) {
        setError('Product not found');
        toast.error('Product not found');
        return;
      }

      setProduct(productData);
      setActiveImage(productData.image || productData.images?.[0] || '');
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

    fetchProduct();
  }, [id]);

  const handleEditProduct = () => {
    if (product) {
      navigate(`/products/edit/${product._id}`);
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>;
  }
  if (error || !product) {
    return <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Product not found'}
        </h2>
        <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>;
  }
  const stockStatus = () => {
    if (product.stock <= 0) return {
      label: 'Out of Stock',
      color: 'bg-red-100 text-red-800'
    };
    if (product.stock < 10) return {
      label: 'Low Stock',
      color: 'bg-yellow-100 text-yellow-800'
    };
    return {
      label: 'In Stock',
      color: 'bg-green-100 text-green-800'
    };
  };
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/products')}>
            Back to Products
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
        <Button variant="primary" leftIcon={<Edit size={16} />} onClick={handleEditProduct}>
          Edit Product
        </Button>
      </div>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row">
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
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${stockStatus().color}`}>
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
                    <p className="text-sm font-semibold">
                      {product.stock} units
                    </p>
                  </div>
                </div>
                {product.material && <div className="flex items-center space-x-2">
                    <Ruler className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Material
                      </p>
                      <p className="text-sm font-semibold">
                        {product.material}
                      </p>
                    </div>
                  </div>}
                {product.gender && <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p className="text-sm font-semibold capitalize">
                        {product.gender}
                      </p>
                    </div>
                  </div>}
                {product.color && <div className="flex items-center space-x-2">
                    <PaintBucket className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Color</p>
                      <p className="text-sm font-semibold">{product.color}</p>
                    </div>
                  </div>}
                {product.lensType && <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Lens Type
                      </p>
                      <p className="text-sm font-semibold">
                        {product.lensType}
                      </p>
                    </div>
                  </div>}
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
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Product Status
            </h3>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Inventory Details
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Current Stock
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {product.stock}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${stockStatus().color}`}>
                  {stockStatus().label}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${product.stock <= 0 ? 'bg-red-600' : product.stock < 10 ? 'bg-yellow-500' : 'bg-green-600'}`} style={{
                width: `${Math.min(100, product.stock / 100 * 100)}%`
              }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0</span>
                <span className="text-xs text-gray-500">100+</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pricing Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Base Price
                </p>
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
                <span className="text-sm text-gray-600">
                  Margin (estimated)
                </span>
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
      </div>
    </div>;
};
export default ProductDetails;