import React, { useEffect, useState } from 'react';
import { StarRating } from './StarRating';
import { getReviewsByProduct, addReview } from '../services/reviewService';
import { useUser } from '../context/UserContext';

interface ProductReviewsProps {
  product?: any; // product object from backend
  productId?: string; // fallback id
  reviewsProp?: any[]; // optional preloaded reviews
  averageRatingProp?: number;
}


export const ProductReviews: React.FC<ProductReviewsProps> = ({ product, productId, reviewsProp }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [reviews, setReviews] = useState<any[]>(reviewsProp ?? []);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, title: '', comment: '' });
  const [formError, setFormError] = useState('');
  const { currentUser } = useUser();

  // 👉 Chỉ dùng _id
  const productIdToUse = product?._id?.toString() ?? productId;

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      try {
        if (!productIdToUse) return;

        setLoading(true);

        const data = await getReviewsByProduct(productIdToUse);

        console.log('Fetched reviews:', data); // Debug dữ liệu từ API

        if (!mounted) return;

        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi khi tải reviews', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReviews();

    return () => { mounted = false; };
  }, [productIdToUse]);

  const sorted = React.useMemo(() => {
    if (!reviews) return [];
    const copy = [...reviews];
    switch (sortBy) {
      case 'newest':
        return copy.sort((a,b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
      case 'highest':
        return copy.sort((a,b) => (b.rating||0) - (a.rating||0));
      case 'lowest':
        return copy.sort((a,b) => (a.rating||0) - (b.rating||0));
      case 'helpful':
        return copy.sort((a,b) => (b.helpfulCount||0) - (a.helpfulCount||0));
      default:
        return copy;
    }
  }, [reviews, sortBy]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (newRating: number) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setFormError('You must be logged in to submit a review');
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setFormError('Rating must be between 1 and 5');
      return;
    }

    if (!formData.comment.trim()) {
      setFormError('Comment is required');
      return;
    }

    try {
      // 👉 gửi productId
      const newReview = await addReview({ ...formData, productId: productIdToUse });

      setReviews([newReview, ...reviews]);
      setFormData({ rating: 0, title: '', comment: '' });
      setShowReviewForm(false);
      setFormError('');
    } catch (err) {
      console.error('Error submitting review:', err);
      setFormError('Error submitting review');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Customer reviews</h3>
        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="border rounded-md p-1 text-sm">
            <option value="newest">Newest</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
            <option value="helpful">Most helpful</option>
          </select>
          <button className="text-sm text-amber-500" onClick={() => setShowReviewForm(v => !v)}>
            {showReviewForm ? 'Close' : 'Write review'}
          </button>
        </div>
      </div>

      {loading ? <div>Loading reviews...</div> : (
        sorted.length ? (
          <div className="space-y-4">
            {sorted.map((r) => (
              <div key={r._id || r.id} className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{r.author || r.user?.name || 'Anonymous'}</div>
                    <StarRating rating={r.rating || 0} interactive={false} />
                  </div>
                  <div className="text-sm text-gray-500">{new Date(r.createdAt || r.date).toLocaleDateString()}</div>
                </div>
                <p className="mt-2 text-gray-700">{r.comment || r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">There are no reviews yet. Be the first to review this product!</p>
          </div>
        )
      )}

      {showReviewForm && (
        <div className="border p-4 rounded-md">
          <h4 className="font-medium mb-2">Write a review</h4>
          {formError && <p className="text-red-500 mb-2">{formError}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <StarRating rating={formData.rating} interactive={true} onRatingChange={handleRatingChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleFormChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Comment</label>
              <textarea name="comment" value={formData.comment} onChange={handleFormChange} className="w-full border p-2 rounded" rows={4} />
            </div>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
