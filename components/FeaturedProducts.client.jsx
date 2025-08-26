"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: "179,900",
    originalPrice: "199,900",
    image: "/images/iphone.png",
    rating: 4.8,
    reviews: 342,
    discount: 10
  },
  {
    id: 2,
    name: "MacBook Air M2",
    category: "Laptops", 
    price: "139,900",
    originalPrice: "159,900",
    image: "/images/mac.jpg",
    rating: 4.9,
    reviews: 128,
    discount: 13
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    category: "Audio",
    price: "32,900",
    originalPrice: "39,900",
    image: "/images/airpodmax.png",
    rating: 4.7,
    reviews: 567,
    discount: 18
  },
  {
    id: 4,
    name: "iPad Pro 12.9″",
    category: "Tablets",
    price: "129,900",
    originalPrice: "149,900", 
    image: "/images/case.jpg",
    rating: 4.6,
    reviews: 234,
    discount: 13
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Simple header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech products at unbeatable prices
          </p>
        </div>

        {/* Clean product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Clean product card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                
                {/* Discount badge - only one, simple */}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}

                {/* Product image */}
                <div className="relative mb-6 mt-8">
                  <div className="aspect-square relative bg-gray-50 rounded-xl p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Product info */}
                <div className="space-y-4">
                  {/* Category */}
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    {product.category}
                  </span>

                  {/* Product name */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-gray-900">
                        Rs. {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          Rs. {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-600 font-medium">
                      EMI from Rs. {Math.floor(parseInt(product.price.replace(/,/g, '')) / 12).toLocaleString()}/month
                    </p>
                  </div>

                  {/* Action button */}
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 font-semibold transition-all duration-300 group-hover:bg-blue-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="text-center mt-16">
          <Link href="/store">
            <Button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
