import React, { useEffect, useState } from 'react';
interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}
export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onPriceChange
}) => {
  const [minValue, setMinValue] = useState<number>(minPrice);
  const [maxValue, setMaxValue] = useState<number>(maxPrice);
  // Update local state when props change
  useEffect(() => {
    setMinValue(minPrice);
    setMaxValue(maxPrice);
  }, [minPrice, maxPrice]);
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= maxValue) {
      setMinValue(value);
    }
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= minValue) {
      setMaxValue(value);
    }
  };
  const handleApply = () => {
    onPriceChange(minValue, maxValue);
  };
  const handleReset = () => {
    setMinValue(minPrice);
    setMaxValue(maxPrice);
    onPriceChange(minPrice, maxPrice);
  };
  return <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
      <div className="flex items-center mb-4">
        <div className="mr-2">
          <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
            Min ($)
          </label>
          <input type="number" id="min-price" value={minValue} onChange={handleMinChange} min={minPrice} max={maxPrice} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
        <div className="mx-2">—</div>
        <div className="ml-2">
          <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
            Max ($)
          </label>
          <input type="number" id="max-price" value={maxValue} onChange={handleMaxChange} min={minPrice} max={maxPrice} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
      </div>
      {/* Price slider representation */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-6">
        <div className="absolute h-2 bg-amber-500 rounded-full" style={{
        left: `${(minValue - minPrice) / (maxPrice - minPrice) * 100}%`,
        right: `${100 - (maxValue - minPrice) / (maxPrice - minPrice) * 100}%`
      }}></div>
      </div>
      <div className="flex space-x-2">
        <button onClick={handleApply} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors duration-200 text-sm">
          Apply
        </button>
        <button onClick={handleReset} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm">
          Reset
        </button>
      </div>
    </div>;
};