"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, Heart, Clock, TrendingUp, Zap, Badge } from "lucide-react";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: "Rs. 179,900",
    originalPrice: "Rs. 199,900", 
    image: "/images/iphone.png",
    rating: 4.8,
    reviews: 342,
    discount: 10,
    inStock: 5,
    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera", "USB-C"],
    badges: ["Bestseller", "Limited Stock"],
    urgency: "Only 5 left!"
  },
  {
    id: 2,
    name: "MacBook Air M2",
    category: "Laptops", 
    price: "Rs. 139,900",
    originalPrice: "Rs. 159,900",
    image: "/images/mac.jpg",
    rating: 4.9,
    reviews: 128,
    discount: 13,
    inStock: 12,
    features: ["M2 Chip", "13.6″ Display", "18hr Battery", "1.24kg Weight"],
    badges: ["Top Rated", "Free Shipping"],
    urgency: "Deal ends in 24hrs"
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    category: "Audio",
    price: "Rs. 32,900", 
    originalPrice: "Rs. 39,900",
    image: "/images/airpodmax.png",
    rating: 4.7,
    reviews: 567,
    discount: 18,
    inStock: 8,
    features: ["Active Noise Cancel", "Spatial Audio", "6hr Playback", "MagSafe Case"],
    badges: ["Hot Deal", "Limited Offer"],
    urgency: "Flash Sale"
  },
  {
    id: 4,
    name: "iPad Pro 12.9″",
    category: "Tablets",
    price: "Rs. 129,900",
    originalPrice: "Rs. 149,900", 
    image: "/images/case.jpg",
    rating: 4.6,
    reviews: 234,
    discount: 13,
    inStock: 15,
    features: ["M2 Chip", "12.9″ Display", "Apple Pencil", "Magic Keyboard"],
    badges: ["Professional", "Best Value"],
    urgency: "Weekend Special"
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Futuristic background */}
      <div className="absolute inset-0 -z-10">
        {/* Tech grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Animated orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Sales-focused header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600/90 to-orange-600/90 text-white rounded-full px-6 py-3 mb-8 shadow-xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <span className="font-bold text-sm tracking-wide">
              🔥 FLASH SALE • UP TO 18% OFF • LIMITED TIME
            </span>
            <Clock className="w-4 h-4" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl lg:text-6xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Hot Deals
            </span>
            <span className="block text-white mt-2">This Week</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            ⚡ <span className="text-blue-400 font-bold">Limited stock</span> • 
            <span className="text-cyan-400 font-bold"> Free express shipping</span> • 
            <span className="text-green-400 font-bold"> 0% EMI available</span> • 
            <span className="text-yellow-400 font-bold"> Best price guarantee</span>
          </motion.p>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02 
              }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-500/30 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden">
                
                {/* Urgency indicators */}
                <div className="absolute top-4 left-4 z-20">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl px-3 py-2 shadow-xl"
                  >
                    <div className="text-xs font-bold">{product.urgency}</div>
                    <div className="text-sm font-black">{product.discount}% OFF</div>
                  </motion.div>
                </div>

                {/* Stock indicator */}
                <div className="absolute top-4 right-4 z-20">
                  <div className={`rounded-full px-3 py-1 text-xs font-bold ${
                    product.inStock <= 5 
                      ? 'bg-red-600/20 border border-red-500/50 text-red-400' 
                      : 'bg-green-600/20 border border-green-500/50 text-green-400'
                  }`}>
                    {product.inStock <= 5 ? `Only ${product.inStock} left!` : 'In Stock'}
                  </div>
                </div>

                {/* Wishlist */}
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-16 right-4 z-20 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-700"
                >
                  <Heart className="w-4 h-4 text-white hover:text-red-400 transition-colors" />
                </motion.button>

                {/* Product image */}
                <div className="relative mb-6 mt-12 bg-gradient-to-br from-gray-700/20 to-gray-800/20 rounded-2xl p-4 group-hover:bg-gradient-to-br group-hover:from-gray-600/20 group-hover:to-gray-700/20 transition-all duration-500">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-all duration-700 group-hover:scale-110 filter drop-shadow-lg group-hover:drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Product info */}
                <div className="space-y-4">
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Product name */}
                  <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Badges */}
                  <div className="flex gap-2">
                    {product.badges.map((badge, idx) => (
                      <span key={idx} className="text-xs font-bold bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Price section */}
                  <div className="space-y-3 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-white">
                        {product.price}
                      </span>
                      <div className="space-y-1">
                        <div className="text-gray-400 line-through text-lg">
                          {product.originalPrice}
                        </div>
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                          SAVE {Math.floor(((parseInt(product.originalPrice.replace(/[^0-9]/g, '')) - parseInt(product.price.replace(/[^0-9]/g, '')) / 1000)))}K
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-blue-400">
                      💳 EMI from Rs. {Math.floor(parseInt(product.price.replace(/[^0-9]/g, '')) / 12).toLocaleString()}/month
                    </p>
                  </div>

                  {/* Key features */}
                  <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-blue-400" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl py-4 font-bold text-sm shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="px-4 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 rounded-xl transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-3 -left-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-3 shadow-xl z-10"
              >
                <div className="text-xs font-bold">🚚 FREE</div>
                <div className="text-sm font-black">Shipping</div>
              </motion.div>

              <motion.div
                animate={{ y: [2, -2, 2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-3 shadow-xl z-10"
              >
                <div className="text-xs font-bold">⚡ EMI</div>
                <div className="text-sm font-black">0%</div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/store">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-white px-12 py-6 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500">
              <motion.span 
                className="relative z-10 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <TrendingUp className="mr-3 w-6 h-6" />
                Shop All Products • Save More
                <motion.span
                  className="ml-3"
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
