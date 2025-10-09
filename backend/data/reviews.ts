export interface Review {
  id: number;
  productId: number;
  rating: number;
  author: string;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}
// Sample reviews data
export const reviews: Review[] = [{
  id: 1,
  productId: 1,
  rating: 5,
  author: 'Sarah Johnson',
  date: '2023-08-15',
  title: 'Perfect fit and style',
  comment: 'These glasses are amazing! The quality is exceptional and they fit perfectly. I receive compliments every time I wear them.',
  verified: true,
  helpfulCount: 12
}, {
  id: 2,
  productId: 1,
  rating: 4,
  author: 'Michael Chen',
  date: '2023-07-22',
  title: 'Great quality, slightly large',
  comment: 'The build quality is excellent and the lenses are crystal clear. They run slightly large for my face, but still comfortable overall.',
  verified: true,
  helpfulCount: 5
}, {
  id: 3,
  productId: 1,
  rating: 5,
  author: 'Emma Davis',
  date: '2023-09-03',
  title: 'Stylish and durable',
  comment: "I've had these glasses for a month now and they've held up perfectly despite my active lifestyle. The vintage style is exactly what I was looking for.",
  verified: true,
  helpfulCount: 8
}, {
  id: 4,
  productId: 2,
  rating: 5,
  author: 'James Wilson',
  date: '2023-08-28',
  title: 'Modern and sleek',
  comment: "These square frames are perfect for my face shape. The matte finish gives them a premium look and they're surprisingly lightweight.",
  verified: true,
  helpfulCount: 15
}, {
  id: 5,
  productId: 2,
  rating: 3,
  author: 'Olivia Martinez',
  date: '2023-07-10',
  title: 'Good but expected more',
  comment: 'The style is nice but they feel a bit flimsy for the price. I was expecting more substantial construction.',
  verified: true,
  helpfulCount: 3
}, {
  id: 6,
  productId: 3,
  rating: 5,
  author: 'Sophia Lee',
  date: '2023-09-12',
  title: 'Absolutely gorgeous!',
  comment: "These cat eye frames are stunning! They're comfortable, well-made, and give me that perfect retro look I was after.",
  verified: true,
  helpfulCount: 20
}, {
  id: 7,
  productId: 4,
  rating: 4,
  author: 'Daniel Brown',
  date: '2023-08-05',
  title: 'Classic style, great quality',
  comment: 'The aviator style is timeless and these are well-made. The gold finish is subtle and elegant. Knocked off one star because the nose pads needed adjustment.',
  verified: true,
  helpfulCount: 7
}, {
  id: 8,
  productId: 5,
  rating: 5,
  author: 'Ava Taylor',
  date: '2023-09-18',
  title: 'Perfect for work',
  comment: "These rectangular frames are professional looking and comfortable for all-day wear. I've received many compliments from colleagues.",
  verified: true,
  helpfulCount: 9
}, {
  id: 9,
  productId: 6,
  rating: 5,
  author: 'Noah Garcia',
  date: '2023-07-30',
  title: 'Statement piece',
  comment: "These oversized frames make a statement! They're surprisingly lightweight and the quality is top-notch.",
  verified: true,
  helpfulCount: 14
}, {
  id: 10,
  productId: 7,
  rating: 4,
  author: 'Isabella Rodriguez',
  date: '2023-08-22',
  title: 'Nearly invisible',
  comment: 'The rimless design is perfect for a subtle look. Very comfortable and lightweight, though I worry about durability over time.',
  verified: true,
  helpfulCount: 6
}, {
  id: 11,
  productId: 8,
  rating: 5,
  author: 'Liam Thompson',
  date: '2023-09-05',
  title: 'Unique and well-crafted',
  comment: "The hexagonal shape sets these apart from other glasses. They're well-made and comfortable. Definitely a conversation starter!",
  verified: true,
  helpfulCount: 11
}];
// Helper functions
export const getReviewsByProductId = (productId: number): Review[] => {
  return reviews.filter(review => review.id === productId);
};
export const getAverageRating = (productId: number): number => {
  const productReviews = reviews.filter(review => review.productId === productId);
  if (productReviews.length === 0) {
    return 0;
  }
  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / productReviews.length).toFixed(1));
};
export const getReviewCount = (productId: number): number => {
  return reviews.filter(review => review.productId === productId).length;
};
// Function to generate a random number of reviews for products without reviews
export const getRandomReviewCount = (): number => {
  return Math.floor(Math.random() * 50) + 5; // Random number between 5 and 54
};