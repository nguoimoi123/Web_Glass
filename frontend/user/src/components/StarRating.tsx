import React, { useState } from 'react';
import { StarIcon } from 'lucide-react';
interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 20,
  className = '',
  showValue = false,
  interactive = false,
  onRatingChange
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  // Calculate the filled stars, half stars, and empty stars
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - filledStars - (hasHalfStar ? 1 : 0);
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };
  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };
  const displayRating = hoverRating !== null ? hoverRating : rating;
  return <div className={`flex items-center ${className}`}>
      <div className="flex">
        {[...Array(max)].map((_, index) => {
        let starFill = 'none';
        if (interactive) {
          starFill = index < (hoverRating || rating) ? 'currentColor' : 'none';
        } else {
          if (index < filledStars) {
            starFill = 'currentColor';
          } else if (index === filledStars && hasHalfStar) {
            // For a half star, we would ideally use a half-filled star icon
            // Since we don't have one, we'll use a filled star for simplicity
            starFill = 'currentColor';
          }
        }
        return <span key={index} className={`${interactive ? 'cursor-pointer' : ''} text-amber-400`} onClick={() => handleClick(index)} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
              <StarIcon size={size} fill={starFill} />
            </span>;
      })}
      </div>
      {showValue && <span className="ml-2 text-sm font-medium text-gray-700">
          {displayRating.toFixed(1)}
        </span>}
    </div>;
};