"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

// Helper function to calculate discounted price
function getDiscountedPrice(price, discount) {
  const discounted = price - price * (discount / 100);
  return discounted.toFixed(2);
}

const products = [
  {
    id: 1,
    name: "AI Smart Assistant",
    img: "/images/gpu.jpg",
    price: 199,
    discount: 25,
  },
  {
    id: 2,
    name: "Track TK Mechanical Keyboard Set",
    img: "/images/track.jpg",
    small_img: "/images/track_small.jpg",
    price: 5000,
    discount: 30,
  },
  {
    id: 3,
    name: "VR Metaverse Bundle",
    img: "/images/atom_keyboard.png",
    price: 299,
    discount: 20,
  },
];

export default function FeaturedProducts() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="mt-12">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Featured Products
      </h2>

      {/*
        - 1 column on small screens.
        - 3 columns on md and above.
        - The first card spans 2 columns on md (making it larger).
      */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Large Card (Spans 2 columns on md) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:col-span-3 md:row-span-2"
        >
          <Card className="relative bg-gray-800 rounded-xl text-white w-full shadow-2xl border border-gray-700 hover:-translate-y-2 transition-transform duration-300">
            <div className="relative w-full h-64 md:h-[30rem]">
              <Image
                src={products[0].img}
                alt={products[0].name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
                priority
              />
            </div>
            {/* Overlay text container */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-black/50 z-10 rounded-b-xl">
              <h3 className="font-extrabold text-white text-2xl sm:text-3xl">
                {products[0].name}
              </h3>
              <p className="mt-2 text-sm sm:text-lg text-white">
                <span className="line-through mr-2">
                  RS. {products[0].price}
                </span>
                <span className="text-green-600 font-bold">
                  RS.{" "}
                  {getDiscountedPrice(
                    products[0].price,
                    products[0].discount
                  )}
                </span>
              </p>
              <Button className="mt-4 bg-gray-600 hover:bg-black text-white px-6 py-3 rounded-full">
                Buy Now
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Smaller Card 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:col-span-2 md:row-span-1"
        >
          <Link href="/product/track-tk-586-apollo-in-nepal">
          <Card className="relative bg-inherit rounded-xl text-white w-full shadow-2xl border border-gray-700 hover:-translate-y-2 transition-transform duration-300">
            <div className="relative w-full h-64 md:h-[14rem]">
              <Image
                src={isSmallScreen ? products[1].small_img : products[1].img}
                alt={products[1].name}
                fill
                className="rounded-xl object-contain md:object-fill"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-black/50 z-10 rounded-b-xl">
              <h3 className="font-extrabold text-white text-xl sm:text-2xl">
                {products[1].name}
              </h3>
              <div className="flex justify-between items-center">
                <p className=" text-sm sm:text-lg text-white">
                  <span className="line-through mr-2">
                    RS. {products[1].price}
                  </span>
                  <span className="text-green-600 font-bold">
                    RS.{" "}
                    {getDiscountedPrice(
                      products[1].price,
                      products[1].discount
                    )}
                  </span>
                </p>
                <div className=" bg-red-600 hover:bg-black text-white mt-1 hover:scale-105 px-3 py-1 rounded-md text-sm cursor-pointer">
                  Buy Now
                </div>
              </div>
            </div>
          </Card>
          </Link>
        </motion.div>

        {/* Smaller Card 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:col-span-2 md:row-span-1"
        >
          <Card className="relative bg-black rounded-xl text-white w-full shadow-2xl border border-gray-700 hover:-translate-y-2 transition-transform duration-300">
            <div className="relative w-full h-64 md:h-[14rem]">
              <Image
                src={products[2].img}
                alt={products[2].name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-black/50 z-10 rounded-b-xl">
              <h3 className="font-extrabold text-white text-xl sm:text-2xl">
                {products[2].name}
              </h3>
              <p className=" text-sm sm:text-lg text-white">
                <span className="line-through mr-2">
                  RS. {products[2].price}
                </span>
                <span className="text-green-600 font-bold">
                  RS.{" "}
                  {getDiscountedPrice(
                    products[2].price,
                    products[2].discount
                  )}
                </span>
              </p>
              <Button className="mt-1 bg-gray-600 hover:bg-black text-white px-6 py-3 rounded-full">
                Buy Now
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}