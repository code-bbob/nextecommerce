// app/product/[id]/page.jsx
import NavBar from "@/components/navbar";
import ProductInteractive from "@/components/productInteractive";
import { notFound } from "next/navigation";

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
  console.log(product)
  if (!product) {
    notFound();
  }
}
catch (error) {
    console.error(error);
}

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-600 to-black font-sans">
      <NavBar />
      {/* Pass product data to a client component for interactivity */}
      <ProductInteractive product={product} />
    </div>
  );
}
