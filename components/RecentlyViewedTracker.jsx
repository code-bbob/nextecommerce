'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

/**
 * Invisible component that tracks product views in localStorage
 * Add this to product pages to automatically track viewed products
 */
export default function RecentlyViewedTracker({ product }) {
  const { addProduct } = useRecentlyViewed();
  console.log('RecentlyViewedTracker mounted for product:', product);

  useEffect(() => {
    if (product && product.product_id) {
      // Track the product view
      addProduct({
        product_id: product.product_id,
        product_name: product.name,
        price: product.price,
        discounted_price: product.discounted_price,
        main_image: product.images[0].image,
        category: product.category,
        brand: product.brand,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.product_id]);

  // This component doesn't render anything
  return null;
}
