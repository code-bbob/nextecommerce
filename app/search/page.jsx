"use client"

import { Suspense, useState, useEffect } from "react"
import NavBar from "@/components/navbar"
import ProductGrid from "@/components/productGrid"
import FilterSidebar from "@/components/filterSidebar"  
import customFetch from "@/utils/customFetch"
import Footer from "@/components/Footer.server"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { X } from "lucide-react"
import BlackNavBar from "@/components/blackNavbar"
import CatBar from "@/components/catbar"

function Search() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get the current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  // Get the search term (if provided in URL: ?q=sth)
  const searchQuery = searchParams.get("q") || ""
  
  const [products, setProducts] = useState([])
  const [ordering, setOrdering] = useState("")
  const [rating, setRating] = useState("")
  const [minRating, setMinRating] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        
        // Build the query parameters
        const queryParams = new URLSearchParams()
        
        // Append the search term if it exists. This will also determine which endpoint to use.
        if (searchQuery) {
          queryParams.append("search", searchQuery)
        }
        
        if (ordering) {
          queryParams.append("ordering", ordering)
        }
        if (rating) {
          queryParams.append("rating", rating)
        }
        if (minRating) {
          queryParams.append("min_rating", minRating)
        }
        if (minPrice) {
          queryParams.append("min_price", minPrice)
        }
        if (maxPrice) {
          queryParams.append("max_price", maxPrice)
        }
        if (brandName) {
          queryParams.append("brand", brandName)
        }
        
        // Add page parameter
        queryParams.append("page", currentPage.toString())
        
        // Select endpoint based on whether a search query exists
        const apiUrl = searchQuery 
          ? `shop/api/search/?${queryParams.toString()}`
          : `shop/api/?${queryParams.toString()}`
        
        const res = await customFetch(apiUrl)
        const data = await res.json()
        
        if (data.results) {
          setProducts(data.results)
          setPagination({
            count: data.count,
            total_pages: data.total_pages,
            current_page: data.current_page,
            next: data.links.next,
            previous: data.links.previous
          })
        } else {
          setProducts(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery, ordering, rating, minRating, currentPage, minPrice, maxPrice, brandName])

  const handlePageChange = (newPage) => {
    const paramsObj = new URLSearchParams(searchParams.toString())
    paramsObj.set("page", newPage.toString())
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${paramsObj.toString()}`)
  }

  // Generate pagination numbers with ellipsis if needed
  const getPageNumbers = () => {
    const totalPages = pagination.total_pages
    const current = pagination.current_page
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages = [1]
    if (current > 3) {
      pages.push("...")
    }
    const start = Math.max(2, current - 1)
    const end = Math.min(totalPages - 1, current + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (current < totalPages - 2) {
      pages.push("...")
    }
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-700 font-sans">
      <BlackNavBar color="inherit"/>
      <CatBar/>
      <div className="flex-grow flex md:flex-row flex-col">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-64">
          <div className="sticky top-0 h-screen overflow-y-auto">
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
          </div>
        </aside>
        
        {/* Mobile Sidebar (modal-style) */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 p-4 overflow-y-auto">
            <div className="bg-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">Filters</h2>
                <Button variant="ghost" className="text-black" onClick={() => setIsSidebarOpen(false)}>
                  <X />
                </Button>
              </div>
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
            </div>
          </div>
        )}
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex justify-between md:justify-center items-center mb-6">
            <h1 className="text-md md:text-xl font-bold text-white capitalize">
              {searchQuery ? `Items matching "${searchQuery}"` : "Products"}
            </h1>
            <Button 
              variant="outline" 
              className="md:hidden bg-white text-black" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <ProductGrid products={products} isLoading={isLoading} />
          
          {/* Pagination Controls */}
          
            
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
      <Footer />
    </div>
  )
}

export default function Page(){
  return(
    <Suspense fallback={<div className="text-black">Loading products...</div>}>
      <Search />
    </Suspense>
  )
}
