"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import Link from "next/link";

export default function LaptopSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchLaptops() {
      try {
        const res = await fetch(`https://api.youthtech.com.np/shop/api/catsearch/laptop/?page=1`);
        if (!res.ok) {
          throw new Error("Failed to fetch laptops");
        }
        const data = await res.json();
        setProducts(data.results || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLaptops();
  }, []);

  return (
    <section className="text-white py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Laptops</h2>
      <div className="flex overflow-x-auto overflow-y-hidden gap-4 no-scrollbar">
        {products.map((item) => (
          <Link key={item.product_id} href={`/product/${item.product_id}`} className="flex-none w-60">
            <div className="flex-none w-60">
              <div className="bg-gradient-to-b from-black via-gray-700 to-gray-900 rounded-lg px-2 py-4 shadow-lg flex flex-col h-full transition-transform duration-300">
                {/* Image */}
                {item.images?.[0]?.image && (
                  <div className="relative w-full h-40 md:h-48 lg:h-52 rounded-md overflow-hidden">
                    <Image
                      src={item.images[0].image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Name & Price */}
                <div className="flex-1 mt-3">
                  <h3 className="font-bold text-lg line-clamp-2">{item.name}</h3>
                  <p className="mt-2">
                    <span className="text-sm line-through mr-2 text-gray-400">
                      RS. {item.old_price}
                    </span>
                    <span className="text-green-400 font-semibold">
                      RS. {item.price}
                    </span>
                  </p>
                </div>

                {/* Button at the bottom */}
                <Link href="/store">
                  <button className="mt-3 px-3 py-2 bg-gray-900 hover:bg-black font-semibold transition-colors">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center h-full mt-6">
        <Link href="/store">
          <button className="px-6 py-3 bg-gray-800 hover:bg-blue-700 rounded-full font-semibold transition-colors">
            See More
          </button>
        </Link>
      </div>
    </section>
  );
}
