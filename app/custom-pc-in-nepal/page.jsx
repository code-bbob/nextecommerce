import Image from "next/image";
import Link from "next/link";
import { Cpu, HardDrive, CpuIcon as Gpu, Server, Database, Wind, Box, Zap, ChevronRight } from "lucide-react"
import Footer from "@/components/Footer.server";
import BlackNavBar from "@/components/blackNavbar";
import { Button } from "@/components/ui/button";
import { getCDNImageUrl } from "@/utils/imageUtils";

export const metadata = {
  title: 'Best Custom PC in Nepal. Best price Custom PC in Nepal. Cheapest Custom PC in Nepal',
  description: 'Best Custom PC in Nepal. Best price Custom PC in Nepal. Cheapest Custom PC in Nepal',
  keywords: 'Custom PC in Nepal, Custom PC Digitech',
}

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black font-sans">
      <BlackNavBar color="black" />
      
      {/* Hero Section - Updated to match carousel theme */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col-reverse lg:flex-row mt-10 justify-between md:gap-12 min-h-[80vh]">
            {/* Left Side: Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left px-4 z-10 mt-8 lg:mt-0">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-purple-600/10 backdrop-blur-sm border border-purple-500/20">
                <span className="text-purple-400 text-sm font-medium">Premium Builds Only @Digitech</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
                <p className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                  Build Your Dream PC <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
                    Starting at Rs. 50,000
                  </span>
                </p>
              </h1>
              
              <h2 className="mt-4 text-2xl font-bold text-yellow-400">
                Only @Digitech
              </h2>

              <p className="mt-6 text-lg text-gray-300">
                Experience premium quality custom PCs built with the finest components.
                Choose from the best of the best, regardless of your budget.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link href="/#shop">
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all duration-300">
                    <span className="relative z-10 flex items-center">
                      SHOP NOW{" "}
                      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: PC Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center relative z-10">
              {/* Circular glow behind product */}
              <div className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl"></div>
              
              <div className="relative">
                <Image
                  src="/images/pc.png"
                  width={700}
                  height={700}
                  alt="High-quality PC build showcasing premium components"
                  priority
                  className="object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <div id="shop" className="mx-auto px-4 pt-12 pb-24 bg-gradient-to-br from-black to-gray-900 shadow-lg">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-purple-600/10 backdrop-blur-sm border border-purple-500/20">
            <span className="text-purple-400 text-sm font-medium">Premium Components</span>
          </div>
          <h2 className="text-4xl font-bold text-white">Explore Our Categories</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">High-performance components for your custom PC build. Quality guaranteed.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:h-[600px]">
          <Link
            href="/search?q=gpu"
            className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 group relative overflow-hidden rounded-2xl shadow-xl aspect-video md:aspect-auto backdrop-blur-sm border border-white/5"
          >
            <Image
              src="/images/gpu.png"
              alt="GPUs"
              height={600}
              width={600}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 to-blue-600/70 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl inline-block mb-4">
                <Gpu className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold mb-2">GPUs</h3>
              <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Elevate your visual experience with cutting-edge graphics
              </p>
            </div>
          </Link>
          <Link
            href="/search?q=ram"
            className="col-span-1 md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-2xl shadow-xl aspect-video md:aspect-auto backdrop-blur-sm border border-white/5"
          >
            <Image
              src="/images/ram.jpg"
              alt="RAM"
              height={600}
              width={600}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 to-teal-600/70 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl inline-block mb-4">
                <HardDrive className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-1">RAM</h3>
              <p className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Boost your system's speed with high-performance memory
              </p>
            </div>
          </Link>
          <Link
            href="/search?q=cpu"
            className="col-span-1 md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-2xl shadow-xl aspect-video md:aspect-auto backdrop-blur-sm border border-white/5"
          >
            <Image
              src="/images/cpu.jpg"
              alt="Processors"
              height={600}
              width={600}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/70 to-orange-500/70 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white z-10">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl inline-block mb-4">
                <Cpu className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-1">Processors</h3>
              <p className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Power up your performance with the latest CPUs
              </p>
            </div>
          </Link>
        </div>
        
        <div className="mt-12">
          <div className="overflow-x-auto no-scrollbar pb-6">
            <div className="flex space-x-6">
              {[
                {
                  name: "Motherboard",
                  icon: Server,
                  color: "from-blue-400/70 to-indigo-400/70",
                  bgColor: "bg-blue-500/10",
                  iconColor: "text-blue-400",
                  image: "/images/motherboard.jpg",
                },
                { 
                  name: "SSD", 
                  icon: Database, 
                  color: "from-green-400/70 to-emerald-400/70", 
                  bgColor: "bg-green-500/10",
                  iconColor: "text-green-400",
                  image: "/images/ssd.jpg" 
                },
                { 
                  name: "Cooling", 
                  icon: Wind, 
                  color: "from-cyan-400/70 to-sky-400/70", 
                  bgColor: "bg-cyan-500/10",
                  iconColor: "text-cyan-400",
                  image: "/images/cooling.jpg" 
                },
                { 
                  name: "Case", 
                  icon: Box, 
                  color: "from-gray-400/70 to-slate-400/70", 
                  bgColor: "bg-gray-500/10",
                  iconColor: "text-gray-400",
                  image: "/images/case.jpg" 
                },
                {
                  name: "Power Supply",
                  icon: Zap,
                  color: "from-yellow-400/70 to-amber-400/70",
                  bgColor: "bg-yellow-500/10",
                  iconColor: "text-yellow-400",
                  image: "/images/powersupply.jpg",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={`/search?q=${item.name.toLowerCase().replace(" ", "-")}`}
                  className="group relative w-72 h-80 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl backdrop-blur-sm border border-white/5"
                >
                  <Image
                    src={getCDNImageUrl(item.image) || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }} 
                    className="transition-transform duration-300 group-hover:scale-110"
                    sizes="288px"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                  ></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                    <div className={`p-3 ${item.bgColor} backdrop-blur-md rounded-xl inline-block mb-4`}>
                      <item.icon className={`w-10 h-10 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                    <p className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                      Explore {item.name} <ChevronRight className="ml-1 h-4 w-4" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  )
}