import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface Review {
  _id: string;
  legacyProductId: number;
  author: string;
  authorId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

interface ReviewContextType {
  reviews: Review[];
  fetchReviews: (legacyProductId: number) => void;
  addReview: (review: Partial<Review>) => Promise<void>;
  updateReview: (id: string, review: Partial<Review>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReviews must be used within ReviewProvider");
  return context;
};

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async (legacyProductId: number) => {
    const res = await axios.get(`/api/reviews/product/${legacyProductId}`);
    setReviews(res.data);
  };

  const addReview = async (review: Partial<Review>) => {
    const res = await axios.post("/api/reviews", review, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setReviews((prev) => [res.data, ...prev]);
  };

  const updateReview = async (id: string, review: Partial<Review>) => {
    const res = await axios.put(`/api/reviews/${id}`, review, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setReviews((prev) => prev.map((r) => (r._id === id ? res.data : r)));
  };

  const deleteReview = async (id: string) => {
    await axios.delete(`/api/reviews/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <ReviewContext.Provider value={{ reviews, fetchReviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  );
};
