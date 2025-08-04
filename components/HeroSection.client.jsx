"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, ShoppingBag, Star, Shield, 
  Truck, Clock, CreditCard, CheckCircle2, Zap, Trophy
} from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProduct = {
    name: "MacBook Pro M3 Max",
    subtitle: "Professional Computing Redefined",
    originalPrice: "Rs. 380,000",
    salePrice: "Rs. 325,000",
    savings: "Rs. 55,000",
    savingsPercent: "15",
    image: "/images/heromac.png",
    rating: 4.9,
    reviews: 1247,
    inStock: 8,
    features: [
      "M3 Max Chip with 16-core CPU",
      "40-core GPU for Pro workflows", 
      "128GB Unified Memory",
      "22-hour battery life"
    ],
    badges: ["Authorized Dealer", "International Warranty", "Free Setup"]
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black"
    >
      {/* Futuristic background grid */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 -z-10"
      >
        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Animated tech elements */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        />

        {/* Floating tech particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Sales-focused content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Urgency badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600/90 to-orange-600/90 backdrop-blur-sm text-white rounded-full px-6 py-3 shadow-xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-white rounded-full"
              />
              <span className="font-bold text-sm">
                🔥 LIMITED TIME OFFER • ONLY {featuredProduct.inStock} LEFT
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl lg:text-7xl font-black leading-tight"
              >
                <span className="text-white">Get Your</span>
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Dream Tech
                </span>
                <span className="block text-white">Today</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold text-white">
                  {featuredProduct.name}
                </h2>
                <p className="text-xl text-blue-400 font-semibold">
                  {featuredProduct.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Price & savings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-white">
                      {featuredProduct.salePrice}
                    </span>
                    <div className="space-y-1">
                      <div className="text-gray-400 line-through text-lg">
                        {featuredProduct.originalPrice}
                      </div>
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        SAVE {featuredProduct.savings}
                      </div>
                    </div>
                  </div>
                  <p className="text-blue-400 text-lg font-semibold mt-2">
                    💳 0% EMI from Rs. 10,800/month
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-red-600 text-white rounded-lg px-4 py-2">
                    <div className="text-2xl font-black">{featuredProduct.savingsPercent}%</div>
                    <div className="text-xs font-bold">OFF</div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
                {featuredProduct.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Truck, text: "Free Express Delivery", subtext: "Within 24 hours" },
                { icon: Shield, text: "3 Year Warranty", subtext: "International coverage" },
                { icon: CreditCard, text: "0% EMI Available", subtext: "Up to 24 months" },
                { icon: Trophy, text: "Authorized Dealer", subtext: "100% Genuine" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-700/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.text}</div>
                      <div className="text-gray-400 text-xs">{item.subtext}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Link href="/store" className="flex-1">
                <Button className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  <motion.span 
                    className="relative z-10 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <ShoppingBag className="mr-3 w-6 h-6" />
                    Buy Now - Save {featuredProduct.savings}
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </motion.span>
                </Button>
              </Link>
              
              <Button 
                variant="outline"
                className="px-8 py-6 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                <Zap className="mr-2 w-5 h-5" />
                Quick EMI Check
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Product card */}
            <div className="relative">
              {/* Futuristic glow */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-cyan-500/30 to-blue-600/20 rounded-3xl blur-3xl animate-pulse" />
              
              {/* Main product card */}
              <motion.div 
                whileHover={{ y: -12, rotateY: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl"
              >
                {/* Stock urgency */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl px-4 py-2 shadow-xl">
                    <div className="text-xs font-bold">⚡ HURRY!</div>
                    <div className="text-sm font-black">Only {featuredProduct.inStock} Left</div>
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl px-4 py-2 shadow-xl">
                    <div className="text-xs font-bold">🚀 BESTSELLER</div>
                    <div className="text-sm font-black">#1 Choice</div>
                  </div>
                </div>

                {/* Product image */}
                <div className="relative mb-8 mt-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-800/20 rounded-2xl" />
                  <div className="relative h-80 lg:h-96">
                    <Image
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      fill
                      className="object-contain filter drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Product details */}
                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white font-bold">
                        {featuredProduct.rating} ({featuredProduct.reviews} reviews)
                      </span>
                    </div>
                    <div className="bg-green-600/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                      ✅ In Stock
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {featuredProduct.features.map((feature, index) => (
                      <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                        <div className="text-blue-400 text-sm font-semibold">{feature}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl py-4 font-bold transform hover:-translate-y-1 transition-all duration-300">
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl py-4 font-semibold">
                      Quick Buy
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating trust badges */}
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 shadow-2xl z-10"
            >
              <div className="text-xs font-bold">🛡️ PROTECTED</div>
              <div className="text-sm font-black">3Yr Warranty</div>
            </motion.div>

            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-4 shadow-2xl z-10"
            >
              <div className="text-xs font-bold">🚚 EXPRESS</div>
              <div className="text-sm font-black">Free Delivery</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
