import publicFetch from "@/utils/publicFetch"
import CatPageClient from "./cat-page-client"
import { Suspense } from "react"

// Force dynamic rendering so query-based pagination works in production
export const dynamic = "force-dynamic"

export const revalidate = 3600 // ISR: Revalidate every 1 hour

async function getInitialProducts(cat, params) {
  try {
    const qs = new URLSearchParams()
    const page = parseInt(params?.page) || 1
    qs.set("page", page.toString())
    
    // Add filters
    if (params?.ordering) qs.set("ordering", params.ordering)
    if (params?.min_rating) qs.set("min_rating", params.min_rating)
    if (params?.min_price) qs.set("min_price", params.min_price)
    if (params?.max_price) qs.set("max_price", params.max_price)
    const brand = params?.brand ?? params?.brand_name
    if (brand) qs.set("brand", brand)
    
    const apiUrl = `shop/api/catsearch/${cat}/?${qs.toString()}`
    console.log('Fetching category products from:', apiUrl)
    const res = await publicFetch(apiUrl, {
      next: { revalidate: 3600 },
    })
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
    console.error('Error fetching category products:', err)
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

export default async function CatPage({ params, searchParams }) {
  const cat = params.cat
  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams?.page || '1', 10)
  
  const { products, pagination } = await getInitialProducts(cat, resolvedParams)

  return (
    <Suspense fallback={<div className="text-white">Loading page...</div>}>
      <CatPageClient 
        initialProducts={products} 
        initialPagination={pagination}
        cat={cat}
      />
    </Suspense>
  )
}
