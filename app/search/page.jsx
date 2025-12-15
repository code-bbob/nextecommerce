import customFetch from "@/utils/customFetch"
import { SearchPageClient } from "./search-page-client"
import { Suspense } from "react"

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
    
    const response = await customFetch(endpoint)
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

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-white to-slate-50/50">
      <div className="h-6 bg-white"></div>
      <div className="flex-grow bg-gray-0 flex flex-row relative">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:flex lg:w-80 border-r sticky top-0 h-screen flex-col overflow-hidden bg-white">
          <div className="px-6 py-6 border-b border-border/5">
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-1 w-6 bg-slate-200 rounded-full"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-24"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </aside>
        {/* Main content skeleton */}
        <main className="flex-1 flex flex-col">
          <div className="border-b border-border/5 px-6 md:px-10 lg:px-12 pt-8 md:pt-8">
            <div className="h-6 bg-slate-200 rounded w-32 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-64"></div>
          </div>
          <section className="flex-1 px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col bg-white border border-border/5 rounded-xl overflow-hidden animate-pulse h-full shadow-sm">
                  <div className="relative sm:h-56 bg-slate-200" />
                  <div className="p-1 sm:p-2 flex flex-col flex-grow space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="mt-auto h-10 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )

  // Pass pre-fetched data to client component
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <SearchPageClient 
        initialProducts={initialData.results || []}
        initialPagination={initialPagination}
        currentPage={pageNum}
        searchQuery={searchQuery}
      />
    </Suspense>
  )
}
