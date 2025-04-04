"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BrandLogos() {
  const [currentPage, setCurrentPage] = useState(0)

  const brands = [
    { name: "Apple", logo: "/images/apple.png", alt: "Apple logo" },
    { name: "Dell", logo: "/images/dell.png", alt: "Dell logo" },
    { name: "Hp", logo: "/images/hp.png", alt: "HP logo" },
    { name: "Asus", logo: "/images/asus.png", alt: "Asus logo" },
    { name: "Acer", logo: "/images/acer.png", alt: "Acer logo" },
    { name: "Msi", logo: "/images/msi.png", alt: "MSI logo" },
    { name: "Lenovo", logo: "/images/lenovo.png", alt: "Lenovo logo" },
    // Add more brands if needed
  ]

  const totalPages = Math.ceil(brands.length / 6)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }
  console.log(currentPage)

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }
  console.log(currentPage)

  const visibleBrands = brands.slice(currentPage , currentPage + 6)
  console.log(visibleBrands)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center font-bold text-2xl mb-6">Authorized Distributor</div>

      {/* Carousel */}
      <div className="relative flex items-center">
        <button
          onClick={prevPage}
          className="absolute left-0 z-10 bg-black text-white rounded-full p-2"
          aria-label="Previous brands"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex justify-between items-center w-full px-12 ">
        {visibleBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/${brand.name.toLowerCase()}`}
              className="mx-2 flex flex-col items-center justify-center hover:opacity-80 transition-opacity"
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.alt}
                width={100}
                height={100}
                className="object-contain mb-2"
              />
              <span className="text-l mt-2 font-medium text-white ">{brand.name}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={nextPage}
          className="absolute right-0 z-10 bg-black text-white rounded-full p-2"
          aria-label="Next brands"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom pagination dots */}
      <div className="flex justify-center mt-12">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={`bottom-${index}`}
            className={cn("w-6 h-2 mx-1 rounded-full", index === currentPage ? "bg-red-600" : "bg-gray-200")}
            onClick={() => setCurrentPage(index)}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

