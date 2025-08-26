"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import customFetch from "@/utils/customFetch";
import { getCDNImageUrl } from "@/utils/imageUtils";

function simplifyDeals(apiItems = []) {
  return apiItems
    .filter(Boolean)
    .map((p) => ({
      id: p.product_id ?? p.id ?? String(Math.random()),
      name: p.name,
      subtitle: p.category || p.brand || "",
      price: Number(p.price ?? p.deal_price ?? p.final_price ?? 0),
      before: Number(p.before_deal_price ?? p.old_price ?? 0),
      image: getCDNImageUrl(p.images?.[0]?.image || p.image || "/placeholder.svg"),
      rating: Number(p.ratings?.stats?.avg_rating ?? p.rating ?? 4.5),
    }));
}

function useCountdown(hoursFromNow = 12) {
  const end = useMemo(() => Date.now() + hoursFromNow * 3600 * 1000, [hoursFromNow]);
  const [left, setLeft] = useState(end - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, end - Date.now())), 1000);
    return () => clearInterval(id);
  }, [end]);
  const h = String(Math.floor(left / 3600000)).padStart(2, "0");
  const m = String(Math.floor((left % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  return `${h} : ${m} : ${s}`;
}

function Rating({ value = 4.5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < full ? "fill-amber-500" : half && i === full ? "fill-amber-300" : "fill-transparent"}`} />
      ))}
    </div>
  );
}

const formatRs = (n) => Number(n || 0).toLocaleString();

export default function DealsOfDay() {
  const timeLeft = useCountdown(9);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await customFetch(`shop/api/deals/?page=1`);
        const data = await res.json();
        const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        const simple = simplifyDeals(list).slice(0, 12);
        if (active) setItems(simple);
      } catch (e) {
        console.error("Failed to load deals for carousel", e);
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
  <section aria-labelledby="deals" className="relative bg-black py-12 sm:py-16">
      {/* Background band */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full rounded-none sm:rounded-[28px] bg-[radial-gradient(1250px_650px_at_50%_-20%,#0b1220,transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
          {/* Left: title + countdown */}
          <div className="md:col-span-3 text-white/90 px-1">
            <h2 id="deals" className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Deals of the Day</h2>
          <h2 className="mt-5 text-3xl font-serif md:text-4xl">Picked just for you</h2>
            <div className="mt-2 text-2xl font-mono tabular-nums text-white/80">{timeLeft}</div>
          </div>

          {/* Right: slider */}
          <div className="md:col-span-9 relative">
            {/* Nav buttons */}
            <button aria-label="Previous" className="deals-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg text-gray-700">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button aria-label="Next" className="deals-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg text-gray-700">
              <ChevronRight className="h-5 w-5" />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{ prevEl: ".deals-prev", nextEl: ".deals-next" }}
              slidesPerView={1.05}
              spaceBetween={14}
              autoplay={{ delay: 3500, disableOnInteraction: true }}
              breakpoints={{
                640: { slidesPerView: 1.6, spaceBetween: 18 },
                768: { slidesPerView: 2.1, spaceBetween: 20 },
                1024: { slidesPerView: 3.1, spaceBetween: 22 },
                1280: { slidesPerView: 3.1, spaceBetween: 24 },
              }}
            >
              {(loading ? Array.from({ length: 4 }) : items).map((p, idx) => (
                <SwiperSlide key={(p && p.id) || idx}>
                  <article className="group h-full rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    {loading ? (
                      <div className="animate-pulse p-5">
                        <div className="mx-auto mt-6 h-44 sm:h-60 md:h-64 w-full bg-gray-100 rounded" />
                        <div className="mt-4 h-4 w-40 bg-gray-100 rounded" />
                        <div className="mt-2 h-3 w-28 bg-gray-100 rounded" />
                        <div className="mt-3 h-5 w-24 bg-gray-100 rounded" />
                      </div>
                    ) : p ? (
                      <Link href={`/product/${p.id}`} className="block">
                        <div className="relative mx-auto mt-5 h-44 sm:h-60 md:h-64 w-full">
                          <div className="absolute inset-0 rounded-b-none bg-gradient-to-b from-transparent via-transparent to-gray-50" />
                          <Image src={p.image} alt={p.name} fill className="object-contain drop-shadow-sm" />
                          {/* Rating pill */}
                          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2 py-1 text-[11px] font-semibold text-gray-800 ring-1 ring-black/5">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            <span>{Number(p.rating || 0).toFixed(1)}</span>
                          </div>
                          {/* Discount pill */}
                          {p.before > p.price && (
                            <div className="absolute right-3 top-3 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-1 ring-1 ring-emerald-200">
                              -{Math.round(((p.before - p.price) / p.before) * 100)}%
                            </div>
                          )}
                        </div>
                        <div className="px-6 pb-6 pt-3">
                          <h3 className="line-clamp-2 text-[15px] font-semibold text-gray-900">{p.name}</h3>
                          <p className="mt-0.5 line-clamp-1 text-[12px] text-gray-500">{p.subtitle}</p>
                          <div className="mt-3 flex items-end justify-between">
                            <div>
                              <div className="text-xl font-extrabold text-gray-900">Rs {(p.price)}</div>
                              {p.before > p.price && (
                                <div className="-mt-0.5 text-[11px] text-gray-400">MRP <span className="line-through">Rs {formatRs(p.before)}</span></div>
                              )}
                            </div>
                            <div className="hidden sm:block">
                              <Rating value={p.rating} />
                            </div>
                          </div>
                          {p.before > p.price && (
                            <div className="mt-1 text-[11px] font-semibold text-emerald-700">You save Rs {formatRs(p.before - p.price)}</div>
                          )}
                        </div>
                      </Link>
                    ) : null}
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
