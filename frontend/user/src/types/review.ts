export interface Review {
  _id: string;
  product: string; // ObjectId string
  legacyProductId: number;
  author: string;
  authorId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}