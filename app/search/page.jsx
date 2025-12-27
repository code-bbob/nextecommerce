import publicFetch from "@/utils/publicFetch"
import { SearchPageClient } from "./search-page-client"

// ISR - Revalidate every 1 hour
export const revalidate = 3600

// Fetch products server-side
async function getInitialProducts(searchQuery, page = 1) {
  try {
    const queryParams = new URLSearchParams()
    
    if (searchQuery) {
      queryParams.append("search", searchQuery)
    }
    
    queryParams.append("page", page.toString())
    
    const endpoint = searchQuery 
      ? `shop/api/search/?${queryParams.toString()}`
      : `shop/api/?${queryParams.toString()}`
    
    const response = await publicFetch(endpoint)
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
  const initialData = await getInitialProducts(searchQuery, pageNum)
  
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
