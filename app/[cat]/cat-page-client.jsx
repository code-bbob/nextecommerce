"use client"

import { useState } from "react"
import ProductPageLayout from "@/components/ProductPageLayout"
import { useRouter } from "next/navigation"

export default function CatPageClient({ initialProducts, initialPagination, cat }) {
  const router = useRouter()
  const [products] = useState(initialProducts)
  const [pagination] = useState(initialPagination)

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <ProductPageLayout
      products={products}
      pagination={pagination}
      currentPage={pagination.current_page}
      onPageChange={handlePageChange}
      pageTitle={`${cat.charAt(0).toUpperCase() + cat.slice(1)}s`}
      pageDescription={`Browse our collection of ${cat}s`}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Categories", href: "/" },
        { label: cat.charAt(0).toUpperCase() + cat.slice(1) },
      ]}
      gridCols={4}
    />
  )
}
