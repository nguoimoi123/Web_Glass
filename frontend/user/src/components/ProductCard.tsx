import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, EyeIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { QuickViewModal } from './QuickViewModal';
import { StarRating } from './StarRating';
import { getReviewsByProduct } from '../services/reviewService';

interface ProductCardProps {
  product: any; // product object returned from backend
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  // 👉 Luôn dùng _id từ backend
  const productId = product?._id?.toString();

  useEffect(() => {
    let mounted = true;
    const loadReviews = async () => {
      try {
        if (!productId) return;
        const reviews = await getReviewsByProduct(productId);
        if (!mounted) return;
        if (Array.isArray(reviews)) {
          setReviewCount(reviews.length);
          const avg = reviews.length
            ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
            : 0;
          setAvgRating(avg);
        }
      } catch (err) {
        console.error('Lỗi khi tải review cho product card', err);
      }
    };
    loadReviews();
    return () => { mounted = false; };
  }, [productId]);

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <div className="relative group">
        <img
          src={product.image ?? product.images?.[0]}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
        <div className="absolute right-2 top-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            aria-label="Quick view"
            onClick={() => setIsQuickViewOpen(true)}
            className="p-2 bg-white rounded-full shadow"
          >
            <EyeIcon size={16} />
          </button>
          <button
            aria-label="Add to wishlist"
            onClick={() => {
              toggleWishlist({ ...product, id: product._id }); // dùng _id
            }}
            className="p-2 bg-white rounded-full shadow"
          >
            <HeartIcon
              size={16}
              fill={isInWishlist(product._id) ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={avgRating ?? 0} interactive={false} />
          {reviewCount != null && (
            <span className="text-sm text-gray-500">({reviewCount})</span>
          )}
        </div>
        <p className="text-amber-500 font-semibold mb-3">
          ${(product.price || 0).toFixed(2)}
        </p>
        <div className="flex justify-between items-center">
          <Link
            to={`/products/${product._id}`} // luôn dùng _id
            className="text-sm text-gray-700 hover:text-amber-500 transition-colors duration-200"
          >
            View Details
          </Link>
          <button
            onClick={() =>
              addToCart({
                id: product._id, // dùng _id
                name: product.name,
                price: product.price,
                image: product.images?.[0] || '',
                images: product.images || [],
                description: product.description,
                category: product.category,
              })
            }
            className="px-3 py-1 rounded-md bg-amber-500 text-white text-sm hover:bg-amber-600 transition-all duration-200"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCartIcon size={18} />
          </button>
        </div>
      </div>
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
};

export default ProductCard;
