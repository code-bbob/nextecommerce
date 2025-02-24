"use client"

import { Suspense, useState, useEffect } from "react"
import NavBar from "@/components/navbar"
import ProductGrid from "@/components/productGrid"
import FilterSidebar from "@/components/filterSidebar"
import customFetch from "@/utils/customFetch"
import Footer from "@/components/footer"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function CatPage() {
  const params = useParams()
  const category = params.cat
  const [products, setProducts] = useState([])
  const [ordering, setOrdering] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `shop/api/catsearch/${category}`
        if (ordering) {
          apiUrl += `?ordering=${ordering}`
        }
        const res = await customFetch(apiUrl)
        const newProducts = await res.json()
        setProducts(newProducts)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category, ordering])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-600 to-black font-sans">
      <NavBar />
      <div className="flex-grow flex flex-col md:h-screen md:flex-row">
        <aside
          className={`${isSidebarOpen ? "fixed inset-0 z-50 " : "hidden"} md:relative md:block md:w-64 md:min-h-0 md:z-auto`}
        >
          <Suspense fallback={<div className="text-white p-4">Loading filters...</div>}>
            <FilterSidebar
              category={category}
              setOrdering={setOrdering}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </Suspense>
        </aside>
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
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  )
}

