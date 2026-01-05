'use client';

import { useState, useEffect, useCallback } from 'react';

const MAX_RECENTLY_VIEWED = 12;
const STORAGE_KEY = 'recentlyViewed';

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecentlyViewed(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  // Add product to recently viewed
  const addProduct = useCallback((product) => {
    if (typeof window === 'undefined') return;

    setRecentlyViewed((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((p) => p.product_id !== product.product_id);
      
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
      
      return updated;
    });
  }, []);

  // Clear all recently viewed
  const clearRecentlyViewed = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  }, []);

  return {
    recentlyViewed,
    addProduct,
    clearRecentlyViewed,
  };
};
