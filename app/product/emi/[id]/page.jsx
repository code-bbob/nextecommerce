// app/product/[id]/page.jsx
import NavBar from "@/components/navbar";
import OtherForm from "@/components/otherEmiForm";
import ProductInteractive from "@/components/productInteractive";
import RealmeForm from "@/components/realmeEmiForm";
import SamsungForm from "@/components/samsungEmiForm";
import { notFound } from "next/navigation";
import BlackNavBar from "@/components/blackNavbar";


export default async function ProductPage({ params }) {
  const { id } = await params;
  const backendUrl = `http://127.0.0.1:8000/shop/api/${id}/`;
  let product = {};
  
  // Fetch product data from backend. { cache: "no-store" } ensures fresh data.
  try {
  const res = await fetch(backendUrl);
  if (!res.ok) {
    notFound();
  }
  product = await res.json();
  if (!product) {
    notFound();
  }
}
catch (error) {
    console.error(error);
}


  
  return (
    <div className="min-h-screen bg-gray-800 font-sans">
      <BlackNavBar color="inherit"/>
      {/* Pass product data to a client component for interactivity */}
      {product.brandName==="Samsung" && <SamsungForm product={product} />}
      {product.brandName === "Apple" && <SamsungForm product={product} />}
    </div>
  );
}
