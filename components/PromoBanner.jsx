"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Percent } from "lucide-react";

export default function PromoBanner() {
  return (
    <section id="deals" className="relative my-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl border border-gray-200/50 bg-white/70 backdrop-blur-xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-2xl p-3 bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
            <Percent className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Mega Tech Deals • Limited Time
            </h3>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Save more on headphones, smartwatches, gaming gear, phones, and accessories.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/deals" className="w-full sm:w-auto">
            <button className="w-full group bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
              Discover Deals
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href="#featured" className="w-full sm:w-auto">
            <button className="w-full border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400 font-semibold px-6 py-3 rounded-xl transition-all">
              See What’s New
            </button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
