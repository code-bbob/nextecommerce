import customFetch from "@/utils/customFetch"
import DealsPageClient from "./deals-page-client"
import { Suspense } from "react"

export const revalidate = 3600 // ISR: Revalidate every 1 hour

async function getInitialDeals(page = 1) {
  try {
    const apiUrl = `shop/api/deals/?page=${page}`
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
    console.error('Error fetching deals:', err)
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

export default async function DealsPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10)
  
  const { products, pagination } = await getInitialDeals(page)

  return (
    <Suspense fallback={<div className="bg-gray-800">Loading page...</div>}>
      <DealsPageClient 
        initialProducts={products} 
        initialPagination={pagination}
      />
    </Suspense>
  )
}
