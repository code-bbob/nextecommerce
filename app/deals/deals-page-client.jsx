"use client"

import { Suspense, useState, useEffect } from "react"
import ProductGrid from "@/components/productGrid"
import FilterSidebar from "@/components/filterSidebar"
import Footer from "@/components/Footer.server"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CatBar from "@/components/catbar"
import BlackNavBar from "@/components/blackNavbar"

export default function DealsPageClient({ initialProducts, initialPagination }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const [products, setProducts] = useState(initialProducts)
  const [ordering, setOrdering] = useState("")
  const [rating, setRating] = useState("")
  const [minRating, setMinRating] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [brandName, setBrandName] = useState("")
  const [pagination, setPagination] = useState(initialPagination)

  // Update state when initialProducts or initialPagination changes (when page changes)
  useEffect(() => {
    setProducts(initialProducts)
    setPagination(initialPagination)
  }, [initialProducts, initialPagination])

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-100">
      {/* NavBar */}
      <BlackNavBar color="inherit" />

      {/* Category Bar */}
      <CatBar />

      {/* Filter Toggle Button */}
      <div 
        className="fixed left-0 top-0 w-6 h-full z-10"
        onMouseEnter={() => setIsSidebarOpen(true)}
      />
      
      {/* Main Layout */}
      <div className="flex-grow flex md:flex-row flex-col">
        {!isSidebarOpen && (
          <ChevronRight className=" fixed top-1/2 h-5 w-5" />
        )}

        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:w-60 lg:w-72 border-gray-700 transition-all duration-300`}>
            <div className="sticky top-20 h-screen overflow-y-auto">
              <Suspense fallback={<div className="p-4">Loading filters...</div>}>
                <FilterSidebar
                  setOrdering={setOrdering}
                  setRating={setRating}
                  setMinRating={setMinRating}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  setBrandName={setBrandName}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </Suspense>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid products={products} isLoading={isLoading} gridCols={isSidebarOpen ? 4 : 5} />
          </Suspense>
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={!pagination.previous || currentPage === 1}
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <span className="text-white">
              {currentPage} of {pagination.total_pages}
            </span>
            <Button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={!pagination.next || currentPage === pagination.total_pages}
            >
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>  
        </main>
      </div>
      <Footer/>
    </div>
  )
}
