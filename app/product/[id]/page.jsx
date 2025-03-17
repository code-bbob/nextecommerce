// app/product/[id]/page.jsx
import NavBar from "@/components/navbar";
import ProductInteractive from "@/components/productInteractive";
import { notFound } from "next/navigation";
import Script from "next/script";

// Generate dynamic metadata based on the product data
export async function generateMetadata({ params }) {
  const { id } = params;
  const backendUrl = `http://127.0.0.1:8000/shop/api/${id}/`;
  
  try {
    const res = await fetch(backendUrl, { cache: "no-store" });
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
    
    return {
      title: `${product.name} in Nepal`,
      description: product.meta_description || product.description,
      keywords: product.meta_keywords, // include meta_keywords field from backend
      openGraph: {
        title: `${product.name} in Nepal`,
        description: product.meta_description || product.description,
        url: `http://127.0.0.1:3000/product/${id}`,
        images: [
          {
            url: product.image_url,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.meta_description || product.description,
        images: [product.image_url],
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

export default async function ProductPage({ params }) {
  const { id } = params;
  const backendUrl = `http://127.0.0.1:8000/shop/api/${id}/`;
  let product = {};
  
  // Fetch product data from backend. { cache: "no-store" } ensures fresh data.
  try {
    const res = await fetch(backendUrl, { cache: "no-store" });
    if (!res.ok) {
      notFound();
    }
    product = await res.json();
    if (!product) {
      notFound();
    }
  } catch (error) {
    console.error(error);
  }
  console.log(product);
  
  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url,
    description: product.meta_description || product.description,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "NPR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />
      {/* Pass product data to a client component for interactivity */}
      <ProductInteractive product={product} />
      {/* JSON-LD Structured Data for SEO */}
      <Script
        type="application/ld+json"
        id="product-jsonld"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
