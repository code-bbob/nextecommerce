"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import customFetch from "@/utils/customFetch";
import { getCDNImageUrl } from "@/utils/imageUtils";

const formatRs = (n) => Number(n || 0).toLocaleString();

export default function MinimalProductGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await customFetch(`shop/api/?page=1`);
        const data = await res.json();
        const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        const simple = list.slice(0, 12).map((p) => ({
          id: p.product_id ?? p.id,
          name: p.name,
          price: Number(p.price ?? 0),
          before: Number(p.old_price ?? 0),
          image: getCDNImageUrl(p.images?.[0]?.image || p.image || "/placeholder.svg"),
          tag: p.category || p.brand || "",
          rating: Number(p.ratings?.stats?.avg_rating ?? 0),
        }));
        if (active) setItems(simple);
      } catch (e) {
        console.error("Failed to load curated strip", e);
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
    <section id="curated" className="mb-3">
        <h2 className="text-2xl md:text-2xl text-center font-bold   text-gray-900">TRENDING NOW</h2>
      <div className="flex items-end justify-center mt-1 mb-2 gap-4">
        <Link href="/store" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Shop all →</Link>
      </div>

      {/* Edge fades for hinting scroll */}
      <div className="relative">
        
        <div className="flex overflow-x-auto pb-2 -mx-3 sm:-mx-6 lg:-mx-10 px-3 sm:px-6 lg:px-10">
          {(loading ? Array.from({ length: 8 }) : items).map((p, i) => (
            <article key={(p && p.id) || i} className="snap-start w-[220px] sm:w-[260px] md:w-[280px] shrink-0  border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-44 sm:h-52 md:h-56 bg-gray-100 rounded-t-2xl" />
                  <div className="p-4">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="mt-2 h-4 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
              ) : p ? (
                <Link href={`/product/${p.id}`} className="block">
                  <div className="relative h-44 sm:h-52 md:h-56 bg-white">
                    <Image src={p.image} alt={p.name} fill className="object-contain" />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-semibold tracking-wide text-blue-600 uppercase line-clamp-1">{p.tag}</div>
                    <div className="mt-1 font-semibold text-gray-900 line-clamp-2 text-[15px]">{p.name}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-base font-extrabold text-gray-900">Rs {formatRs(p.price)}</div>
                      {p.before > p.price && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Save Rs {formatRs(p.before - p.price)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
