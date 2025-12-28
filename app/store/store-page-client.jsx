"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductPageLayout from "@/components/ProductPageLayout";
import publicFetch from "@/utils/publicFetch";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";

export function StorePageClient({ initialProducts, currentPage }) {
  const router = useNavigationProgress();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts.results || initialProducts);
  const [pagination, setPagination] = useState({
    count: initialProducts.count,
    total_pages: initialProducts.total_pages,
    current_page: initialProducts.current_page || currentPage,
    next: initialProducts.links?.next,
    previous: initialProducts.links?.previous,
  });
  const [filters, setFilters] = useState({
    ordering: "",
    rating: "",
    minRating: "",
    minPrice: "",
    maxPrice: "",
    brandName: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Keep local filter state in sync with URL (important for pagination)
  useEffect(() => {
    if (!searchParams) return;
    setFilters((prev) => ({
      ...prev,
      ordering: searchParams.get("ordering") || "",
      rating: searchParams.get("rating") || "",
      minRating: searchParams.get("min_rating") || "",
      minPrice: searchParams.get("min_price") || "",
      maxPrice: searchParams.get("max_price") || "",
      brandName: searchParams.get("brand") || "",
    }));
  }, [searchParams]);

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
    // Stop any client-side loading state once new data arrives
    setIsLoading(false);
  }, [initialProducts, currentPage]);

  const buildQueryParams = (page) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (filters.ordering) params.set("ordering", filters.ordering);
    if (filters.rating) params.set("rating", filters.rating);
    if (filters.minRating) params.set("min_rating", filters.minRating);
    if (filters.minPrice) params.set("min_price", filters.minPrice);
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    if (filters.brandName) params.set("brand", filters.brandName);
    return params;
  };

  // Prefetch adjacent pages (Next/Prev) to make pagination feel instant
  useEffect(() => {
    const current = pagination.current_page || currentPage || 1;
    const total = pagination.total_pages || 1;

    if (current < total) {
      const nextParams = buildQueryParams(current + 1);
      router.prefetch?.(`?${nextParams.toString()}`);
    }
    if (current > 1) {
      const prevParams = buildQueryParams(current - 1);
      router.prefetch?.(`?${prevParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current_page, pagination.total_pages, currentPage, filters]);

  const fetchFilteredProducts = async (newFilters, page = 1) => {
    setIsLoading(true);
    try {
      const queryString = new URLSearchParams();
      queryString.set("page", page.toString());
      if (newFilters.ordering) queryString.set("ordering", newFilters.ordering);
      if (newFilters.rating) queryString.set("rating", newFilters.rating);
      if (newFilters.minRating) queryString.set("min_rating", newFilters.minRating);
      if (newFilters.minPrice) queryString.set("min_price", newFilters.minPrice);
      if (newFilters.maxPrice) queryString.set("max_price", newFilters.maxPrice);
      // Backend expects `brand` key
      if (newFilters.brandName) queryString.set("brand", newFilters.brandName);

      const apiUrl = `shop/api/?${queryString.toString()}`;
      const res = await publicFetch(apiUrl);
      const data = await res.json();

      if (data.results) {
        setProducts(data.results);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }

      setPagination({
        count: data.count || 0,
        total_pages: data.total_pages || 1,
        current_page: data.current_page || 1,
        next: data.links?.next,
        previous: data.links?.previous,
      });
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setIsLoading(true);
    const params = buildQueryParams(newPage);
    const href = `?${params.toString()}`;
    router.prefetch?.(href);
    router.push(href);
  };

  const handleOrderingChange = (value) => {
    const newFilters = { ...filters, ordering: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1);
  };

  const handleRatingChange = (value) => {
    const newFilters = { ...filters, rating: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1);
  };

  const handleMinRatingChange = (value) => {
    const newFilters = { ...filters, minRating: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1);
  };

  const handleMinPriceChange = (value) => {
    const newFilters = { ...filters, minPrice: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1);
  };

  const handleMaxPriceChange = (value) => {
    const newFilters = { ...filters, maxPrice: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1);
  };

  const handleBrandNameChange = (value) => {
    const newFilters = { ...filters, brandName: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1);
  };

  return (
    <ProductPageLayout
      products={products}
      pagination={pagination}
      currentPage={pagination.current_page}
      onPageChange={handlePageChange}
      onOrderingChange={handleOrderingChange}
      onRatingChange={handleRatingChange}
      onMinRatingChange={handleMinRatingChange}
      onMinPriceChange={handleMinPriceChange}
      onMaxPriceChange={handleMaxPriceChange}
      onBrandNameChange={handleBrandNameChange}
      pageTitle="Browse Our Store"
      pageDescription={`Discover ${pagination.count} carefully curated products`}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Store" },
      ]}
      gridCols={4}
      isLoading={isLoading}
    />
  );
}
