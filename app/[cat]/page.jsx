"use client"

import { Suspense, useState, useEffect } from "react"
import NavBar from "@/components/navbar"
import ProductGrid from "@/components/productGrid"
import FilterSidebar from "@/components/filterSidebar"
import customFetch from "@/utils/customFetch"
import Footer from "@/components/footer"
import { useSearchParams, useParams,useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter, ChevronLeft, ChevronRight, X } from "lucide-react"

function StorePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const cat = params.cat
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  
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
        if (rating) queryParams.append('ordering', rating)
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
  }, [ordering, rating, minRating, currentPage, minPrice, maxPrice, brandName])

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${params.toString()}`)
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
