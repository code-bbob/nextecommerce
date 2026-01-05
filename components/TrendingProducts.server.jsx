import Image from "next/image";
import Link from "next/link";
import { getCDNImageUrl } from "@/utils/imageUtils";
import publicFetch from "@/utils/publicFetch";
import { Sparkles } from 'lucide-react';
import CarouselWrapper from './CarouselWrapper.client';

async function getTrending(productId) {
  if (!productId) return [];
  
  const url = `shop/api/recommendations/?product_id=${productId}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await publicFetch(url, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.trending || [];
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function ProductCard({ product }) {
  const url = `/product/${product.product_id ?? product.id ?? product.slug}`;
  const img = getCDNImageUrl(product.images?.[0]?.image);
  
  return (
    <article className="group flex-none w-[180px] sm:w-[220px] snap-start">
      <Link href={url} prefetch aria-label={`View ${product.name}`} className="block">
        <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border bg-card mb-2">
          {img && (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="220px"
              style={{ objectFit: 'contain' }}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <h3 className="text-sm font-medium line-clamp-2 mb-1 text-foreground">
          {product.name}
        </h3>
        <p className="text-base font-bold text-foreground">
          Rs {Number(product.price || 0).toLocaleString()}
        </p>
      </Link>
    </article>
  );
}

export default async function TrendingProducts({ productId }) {
  const products = await getTrending(productId);
  
  if (!products?.length) return null;

  return (
    <section className="py-6 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">Trending Now</h2>
        <span className="text-sm text-gray-500">({products.length})</span>
      </div>
      
      <CarouselWrapper productCount={products.length}>
        {products.map((product) => (
          <ProductCard key={product.product_id ?? product.id} product={product} />
        ))}
      </CarouselWrapper>
    </section>
  );
}
