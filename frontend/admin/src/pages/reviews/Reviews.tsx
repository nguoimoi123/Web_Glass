import React, { useState, useEffect } from 'react';
import { Eye, Star, MessageCircle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

interface ApiReview {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  author: string;
  rating: number;
  comment: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [reviewToView, setReviewToView] = useState<Review | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');

 useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();

      console.log("API response:", data);

      let mappedReviews: Review[] = [];

      if (Array.isArray(data)) {
        // Nếu API trả trực tiếp array
        mappedReviews = data.map((review: ApiReview) => ({
          id: review._id,
          productId: review.product._id,
          productName: review.product.name,
          customerName: review.author,
          customerEmail: "",
          rating: review.rating,
          comment: review.comment,
          status: review.status || "Pending",
          createdAt: review.createdAt,
        }));
      } else if (data.reviews && Array.isArray(data.reviews)) {
        // Nếu API trả { reviews: [...] }
        mappedReviews = data.reviews.map((review: ApiReview) => ({
          id: review._id,
          productId: review.product._id,
          productName: review.product.name,
          customerName: review.author,
          customerEmail: "",
          rating: review.rating,
          comment: review.comment,
          status: review.status || "Pending",
          createdAt: review.createdAt,
        }));
      }

      setReviews(mappedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  fetchReviews();
}, []);

  const handleViewReview = (review: Review) => {
    setReviewToView(review);
    setIsViewModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    let matchesStatus = true;
    let matchesRating = true;
    if (statusFilter) {
      matchesStatus = review.status === statusFilter;
    }
    if (ratingFilter) {
      matchesRating = review.rating === parseInt(ratingFilter);
    }
    return matchesStatus && matchesRating;
  });

      const columns: {
      header: string;
      accessor: keyof Review | ((data: Review) => React.ReactNode);
      sortable?: boolean;
      cell?: (data: Review) => React.ReactNode;
    }[] = [
    {
      header: 'Product',
      accessor: 'productName',
      sortable: true,
      cell: (review: Review) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{review.productName}</div>
          <div className="text-xs text-gray-500">ID: {review.productId}</div>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      sortable: true,
      cell: (review: Review) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{review.customerName}</div>
          <div className="text-xs text-gray-500">{review.customerEmail}</div>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: 'rating',
      sortable: true,
      cell: (review: Review) => renderStars(review.rating),
    },
    {
      header: 'Comment',
      accessor: 'comment',
      cell: (review: Review) => (
        <div className="truncate max-w-xs">
          <p className="text-sm text-gray-500">{review.comment}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (review: Review) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(review.status)}`}>
          {review.status}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      cell: (review: Review) => new Date(review.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (review: Review) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Eye size={16} />}
            onClick={() => handleViewReview(review)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <div className="flex space-x-4">
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={ratingFilter}
              onChange={e => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={filteredReviews} keyField="id" />

      {/* Review View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Review Details"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="mr-2">
              Close
            </Button>
          </>
        }
      >
        {reviewToView && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle size={24} className="text-blue-500" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    Review #{reviewToView.id}
                  </h3>
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reviewToView.status)}`}
                >
                  {reviewToView.status}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <div className="mr-2">{renderStars(reviewToView.rating)}</div>
                <span className="text-sm text-gray-500">({reviewToView.rating}/5)</span>
              </div>
              <p className="mt-4 text-gray-700">{reviewToView.comment}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product</h3>
                <div className="mt-2 border border-gray-200 rounded-md p-4 bg-white">
                  <p className="text-sm font-medium text-gray-900">{reviewToView.productName}</p>
                  <p className="text-xs text-gray-500">ID: {reviewToView.productId}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                <div className="mt-2 border border-gray-200 rounded-md p-4 bg-white">
                  <p className="text-sm font-medium text-gray-900">{reviewToView.customerName}</p>
                  <p className="text-xs text-gray-500">{reviewToView.customerEmail}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {new Date(reviewToView.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reviews;