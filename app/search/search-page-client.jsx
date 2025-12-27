"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductPageLayout from "@/components/ProductPageLayout";
import publicFetch from "@/utils/publicFetch";

export function SearchPageClient({ initialProducts, initialPagination, currentPage, searchQuery }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(initialProducts || []);
  const [pagination, setPagination] = useState(initialPagination || {
    count: 0,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null
  });

  // Filters state
  const [ordering, setOrdering] = useState("");
  const [rating, setRating] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery);

  // Debounce timer refs
  const debounceTimer = useRef(null);

  // Detect when search query changes and update state
  useEffect(() => {
    if (searchQuery !== currentSearchQuery) {
      setCurrentSearchQuery(searchQuery);
      setProducts(initialProducts || []);
      setPagination(initialPagination || {
        count: 0,
        total_pages: 1,
        current_page: 1,
        next: null,
        previous: null
      });
      // Reset filters when doing a new search
      setOrdering("");
      setRating("");
      setMinRating("");
      setMinPrice("");
      setMaxPrice("");
      setBrandName("");
    }
  }, [searchQuery, currentSearchQuery, initialProducts, initialPagination]);

  // Fetch products with current filters
  const fetchProducts = useCallback(async (filterParams) => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams();

      if (currentSearchQuery) {
        queryParams.append("search", currentSearchQuery);
      }

      if (filterParams.ordering) {
        queryParams.append("ordering", filterParams.ordering);
      }
      if (filterParams.rating) {
        queryParams.append("rating", filterParams.rating);
      }
      if (filterParams.minRating) {
        queryParams.append("min_rating", filterParams.minRating);
      }
      if (filterParams.minPrice) {
        queryParams.append("min_price", filterParams.minPrice);
      }
      if (filterParams.maxPrice) {
        queryParams.append("max_price", filterParams.maxPrice);
      }
      if (filterParams.brandName) {
        queryParams.append("brand", filterParams.brandName);
      }

      queryParams.append("page", currentPage.toString());

      const apiUrl = currentSearchQuery
        ? `shop/api/search/?${queryParams.toString()}`
        : `shop/api/?${queryParams.toString()}`;

      const res = await publicFetch(apiUrl);
      const data = await res.json();

      if (data.results) {
        setProducts(data.results);
        setPagination({
          count: data.count,
          total_pages: data.total_pages,
          current_page: data.current_page,
          next: data.links.next,
          previous: data.links.previous
        });
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSearchQuery, currentPage]);

  // Debounced filter update function
  const updateFiltersWithDebounce = useCallback((newFilters) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchProducts(newFilters);
    }, 300); // 300ms debounce
  }, [fetchProducts]);

  // Handle ordering change
  const handleOrderingChange = useCallback((value) => {
    setOrdering(value);
    updateFiltersWithDebounce({
      ordering: value,
      rating,
      minRating,
      minPrice,
      maxPrice,
      brandName
    });
  }, [rating, minRating, minPrice, maxPrice, brandName, updateFiltersWithDebounce]);

  // Handle rating change
  const handleRatingChange = useCallback((value) => {
    setRating(value);
    updateFiltersWithDebounce({
      ordering,
      rating: value,
      minRating,
      minPrice,
      maxPrice,
      brandName
    });
  }, [ordering, minRating, minPrice, maxPrice, brandName, updateFiltersWithDebounce]);

  // Handle min rating change
  const handleMinRatingChange = useCallback((value) => {
    setMinRating(value);
    updateFiltersWithDebounce({
      ordering,
      rating,
      minRating: value,
      minPrice,
      maxPrice,
      brandName
    });
  }, [ordering, rating, minPrice, maxPrice, brandName, updateFiltersWithDebounce]);

  // Handle min price change
  const handleMinPriceChange = useCallback((value) => {
    setMinPrice(value);
    updateFiltersWithDebounce({
      ordering,
      rating,
      minRating,
      minPrice: value,
      maxPrice,
      brandName
    });
  }, [ordering, rating, minRating, maxPrice, brandName, updateFiltersWithDebounce]);

  // Handle max price change
  const handleMaxPriceChange = useCallback((value) => {
    setMaxPrice(value);
    updateFiltersWithDebounce({
      ordering,
      rating,
      minRating,
      minPrice,
      maxPrice: value,
      brandName
    });
  }, [ordering, rating, minRating, minPrice, brandName, updateFiltersWithDebounce]);

  // Handle brand name change
  const handleBrandNameChange = useCallback((value) => {
    setBrandName(value);
    updateFiltersWithDebounce({
      ordering,
      rating,
      minRating,
      minPrice,
      maxPrice,
      brandName: value
    });
  }, [ordering, rating, minRating, minPrice, maxPrice, updateFiltersWithDebounce]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const paramsObj = new URLSearchParams(searchParams.toString());
    paramsObj.set("page", newPage.toString());
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${paramsObj.toString()}`);
  };

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : "Products";
  const pageDescription = searchQuery ? `${pagination.count || 0} products found` : "Browse all available products";

  return (
    <ProductPageLayout
      products={products}
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onOrderingChange={handleOrderingChange}
      onRatingChange={handleRatingChange}
      onMinRatingChange={handleMinRatingChange}
      onMinPriceChange={handleMinPriceChange}
      onMaxPriceChange={handleMaxPriceChange}
      onBrandNameChange={handleBrandNameChange}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      isLoading={isLoading}
      gridCols={4}
    />
  );
}
