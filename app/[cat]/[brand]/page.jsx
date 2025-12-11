import customFetch from "@/utils/customFetch"
import BrandPageClient from "./brand-page-client"
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

export default async function BrandPage({ params, searchParams }) {
  const cat = params.cat
  const brand = params.brand
  const page = parseInt(searchParams.page || '1', 10)
  
  const { products, pagination } = await getInitialProducts(cat, brand, page)

  return (
    <Suspense fallback={<div className="text-white">Loading page...</div>}>
      <BrandPageClient 
        initialProducts={products} 
        initialPagination={pagination}
        cat={cat}
        brand={brand}
      />
    </Suspense>
  )
}