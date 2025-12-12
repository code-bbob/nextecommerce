"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductPageLayout from "@/components/ProductPageLayout";

export function StorePageClient({ initialProducts, currentPage }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts.results || initialProducts);
  const [pagination, setPagination] = useState({
    count: initialProducts.count,
    total_pages: initialProducts.total_pages,
    current_page: initialProducts.current_page || currentPage,
    next: initialProducts.links?.next,
    previous: initialProducts.links?.previous,
  });

  // Update state when initialProducts changes (when page changes)
  useEffect(() => {
    setProducts(initialProducts.results || initialProducts);
    setPagination({
      count: initialProducts.count,
      total_pages: initialProducts.total_pages,
      current_page: initialProducts.current_page || currentPage,
      next: initialProducts.links?.next,
      previous: initialProducts.links?.previous,
    });
  }, [initialProducts, currentPage]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`);
  };

  return (
    <ProductPageLayout
      products={products}
      pagination={pagination}
      currentPage={pagination.current_page}
      onPageChange={handlePageChange}
      pageTitle="Browse Our Store"
      pageDescription={`Discover ${pagination.count} carefully curated products`}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Store" },
      ]}
      gridCols={4}
    />
  );
}
