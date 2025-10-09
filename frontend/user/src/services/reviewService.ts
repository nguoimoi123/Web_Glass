import api from "./api";

export async function getReviewsByProduct(productId: string) {
  if (!productId) return [];
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data.reviews || [];
}

export async function addReview(payload: any) {
  const res = await api.post("/reviews", payload); // payload.productId = _id
  return res.data.review || res.data;
}

export async function getAverageRating(productId: string): Promise<number> {
  if (!productId) return 0;
  const reviews = await getReviewsByProduct(productId);
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
  return total / reviews.length;
}

export async function updateReview(id: string, payload: any) {
  if (!id) throw new Error("Review ID is required");
  const res = await api.put(`/reviews/${id}`, payload);
  return res.data.review || res.data;
}

export async function deleteReview(id: string) {
  if (!id) throw new Error("Review ID is required");
  const res = await api.delete(`/reviews/${id}`);
  return res.data || { message: "Review deleted" };
}
