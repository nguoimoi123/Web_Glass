import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { getReviewsByProduct } from '../services/reviewService';
import { getSizeGuide } from '../services/sizeGuideService';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [sizeInfo, setSizeInfo] = useState<any | null>(null);

  // 👉 Chỉ dùng _id
  const productId = product?._id?.toString();
  const categoryName = product?.categoryName ?? product?.category ?? product?.category?.name;

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;

    const load = async () => {
      try {
        if (productId) {
          const r = await getReviewsByProduct(productId);
          if (mounted) setReviews(Array.isArray(r) ? r : []);
        }
        if (categoryName) {
          const s = await getSizeGuide(categoryName);
          if (mounted) setSizeInfo(s);
        }
      } catch (err) {
        console.error('Lỗi QuickView load', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, [isOpen, productId, categoryName]);

  if (!isOpen) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md max-w-3xl w-full p-6 relative">
        <button className="absolute top-4 right-4" onClick={handleClose}><XIcon /></button>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <img
              src={product.image ?? product.images?.[0]}
              alt={product.name}
              className="w-full h-80 object-cover rounded"
            />
          </div>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Size information</h4>
            {sizeInfo ? (
              <div className="text-sm text-gray-700 space-y-1">
                <div><strong>Frame Width:</strong> {sizeInfo.frameWidth}</div>
                <div><strong>Lens Width:</strong> {sizeInfo.lensWidth}</div>
                <div><strong>Bridge Width:</strong> {sizeInfo.bridgeWidth}</div>
                <div><strong>Temple Length:</strong> {sizeInfo.templeLength}</div>
                <div><strong>Lens Height:</strong> {sizeInfo.lensHeight}</div>
                <div><strong>Weight:</strong> {sizeInfo.weight}</div>
                <div><strong>Suitable Face Shapes:</strong> {sizeInfo.faceShapes?.join(', ')}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No size guide available</div>
            )}
          </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Reviews ({reviews.length})</h4>
              <div className="max-h-36 overflow-auto text-sm text-gray-700 space-y-2">
                {reviews.slice(0, 5).map(r => (
                  <div key={r._id || r.id} className="border-b pb-2">
                    <div className="font-medium">{r.user || r.name || 'Anonymous'}</div>
                    <div className="text-sm">{r.comment}</div>
                  </div>
                ))}
                {reviews.length === 0 && <div className="text-gray-500">No reviews yet</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default QuickViewModal;
