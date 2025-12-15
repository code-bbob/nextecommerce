"use client"

import { useState, useEffect } from "react"
import ProductPageLayout from "@/components/ProductPageLayout"
import { useRouter } from "next/navigation"
import customFetch from "@/utils/customFetch"

export default function CatPageClient({ initialProducts, initialPagination, cat }) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [pagination, setPagination] = useState(initialPagination)
  const [filters, setFilters] = useState({
    ordering: "",
    rating: "",
    minRating: "",
    minPrice: "",
    maxPrice: "",
    brandName: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update state when initialProducts or initialPagination changes (when page changes)
  useEffect(() => {
    setProducts(initialProducts)
    setPagination(initialPagination)
  }, [initialProducts, initialPagination])

  const buildQueryParams = (page = 1) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    if (filters.ordering) params.set('ordering', filters.ordering)
    if (filters.rating) params.set('rating', filters.rating)
    if (filters.minRating) params.set('min_rating', filters.minRating)
    if (filters.minPrice) params.set('min_price', filters.minPrice)
    if (filters.maxPrice) params.set('max_price', filters.maxPrice)
    if (filters.brandName) params.set('brand_name', filters.brandName)
    return params.toString()
  }

  const fetchFilteredProducts = async (newFilters, page = 1) => {
    setIsLoading(true)
    try {
      const queryString = new URLSearchParams()
      queryString.set('page', page.toString())
      if (newFilters.ordering) queryString.set('ordering', newFilters.ordering)
      if (newFilters.rating) queryString.set('rating', newFilters.rating)
      if (newFilters.minRating) queryString.set('min_rating', newFilters.minRating)
      if (newFilters.minPrice) queryString.set('min_price', newFilters.minPrice)
      if (newFilters.maxPrice) queryString.set('max_price', newFilters.maxPrice)
      if (newFilters.brandName) queryString.set('brand_name', newFilters.brandName)
      
      const apiUrl = `shop/api/catsearch/${cat}/?${queryString.toString()}`
      console.log('Fetching from:', apiUrl)
      const res = await customFetch(apiUrl)
      const data = await res.json()
      console.log('API Response:', data)

      if (data.results) {
        console.log('Setting products:', data.results.length)
        setProducts(data.results)
        setPagination({
          count: data.count,
          total_pages: data.total_pages,
          current_page: data.current_page,
          next: data.links?.next,
          previous: data.links?.previous
        })
      } else if (Array.isArray(data)) {
        console.log('Response is array:', data.length)
        setProducts(data)
      } else {
        console.warn('Unexpected API response structure:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    if (filters.ordering) params.set('ordering', filters.ordering)
    if (filters.rating) params.set('rating', filters.rating)
    if (filters.minRating) params.set('min_rating', filters.minRating)
    if (filters.minPrice) params.set('min_price', filters.minPrice)
    if (filters.maxPrice) params.set('max_price', filters.maxPrice)
    if (filters.brandName) params.set('brand_name', filters.brandName)
    router.push(`?${params.toString()}`)
  }

  const handleOrderingChange = (value) => {
    const newFilters = { ...filters, ordering: value }
    setFilters(newFilters)
    fetchFilteredProducts(newFilters, 1)
  }

  const handleRatingChange = (value) => {
    const newFilters = { ...filters, rating: value }
    setFilters(newFilters)
    fetchFilteredProducts(newFilters, 1)
  }

  const handleMinRatingChange = (value) => {
    const newFilters = { ...filters, minRating: value }
    setFilters(newFilters)
    fetchFilteredProducts(newFilters, 1)
  }

  const handleMinPriceChange = (value) => {
    const newFilters = { ...filters, minPrice: value }
    setFilters(newFilters)
    fetchFilteredProducts(newFilters, 1)
  }

  const handleMaxPriceChange = (value) => {
    const newFilters = { ...filters, maxPrice: value }
    setFilters(newFilters)
    fetchFilteredProducts(newFilters, 1)
  }

  const handleBrandNameChange = (value) => {
    const newFilters = { ...filters, brandName: value }
    setFilters(newFilters)
    fetchFilteredProducts(newFilters, 1)
  }

  return (
    <ProductPageLayout
      products={products}
      pagination={pagination}
      currentPage={pagination.current_page}
      onPageChange={handlePageChange}
      onOrderingChange={handleOrderingChange}
      onRatingChange={handleRatingChange}
      onMinRatingChange={handleMinRatingChange}
      onMinPriceChange={handleMinPriceChange}
      onMaxPriceChange={handleMaxPriceChange}
      onBrandNameChange={handleBrandNameChange}
      pageTitle={`${cat.charAt(0).toUpperCase() + cat.slice(1)}s`}
      pageDescription={`Browse our collection of ${cat}s`}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Categories", href: "/" },
        { label: cat.charAt(0).toUpperCase() + cat.slice(1) },
      ]}
      gridCols={4}
      isLoading={isLoading}
    />
  )
}
