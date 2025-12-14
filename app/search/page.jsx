"use client"

import { Suspense, useState, useEffect } from "react"
import ProductPageLayout from "@/components/ProductPageLayout"
import customFetch from "@/utils/customFetch"
import { useSearchParams, useRouter } from "next/navigation"

function Search({ initialData = null, initialPagination = null }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get the current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  // Get the search term (if provided in URL: ?q=sth)
  const searchQuery = searchParams.get("q") || ""
  
  const [products, setProducts] = useState(initialData || [])
  const [ordering, setOrdering] = useState("")
  const [rating, setRating] = useState("")
  const [minRating, setMinRating] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(!!initialData)
  const [pagination, setPagination] = useState(initialPagination || {
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
        setHasInitialized(true)
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

  const handleOrderingChange = (value) => {
    setOrdering(value)
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  const handleMinRatingChange = (value) => {
    setMinRating(value)
  }

  const handleMinPriceChange = (value) => {
    setMinPrice(value)
  }

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value)
  }

  const handleBrandNameChange = (value) => {
    setBrandName(value)
  }

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : "Products"
  const pageDescription = searchQuery ? `${pagination.count || 0} products found` : "Browse all available products"

  return (
    <ProductPageLayout
      products={products}
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onOrderingChange={handleOrderingChange}
      onRatingChange={handleRatingChange}
      onMinRatingChange={handleMinRatingChange}
      onMinPriceChange={handleMinPriceChange}
      onMaxPriceChange={handleMaxPriceChange}
      onBrandNameChange={handleBrandNameChange}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      isLoading={isLoading || !hasInitialized}
      gridCols={4}
    />
  )
}

export default function Page(){
  return(
    <Suspense fallback={<div className="text-black">Loading products...</div>}>
      <Search />
    </Suspense>
  )
}
