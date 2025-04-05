"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BrandLogos() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Default for small screens

  const brands = [
    { name: "Apple", logo: "/images/apple.png", alt: "Apple logo" },
    { name: "Dell", logo: "/images/dell.png", alt: "Dell logo" },
    { name: "Hp", logo: "/images/hp.png", alt: "HP logo" },
    { name: "Asus", logo: "/images/asus.png", alt: "Asus logo" },
    { name: "Acer", logo: "/images/acer.png", alt: "Acer logo" },
    { name: "Msi", logo: "/images/msi.png", alt: "MSI logo" },
    { name: "Lenovo", logo: "/images/lenovo.png", alt: "Lenovo logo" },
    // Add more brands if needed
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Small screens
        setItemsPerPage(4);
      } else if (window.innerWidth < 1024) { // Medium screens
        setItemsPerPage(4);
      } else { // Large screens
        setItemsPerPage(6);
      }
    };

    handleResize(); // Initial setup
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleBrands = brands.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="w-full max-w-7xl mx-auto md:px-4 py-12">
      <div className="text-center font-bold text-2xl mb-6">Authorized Distributor</div>

      {/* Carousel */}
      <div className="relative flex items-center">
        <button
          onClick={prevPage}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white rounded-full p-2"
          aria-label="Previous brands"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex justify-center items-center w-full px-2 sm:px-4 md:px-12">
          {visibleBrands.map((brand) => (
            <Link
              key={brand.name}
              href={`/${brand.name.toLowerCase()}`}
              className={`flex flex-col items-center justify-center p-1 sm:p-2 ${
                itemsPerPage === 3 ? "w-1/3" : itemsPerPage === 4 ? "w-1/4" : "w-1/6"
              }`}
            >
              <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 relative mb-1 sm:mb-2">
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.alt}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="text-xs sm:text-sm md:text-l mt-1 font-medium text-white">{brand.name}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white rounded-full p-2"
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
  );
}