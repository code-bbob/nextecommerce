"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import customFetch from "@/utils/customFetch";
import { getCDNImageUrl } from "@/utils/imageUtils";
import { Button } from "./ui/button";

const formatRs = (n) => Number(n || 0).toLocaleString();

export default function ProductShowcase() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await customFetch(`shop/api/?page=1&page_size=6`);
        const data = await res.json();
        const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        const simple = list.map((p) => ({
          id: p.product_id ?? p.id,
          name: p.name,
          price: Number(p.price ?? 0),
          before: Number(p.old_price ?? 0),
          image: getCDNImageUrl(p.images?.[0]?.image || p.image || "/placeholder.svg"),
          category: p.category || "New Arrival",
        }));
        if (active) setItems(simple);
      } catch (e) {
        console.error("Failed to load showcase products", e);
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="my-6">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Latest From Digitech
          </h2>
          
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {(loading ? Array.from({ length: 8 }) : items).map((p, i) => (
            <div key={(p && p.id) || i} className="bg-white hover:border-2 transition-shadow  overflow-hidden group">
              {loading ? (
                <div className="animate-pulse flex items-center p-4 gap-4">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ) : (
                <Link href={`/product/${p.id}`} className="flex items-center p-4 ">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{p.category}</p>
                    <h3 className="text-md font-bold text-gray-800 mt-1 line-clamp-2">{p.name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-xl font-extrabold text-gray-900">Rs {formatRs(p.price)}</p>
                      {p.before > p.price && (
                        <p className="text-sm text-gray-400 line-through">Rs {formatRs(p.before)}</p>
                      )}
                    </div>
                    <Button size="sm" className="mt-4 w-fit">
                      Shop Now
                    </Button>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
