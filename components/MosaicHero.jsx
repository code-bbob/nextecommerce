"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const tiles = [
  { src: "https://www.notebookcheck.net/fileadmin/Notebooks/Sonstiges/bestmultimedialaptop.jpg", alt: "Latest iPhone", span: "col-span-2 row-span-2" },
  { src: "https://dubsnatch.com/cdn/shop/files/bluetooth-on-ear-gradient-pastel-headphones-mic-stereo-dubsnatch_1200x.jpg?v=1684453587", alt: "MacBook Pro", span: "col-span-1 row-span-1" },
  { src: "https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-16e/White/Apple-iPhone-16e-White-thumbnail.png", alt: "AirPods Max", span: "col-span-1 row-span-2" },
  { src: "https://media.wired.com/photos/65b0438c22aa647640de5c75/3:2/w_2560%2Cc_limit/Mechanical-Keyboard-Guide-Gear-GettyImages-1313504623.jpg", alt: "Gaming GPU", span: "col-span-2 row-span-1" },
//   { src: "/images/pc.png", alt: "Custom PC", span: "col-span-1 row-span-2" },
//   { src: "/images/macs.jpeg", alt: "Apple Ecosystem", span: "col-span-2 row-span-1" },
];

export default function MosaicHero() {
  return (
  <section id="hero" className="pt-6 md:pt-10 pb-6">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Left copy */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Elevate your setup
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
              with future‑ready tech
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl">
            Premium laptops, phones, audio, and gaming gear. Clean design, fast checkout, and genuine warranty.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#laptops">
              <button className="bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl font-semibold">
                Shop Laptops
              </button>
            </a>
            <a href="#curated">
              <button className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold">
                Discover Picks
              </button>
            </a>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <span>0% EMI</span>
            <span>Authorized Brands</span>
            <span>Express Delivery</span>
          </div>
        </div>

        {/* Right mosaic */}
  <div className="grid grid-cols-3 grid-rows-3 gap-4 h-[520px] md:h-[520px]">
          {tiles.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className={`relative ${t.span} rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden`}
            >
              <Image src={t.src} alt={t.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
