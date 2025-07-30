"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay, Pagination } from "swiper/modules"
import { ChevronRight, ShoppingCart, CreditCard, Star } from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const heroProducts = [
  {
    name: "MacBook Air M2",
    img: "/images/bibhabok.png",
    price: "Rs. 125,000",
    rating: 4.9,
    specs: ["8 GB RAM", "256 GB CPU", "Apple M2 Chip", "13.6-inch Retina Display"],
  },
  {
    name: "iPhone 16   ",
    img: "/images/iphone.png",
    price: "Rs. 130200.00",
    rating: 4.8,
    specs: ["A18 Bionic", "48MP camera", "OLED Display","8GB RAM | 128GB Storage"],
  },
]

export default function HeroCarousel() {
  const router = useRouter()

  return (
    <section className="relative mt-0 min-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50">
      {/* Elegant background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-purple-200/20 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-blue-200/25 rounded-full blur-[110px]"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] -z-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `
                 radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)
               `,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom'
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        speed={1200}
        slidesPerView={1}
        className="w-full h-full"
      >
        {heroProducts.map((product, index) => (
          <SwiperSlide key={index} className="flex items-center">
            <div className="container mx-auto px-6 py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                
                {/* Left Side: Product Showcase */}
                <div className="w-full lg:w-1/2 relative">
                  {/* Floating badge */}
                  <div className="absolute -top-4 left-8 z-20">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⚡ Limited Edition 2082
                    </div>
                  </div>

                  {/* Product card */}
                  <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl transform hover:scale-[1.02] transition-all duration-500">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-3xl blur-xl -z-10"></div>
                    
                    {/* Product image */}
                    <div className="relative w-full h-80 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl"></div>
                      <Image
                        src={product.img || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-lg"
                        priority
                      />
                      {/* Floating elements */}
                      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-medium text-white">NEW</span>
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.rating} • 2.8k reviews)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-indigo-600">{product.price}</span>
                        <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                          Save 25%
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3">
                        {product.specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-xs text-gray-600">{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-6 shadow-lg">
                          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                        <Button variant="outline" className="flex-1 border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl py-6">
                          <CreditCard className="mr-2 h-5 w-5" /> Buy on EMI
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
                  {/* Main headline */}
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                      <span className="block text-gray-900">The Future</span>
                      <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        is Here
                      </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-lg">
                      Experience cutting-edge technology with our exclusive collection. 
                      Premium quality, unbeatable prices, and warranty you can trust.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: "🚀", title: "Fast Delivery", desc: "Same day delivery" },
                      { icon: "🛡️", title: "Warranty", desc: "2 year protection" },
                      { icon: "💳", title: "Easy EMI", desc: "0% interest" }
                    ].map((feature, i) => (
                      <div key={i} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 text-center">
                        <div className="text-2xl mb-2">{feature.icon}</div>
                        <div className="font-semibold text-gray-900">{feature.title}</div>
                        <div className="text-sm text-gray-600">{feature.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button
                      onClick={() => router.push("/store")}
                      className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span className="flex items-center">
                        Explore Collection
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                    
                    <Button variant="ghost" className="text-lg px-8 py-6 rounded-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom navigation */}
        <div className="swiper-button-prev-custom absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
          <ChevronRight className="w-5 h-5 rotate-180 text-gray-700" />
        </div>
        <div className="swiper-button-next-custom absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </div>
      </Swiper>
      
      {/* Custom pagination styles */}
      <style jsx global>{`
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgb(209 213 219);
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active-custom {
          background: rgb(79 70 229);
          transform: scale(1.2);
        }
      `}</style>
    </section>
  )
}