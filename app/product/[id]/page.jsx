// app/product/[id]/page.jsx
import BlackNavBar from "@/components/blackNavbar";
import Footer from "@/components/Footer.server";
import NavBar from "@/components/navbar";
import ProductInteractive from "@/components/productInteractive";
import { notFound } from "next/navigation";
// Removed next/script usage; JSON-LD is injected server-side
import { getCDNImageUrl } from "@/utils/imageUtils";
import CatBar from "@/components/catbar";
import ProductJsonLd from "@/components/ProductJsonLd.server";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd.server";
import RelatedProducts from "@/components/RelatedProducts.server";
import { Suspense } from "react";

// ISR: Revalidate every 1 hour for fast caching
export const revalidate = 3600;

// Generate dynamic metadata based on the product data
export async function generateMetadata({ params }) {
  const { id } = await params;
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/${id}/`;
  
  try {
    const res = await fetch(backendUrl, {
      next: { revalidate: 3600 }  // ISR: Revalidate every 1 hour
    });
    if (!res.ok) {
      return {
        title: "Product Not Found",
        description: "The product you are looking for does not exist.",
      };
    }
    
    const product = await res.json();
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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/`, { 
      next: { revalidate: 3600 },  // ISR: Revalidate every 1 hour
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch products for static params');
      return [];
    }

    const data = await res.json();
    
    // Handle the paginated response format
    if (!data.results || !Array.isArray(data.results)) {
      console.error('API did not return expected results array');
      return [];
    }

    return data.results.map((product) => ({
      id: product.product_id?.toString() || ''
    })).filter(param => param.id);
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/${id}/`;
  let product = {};
  
  // Fetch product data from backend with caching
  try {
    // ISR: Revalidate every 1 hour
    const res = await fetch(backendUrl, { 
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      notFound();
    }
    product = await res.json();
    if (!product) {
      notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  }
  
  // Fetch related products with timeout to avoid slow loads
  let related = [];
  try {
    const relUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/related/${id}/`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const relRes = await fetch(relUrl, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    if (relRes.ok) {
      const relData = await relRes.json();
      related = Array.isArray(relData?.results) ? relData.results : Array.isArray(relData) ? relData : [];
    }
  } catch (error) {
    // If related products timeout or fail, continue without them
    console.warn('Related products fetch failed, continuing without them');
  }
  
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground font-sans">
      <BlackNavBar color="inherit"/>
      <CatBar />
      {/* Semantic header for SEO */}
      <header className="sr-only">
        <h1>{product.name} price in Nepal | Buy {product.brand?.name ? `${product.brand.name} ` : ""}{product.name}</h1>
      </header>
      {/* Pass product data to a client component for interactivity (code-split) */}
      <ProductInteractive product={product} />
      {/* Internal linking to related products (lazy loaded) */}
      <Suspense fallback={null}>
        <RelatedProducts products={related} />
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
