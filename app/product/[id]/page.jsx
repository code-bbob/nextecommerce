// app/product/[id]/page.jsx
import BlackNavBar from "@/components/blackNavbar";
import Footer from "@/components/Footer.server";
import ProductDetails from "@/components/ProductDetails.server";
import { notFound } from "next/navigation";
// Removed next/script usage; JSON-LD is injected server-side
import { getCDNImageUrl } from "@/utils/imageUtils";
import ProductJsonLd from "@/components/ProductJsonLd.server";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd.server";
import RelatedProducts from "@/components/RelatedProducts.server";
import { Suspense } from "react";
import { cache } from "react";

// ISR: Revalidate every 1 hour for fast caching
export const revalidate = 3600;

const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL;

const getProduct = cache(async (id) => {
  if (!backendBase) return null;
  const backendUrl = `${backendBase}shop/api/${id}/`;
  const res = await fetch(backendUrl, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
});

// Generate dynamic metadata based on the product data
export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const product = await getProduct(id);
    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      };
    }
    
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
    const title = `${product.name} in Nepal | Buy Online`;
    const description = product.meta_description || product.description;
    const keywords = [
      ...(Array.isArray(product.meta_keywords) ? product.meta_keywords : []),
      `${product.name} price in Nepal`,
      `${product.brand?.name || ""} ${product.name} Kathmandu`,
      "Nepal laptops",
      "smartphones Nepal",
      "buy laptops Nepal",
      "laptop accessories Nepal",
    ];
    return {
      title,
      description,
      keywords,
      alternates: { canonical: `${site}/product/${id}` },
      openGraph: {
        title,
        description,
        url: `${site}/product/${id}`,
        images: product.images && product.images.length > 0 ? [
          {
            url: getCDNImageUrl(product.images[0]?.image),
            width: 800,
            height: 600,
            alt: product.name,
          },  
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.images && product.images.length > 0 ? [getCDNImageUrl(product.images[0]?.image)] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product",
      description: "Product details page",
    };
  }
}

// Add this function to generate static paths
export async function generateStaticParams() {
  if (process.env.GENERATE_PRODUCT_STATIC_PARAMS !== "true") {
    return [];
  }

  try {
    if (!backendBase) return [];

    const ids = [];
    const pageSize = 100; // backend max_page_size
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const res = await fetch(`${backendBase}shop/api/?page=${page}&page_size=${pageSize}`, {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      });
      if (!res.ok) break;
      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];

      totalPages = Number(data?.total_pages || 1);
      for (const product of results) {
        const pid = product?.product_id?.toString();
        if (pid) ids.push({ id: pid });
      }
      page += 1;

      // Hard safety limit (avoid runaway builds)
      if (ids.length > 5000) break;
    }

    return ids;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product = null;
  
  // Fetch product data from backend with caching
  try {
    product = await getProduct(id);
    if (!product) notFound();
  } catch (error) {
    console.error(error);
    notFound();
  }
  
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground font-sans">
      <BlackNavBar color="inherit"/>
      {/* Semantic header for SEO */}
      <header className="sr-only">
        <h1>{product.name} price in Nepal | Buy {product.brand?.name ? `${product.brand.name} ` : ""}{product.name}</h1>
      </header>
      <ProductDetails product={product} />
      {/* Internal linking to related products (lazy loaded) */}
      <Suspense fallback={null}>
        <RelatedProducts productId={id} />
      </Suspense>
      {/* JSON-LD Structured Data (SSR) */}
      <ProductJsonLd product={product} siteUrl={site} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: site },
          { name: "Store", item: `${site}/store` },
          { name: product.name, item: `${site}/product/${id}` },
        ]}
      />
      <Footer/>
    </div>
  );
}
