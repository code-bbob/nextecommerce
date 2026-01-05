import Image from "next/image";
import Link from "next/link";
import { getCDNImageUrl } from "@/utils/imageUtils";
import publicFetch from "@/utils/publicFetch";
import { TrendingUp, Package, Sparkles } from 'lucide-react';
import CarouselWrapper from './CarouselWrapper.client';

async function getRecommendations(productId) {
  if (!productId) return { upsells: [], complementary: [], trending: [] };
  
  const url = `shop/api/recommendations/?product_id=${productId}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await publicFetch(url, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    if (!res.ok) return { upsells: [], complementary: [], trending: [] };
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return { upsells: [], complementary: [], trending: [] };
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

function ProductCarousel({ products, title, icon: Icon }) {
  if (!products?.length) return null;

  return (
    <section className="py-6 border-t border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
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

export default async function Recommendations({ productId }) {
  const recommendations = await getRecommendations(productId);
  console.log(recommendations)
  
  const hasUpsells = recommendations.upsells?.length > 0;
  const hasComplementary = recommendations.complementary?.length > 0;
  const hasTrending = recommendations.trending?.length > 0;

  if (!hasUpsells && !hasComplementary && !hasTrending) {
    return null;
  }
  return (
    <section className="py-8">
      {hasUpsells && (
        <ProductCarousel
          products={recommendations.upsells}
          title="Upgrade Your Experience"
          icon={TrendingUp}
        />
      )}

      {/* {hasComplementary && (
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
      )} */}
    </section>
  );
}   