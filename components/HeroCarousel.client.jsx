"use client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, EffectFade, Pagination } from "swiper/modules"
import { ChevronRight, ShoppingCart, CreditCard, Star } from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

const heroProducts = [
  {
    name: "MacBook Air M2",
    img: "/images/bibhabok.png",
    price: "Rs. 99,999",
    rating: 4.9,
    specs: ["8-core CPU", "10-core GPU", "Up to 24GB memory"],
  },
  {
    name: "iPhone 16 Pro Max",
    img: "/images/iphone.png",
    price: "Rs. 10,999",
    rating: 4.8,
    specs: ["A18 Bionic", "48MP camera", "Titanium design"],
  },
]

// Animation variants for consistent animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
}

const fadeInRight = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.2 },
}

export default function HeroCarousel() {
  const router = useRouter()

  return (
    <section className="relative mt-0 min-h-[90vh] overflow-hidden bg-inherit">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-[120px] -z-10"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30 -z-10"></div>

      <Swiper
        modules={[Navigation, Autoplay, EffectFade, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        slidesPerView={1}
        className="w-full h-full"
      >
        {heroProducts.map((product, index) => (
          <SwiperSlide key={index} className="flex items-center">
            {({ isActive }) => (
              <div className="container mt-2 mx-auto px-4 md:py-4">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between md:gap-12">
                  {/* Left Side: Text */}
                  <div className="w-full lg:w-1/2 text-center lg:text-left px-4 z-10">
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-purple-600/10 backdrop-blur-sm border border-purple-500/20"
                    >
                      <span className="text-purple-400 text-sm font-medium">New Year 2082 Exclusive</span>
                    </motion.div>

                    <motion.h1
                      variants={fadeInRight}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="text-4xl sm:text-5xl lg:text-6xl hidden md:block xl:text-7xl font-extrabold"
                    >
                      <p className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Unbeatable <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
                          Prices
                        </span></p>
                        <p className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Unmatched <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
                          Quality
                        </span></p>
                        
                    </motion.h1>

                    <motion.div
                      variants={fadeInRight}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="mt-6 flex items-center justify-center lg:justify-start"
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-yellow-400 font-medium">{product.rating}</span>
                      <span className="ml-2 text-gray-400">| Premium Selection</span>
                    </motion.div>

                    <motion.p
                      variants={fadeInRight}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-6 text-lg sm:text-xl text-gray-300"
                    >
                      Experience the future with <span className="font-bold text-white">{product.name}</span>. Limited
                      stock available at just <span className="text-yellow-400 font-bold">{product.price}</span>!
                    </motion.p>

                    <motion.div
                      variants={fadeInRight}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="mt-6 space-y-3 flex flex-col items-center lg:items-start"
                    >
                      {product.specs.map((spec, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-gray-300">{spec}</span>
                        </div>
                      ))}
                    </motion.div>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.7, delay: 0.6 }}
                      className="w-full md:hidden mt-10 max-w-md backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
                    >
                      <div className="md:flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white max-w">{product.name}</h3>
                        <span className="text-xl font-bold text-yellow-400">{product.price}</span>
                      </div>

                      <div className="">
                        <Button className="flex-1 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-5 sm:py-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                          <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-purple-500/30 text-black hover:bg-purple-500/10 rounded-xl py-5 sm:py-6"
                        >
                          <CreditCard className="mr-2 h-5 w-5" /> Apply EMI
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="mt-8 flex justify-center lg:justify-start"
                    >
                      <Button
                        onClick={() => router.push("/store")}
                        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center">
                          Shop Collection{" "}
                          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </motion.div>
                  </div>

                  {/* Right Side: Image & Product Details */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative md:mt-12 lg:mt-0">
                  <div className="md:hidden">
                  <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-block px-3 mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-purple-600/10 backdrop-blur-sm border border-purple-500/20"
                      >
                      <span className="text-purple-400 text-sm font-medium">New Year 2082 Exclusive</span>
                    </motion.div>
                      </div>
                  <motion.h1
                      variants={fadeInRight}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="text-4xl text-center md:hidden sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold"
                    >
                      <p className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Unbeatable <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
                          Prices
                        </span></p>
                        <p className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Unmatched <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
                          Quality
                        </span></p>
                        
                    </motion.h1>
                    {/* Circular glow behind product */}
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl"
                    ></motion.div>

                    {/* Product image with floating animation */}
                    <motion.div
                      className="relative w-full mt-5 h-56 sm:h-64 md:h-72 lg:h-80 z-10 md:mb-12"
                      variants={fadeInLeft}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.7, delay: 0.4 }}
                    >
                      <motion.div
                        animate={
                          isActive
                            ? {
                                y: [0, -15, 0],
                              }
                            : { y: 0 }
                        }
                        transition={{
                          y: { repeat: isActive ? Number.POSITIVE_INFINITY : 0, duration: 4, ease: "easeInOut" },
                        }}
                        className="w-full h-full"
                      >
                        <Image
                          src={product.img || "/placeholder.svg"}
                          alt={product.name}
                          layout="fill"
                          objectFit="contain"
                          className="drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                          priority
                        />
                      </motion.div>
                    </motion.div>

                    {/* Product info card */}
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate={isActive ? "visible" : "exit"}
                      transition={{ duration: 0.7, delay: 0.6 }}
                      className="w-full hidden md:block max-w-md backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
                    >
                      <div className="md:flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white max-w">{product.name}</h3>
                        <span className="text-xl font-bold text-yellow-400">{product.price}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl py-5 sm:py-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                          <ShoppingCart className="mr-2 h-5 w-5" /> Buy Now
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-purple-500/30 text-black hover:bg-purple-500/10 rounded-xl py-5 sm:py-6"
                        >
                          <CreditCard className="mr-2 h-5 w-5" /> Apply EMI
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
