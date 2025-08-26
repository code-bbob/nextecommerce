"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const curated = [
  { id: "p1", name: "MacBook Air M2", price: 139900, image: "/images/mac.jpg", tag: "Light & Powerful" },
  { id: "p2", name: "iPhone 15 Pro Max", price: 179900, image: "/images/iphone.png", tag: "Pro Camera" },
  { id: "p3", name: "AirPods Max", price: 85900, image: "/images/airpodmax.png", tag: "Immersive Audio" },
  { id: "p4", name: "RTX Gaming GPU", price: 129900, image: "/images/gpu.png", tag: "Ultra FPS" },
  { id: "p5", name: "NVMe SSD 2TB", price: 21900, image: "/images/ssd.jpg", tag: "Blazing Fast" },
  { id: "p6", name: "Cooling Pad", price: 12900, image: "/images/cooling.jpg", tag: "Stay Cool" },
].filter(Boolean);

export default function MinimalProductGrid() {
  return (
  <section id="curated" className="py-14">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold">Curated for You</h2>
        <Link href="/store" className="text-sm text-blue-600 hover:underline">Shop all →</Link>
      </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {curated.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-md overflow-hidden"
          >
            <div className="relative h-48">
              <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            </div>
            <div className="p-3">
              <div className="text-xs text-muted-foreground">{p.tag}</div>
              <div className="font-semibold truncate">{p.name}</div>
              <div className="text-sm font-bold">Rs {p.price.toLocaleString()}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
