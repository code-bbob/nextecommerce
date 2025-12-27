import Image from "next/image";
import Link from "next/link";
import { getCDNImageUrl } from "@/utils/imageUtils";
import publicFetch from "@/utils/publicFetch";

async function getRelatedProducts(productId) {
  const relUrl = `shop/api/related/${productId}/`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await publicFetch(relUrl, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export default async function RelatedProducts({ productId, products = [] }) {
  const resolvedProducts = products?.length
    ? products
    : productId
      ? await getRelatedProducts(productId)
      : [];

  if (!resolvedProducts?.length) return null;
  return (
    <section aria-labelledby="related-heading" className="mx-auto w-full px-4 py-8">
      <h2 id="related-heading" className="text-2xl md:text-3xl font-bold mb-4">
        Related Products in Nepal
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {resolvedProducts.map((p) => {
          const url = `/product/${p.product_id ?? p.id ?? p.slug}`;
          const img = getCDNImageUrl(p.images?.[0]?.image);
          return (
            <article key={p.product_id ?? p.id ?? p.slug} className="group">
              <Link href={url} prefetch aria-label={`View ${p.name}`} className="block">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border bg-card">
                  {img && (
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      sizes="(max-width:768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium line-clamp-2" title={p.name}>
                  {p.name}
                </h3>
                {typeof p.price !== "undefined" && (
                  <p className="text-sm text-muted-foreground">Rs. {Number(p.price).toLocaleString()}</p>
                )}
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
