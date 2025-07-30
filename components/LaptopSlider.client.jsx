"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function LaptopGrid() {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchLaptops() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/catsearch/laptop/?page=1`);
        if (!res.ok) {
          throw new Error("Failed to fetch laptops");
        }
        const data = await res.json();
        setProducts(data.results.slice(0, 9) || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLaptops();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Set on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile shows only 8, desktop shows 9
  const displayedProducts = isMobile ? products.slice(0, 8) : products;

  return (
    <section className=" text-black py-12">
      <div className="">
        <h2 className="text-xl font-bold mb-4 text-center text-white">TOP SELLING PRODUCTS</h2>

        <div className="grid grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => (
            <div
              key={product.product_id}
              //if is mobile, add margin1 using tailwind css
              className={`${
                isMobile ? "m-1" : "m-0 "
              } border border-gray-700 bg-gray-800 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.03] relative cursor-pointer`}
              onClick={() => router.push(`/product/${product.product_id}`)}
              >
              {/* MOBILE LAYOUT */}
              <div className="block lg:hidden">
                {product.images?.[0]?.image ? (
                  <div className="relative w-full h-40 bg-white">
                    <Image
                      src={getCDNImageUrl(product.images[0].image)}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                <div className="p-4">
                  {product.is_new && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded w-fit mb-2 inline-block">NEW</span>
                  )}
                  <h3 className="font-medium text-base mb-2 line-clamp-2">
                    {product.name || "Product Name"}
                  </h3>
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                      </svg>
                    ))}
                    <span className="text-gray-400 text-xs ml-1">
                      ({product.rating_count || Math.floor(Math.random() * 5) + 1})
                    </span>
                  </div>
                  <div className="text-xl font-bold">
                    RS {product.price?.toLocaleString() || "99,999.00"}
                  </div>
                  {product.old_price && product.old_price > product.price && (
                    <div className="text-gray-400 line-through text-sm">
                      RS {product.old_price?.toLocaleString() || "109,999.00"}
                    </div>
                  )}
                </div>
              </div>

              {/* DESKTOP LAYOUT */}
              <div className="hidden lg:block p-4">
                <div className="flex">
                  <div className="w-1/2 flex items-center justify-center pr-2">
                    {product.images?.[0]?.image ? (
                      <div className="relative h-40 w-40">
                        <Image
                          src={getCDNImageUrl(product.images[0].image)}
                          alt={product.name}
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="160px"
                        />
                      </div>
                    ) : (
                      <div className="h-40 w-40 bg-gray-700 flex items-center justify-center rounded">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="w-1/2 flex flex-col h-full">
                    {product.is_new && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded w-fit mb-2">NEW</span>
                    )}
                    <h3 className="font-medium text-base mb-2 line-clamp-2">
                      {product.name || "Product Name"}
                    </h3>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                        </svg>
                      ))}
                      <span className="text-gray-400 text-xs ml-1">
                        ({product.rating_count || Math.floor(Math.random() * 5) + 1})
                      </span>
                    </div>
                    <div className="mt-auto">
                      <div className="text-xl font-bold">
                        RS {product.price?.toLocaleString() || "99,999.00"}
                      </div>
                      {product.old_price && product.old_price > product.price && (
                        <div className="text-gray-400 line-through text-sm">
                          RS {product.old_price?.toLocaleString() || "109,999.00"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Discount Badge */}
              {product.old_price && product.old_price > product.price && (
                <div className="absolute hidden md:block bottom-4 right-4">
                  <div className="bg-orange-500 text-white text-xs font-semibold py-1 px-2 rounded">
                    SAVE {Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
