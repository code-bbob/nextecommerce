import publicFetch from "@/utils/publicFetch"
import { SearchPageClient } from "./search-page-client"

// Force dynamic rendering so query-based pagination works in production
export const dynamic = "force-dynamic"

// ISR - Revalidate every 1 hour
export const revalidate = 3600

// Reduce Vercel cold-start/region latency for dynamic searches
export const runtime = "edge"
export const preferredRegion = ["bom1"]

// Fetch products server-side with full query support
async function getInitialProducts(params) {
  try {
    const queryParams = new URLSearchParams()
    const searchQuery = params?.q || params?.search || ""
    const page = parseInt(params?.page) || 1
    
    if (searchQuery) {
      queryParams.append("search", searchQuery)
    }
    
    queryParams.append("page", page.toString())
    
    // Add filters
    if (params?.ordering) queryParams.append("ordering", params.ordering)
    if (params?.rating) queryParams.append("rating", params.rating)
    if (params?.min_rating) queryParams.append("min_rating", params.min_rating)
    if (params?.min_price) queryParams.append("min_price", params.min_price)
    if (params?.max_price) queryParams.append("max_price", params.max_price)
    const brand = params?.brand ?? params?.brand_name
    if (brand) queryParams.append("brand", brand)
    
    const endpoint = searchQuery 
      ? `shop/api/search/?${queryParams.toString()}`
      : `shop/api/?${queryParams.toString()}`
    
    const response = await publicFetch(endpoint, {
      next: { revalidate: 3600 },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return {
      results: [],
      count: 0,
      total_pages: 0,
      current_page: 1,
      links: { next: null, previous: null },
    }
  }
}

// Server Component - Fetches data instantly
export default async function SearchPage({ searchParams }) {
  // In Next.js 15, searchParams is a Promise, so we need to await it
  const params = await searchParams
  
  const searchQuery = params?.q || ""
  const pageNum = parseInt(params?.page) || 1
  
  // Data is fetched on the server before page renders
  const initialData = await getInitialProducts(params)
  
  const initialPagination = {
    count: initialData.count || 0,
    total_pages: initialData.total_pages || 0,
    current_page: initialData.current_page || pageNum,
    next: initialData.links?.next || null,
    previous: initialData.links?.previous || null
  }

  return (
    <SearchPageClient
      initialProducts={initialData.results || []}
      initialPagination={initialPagination}
      currentPage={pageNum}
      searchQuery={searchQuery}
    />
  )
}
