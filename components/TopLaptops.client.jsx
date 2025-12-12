"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";
import { getCDNImageUrl } from "@/utils/imageUtils";

export default function TopLaptops() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const router = useNavigationProgress();

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}shop/api/catsearch/laptop/?page=1`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load laptops");
  const data = await res.json();
  if (isMounted) setItems((data.results || []).slice(0, 12));
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  return (
  <section id="laptops" className="py-14">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold">Top Laptops</h2>
        <button onClick={() => router.push("/search?q=laptop")} className="text-sm text-blue-600 hover:underline">See more →</button>
      </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {items.slice(page * 8, page * 8 + 8).map((p) => (
          <div
            key={p.product_id}
            className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push(`/product/${p.product_id}`)}
          >
            <div className="relative h-44 mb-3">
              {p.images?.[0]?.image ? (
                <Image src={getCDNImageUrl(p.images[0].image)} alt={p.name} fill className="object-contain" sizes="(max-width: 768px) 50vw, 25vw" />
              ) : (
                <div className="h-full w-full bg-gray-100 rounded-lg" />
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">{p.brand || "Laptop"}</div>
            <div className="font-semibold line-clamp-2 min-h-[40px]">{p.name}</div>
            <div className="mt-2 font-bold">Rs {p.price?.toLocaleString()}</div>
          </div>
        ))}
      </div>
      {items.length > 8 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(items.length / 8) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-6 h-2 rounded-full ${i === page ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
