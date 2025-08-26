"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroMinimal() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          Elevate your everyday tech
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-lg md:text-xl text-muted-foreground"
        >
          Minimal design. Maximum performance. Shop curated devices and accessories.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link href="/store" className="inline-flex items-center justify-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
            Shop Now
          </Link>
          <Link href="/deals" className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition">
            Discover Deals
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
