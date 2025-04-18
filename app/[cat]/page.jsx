"use client"

import { Suspense, useState, useEffect } from "react"
import NavBar from "@/components/navbar"
import ProductGrid from "@/components/productGrid"
import FilterSidebar from "@/components/filterSidebar"
import customFetch from "@/utils/customFetch"
import Footer from "@/components/Footer.server"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter, ChevronLeft, ChevronRight, X } from "lucide-react"
import CatBar from "@/components/catbar"
import BlackNavBar from "@/components/blackNavbar"

function StorePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const cat = params.cat
  const currentPage = parseInt(searchParams.get('page') || '1', 18)
  
  const [products, setProducts] = useState([])
  const [ordering, setOrdering] = useState("")
  const [rating, setRating] = useState("")
  const [minRating, setMinRating] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [brandName, setBrandName] = useState("")
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
        const queryParams = new URLSearchParams()
        if (ordering) queryParams.append('ordering', ordering)
        if (rating) queryParams.append('rating', rating) // Adjusted to use 'rating'
        if (minRating) queryParams.append('min_rating', minRating)
        if (minPrice) queryParams.append('min_price', minPrice)
        if (maxPrice) queryParams.append('max_price', maxPrice)
        if (brandName) queryParams.append('brand', brandName)

        queryParams.append('page', currentPage.toString())

        const apiUrl = `shop/api/catsearch/${cat}/?${queryParams.toString()}`
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
  }, [ordering, rating, minRating, currentPage, minPrice, maxPrice, brandName, cat])

  const handlePageChange = (newPage) => {
    const paramsObj = new URLSearchParams(searchParams.toString())
    paramsObj.set('page', newPage.toString())
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${paramsObj.toString()}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-700 font-sans">
      <BlackNavBar color="inherit" />
      <CatBar/>
      <div className="flex-grow flex md:flex-row flex-col">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:w-60 lg:w-72">
          <div className="sticky top-20 h-screen overflow-y-auto">
            <Suspense fallback={<div className="text-white p-4">Loading filters...</div>}>
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

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Suspense fallback={<div className="text-white">Loading products...</div>}>
            <ProductGrid products={products} isLoading={isLoading} />
          </Suspense>

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

// 🔹 Wrap the component inside Suspense when exporting
export default function PageWrapper() {
  return (
    <Suspense fallback={<div className="text-white">Loading page...</div>}>
      <StorePage />
    </Suspense>
  )
}
