import publicFetch from "@/utils/publicFetch"
import CatPageClient from "./cat-page-client"
import { Suspense } from "react"

export const revalidate = 3600 // ISR: Revalidate every 1 hour

async function getInitialProducts(cat, page = 1) {
  try {
    const apiUrl = `shop/api/catsearch/${cat}/?page=${page}`
    const res = await publicFetch(apiUrl)
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
  const page = parseInt(searchParams.page || '1', 10)
  
  const { products, pagination } = await getInitialProducts(cat, page)

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
