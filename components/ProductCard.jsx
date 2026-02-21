'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addToCart, sendCartToServer } from '@/redux/cartSlice';
import { getLocalCart, setLocalCart } from '@/utils/localCart';
import { useNavigationProgress } from '@/hooks/useNavigationProgress';
import { getCDNImageUrl } from '@/utils/imageUtils';

export default function ProductCard(product) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.access.isAuthenticated);
  const router = useNavigationProgress();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Prevent adding out of stock items
    if (!product.in_stock) {
      return;
    }

    const cartItem = {
      product_id: product.product_id,
      price: product.price,
      image: getCDNImageUrl(product.images?.[0]?.image || product.main_image),
      name: product.name || product.product_name,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    if (isLoggedIn) {
      dispatch(sendCartToServer(cartItem));
    } else {
      const localCart = getLocalCart();
      const existingIndex = localCart.findIndex(
        (item) => item.product_id === product.product_id
      );
      if (existingIndex !== -1) {
        localCart[existingIndex].quantity += 1;
      } else {
        localCart.push(cartItem);
      }
      setLocalCart(localCart);
    }
  };

  const displayName = product.name || product.product_name;
  const displayImage =
    getCDNImageUrl(product.images?.[0]?.image || product.main_image) ||
    '/placeholder.svg';
  const displayPrice = product.discounted_price || product.price;
  const oldPrice = product.old_price;
  const rating = product.ratings?.stats?.avg_rating || 0;

  return (
    <Link
      href={`/product/${product.product_id}`}
      prefetch
      onMouseEnter={() => router.prefetch(`/product/${product.product_id}`)}
      className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 relative group h-full shadow-sm cursor-pointer transition-all duration-300"
    >
      {/* Deal Badge */}
      {product.deal && (
        <div className="absolute top-2 left-2 z-20">
          <span className="inline-block text-white font-bold px-3 py-1 text-xs rounded-full bg-red-600 shadow-lg">
            Sale
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <Image
          src={displayImage}
          alt={displayName}
          fill
          style={{ objectFit: 'contain' }}
          className="group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px"
          loading="lazy"
          quality={80}
        />
      </div>

      {/* Content Container */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug min-h-[40px]">
          {displayName}
        </h3>

        {/* Rating Section */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            {oldPrice && oldPrice > displayPrice && (
              <div className="text-xs line-through text-gray-500 font-medium">
                Rs {oldPrice.toLocaleString()}
              </div>
            )}
            <div className="text-lg font-bold text-gray-900">
              Rs {displayPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="text-sm bg-gray-900 hover:bg-gray-800 text-white w-full py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-semibold mt-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Link>
  );
}
