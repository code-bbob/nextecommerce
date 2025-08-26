"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    key: "headphones",
    name: "Headphones",
    href: "/search?q=headphone",
    image: "/images/airpodmax.jpg",
    accent: "from-blue-600 to-cyan-600",
  },
  {
    key: "smartwatches",
    name: "Smartwatches",
    href: "/search?q=watch",
    image: "/images/pic1.jpg",
    accent: "from-emerald-600 to-green-600",
  },
  {
    key: "gaming",
    name: "Gaming Gear",
    href: "/search?q=gaming",
    image: "/images/gpu.jpg",
    accent: "from-purple-600 to-fuchsia-600",
  },
  {
    key: "phones",
    name: "Phones",
    href: "/search?q=phone",
    image: "/images/iphone.jpg",
    accent: "from-sky-600 to-indigo-600",
  },
  {
    key: "accessories",
    name: "Accessories",
    href: "/search?q=accessories",
    image: "/images/ssd.jpg",
    accent: "from-rose-600 to-orange-600",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          Shop by Category
        </h2>
        <p className="text-muted-foreground mt-2">
          Explore the latest in audio, wearables, gaming, phones, and more
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl"
          >
            <Link href={cat.href} className="block">
              <div className="relative h-44">
                <Image src={cat.image} alt={`${cat.name} category`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${cat.accent}`}>
                  <span>Explore</span>
                </div>
                <h3 className="mt-3 text-xl font-bold">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">Shop the latest</p>
              </div>
            </Link>

            {/* glow */}
            <div className={`pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl bg-gradient-to-r ${cat.accent}`} />
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a href="#featured">
          <button className="btn-futuristic border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400 font-semibold px-6 py-3 rounded-xl transition-all">
            See Featured Products
          </button>
        </a>
      </div>
    </section>
  );
}
