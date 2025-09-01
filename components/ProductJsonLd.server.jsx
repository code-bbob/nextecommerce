// Server component to inject Product JSON-LD
// Expects a product object with properties similar to the backend response
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function ProductJsonLd({ product, siteUrl }) {
  if (!product) return null;
  const images = (product.images || []).map((img) => getCDNImageUrl(img?.image)).filter(Boolean);
  const brand = product.brand?.name || undefined;
  const price = product.price ?? product.current_price ?? undefined;
  const availability = (product.in_stock ?? true) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const aggregateRating = product.rating || product.average_rating
    ? {
        "@type": "AggregateRating",
        ratingValue: Number(product.rating || product.average_rating) || undefined,
        reviewCount: Number(product.review_count || reviews.length) || undefined,
      }
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description || product.description,
    image: images.length ? images : undefined,
    sku: product.sku,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price,
      availability,
      url: siteUrl ? `${siteUrl}/product/${product.product_id ?? product.id ?? product.slug}` : undefined,
    },
    aggregateRating,
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating },
      author: { "@type": "Person", name: r.author || "User" },
      datePublished: r.date || r.created_at,
      reviewBody: r.comment || r.text,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
