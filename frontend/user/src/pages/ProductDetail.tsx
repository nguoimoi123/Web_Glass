import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCartIcon, TruckIcon, ShieldCheckIcon, HeartIcon, ArrowLeftIcon, RulerIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { getProductById } from '../services/productService';
import { getReviewsByProduct, getAverageRating } from '../services/reviewService';
import { getSizeGuideByCategory } from '../services/sizeGuideService';
import { ProductCard } from '../components/ProductCard';
import { StarRating } from '../components/StarRating';
import { ProductReviews } from '../components/ProductReviews';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { RecentlyViewedProducts } from '../components/RecentlyViewedProducts';
import { ImageGallery } from '../components/ImageGallery';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState<any>(null);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (productId) {
      getProductById(productId).then(setProduct);
      getReviewsByProduct(productId).then(setProductReviews);
      getAverageRating(productId).then(setAverageRating);
      getSizeGuideByCategory(product?.category || '').then(setSizeInfo);
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product as any);
    }
  }, [product, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center text-amber-500 font-medium hover:text-amber-600 transition-colors duration-200"
        >
          <ArrowLeftIcon size={20} className="mr-2" /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,        // dùng _id của backend
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      images: product.images || [],
      description: product.description,
      category: product.category,
      }); // ép kiểu nhanh
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-amber-500 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link to="/shop" className="hover:text-amber-500 transition-colors duration-200">
                Shop
              </Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product image gallery */}
          <div className="relative">
            <ImageGallery
              images={product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg']}
              productName={product.name}
            />
          </div>

          {/* Product info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <button
                onClick={() => toggleWishlist(product as any)}
                className={`p-2 rounded-full ${
                  inWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-amber-500'
                } transition-colors duration-200`}
              >
                <HeartIcon size={24} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex items-center mb-4">
              <StarRating rating={averageRating} showValue={true} />
              <span className="ml-2 text-sm text-gray-500">
                ({productReviews.length}{' '}
                {productReviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <p className="text-2xl font-semibold text-amber-500 mb-6">
              ${product.price}
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
                  {/* Stock */}
            <p className={`mb-6 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </p>
            {sizeInfo && (
              <div className="mb-6">
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center text-amber-500 hover:text-amber-600 transition-colors duration-200"
                >
                  <RulerIcon size={16} className="mr-1" /> Size Guide
                </button>
                <SizeGuideModal
                  isOpen={isSizeGuideOpen}
                  onClose={() => setIsSizeGuideOpen(false)}
                  sizeInfo={sizeInfo as any} // ép kiểu nhanh
                />
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
              >
                <ShoppingCartIcon size={20} className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist({
                  ...product,
                  id: product._id, // đảm bảo id là string _id từ backend
                })}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-colors duration-200 ${
                  inWishlist
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <HeartIcon size={20} className="mr-2" />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center">
                <TruckIcon size={20} className="text-amber-500 mr-3" />
                <span className="text-gray-600">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon size={20} className="text-amber-500 mr-3" />
                <span className="text-gray-600">30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product reviews */}
        <ProductReviews
          reviewsProp={productReviews as any} // ép kiểu nhanh
          averageRatingProp={averageRating}
          productId={product._id}
        />

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct as any} />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed products */}
        <RecentlyViewedProducts currentProductId={product._id as unknown as string} />
      </div>
    </div>
  );
};
