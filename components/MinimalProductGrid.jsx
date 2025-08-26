"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const curated = [
  { id: "p1", name: "MacBook Air M2", price: 139900, image: "/images/mac.jpg", tag: "Light & Powerful" },
  { id: "p2", name: "iPhone 15 Pro Max", price: 179900, image: "/images/iphone.png", tag: "Pro Camera" },
  { id: "p3", name: "AirPods Max", price: 85900, image: "/images/airpodmax.png", tag: "Immersive Audio" },
  { id: "p4", name: "RTX Gaming GPU", price: 129900, image: "/images/gpu.png", tag: "Ultra FPS" },
  { id: "p5", name: "NVMe SSD 2TB", price: 21900, image: "/images/ssd.jpg", tag: "Blazing Fast" },
  { id: "p6", name: "Cooling Pad", price: 12900, image: "/images/cooling.jpg", tag: "Stay Cool" },
].filter(Boolean);

export default function MinimalProductGrid() {
  const wide = curated[0];
  const tall = curated[1];
  const rest = curated.slice(2);

  return (
    <section id="curated" className="py-16">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Curated for You</h2>
        <Link href="/store" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Shop all →</Link>
      </div>

      {/* Asymmetric mosaic grid to avoid uniform squares */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[220px] lg:auto-rows-[260px]">
        {/* Wide feature card */}
        {wide && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative md:col-span-12 lg:col-span-7 md:row-span-2 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/80 to-gray-50" />
            <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Text */}
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> {wide.tag}
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">{wide.name}</h3>
                <div className="mt-2 text-lg font-bold text-gray-900">Rs {wide.price.toLocaleString()}</div>
                <Link href={`/product/${wide.id}`} className="mt-6 inline-flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600">
                  Shop now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              {/* Image */}
              <div className="relative min-h-[220px] lg:min-h-full">
                <Image
                  src={wide.image}
                  alt={wide.name}
                  fill
                  className="object-contain p-6 lg:p-10 transition-transform duration-700 group-hover:scale-105 group-hover:translate-x-1"
                />
              </div>
            </div>
            <Link href={`/product/${wide.id}`} className="absolute inset-0" aria-label={`View ${wide.name}`} />
          </motion.article>
        )}

        {/* Tall feature card */}
        {tall && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="group relative md:col-span-12 lg:col-span-5 md:row-span-2 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="relative h-full">
              <div className="p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> {tall.tag}
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-gray-900">{tall.name}</h3>
                <div className="mt-1 text-lg font-bold text-gray-900">Rs {tall.price.toLocaleString()}</div>
              </div>
              <div className="relative aspect-[4/3] md:aspect-[5/4] lg:aspect-[3/4]">
                <Image
                  src={tall.image}
                  alt={tall.name}
                  fill
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <Link href={`/product/${tall.id}`} className="absolute inset-0" aria-label={`View ${tall.name}`} />
          </motion.article>
        )}

        {/* Remaining tiles */}
        {rest.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.05 * (i + 2) }}
            className="group relative md:col-span-6 lg:col-span-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="p-5">
              <div className="relative aspect-[4/3] rounded-xl bg-gray-50">
                <Image src={p.image} alt={p.name} fill className="object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="mt-4">
                <div className="text-[11px] font-semibold tracking-wide text-blue-600 uppercase">{p.tag}</div>
                <div className="mt-1 font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                <div className="mt-1 text-sm font-bold text-gray-800">Rs {p.price.toLocaleString()}</div>
              </div>
            </div>
            <Link href={`/product/${p.id}`} className="absolute inset-0" aria-label={`View ${p.name}`} />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
