"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "AI Smart Assistant",
    img: "/images/featured1.png",
    price: 199,
    discount: 25,
  },
  {
    id: 2,
    name: "Quantum Computing Guide",
    img: "/images/airpodmax.jpg",
    price: 99,
    discount: 30,
  },
  {
    id: 3,
    name: "VR Metaverse Bundle",
    img: "/images/featured3.png",
    price: 299,
    discount: 20,
  },
];

export default function FeaturedProducts() {
  return (
    <section className="mt-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product, index) => {
          const discountedPrice =
            (product.price * (100 - product.discount)) / 100;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 * index, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <Card className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 hover:-translate-y-2 transition-transform duration-300">
                <div className="relative w-60 h-60 mx-auto">
                  <Image
                    src={product.img}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                    priority
                  />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">
                  {product.name}
                </h3>
                <p className="mt-2 text-lg">
                  <span className="line-through text-gray-500 mr-2">
                    ${product.price}
                  </span>
                  <span className="text-green-400 font-bold">
                    ${discountedPrice.toFixed(2)}
                  </span>
                </p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full">
                  Buy Now
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
