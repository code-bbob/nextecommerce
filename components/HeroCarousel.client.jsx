"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const heroProducts = [
  {
    name: "MacBook Pro M4",
    img: "/images/heromac.png",
    price: "Rs. 99,999",
  },
  {
    name: "Iphone 16 Pro Max",
    img: "/images/iphone.png",
    price: "Rs. 10,999",
  },
  // {
  //   name: "Hp Elitebook 850",
  //   img: "/images/newhp.png",
  //   price: "Rs. 49,999",
  // },
  // {
  //   name: "VR Metaverse Bundle",
  //   img: "/images/featured3.png",
  //   price: "Rs. 79,999",
  // },
];

export default function HeroCarousel() {
  const router = useRouter();

  return (
    <section className="pt-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 2000 }}
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
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-300 drop-shadow-2xl">
                  Unbeatable Prices, Unmatched Quality
                </h1>
                <Button
                  onClick={() => router.push("/store")}
                  className="md:hidden mt-8 bg-gray-400 text-white text-xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
                >
                  Shop Now
                </Button>
                <p className="mt-16 text-xl md:text-2xl text-gray-300">
                  Get the best deals on{" "}
                  <span className="font-bold">{product.name}</span>. Limited stock available at just{" "}
                  <span className="text-yellow-400">{product.price}</span>!
                </p>
                <Button
                  onClick={() => router.push("/store")}
                  className="hidden md:block mt-8 bg-gradient-to-r from-gray-700 via-black to-gray-700 text-white text-xl px-8 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
                >
                  Shop Now
                </Button>
              </div>

              {/* Right Side: Image & Product Details */}
              <motion.div
                className="w-full md:w-1/2 flex flex-col justify-center items-center"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="relative w-full h-80">
                  <Image
                    src={product.img}
                    alt={product.name}
                    layout="fill"
                    objectFit="contain"
                    className="mx-auto"
                    priority
                  />
                </div>
                <p className="mt-4 text-center text-2xl font-bold text-transparent bg-clip-text bg-gray-300">
                  {product.name}
                </p>
                <p className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gray-300">
                  Now available at {product.price}
                </p>
                <div className="flex justify-center">
                  <Button className="mt-6 mr-8 w-36 bg-gradient-to-r from-gray-700 via-black to-gray-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
                    Buy Now
                  </Button>
                  <Button className="mt-6 w-36 bg-gradient-to-r from-gray-700 via-black to-gray-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
                    Apply EMI
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
