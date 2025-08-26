"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, Pagination } from "swiper/modules"
import { ArrowRight, ShoppingCart, Star, Truck, Shield, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const heroProducts = [
  {
    name: "MacBook Air M2",
    subtitle: "Supercharged for pros.",
    img: "/images/bibhabok.png",
    price: "Rs. 125,000",
    originalPrice: "Rs. 145,000",
    rating: 4.9,
    reviews: "2.8k",
    discount: "14",
    features: ["M2 Chip", "13.6\" Retina", "18hr Battery", "8GB RAM"],
    highlights: ["Free Shipping", "1 Year Warranty", "0% EMI Available"]
  },
  {
    name: "iPhone 16",
    subtitle: "So. Much. Pro.",
    img: "/images/iphone.png",
    price: "Rs. 130,200",
    originalPrice: "Rs. 149,900",
    rating: 4.8,
    reviews: "5.2k",
    discount: "13",
    features: ["A18 Bionic", "48MP Camera", "6.1\" OLED", "128GB Storage"],
    highlights: ["Express Delivery", "2 Year Protection", "Trade-in Available"]
  },
]

export default function HeroCarousel() {
  const router = useRouter()

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Minimal background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        {/* Clean grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" 
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active'
        }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        loop={true}
        speed={800}
        slidesPerView={1}
        className="w-full h-full"
      >
        {heroProducts.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="container mx-auto px-6 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                
                {/* Left: Content */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-8"
                >
                  {/* Main headline */}
                  <div className="space-y-4">
                    <motion.h1 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-5xl lg:text-7xl font-black leading-tight"
                    >
                      <span className="text-gray-900">{product.name}</span>
                    </motion.h1>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-2xl text-gray-600 font-medium"
                    >
                      {product.subtitle}
                    </motion.p>
                  </div>

                  {/* Rating */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-gray-500">({product.reviews} reviews)</span>
                  </motion.div>

                  {/* Price */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-gray-900">{product.price}</span>
                      <div className="space-y-1">
                        <div className="text-gray-500 line-through text-lg">{product.originalPrice}</div>
                        <div className="inline-block bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                          {product.discount}% OFF
                        </div>
                      </div>
                    </div>
                    <p className="text-blue-600 font-semibold">
                      💳 EMI from Rs. {Math.floor(parseInt(product.price.replace(/[^0-9]/g, '')) / 12).toLocaleString()}/month
                    </p>
                  </motion.div>

                  {/* Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-bold text-gray-900">Key Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <span className="text-sm font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Benefits */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex gap-6"
                  >
                    {[
                      { icon: Truck, text: "Free Shipping" },
                      { icon: Shield, text: "Warranty" },
                      { icon: CreditCard, text: "0% EMI" }
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-600">
                        <benefit.icon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">{benefit.text}</span>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="flex gap-4 pt-4"
                  >
                    <Button 
                      onClick={() => router.push("/store")}
                      className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <ShoppingCart className="mr-2 w-5 h-5" />
                      Buy Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="px-8 py-6 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 rounded-xl text-lg font-semibold transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Right: Product Image */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  {/* Clean product showcase */}
                  <div className="relative bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100">
                    {/* Product image */}
                    <div className="relative w-full h-96">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl"></div>
                      <Image
                        src={product.img || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>
                    
                    {/* Simple stock indicator */}
                    <div className="absolute top-6 right-6">
                      <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        ✅ In Stock
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-6 -left-6 bg-blue-600 text-white rounded-2xl p-4 shadow-xl z-10"
                  >
                    <div className="text-xs font-bold">🚚 FREE</div>
                    <div className="text-sm font-black">Delivery</div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [3, -3, 3] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute -top-6 -right-6 bg-green-600 text-white rounded-2xl p-4 shadow-xl z-10"
                  >
                    <div className="text-xs font-bold">💳 EMI</div>
                    <div className="text-sm font-black">0%</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Clean navigation */}
        <div className="hero-prev absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-300">
          <ArrowRight className="w-5 h-5 rotate-180 text-gray-700" />
        </div>
        <div className="hero-next absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-300">
          <ArrowRight className="w-5 h-5 text-gray-700" />
        </div>
      </Swiper>
      
      {/* Clean pagination styles */}
      <style jsx global>{`
        .hero-bullet {
          width: 10px;
          height: 10px;
          background: rgb(209 213 219);
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
          margin: 0 4px;
        }
        .hero-bullet-active {
          background: rgb(37 99 235);
          transform: scale(1.3);
        }
        .swiper-pagination {
          bottom: 40px !important;
        }
      `}</style>
    </section>
  )
}