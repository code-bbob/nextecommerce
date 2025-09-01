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
import BlackNavBar from "@/components/blackNavbar"
import CatBar from "@/components/catbar"

// Metadata is handled in app/[cat]/[brand]/layout.jsx

function BrandStorePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const cat = params.cat
  const brand = params.brand
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

        const apiUrl = `shop/api/catsearch/${cat}/brand/${brand}/?${queryParams.toString()}`
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-foreground h-full">
      <BlackNavBar color="inherit" />
      <CatBar />

      {/* Hover strip to open sidebar */}
      <div
        className="fixed left-0 top-0 w-6 h-full z-10"
        onMouseEnter={() => setIsSidebarOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-grow flex md:flex-row flex-col">
        {!isSidebarOpen && (
          <ChevronRight className="fixed top-1/2 h-5 w-5 text-primary hover:text-primary/80 transition-colors" />
        )}

        {/* Sidebar */}
        {isSidebarOpen && (
          <aside
            className={`${isSidebarOpen ? "block" : "hidden"} md:w-60 sticky top-0 lg:w-72 glass card-modern border-r border-border/30 transition-all duration-300`}
          >
            <div className="overflow-y-auto no-scrollbar">
              <Suspense fallback={<div className="p-4 text-muted-foreground">Loading filters...</div>}>
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
          <Suspense fallback={<div className="text-muted-foreground">Loading products...</div>}>
            <ProductGrid products={products} isLoading={isLoading} gridCols={isSidebarOpen ? 4 : 5} />
          </Suspense>
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.previous || currentPage === 1}
              className="btn-futuristic bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>
            <span className="text-foreground font-medium bg-card/80 px-4 py-2 rounded-lg border border-border/30 shadow-sm">
              {currentPage} of {pagination.total_pages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.next || currentPage === pagination.total_pages}
              className="btn-futuristic bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
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

export default function PageWrapper() {
  return (
    <Suspense fallback={<div className="text-white">Loading page...</div>}>
      <BrandStorePage />
    </Suspense>
  )
}