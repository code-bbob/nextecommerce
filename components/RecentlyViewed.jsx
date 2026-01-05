'use client';

import { Clock } from 'lucide-react';
import ProductCarousel from '@/components/ProductCarousel';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function RecentlyViewed({ currentProductId }) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // Filter out current product
  const filteredProducts = recentlyViewed.filter(
    (product) => product.product_id !== currentProductId
  );

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={clearRecentlyViewed}
        className="absolute top-6 right-0 text-sm text-gray-600 hover:text-gray-900 transition-colors z-10"
      >
        Clear
      </button>
      <ProductCarousel
        products={filteredProducts.slice(0, 15)}
        title="Recently Viewed"
        icon={Clock}
      />
    </div>
  );
}
