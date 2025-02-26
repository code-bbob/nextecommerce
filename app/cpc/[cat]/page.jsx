"use client"

import { Suspense, useState, useEffect } from "react"
import NavBar from "@/components/navbar"
import ProductGrid from "@/components/productGrid"
import FilterSidebar from "@/components/filterSidebar"
import customFetch from "@/utils/customFetch"
import Footer from "@/components/footer"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { X } from "lucide-react"

export default function CatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = params.cat
  
  // Get the current page from URL or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  
  const [products, setProducts] = useState([]);
  const [ordering, setOrdering] = useState("");
  const [rating, setRating] = useState("");
  const [minRating, setMinRating] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
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
        console.log(queryParams.toString())
        if (ordering) {
          queryParams.append('ordering', ordering)
        }
        if (rating) {
          queryParams.append('ordering', rating)
          console.log(queryParams.toString())
        }
        if (minRating) {
          queryParams.append('min_rating', minRating)
        }
        if (minPrice) {
          queryParams.append('min_price', minPrice)
        }
        if (maxPrice) {
          queryParams.append('max_price', maxPrice)
        }

        // Add page parameter
        queryParams.append('page', currentPage.toString())
        
        // Create the API URL
        const apiUrl = `shop/api/subcatsearch/${category}/?${queryParams.toString()}`
        
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
  }, [category, ordering, rating,minRating, currentPage, minPrice, maxPrice])

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const totalPages = pagination.total_pages
    const currentPage = pagination.current_page
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages = [1]
    if (currentPage > 3) {
      pages.push('...')
    }
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-600 to-black font-sans">
      <NavBar />
      <div className="flex-grow flex md:flex-row flex-col">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-64">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <Suspense fallback={<div className="text-white p-4">Loading filters...</div>}>
              <FilterSidebar
                category={category}
                setOrdering={setOrdering}
                setRating={setRating}
                setMinRating={setMinRating}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}

              />
            </Suspense>
          </div>
        </aside>
        
        {/* Mobile Sidebar (modal-style) */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-black via-slate-500 to-black p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <Button variant="ghost" className="text-white" onClick={() => setIsSidebarOpen(false)}>
                  <X />
                </Button>
              </div>
              <Suspense fallback={<div className="text-white p-4">Loading filters...</div>}>
                <FilterSidebar
                  category={category}
                  setOrdering={setOrdering}
                  setRating={setRating}
                  setMinRating={setMinRating}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </Suspense>
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-8">
          <div className="flex justify-between md:justify-center items-center mb-6">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white capitalize">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                {category} Products
              </span>
            </h1>
            <Button variant="outline" className="md:hidden bg-black text-white" onClick={() => setIsSidebarOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          <Suspense fallback={<div className="text-white">Loading products...</div>}>
            <ProductGrid products={products} isLoading={isLoading} />
            
            {/* Pagination controls */}
            {pagination.total_pages > 1 && (
              <div className="flex flex-col items-center mt-8 space-y-2">
                <div className="text-white text-sm">
                  Page {pagination.current_page} of {pagination.total_pages}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.previous}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-white">...</span>
                    ) : (
                      <Button
                        key={`page-${page}`}
                        variant={page === pagination.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => page !== pagination.current_page && handlePageChange(page)}
                        className={page === pagination.current_page 
                          ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white" 
                          : "bg-gray-800 text-white hover:bg-gray-700"}
                      >
                        {page}
                      </Button>
                    )
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.next}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  )
}
