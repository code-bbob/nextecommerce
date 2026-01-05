'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Package, Sparkles } from 'lucide-react';
import ProductCarousel from '@/components/ProductCarousel';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Recommendations({ productId }) {
  const [recommendations, setRecommendations] = useState({
    upsells: [],
    complementary: [],
    trending: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `${BACKEND_URL}/shop/api/recommendations/?product_id=${productId}`;
        console.log('Fetching recommendations from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Recommendations data:', data);
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        console.log('Loading complete');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-8 py-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="flex-none w-[180px] h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            asd
          </div>
        ))}
      </div>
    );
  }

  const hasUpsells = recommendations.upsells?.length > 0;
  const hasComplementary = recommendations.complementary?.length > 0;
  const hasTrending = recommendations.trending?.length > 0;

  if (!hasUpsells && !hasComplementary && !hasTrending) {
    return null;
  }

  return (
    <div className="space-y-8 py-8">
      {hasUpsells && (
        <ProductCarousel
          products={recommendations.upsells}
          title="Upgrade Your Experience"
          icon={TrendingUp}
        />
      )}

      {hasComplementary && (
        <ProductCarousel
          products={recommendations.complementary}
          title="Complete Your Setup"
          icon={Package}
        />
      )}

      {hasTrending && (
        <ProductCarousel
          products={recommendations.trending}
          title="Trending Now"
          icon={Sparkles}
        />
      )}
    </div>
  );
}
