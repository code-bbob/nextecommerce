import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { Cpu, HardDrive, CpuIcon as Gpu, Server, Database, Wind, Box, Zap } from "lucide-react"
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-black via-gray-600 to-white font-sans">
      
      <NavBar />
      <div className="md:h-screen pt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="text-center text-white mt-5 md:mt-20 px-4">
          <h2 className="text-3xl font-bold mb-4">Best Quality PCS</h2>
          <h1 className="text-4xl font-extrabold mb-6">
            Build your dream PC at home starting just Rs. 50000
          </h1>
          <h2 className="text-3xl font-bold mb-4">Only @CompanyName </h2>
          <h2 className="text-3xl font-bold mb-4">Choose from the best of the best </h2>
          <h2 className="text-3xl font-bold mb-4">Regardless of your budget </h2>
          <Link href="/#shop">
          <button className="bg-red-500 mb-4 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full">
            SHOP NOW
          </button>
          </Link>

        </div>
        <div className="flex items-center justify-center p-6 md:w-4/5 md:px-28 md:py-12">
          <Image
            src="/images/pc.png"
            width={800}
            height={800}
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>
      <div
        className="container mx-auto px-4 pt-4 pb-16 bg-gradient-to-br from-black via-gray-600 to-black shadow-lg"
        id="shop"
      >
        <h2 className="text-4xl font-bold pb-5 text-center text-white">Explore Our Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:h-[600px]">
          <Link
            href="/cpc/gpu"
            className="col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 group relative overflow-hidden rounded-lg shadow-lg aspect-video md:aspect-auto"
          >
            <Image
              src="/images/gpu.png"
              alt="GPUs"
              height={600}
              width={600}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300/70 to-blue-300/70 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white z-10">
              <Gpu className="w-12 h-12 mb-4" />
              <h3 className="text-3xl font-bold mb-2">GPUs</h3>
              <p className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Elevate your visual experience
              </p>
            </div>
          </Link>
          <Link
            href="/cpc/ram"
            className="col-span-1 md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-lg shadow-lg aspect-video md:aspect-auto"
          >
            <Image
              src="/images/ram.jpg"
              alt="RAM"
              height={600}
              width={600}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/70 to-teal-600/70 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white z-10">
              <HardDrive className="w-10 h-10 mb-3" />
              <h3 className="text-2xl font-bold mb-1">RAM</h3>
              <p className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Boost your system's speed
              </p>
            </div>
          </Link>
          <Link
            href="/cpc/cpu"
            className="col-span-1 md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-lg shadow-lg aspect-video md:aspect-auto"
          >
            <Image
              src="/images/cpu.jpg"
              alt="Processors"
              height={600}
              width={600}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/70 to-orange-500/70 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white z-10">
              <Cpu className="w-10 h-10 mb-3" />
              <h3 className="text-2xl font-bold mb-1">Processors</h3>
              <p className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Power up your performance
              </p>
            </div>
          </Link>
        </div>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="overflow-x-auto no-scrollbar pb-6">
          <div className="flex space-x-4 md:space-x-6">
            {[
              {
                name: "Motherboard",
                icon: Server,
                color: "from-blue-400/70 to-indigo-400/70",
                image: "/images/motherboard.jpg",
              },
              { name: "SSD", icon: Database, color: "from-green-400/70 to-emerald-400/70", image: "/images/ssd.jpg" },
              { name: "Cooling", icon: Wind, color: "from-cyan-400/70 to-sky-400/70", image: "/images/cooling.jpg" },
              { name: "Case", icon: Box, color: "from-gray-400/70 to-slate-400/70", image: "/images/case.jpg" },
              {
                name: "Power Supply",
                icon: Zap,
                color: "from-yellow-400/70 to-amber-400/70",
                image: "/images/powersupply.jpg",
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={`/cpc/${item.name.toLowerCase().replace(" ", "-")}`}
                className="group relative w-64 h-80 flex-shrink-0 overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }} 
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                ></div>
                <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                  <item.icon className="w-10 h-10 mb-3" />
                  <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                  <p className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore {item.name}
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

