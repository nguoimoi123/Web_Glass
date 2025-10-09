import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
interface ImageGalleryProps {
  images: string[];
  productName: string;
}
export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const handlePrevImage = () => {
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    // Reset zoom when changing images
    setIsZoomed(false);
  };
  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
    // Reset zoom when changing images
    setIsZoomed(false);
  };
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    // Reset zoom when changing images
    setIsZoomed(false);
  };
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  return <div className="relative">
      {/* Main image container */}
      <div className="relative overflow-hidden rounded-lg shadow-md mb-4">
        <div className={`relative cursor-pointer transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`} onClick={toggleZoom}>
          <img src={images[currentImageIndex]} alt={`${productName} - Image ${currentImageIndex + 1}`} className="w-full h-auto object-cover" />
        </div>
        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-70 rounded-full p-2">
          {isZoomed ? <ZoomOutIcon size={20} className="text-gray-700" /> : <ZoomInIcon size={20} className="text-gray-700" />}
        </div>
        {/* Navigation arrows */}
        {images.length > 1 && <>
            <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-opacity" onClick={handlePrevImage} aria-label="Previous image">
              <ChevronLeftIcon size={24} className="text-gray-700" />
            </button>
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-opacity" onClick={handleNextImage} aria-label="Next image">
              <ChevronRightIcon size={24} className="text-gray-700" />
            </button>
          </>}
      </div>
      {/* Image thumbnails */}
      {images.length > 1 && <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => <div key={index} className={`w-16 h-16 flex-shrink-0 cursor-pointer border-2 rounded ${currentImageIndex === index ? 'border-amber-500' : 'border-transparent'}`} onClick={() => handleThumbnailClick(index)}>
              <img src={image} alt={`${productName} thumbnail ${index + 1}`} className="w-full h-full object-cover rounded" />
            </div>)}
        </div>}
      {/* Image counter */}
      {images.length > 1 && <div className="text-center mt-2 text-sm text-gray-500">
          Image {currentImageIndex + 1} of {images.length} •{' '}
          {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
        </div>}
    </div>;
};