// app/product/[id]/page.jsx
import BlackNavBar from "@/components/blackNavbar";
import Footer from "@/components/Footer.server";
import NavBar from "@/components/navbar";
import ProductInteractive from "@/components/productInteractive";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getCDNImageUrl } from "@/utils/imageUtils";
import CatBar from "@/components/catbar";

// Generate dynamic metadata based on the product data
export async function generateMetadata({ params }) {
  const { id } = await params;
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/${id}/`;
  
  try {
    const res = await fetch(backendUrl, {
      next: { revalidate: 3600 }  // Use same revalidation as main content
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
    
    return {
      title: `${product.name} in Nepal`,
      description: product.meta_description || product.description,
      keywords: product.meta_keywords, // include meta_keywords field from backend
      openGraph: {
        title: `${product.name} in Nepal`,
        description: product.meta_description || product.description,
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`,
        images: [
          {
            url: getCDNImageUrl(product.images[0]?.image),
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
        images: [getCDNImageUrl(product.images[0]?.image)],
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
      next: { revalidate: 100 },
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
  
  // Fetch product data from backend. { cache: "no-store" } ensures fresh data.
  try {
    // Modified fetch to use ISR with 1 hour revalidation
    const res = await fetch(backendUrl, { 
      next: { revalidate: 100 } // Revalidate every hour
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
  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: getCDNImageUrl(product.images[0]?.image),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground font-sans">
      <BlackNavBar color="inherit"/>
      <CatBar />
      {/* Pass product data to a client component for interactivity */}
      <ProductInteractive product={product} />
      {/* JSON-LD Structured Data for SEO */}
      <Script
        type="application/ld+json"
        id="product-jsonld"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Footer/>
    </div>
  );
}
