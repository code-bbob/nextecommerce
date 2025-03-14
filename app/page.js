"use client";

import Image from "next/image";
import Head from "next/head";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CatBar from "@/components/catbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import FormComponent from "@/components/samsungEmiForm";

// Sample products with prices and discount labels
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

const heroProducts = [
  {
    name: "MacBook Pro M4",
    img: "/images/cp.png",
    price: "Rs. 99,999",
  },
  {
    name: "Iphone 16 Pro Max",
    img: "/images/iphone.png",
    price: "Rs. 10,999",
  },
  {
    name: "Hp Elitebook 850",
    img: "/images/newhp.png",
    price: "Rs. 49,999",
  },
  {
    name: "VR Metaverse Bundle",
    img: "/images/featured3.png",
    price: "Rs. 79,999",
  },
];

export default function Page() {
  // Countdown timer for a limited-time offer (expires in 2 days)
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31T23:59:59") - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  // Helper to display the countdown timer
  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <span key={interval} className="mx-1">
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  return (
    <>
      <Head>
        <title>Digitech - Unbeatable Prices for Premium Products</title>
        <meta
          name="description"
          content="Experience the best prices in retail – premium tech products at prices that can’t be beaten. Shop now and save big!"
        />
        <meta
          name="keywords"
          content="best prices, retail deals, premium tech, unbeatable prices, online shopping"
        />
        <link rel="canonical" href="https://www.digitech.com" />
      </Head>

      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white ">
        <NavBar />
        {/* <CatBar /> */}

        <main className="container mx-auto px-6 ">
          {/* Hero Section as a Carousel */}
          <section className="py-6">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000 }}
              loop={true}
              slidesPerView={1}
              className="w-full"
            >
              {heroProducts.map((product, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col md:flex-row items-center justify-between"
                  >
                    {/* Left Side: Text */}
                    <div className="w-full md:w-1/2 text-center md:text-left px-6">
                      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-2xl">
                        Unbeatable Prices, Unmatched Quality
                      </h1>
                      <p className="mt-6 text-xl md:text-2xl text-gray-300">
                        Get the best deals on{" "}
                        <span className="font-bold">{product.name}</span>. Limited stock available at just{" "}
                        <span className="text-yellow-400">{product.price}</span>!
                      </p>
                      <Button className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
                        Shop Now
                      </Button>
                    </div>

                    {/* Right Side: Image */}
                    <motion.div
      className="w-full md:w-1/2 flex flex-col justify-center items-center"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Wrapper with fixed aspect ratio */}
      <div className="relative w-full h-80"> {/* Fixed height of 400px (h-96) */}
        <Image
          src={product.img}
          alt={product.name}
          layout="fill" // Fill the parent container
          objectFit="contain" // Cover the container and maintain the aspect ratio
          className="mx-auto" // Center the image
          priority
        />
      </div>

      <p className="mt-4 text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        {product.name}
      </p>
      <p className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
        Now available at {product.price}
      </p>
      
      <div className="flex justify-center">
        <Button className="mt-6 mr-8 w-36 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          Buy Now
        </Button>
        <Button className="mt-6 w-36 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          Apply EMI
        </Button>
      </div>
    </motion.div>
                    </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* Limited-Time Offer Countdown */}
          <section className="bg-gray-800 rounded-xl p-6 my-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
            <p className="text-xl text-gray-300 mb-4">
              Grab these deals before they vanish.
            </p>
            <div className="text-2xl font-mono text-yellow-400">
              {timerComponents.length ? (
                timerComponents
              ) : (
                <span>Offer Expired!</span>
              )}
            </div>
          </section>

          {/* Featured Products */}
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

          {/* Social Proof & Testimonials */}
          <section className="mt-20 bg-gray-800 p-8 rounded-xl shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-8">
              Why Our Customers Love Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center"
              >
                <p className="text-xl italic">
                  "I couldn't believe the prices – the quality is incredible.
                  I've never shopped anywhere else!"
                </p>
                <p className="mt-4 font-bold">– Alex M.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center"
              >
                <p className="text-xl italic">
                  "The best deals I've ever seen. Fast, reliable, and unbeatable
                  value. Highly recommended!"
                </p>
                <p className="mt-4 font-bold">– Jamie L.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-center"
              >
                <p className="text-xl italic">
                  "A game changer in digital shopping. I always find exactly
                  what I need at the best price."
                </p>
                <p className="mt-4 font-bold">– Morgan S.</p>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer Section with Trust Badges */}
        <footer className="mt-12 py-8 border-t border-gray-700 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Digitech. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="https://twitter.com/digitech"
              className="hover:text-white transition-colors duration-300"
            >
              Twitter
            </a>
            <a
              href="https://facebook.com/digitech"
              className="hover:text-white transition-colors duration-300"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/digitech"
              className="hover:text-white transition-colors duration-300"
            >
              Instagram
            </a>
          </div>
          <div className="mt-6">
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Best Price Guarantee
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
