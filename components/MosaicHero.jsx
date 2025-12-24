"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Timer,
  BadgePercent,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  Clipboard,
} from "lucide-react";

const tiles = [
  {
    src: "/images/bg1.jpg",
    alt: "Laptops",
    span: "col-span-3 row-span-2 md:col-span-2 md:row-span-2",
    label: "Laptops",
    href: "/laptop",
  },
  {
    src: "/images/headphone.webp",
    alt: "Headphones",
    span: "col-span-2 row-span-1 md:col-span-1 md:row-span-1",
    label: "Headphones",
    href: "/headphone",
  },
  {
    src: "/images/cropped.jpg",
    alt: "Phones",
    span: "col-span-2 row-span-2 md:col-span-1 md:row-span-2",
    label: "Phones",
    href: "/smartphone",
  },
  {
    src: "/images/keyboard.webp",
    alt: "Keyboards",
    span: "col-span-3 row-span-1 md:col-span-2 md:row-span-1",
    label: "Keyboards",
    href: "/keyboard",
  },
];

export default function MosaicHero() {
  const [countdown, setCountdown] = useState("");
  const couponCode = "FREESHIPPING";
  const [showClipboard, setShowClipboard] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const target = new Date("2026-01-01T23:59:59+05:45").getTime();
    const id = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setToast("Coupon copied!");
      setTimeout(() => setToast(""), 1800);
    } catch (_) {
      setToast("Failed to copy");
      setTimeout(() => setToast(""), 1800);
    }
  };

  return (
    <section id="hero" className="relative pb-8">
      {/* Festive background accents */}

      <div className="grid lg:grid-cols-2 md:gap-10 ">
        {/* Left copy */}
        <div className="order-2 relative md:order-1 space-y-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"
          />

          <h1 className="text-5xl hidden md:block font-extrabold leading-tight tracking-tight">
            Celebrate Massive Savings This New Year 2026
            <span className="block bg-gradient-to-r from-rose-600 via-amber-600 to-sky-700 bg-clip-text text-transparent">
              Up to 20% OFF
            </span>
          </h1>
          {/* Countdown + Coupon strip */}
          <div className=" hidden md:flex gap-3 sm:items-center">
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 relative">
              <BadgePercent className="h-4 w-4" />
              <span className="font-semibold">Use code</span>
              <code className="bg-amber-100 px-2 py-0.5 rounded">
                {couponCode}
              </code>
              <button
                onClick={copyCoupon}
                className="ml-1 text-amber-700 hover:text-amber-900 flex items-center"
                style={{ position: "relative" }}
                aria-label="Copy coupon code"
              >
                <Clipboard className="h-5 w-5" />
              </button>
              {toast && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg text-sm animate-fadein z-50">
                  {toast}
                </div>
              )}
            </div>
            <div className=" inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 shadow">
              <Timer className="h-4 w-4 text-amber-400" />
              <span className="font-semibold">Ends in:</span>
              <span className="tabular-nums">{countdown}</span>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl">
            Enjoy exclusive festive discounts on laptops, phones, audio, and
            gaming gear. Genuine warranty, express delivery, and easy checkout.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl font-semibold shadow"
            >
              <Gift className="h-5 w-5 text-amber-400" /> Shop Now
            </Link>
            <a
              href="#curated"
              className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold"
            >
              Discover Picks
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 max-w-xl pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 p-2">
              <Truck className="h-4 w-4 text-emerald-500" /> Express Delivery
            </div>
            <div className="flex items-center gap-2 p-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> Genuine Warranty
            </div>
            <div className="flex items-center gap-2 p-2">
              <RefreshCcw className="h-4 w-4 text-purple-600" /> Easy Returns
            </div>
          </div>
        </div>

        {/* Right mosaic */}
        <div className="order-1 md:order-2">
          <h1 className="text-3xl mt-2 md:hidden font-extrabold leading-tight tracking-tight">
            Celebrate Savings This Dashain Tihar 2082
            <span className="block bg-gradient-to-r from-rose-600 via-amber-600 to-sky-700 bg-clip-text text-transparent">
              <div className="flex text-2xl items-center gap-2">
                Up to 20% OFF
                <div className="flex w-fit items-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 relative">
                  <BadgePercent className="h-4 w-4" />
                  <span className="text-sm font-semibold"></span>
                  <code className="bg-amber-100 text-sm px-2 py-0.5 rounded">
                    {couponCode}
                  </code>
                  <button
                    onClick={copyCoupon}
                    className="ml-1 text-amber-700 hover:text-amber-900 flex items-center"
                    style={{ position: "relative" }}
                    aria-label="Copy coupon code"
                  >
                    <Clipboard className="h-5 w-5" />
                  </button>
                  {toast && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg text-sm animate-fadein z-50">
                      {toast}
                    </div>
                  )}
                </div>
              </div>
            </span>
          </h1>
          <div className=" grid grid-cols-5 grid-rows-3 md:grid-cols-3 md:grid-rows-3 gap-4 h-[320px] md:h-[520px] mt-5">
            {tiles.map((t, i) => (
              <Link key={i} href={t.href} className={`relative ${t.span}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className={`relative h-full w-full rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden`}
                >
                  <Image
                    src={t.src}
                    alt={t.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* label chip */}
                  {/* <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-medium shadow border border-gray-200">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {t.label}
                </div> */}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
