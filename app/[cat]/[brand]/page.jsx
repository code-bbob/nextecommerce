import customFetch from "@/utils/customFetch"
import { BrandPageClient } from "./brand-page-client"
import { Suspense } from "react"

export const revalidate = 3600 // ISR: Revalidate every 1 hour

// Metadata is handled in app/[cat]/[brand]/layout.jsx

async function getInitialProducts(cat, brand, page = 1) {
  try {
    const apiUrl = `shop/api/catsearch/${cat}/brand/${brand}/?page=${page}`
    const res = await customFetch(apiUrl)
    const data = await res.json()

    if (data.results) {
      return {
        products: data.results,
        pagination: {
          count: data.count,
          total_pages: data.total_pages,
          current_page: data.current_page,
          next: data.links.next,
          previous: data.links.previous
        }
      }
    }
    return {
      products: data,
      pagination: {
        count: 0,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null
      }
    }
  } catch (err) {
    console.error('Error fetching brand products:', err)
    return {
      products: [],
      pagination: {
        count: 0,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null
      }
    }
  }
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

export default async function BrandPage({ params, searchParams }) {
  const cat = params.cat
  const brand = params.brand
  const page = parseInt(searchParams.page || '1', 10)
  
  const { products, pagination } = await getInitialProducts(cat, brand, page)

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <BrandPageClient 
        initialProducts={products} 
        initialPagination={pagination}
        currentPage={page}
        cat={cat}
        brand={brand}
      />
    </Suspense>
  )
}
